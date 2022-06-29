import create from 'zustand'

// Store for global application state
const useGlobalState = create(set => ({
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
