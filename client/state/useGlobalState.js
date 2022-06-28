import create from 'zustand'

// Store for global application state
const useGlobalState = create(set => ({
  // Bulk mode global values
  bulkModeEnabled: false,
  bulkServerIP: '10.1.1.104:42424',
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
