import create from 'zustand'

// Store for camera related state
const useCameraStore = create(set => ({
  // Camera List
  cameraList: {},

  // Camera list mutators
  addCameras: (newCameras, serverIP) => set(state => {
    console.log('Updating camera list for', serverIP)
    const cameraList = { ...state.cameraList }
    cameraList[serverIP] = [...newCameras]
    return { cameraList }
  }),

  removeCamera: (cameraIndex, serverIP) => set(state => {
    if (Array.isArray(state.cameraList[serverIP])) {
      const listIndex = state.cameraList[serverIP].findIndex((camera) => (camera.index === cameraIndex))
      if (listIndex >= 0) {
        const cameraList = { ...state.cameraList }
        cameraList[serverIP].splice(listIndex, 1)
        return { cameraList }
      }
    }
  })
}))

// Expose for other modules to import
export default useCameraStore
