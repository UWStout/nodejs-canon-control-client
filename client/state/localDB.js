// Import dexie for easy Index DB usage
import Dexie from 'dexie'
import { exportDB, importInto } from 'dexie-export-import'

import { getCameraDetails, getCameraList } from '../helpers/serverHelper'

// Initialize the database
const db = new Dexie('c4-database')
db.version(4).stores({
  servers: '++id, IP',
  cameras: 'id, serverId',
  sessions: '++id, path',
  settings: 'name'
})

// Flag for syncronizing async DB queries and preventing race conditions
let DB_BUSY = false

/**
 * Create a promise that will only resolve once the database has been locked. It will
 * wait up to 'timeout' milliseconds for the lock to be released and will then relock
 * it before resolving.  If timeout is exceeded it will reject.
 * @param {number} timeout How long to wait (in milliseconds) before rejecting
 * @returns {Promise} Returns a promise that resolves when and if the DB is locked
 */
function waitForDBLock (timeout = 5000) {
  let elapsed = 0
  return new Promise((resolve, reject) => {
    if (DB_BUSY) {
      const myInterval = setInterval(() => {
        // Check for timeout
        elapsed += 500
        if (elapsed > timeout) {
          clearInterval(myInterval)
          return reject(new Error('Timeout exceeded waiting for database'))
        }

        // Has the database lock been released?
        if (!DB_BUSY) {
          clearInterval(myInterval)
          DB_BUSY = true
          return resolve()
        }
      }, 500)
    } else {
      DB_BUSY = true
      return resolve()
    }
  })
}

function unlockDB () { DB_BUSY = false }

/**
 * Export the entire local database to a data blob for download as a file.
 * @returns {blob} Data blob representing the entirety of the local c4 database
 */
export async function exportLocalData () {
  await waitForDBLock()
  const dataBlob = await exportDB(db)
  unlockDB()
  return dataBlob
}

/**
 * Import a previously exported data blob into the local database, replacing
 * any existing data in the database.
 * @param {blob} dataBlob A file or dataBlob containing the data to import.
 * @param {boolean} [includeServers=true] Import data in the servers table
 * @param {boolean} [includeCameras=true] Import data in the cameras table
 * @param {boolean} [includeSessions=true] Import data in the sessions table
 * @param {boolean} [includeSettings=false] Import data in the settings table
 */
export async function importLocalData (
  dataBlob,
  includeServers = true,
  includeCameras = true,
  includeSessions = true,
  includeSettings = false
) {
  await waitForDBLock()
  await importInto(db, dataBlob, {
    overwriteValues: true,
    filter: (table) => {
      if (!includeServers && table === 'servers') return false
      if (!includeCameras && table === 'cameras') return false
      if (!includeSessions && table === 'sessions') return false
      if (!includeSettings && table === 'settings') return false
      return true
    }
  })
  unlockDB()
}

/**
 * Manually set the 'status' of all cameras in the database to default values
 */
export async function clearCameraStatus () {
  await waitForDBLock()
  await db.transaction('rw', db.cameras, async () => {
    await db.cameras.toCollection().modify(camera => {
      // Default to missing and an 'unknown' exposure status
      camera.missing = true
      camera.exposureStatus = 'unknown'
    })
  })
  unlockDB()
}

/**
 * Set the exposure status of all cameras to the given string
 */
export async function setExposureStatus (newStatus = 'unknown') {
  await waitForDBLock()
  await db.transaction('rw', db.cameras, async () => {
    await db.cameras.toCollection().modify(camera => {
      camera.exposureStatus = newStatus
    })
  })
  unlockDB()
}

/**
 * Query the list of cameras available on a server and update
 * their entries in the database.
 * @param {ServerObjShape} server The server to refresh
 */
export async function reloadCameraList (server) {
  try {
    // Query camera list from server and adjust with proper DB keys
    const cameraList = await getCameraList(server)
    refreshCameraList(cameraList, server.id)
  } catch (error) {
    console.error('Error reloading server cameras')
    console.error(error)
  }
}

/**
 * Parse a list of cameras and update the database
 * @param {object[]} cameraList List of cameras returned by the server API
 */
