import create from 'zustand'
import { io } from 'socket.io-client'

// Store for global application state
const useSocketState = create(set => ({
  // Socket connections for each server
  socketList: [],

  // Ensure the socket connectsions are synchronized with the list of servers
  updateServerSockets: (serverList) => set(state => {
    // Ignore deactivated servers
    serverList = serverList.filter(server => !server.deactivated)

    // Disconnect any old socket connections
    const staleSessions = state.socketList.filter(
      session => !(serverList.find(server => server.id === session.serverId))
    )
    staleSessions.forEach(session => {
      console.log(`SOCKET: Disconnecting from ${session.serverId}`)
      session.socket.disconnect()
    })

    // Make new connections and reuse any existing ones
    const newSocketList = serverList.map(server => {
      const socketSession = state.socketList.find(session => session.serverId === server.id)
      if (!socketSession) {
        // Make and return new socket session
        console.log(`SOCKET: connecting to ${server.id}`)
        const socket = io(`https://${server.IP}:${server.port}`, { path: '/socket.io' })
        return { serverID: server.id, socket }
      }
      return socketSession
    })

    // Update the state
    return { socketList: newSocketList }
  })
}))

// Expose for other modules to import
export default useSocketState
