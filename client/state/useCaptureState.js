import create from 'zustand'

// Track the progress of a capture
const useCaptureState = create(set => ({
  // Basic capture info
  readyForCapture: false,
  expectedCount: -1,

  // Lists of cameras downloading
  inProgress: [],
  succeeded: [],
  failed: [],

  // Clear current capture and prepare for a new one
  newCapture: (expectedCount, isReady = false) => set(state => {
    console.log('Clearing for new capture' + (!isReady ? ' (not yet ready)' : ''))
    return {
      // Basic capture info
      readyForCapture: isReady,
      expectedCount,

      // Clear lists
      inProgress: [],
      succeeded: [],
      failed: []
    }
  }),

  // Keep track of started downloads
  downloadStarted: (serverId, cameraIndex) => set(state => {
    // Build info updates
    const cameraInfo = { cameraIndex, serverId }
    return {
      inProgress: [...state.inProgress, cameraInfo]
    }
  }),

  // Count finished downloads and save info about successes and failures
  downloadFinished: (serverId, cameraIndex, failed = false) => set(state => {
    // Build info object and update inProgress array
    const cameraInfo = { cameraIndex, serverId }
    const filteredInProgress = state.inProgress.filter(
      info => (info.cameraIndex !== cameraIndex || info.serverId !== serverId)
    )

    // Set state according to success or failure
    if (failed) {
      return {
        inProgress: filteredInProgress,
        failedList: [...state.failedList, cameraInfo]
      }
    } else {
      return {
        inProgress: filteredInProgress,
        successList: [...state.successList, cameraInfo]
      }
    }
  })
}))

// Expose for other modules to import
export default useCaptureState
