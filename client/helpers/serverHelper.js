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

  console.log(`Retrieving details for camera ${camera.index} on ${server?.nickname} server`)
  return new Promise((resolve, reject) => {
    axios.get(`https://${server.IP}:${server.port}/camera/${camera.index}`)
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

  console.log(`Retrieving property <${propID}> for camera ${camera.index} on ${server?.nickname} server`)
  return new Promise((resolve, reject) => {
    axios.get(`https://${server.IP}:${server.port}/camera/${camera.index}/${propID}`)
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

  console.log(`Retrieving property <${propID}> allowed values for camera ${camera.index} at ${server?.nickname}  server`)
  return new Promise((resolve, reject) => {
    axios.get(`https://${server.IP}:${server.port}/camera/${camera.index}/${propID}/allowed`)
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

  console.log(`Setting property <${propID}>="${valueOrLabel}" for camera ${camera?.index || camera} on ${server?.nickname} server`)
  return new Promise((resolve, reject) => {
    axios.post(
      `https://${server.IP}:${server.port}/camera/${camera.index || camera}/${propID}`,
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

  console.log(`Setting bulk properties for camera ${camera?.index || camera} on ${server?.nickname} server`)
  return new Promise((resolve, reject) => {
    axios.post(
      `https://${server.IP}:${server.port}/camera/${camera.index || camera}`,
      propertyObject
    ).then((response) => {
      resolve(response.data)
    }).catch((error) => {
      reject(error)
    })
  })
}

export function takeAPhoto (server, camera) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve({})

  console.log(`Taking photo using camera ${camera?.index || camera} on ${server?.nickname} server`)
  return new Promise((resolve, reject) => {
    axios.post(`https://${server.IP}:${server.port}/camera/${camera.index || camera}/trigger`)
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

  console.log(`Doing auto-focus on camera ${camera?.index || camera} on ${server?.nickname} server`)
  return new Promise((resolve, reject) => {
    axios.post(`https://${server.IP}:${server.port}/camera/${camera.index || camera}/halfShutter`)
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

  console.log(`Releasing shutter without focus on camera ${camera?.index || camera} on ${server?.nickname} server`)
  return new Promise((resolve, reject) => {
    axios.post(`https://${server.IP}:${server.port}/camera/${camera.index || camera}/fullShutter`)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
