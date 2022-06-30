// Import dexie for easy Index DB usage
import Dexie from 'dexie'
import { exportDB, importInto } from 'dexie-export-import'

import { getCameraDetails, getCameraList } from '../helpers/serverHelper'

// Initialize the database
const db = new Dexie('c4-database')
db.version(1).stores({
  servers: '++id, IP',
  cameras: 'id, serverId',
  settings: 'name'
})

/**
 * Export the entire local database to a data blob for download as a file.
 * @returns {blob} Data blob representing the entirety of the local c4 database
 */
export async function exportLocalData () {
  const dataBlob = await exportDB(db)
  return dataBlob
}

/**
 * Import a previously exported data blob into the local database, replacing
 * any existing data in the database.
 * @param {blob} dataBlob A file or dataBlob containing the data to import.
 * @param {boolean} [includeServers=true] Import data in the servers table
 * @param {boolean} [includeCameras=true] Import data in the cameras table
 */
export async function importLocalData (dataBlob, includeServers = true, includeCameras = true) {
  await importInto(db, dataBlob, {
    overwriteValues: true,
    filter: (table, value, key) => {
      if (!includeServers && table === 'servers') return false
      if (!includeCameras && table === 'cameras') return false
      return true
    }
  })
}

/**
 * Query the list of cameras available on a server and update
 * their entries in the database.
 * @param {ServerObjShape} server The server to refresh
 */
export async function refreshCameraList (server) {
  try {
    // Query camera list from server and adjust with proper DB keys
    console.log('Retrieving cameras for', server)
    const cameraList = await getCameraList(server)

    // Build modify query object
    const newCameras = cameraList.map(camera => camera.BodyIDEx.value)

    // Start transaction for modify query
    console.log('Updating cameras in DB')
    await db.transaction('rw', db.cameras, async () => {
      await db.cameras.where({ serverId: server.id }).modify((camera, ref) => {
        // Look for camera in camera list
        const serverCam = cameraList.find(serverCam => serverCam.BodyIDEx?.value === camera.id)
        if (!serverCam) {
          console.log('Missing camera', camera.id)
          camera.missing = true
        } else {
          // Remove from new camera list
          const camIndex = newCameras.findIndex(newCameraID => newCameraID === camera.id)
          if (camIndex >= 0) { newCameras.splice(camIndex, 1) }

          // Update its entry
          console.log('Updating camera', camera.id)
          ref.value = { ...camera, ...serverCam, missing: undefined }
        }
      })
    })

    // Add in any new cameras
    if (newCameras.length > 0) {
      console.log('Adding cameras to DB', newCameras)
      await db.cameras.bulkAdd(newCameras.map(cameraId => ({
        ...cameraList.find(serverCam => serverCam.BodyIDEx?.value === cameraId),
        id: cameraId,
        serverId: server.id
      })))
    }
  } catch (error) {
    console.error('Error refreshing server cameras')
    console.error(error)
  }
}

/**
 * Query the full details for a camera and update them in
 * the local DB.
 * @param {CameraObjShape} camera The server to refresh
 */
export async function refreshCameraDetails (serverID, cameraID) {
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
  // Pack a non-object value under the property 'value'
  if (typeof value !== 'object') {
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
