import axios from 'axios'

export function getCameraList (server) {
  console.log('Retrieving camera list for', server)
  return new Promise((resolve, reject) => {
    axios.get(`https://${server.IP}/camera`)
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

export function getCameraDetails (serverIP, camIndex) {
  console.log('Retrieving details for camera', camIndex, 'on', serverIP)
  return new Promise((resolve, reject) => {
    axios.get(`https://${serverIP}/camera/${camIndex}`)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
