import create from 'zustand'

// Store for global application state
const useGlobalState = create(set => ({
  // General global settings
  bulkModeEnabled: true,

  // Settings mutators
  toggleBulkMode: () => set(state => {
    return { bulkModeEnabled: !state.bulkModeEnabled }
  })
}))

// Expose for other modules to import
export default useGlobalState
