import create from 'zustand'

// Create the state management store
const useStore = create(set => ({
  // Server List
  serverList: [
    // TESTING: Start with the local server already in the list
    { IP: '127.0.0.1:3000', nickname: 'Local' },
    { IP: '10.1.1.103:42424', nickname: 'West' }
  ],

  // Server list mutators
  addServer: (newServer) => set(state => {
    // Check for and avoid duplicates
    if (!state.serverList.find((server) => (
      server.IP === newServer.IP ||
      server.nickname.toLowerCase() === newServer.nickname.toLowerCase()
    ))) {
      console.log('Adding server', newServer)
      return {
        serverList: [...state.serverList, newServer]
      }
    }
  }),

  removeServerByIP: (serverIP) => set(state => {
    // Find index of server
    const index = state.serverList.findIndex(
      (server) => (server.IP === serverIP)
    )

    // If found, splice it out
    if (index >= 0) {
      console.log('Removing server', serverIP)
      const newList = [...state.serverList]
      newList.splice(index, 1)
      return {
        serverList: newList
      }
    }
  }),

  removeServerByNickname: (serverNickname) => set(state => {
    // Find index of server
    const index = state.serverList.findIndex(
      (server) => (server.nickname === serverNickname)
    )

    // If found, splice it out
    if (index >= 0) {
      const newList = [...state.serverList]
      newList.splice(index, 1)
      return {
        serverList: newList
      }
    }
  })
}))

// Expose for other modules to import
export default useStore
