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

  const camIndex = (typeof camera === 'number' ? camera : camera?.index)
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

export function getCameraProperty (server, camera, propID) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve({})

  const camIndex = (typeof camera === 'number' ? camera : camera?.index)
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

  const camIndex = (typeof camera === 'number' ? camera : camera?.index)
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

  const camIndex = (typeof camera === 'number' ? camera : camera?.index)
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

  const camIndex = (typeof camera === 'number' ? camera : camera?.index)
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

export function takeAPhoto (server, camera) {
  // Skip deactivated servers
  if (server.deactivated) return Promise.resolve({})

  const camIndex = (typeof camera === 'number' ? camera : camera?.index)
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

  const camIndex = (typeof camera === 'number' ? camera : camera?.index)
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

  const camIndex = (typeof camera === 'number' ? camera : camera?.index)
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
