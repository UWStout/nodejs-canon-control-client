import create from 'zustand'

// Track the progress of a capture
const useCaptureState = create(set => ({
  // Basic capture info
  expectedCount: 116,

  // Lists of cameras downloading
  inProgress: [],
  succeeded: [],
  failed: [],
  missing: [],

  // Clear current capture and prepare for a new one
  newCapture: (expectedCount) => set(state => {
    return {
      // Basic capture info
      expectedCount,

      // Clear lists
      inProgress: [],
      succeeded: [],
      failed: [],
      missing: []
    }
  }),

  // Halt the capture and count up missing cameras
  haltCapture: (cameraList, expectTwoPhotos = false) => set(state => {
    const allResults = [...state.inProgress, ...state.succeeded, ...state.failed]
    const missingList = cameraList.filter(camera => {
      const result = allResults.filter(info => info.filename.includes(camera.nickname))
      return (expectTwoPhotos ? result.length === 2 : result.length === 1)
    }).map(camera => ({
      nickname: camera.nickname,
      serverId: camera.serverId,
      index: camera.index
    }))

    return { missing: missingList }
  }),

  // Keep track of started downloads
  downloadStarted: (serverId, cameraIndex, filename) => set(state => {
    // Build info updates
    const cameraInfo = { cameraIndex, serverId, filename }
    return {
      inProgress: [...state.inProgress, cameraInfo]
    }
  }),

  // Count finished downloads and save info about successes and failures
  downloadFinished: (serverId, cameraIndex, filename, exposureInfo, failed = false) => set(state => {
    // Build info object and update inProgress array
    const cameraInfo = { cameraIndex, serverId, filename, exposureInfo }
    const filteredInProgress = state.inProgress.filter(
      info => (info.cameraIndex !== cameraIndex || info.serverId !== serverId)
    )

    // Set state according to success or failure
    if (failed) {
      return {
        inProgress: filteredInProgress,
        failed: [...state.failed, cameraInfo]
      }
    } else {
      return {
        inProgress: filteredInProgress,
        succeeded: [...state.succeeded, cameraInfo]
      }
    }
  })
}))

// Expose for other modules to import
export default useCaptureState
