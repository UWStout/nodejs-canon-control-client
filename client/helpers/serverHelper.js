import axios from 'axios'

export function getCameraList (server) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve([])

  console.log(`Retrieving camera list for ${server?.nickname} server`)
  return new Promise((resolve, reject) => {
    axios.get(`https://${server.IP}:${server.port}/camera`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          return resolve(response.data)
        } else {
          return reject(new Error('Unexpected response'))
        }
      })
      .catch((error) => { return reject(error) })
  })
}

export function getCameraDetails (server, camera) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve({})

  const camIndex = (typeof camera === 'object' ? camera?.index : camera)
  console.log(`Retrieving details for camera ${camIndex} on ${server?.nickname} server`)
  return new Promise((resolve, reject) => {
    axios.get(`https://${server.IP}:${server.port}/camera/${camIndex}`)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getCameraImagePropeties (server, camera) {
  // Skip deactivated servers
  if (!server || server.deactivated) return Promise.resolve({})

  const camIndex = (typeof camera === 'object' ? camera?.index : camera)
  console.log(`Retrieving image properties for camera ${camIndex} on ${server?.nickname} server`)
  return new Promise((resolve, reject) => {
    axios.get(`https://${server.IP}:${server.port}/camera/${camIndex}/imageProperties`)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getCameraProperty (server, camera, propID) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve({})

  const camIndex = (typeof camera === 'object' ? camera?.index : camera)
  console.log(`Retrieving property <${propID}> for camera ${camIndex} on ${server?.nickname} server`)
  return new Promise((resolve, reject) => {
    axios.get(`https://${server.IP}:${server.port}/camera/${camIndex}/${propID}`)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getAllowedPropertyValues (server, camera, propID) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve({})

  const camIndex = (typeof camera === 'object' ? camera?.index : camera)
  console.log(`Retrieving property <${propID}> allowed values for camera ${camIndex} at ${server?.nickname}  server`)
  return new Promise((resolve, reject) => {
    axios.get(`https://${server.IP}:${server.port}/camera/${camIndex}/${propID}/allowed`)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setCameraProperty (server, camera, propID, valueOrLabel) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve({})

  const camIndex = (typeof camera === 'object' ? camera?.index : camera)
  console.log(`Setting property <${propID}>="${valueOrLabel}" for camera ${camIndex} on ${server?.nickname} server`)
  return new Promise((resolve, reject) => {
    axios.post(
      `https://${server.IP}:${server.port}/camera/${camIndex}/${propID}`,
      { value: valueOrLabel }
    ).then((response) => {
      resolve(response.data)
    }).catch((error) => {
      reject(error)
    })
  })
}

export function setCameraProperties (server, camera, propertyObject) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve({})

  const camIndex = (typeof camera === 'object' ? camera?.index : camera)
  console.log(`Setting bulk properties for camera ${camIndex} on ${server?.nickname} server`)
  return new Promise((resolve, reject) => {
    axios.post(
      `https://${server.IP}:${server.port}/camera/${camIndex}`,
      propertyObject
    ).then((response) => {
      resolve(response.data)
    }).catch((error) => {
      reject(error)
    })
  })
}

export function resetCamera (server, camera) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve({})

  const camIndex = (typeof camera === 'object' ? camera?.index : camera)
  console.log(`Resetting camera ${camIndex} on ${server?.nickname} server`)
  return new Promise((resolve, reject) => {
    axios.post(`https://${server.IP}:${server.port}/camera/${camIndex}/reset`)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function takeAPhoto (server, camera) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve({})

  const camIndex = (typeof camera === 'object' ? camera?.index : camera)
  console.log(`Taking photo using camera ${camIndex} on ${server?.nickname} server`)
  return new Promise((resolve, reject) => {
    axios.post(`https://${server.IP}:${server.port}/camera/${camIndex}/trigger`)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function doAutoFocus (server, camera) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve({})

  const camIndex = (typeof camera === 'object' ? camera?.index : camera)
  console.log(`Doing auto-focus on camera ${camIndex} on ${server?.nickname} server`)
  return new Promise((resolve, reject) => {
    axios.post(`https://${server.IP}:${server.port}/camera/${camIndex}/halfShutter`)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function releaseShutter (server, camera) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve({})

  const camIndex = (typeof camera === 'object' ? camera?.index : camera)
  console.log(`Releasing shutter without focus on camera ${camIndex} on ${server?.nickname} server`)
  return new Promise((resolve, reject) => {
    axios.post(`https://${server.IP}:${server.port}/camera/${camIndex}/fullShutter`)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function syncronizeTime (server, camera) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve({})

  const camIndex = (typeof camera === 'object' ? camera?.index : camera)
  console.log(`Syncronizing clock on camera ${camIndex} on ${server?.nickname} server`)
  return new Promise((resolve, reject) => {
    axios.post(`https://${server.IP}:${server.port}/camera/${camIndex}/syncTime`)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function syncronizeCameraNicknames (server, nicknameList) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve({})

  console.log(`Syncronizing camera nickname list on ${server?.nickname} server`)
  return new Promise((resolve, reject) => {
    axios.post(`https://${server.IP}:${server.port}/server/nicknames`, nicknameList)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function ensureSessionOnServer (server, nickname, path, time, allowCreation = false) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve({})

  console.log('Creating new Session Storage')
  return new Promise((resolve, reject) => {
    axios.post(`https://${server.IP}:${server.port}/server/session/${allowCreation ? 'create' : 'confirm'}`, {
      nickname,
      path,
      time
    }).then((response) => {
      resolve(response.data)
    }).catch((error) => {
      reject(error)
    })
  })
}

export function getSessionList (server) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve({})

  console.log('Fetching list of sessions')
  return new Promise((resolve, reject) => {
    axios.get(`https://${server.IP}:${server.port}/server/sessions`)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function ensureCaptureOnServer (server, sessionPath, captureName, captureNumber, allowCreation = false) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve({})

  console.log('Creating new Capture Storage')
  return new Promise((resolve, reject) => {
    axios.post(`https://${server.IP}:${server.port}/server/capture/${allowCreation ? 'create' : 'confirm'}`, {
      sessionPath,
      captureName,
      captureNumber
    }).then((response) => {
      resolve(response.data)
    }).catch((error) => {
      reject(error)
    })
  })
}

export function getCaptureOnServer (server) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve({})

  console.log('Getting Current Capture Storage')
  return new Promise((resolve, reject) => {
    axios.get(`https://${server.IP}:${server.port}/server/capture/current`)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setCaptureOnServer (server, sessionPath, captureName, captureNumber) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve({})

  console.log('Setting target Capture Storage')
  return new Promise((resolve, reject) => {
    axios.post(`https://${server.IP}:${server.port}/server/capture/select`, {
      sessionPath,
      captureName,
      captureNumber
    }).then((response) => {
      resolve(response.data)
    }).catch((error) => {
      reject(error)
    })
  })
}

export async function getTriggerBoxList (server) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve([])

  console.log(`Retrieving trigger box list on ${server.nickname}`)
  return new Promise((resolve, reject) => {
    axios.get(`https://${server.IP}:${server.port}/trigger`)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export async function releaseTriggerBox (server, boxIndex) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve({})

  console.log(`Releasing shutter for trigger box ${boxIndex} on ${server.nickname}`)
  return new Promise((resolve, reject) => {
    axios.post(`https://${server.IP}:${server.port}/trigger/${boxIndex}/takePhoto`)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export async function focusTriggerBox (server, boxIndex) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve({})

  console.log(`Focus only for trigger box ${boxIndex} on ${server.nickname}`)
  return new Promise((resolve, reject) => {
    axios.post(`https://${server.IP}:${server.port}/trigger/${boxIndex}/focus`)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export async function primeTriggerBox (server, boxIndex) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve({})

  console.log(`Priming trigger box ${boxIndex} on ${server.nickname}`)
  return new Promise((resolve, reject) => {
    axios.post(`https://${server.IP}:${server.port}/trigger/${boxIndex}/prime`)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export async function firePrimedTriggerBox (server) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve({})

  console.log(`Firimg primed trigger box on ${server.nickname}`)
  return new Promise((resolve, reject) => {
    axios.post(`https://${server.IP}:${server.port}/trigger/fire`)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export async function flushPrimedTriggerBox (server) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve({})

  console.log(`Flushing primed trigger box on ${server.nickname}`)
  return new Promise((resolve, reject) => {
    axios.post(`https://${server.IP}:${server.port}/trigger/flush`)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getLiveViewTimeoutOnServer (server) {
  return new Promise((resolve, reject) => {
    axios.get(`https://${server.IP}:${server.port}/server/liveview/timeout`)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setLiveViewTimeoutOnServer (server, timeout) {
  return new Promise((resolve, reject) => {
    axios.post(`https://${server.IP}:${server.port}/server/liveview/timeout/${timeout}`)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