export async function refreshCameraList (cameraList, serverId) {
  await waitForDBLock()
  try {
    // Build modify query object
    const newCameras = cameraList.map(camera => camera.BodyIDEx.value)

    // Start transaction for modify query
    await db.transaction('rw', db.cameras, async () => {
      await db.cameras.where({ serverId }).modify((camera, ref) => {
        // Look for camera in camera list
        const serverCam = cameraList.find(serverCam => serverCam.BodyIDEx?.value === camera.id)
        if (!serverCam) {
          camera.missing = true
        } else {
          // Remove from new camera list
          const camIndex = newCameras.findIndex(newCameraID => newCameraID === camera.id)
          if (camIndex >= 0) { newCameras.splice(camIndex, 1) }

          // Update its entry
          ref.value = { ...camera, ...serverCam, missing: undefined }
        }
      })
    })

    // Add in any new cameras
    if (newCameras.length > 0) {
      await db.cameras.bulkAdd(newCameras.map(cameraId => ({
        ...cameraList.find(serverCam => serverCam.BodyIDEx?.value === cameraId),
        id: cameraId,
        serverId
      })))
    }
  } catch (error) {
    console.error('Error refreshing server cameras')
    console.error(error)
  }
  unlockDB()
}

/**
 * Query the full details for a camera and update them in
 * the local DB.
 * @param {CameraObjShape} camera The server to refresh
 */
export async function refreshCameraDetails (serverID, cameraID) {
  await waitForDBLock()
  try {
    // Lookup server and camera objects
    const server = await db.servers.get(serverID)
    const camera = await db.cameras.get(cameraID)
    if (!server || !camera) {
      throw new Error(`Unknown camera id (${cameraID}) or server id (${serverID})`)
    }

    // Query camera list from server and adjust with proper DB keys
    const cameraDetails = await getCameraDetails(server, camera)
    const fullEntry = { ...camera, ...cameraDetails }

    // Put to database (will either update or add)
    await db.cameras.put(fullEntry)
  } catch (error) {
    console.error('Error refreshing camera details')
    console.error(error)
  }
  unlockDB()
}

/**
 * Add a new session with no captures to the sessions table.
 * @param {number} time Time of session creation in epoch milliseconds
 * @param {string} nickname A nickname to help remember this session (defaults to the time)
 * @returns {Object} A session object with id, path, time, nickname, and captures array
 */
export async function addNewSession (time, nickname = '') {
  // Fall back to time if nickname is not provided
  nickname = nickname || ('' + time)

  // Build path string
  const date = new Date(parseInt(time))
  const hourStr = date.getHours().toFixed().padStart(2, '0')
  const minuteStr = date.getMinutes().toFixed().padStart(2, '0')
  const path = `SES_${nickname}_AT_${hourStr}_${minuteStr}_${date.toDateString()}`.replaceAll(' ', '_')

  // Insert and return session object
  const sessionData = { nickname, path, time, captures: [] }
  const id = await db.sessions.put(sessionData)
  return { id, ...sessionData }
}

/**
 * Add a new, empty capture to a session
 * @param {number} sessionId The key for the session to add the capture to
 * @param {string} nickname A nickname to remember this session (defaults to capture_#)
 * @returns {string} Name/path for this capture
 */
export async function addNewCapture (sessionId, nickname = '') {
  // Lookup session object
  const session = await db.sessions.get(sessionId)

  // Build and append new capture path
  const newCapture = nickname || `capture_${(session.captures.length + 1).toFixed().padStart(3, '0')}`
  await db.sessions.update(sessionId, { captures: [...session.captures, newCapture] })

  // Return the capture path
  return newCapture
}

/**
 * Update a 'setting' that you want to persist between browser sessions. The 'name'
 * acts as a key to lookup the value later and any setting with a matching name will
 * be overwritten. NOTE: nested properties are merged 1-level deep.
 *
 * @param {string} name The key name of the setting
 * @param {(string|object)} newValue A primitive value to set or an object of properties
 */
export async function updateSetting (name, newValue) {
  // Pack a primitive value under the property 'value'
  if (typeof newValue !== 'object') {
    newValue = { value: newValue }
  }

  // Retrieve current value (if any)
  let oldValue = await db.settings.get(name)
  if (oldValue === undefined) {
    oldValue = {}
  }

  // Update the setting
  await db.settings.put({ name, ...oldValue, ...newValue })
}

// Expose access to database for other files
export default db
