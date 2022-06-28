import axios from 'axios'

export function getCameraList (server) {
  console.log('Retrieving camera list for', server)
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

export function getCameraDetails (server, camIndex) {
  console.log('Retrieving details for camera', camIndex, 'on', server.name)
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

export function getCameraProperty (server, camIndex, propID) {
  console.log('Retrieving property', propID, 'for camera', camIndex, 'on', server.name)
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

export function getAllowedPropertyValues (server, camIndex, propID) {
  console.log('Retrieving property', propID, 'for camera', camIndex, 'on', server.name)
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

export function setCameraProperty (server, camIndex, propID, valueOrLabel) {
  console.log('Retrieving property', propID, 'for camera', camIndex, 'on', server.name)
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
