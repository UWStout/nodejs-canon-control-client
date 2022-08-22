import create from 'zustand'

// Store for global application state
const useGlobalState = create(set => ({
  // Building a camera group
  selectedCameras: [],
  addCameraToSelection: (newCameraId) => set(state => {
    return {
      selectedCameras: [...state.selectedCameras, newCameraId]
    }
  }),
  removeCameraFromSelection: (removedCameraId) => set(state => {
    return {
      selectedCameras: state.selectedCameras.filter(id => id !== removedCameraId)
    }
  }),
  clearSelectedCameras: () => set(state => {
    return { selectedCameras: [] }
  }),

  // Visibility of settings dialogs
  serverEditDialogVisible: false,
  showServerEditDialog: () => set(state => {
    return { serverEditDialogVisible: true }
  }),
  hideServerEditDialog: () => set(state => {
    return { serverEditDialogVisible: false }
  }),

  importExportDialogVisible: false,
  showImportExportDialog: () => set(state => {
    return { importExportDialogVisible: true }
  }),
  hideImportExportDialog: () => set(state => {
    return { importExportDialogVisible: false }
  }),

  cameraNicknameSyncDialogVisible: false,
  showCameraNicknameSyncDialog: () => set(state => {
    return { cameraNicknameSyncDialogVisible: true }
  }),
  hideCameraNicknameSyncDialog: () => set(state => {
    return { cameraNicknameSyncDialogVisible: false }
  }),

  liveViewDialogVisible: false,
  showLiveViewDialog: () => set(state => {
    return { liveViewDialogVisible: true }
  }),
  hideLiveViewDialog: () => set(state => {
    return { liveViewDialogVisible: false }
  }),

  bulkTaskFeedbackDialogVisible: false,
  showBulkTaskFeedbackDialog: () => set(state => {
    return { bulkTaskFeedbackDialogVisible: true }
  }),
  hideBulkTaskFeedbackDialog: () => set(state => {
    return { bulkTaskFeedbackDialogVisible: false }
  }),

  // Bulk mode global values
  bulkProperties: null,
  updateBulkProperties: (newProperties) => set(state => {
    console.log('Updating bulk properties:')
    console.log({ ...state.bulkProperties, ...newProperties })
    return {
      bulkProperties: { ...state.bulkProperties, ...newProperties }
    }
  })
}))

// Expose for other modules to import
export default useGlobalState
