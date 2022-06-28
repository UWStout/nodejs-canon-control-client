import create from 'zustand'

// Store for camera related state
const useCameraStore = create(set => ({
  // Camera List
  cameraList: {},

  // Camera list mutators
  addCameras: (newCameras, serverId) => set(state => {
    console.log('Updating camera list for', serverId)
    const cameraList = { ...state.cameraList }
    cameraList[serverId] = [...newCameras]
    return { cameraList }
  }),

  removeCamera: (cameraIndex, serverId) => set(state => {
    if (Array.isArray(state.cameraList[serverId])) {
      const listIndex = state.cameraList[serverId].findIndex((camera) => (camera.index === cameraIndex))
      if (listIndex >= 0) {
        const cameraList = { ...state.cameraList }
        cameraList[serverId].splice(listIndex, 1)
        return { cameraList }
      }
    }
  })
}))

// Expose for other modules to import
export default useCameraStore
