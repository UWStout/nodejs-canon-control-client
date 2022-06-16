import create from 'zustand'

// Store for global application state
const useGlobalState = create(set => ({
  // Bulk mode global values
  bulkModeEnabled: true,
  bulkServerIP: '127.0.0.1:3000',
  bulkCameraIndex: 0,
  bulkModeSettings: null,

  // Bulk mode setters and mutators
  toggleBulkMode: () => set(state => {
    return { bulkModeEnabled: !state.bulkModeEnabled }
  }),

  setBulkModeEnabled: (enabledState) => set(state => {
    return { bulkModeEnabled: enabledState }
  }),

  updateBulkModeSettings: (newSettings) => set(state => {
    console.log('Updating bulk mode settings:')
    console.log({ ...state.bulkModeSettings, ...newSettings })
    return {
      bulkModeSettings: { ...state.bulkModeSettings, ...newSettings }
    }
  })
}))

// Expose for other modules to import
export default useGlobalState
