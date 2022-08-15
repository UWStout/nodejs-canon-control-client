import create from 'zustand'
import { io } from 'socket.io-client'

function updateLiveView (socket, cameraIndex, callback, timeoutCallback) {
  console.log(`Syncing live view state: ${cameraIndex}`)

  // Make sure callback is in sync
  socket.off('LiveViewImage')
  socket.on('LiveViewImage', callback)

  // Sync timeout callback
  socket.off('LiveViewTimeout')
  socket.on('LiveViewTimeout', timeoutCallback)

  socket.off('LiveViewError')
  socket.on('LiveViewError', (data) => {
    console.error('Failed to start live view')
    console.error(data.message)
    console.error(data.error.message)
  })

  // Sync camera index
  if (cameraIndex >= 0) {
    console.log('Setting live view camera to', cameraIndex)
    socket.emit('setLiveViewCamera', cameraIndex)
  }
}

// Store for global application state
const useSocketState = create(set => ({
  // Socket connections for each server
  socketList: [],

  // Socket based live view settings
  liveViewActive: false,
  liveViewCallback: null,
  liveViewOrientation: 0,
  liveViewServerSelection: -1,
  liveViewCameraSelection: -1,
  timeoutDialogVisible: false,

  openTimeoutDialog: () => set (state => {
    return { timeoutDialogVisible: true }
  }),

  closeTimeoutDialog: () => set(state => {
    return { timeoutDialogVisible: false }
  }),

  setLiveViewOrientation: (newOrientation) => set(state => {
    return { liveViewOrientation: newOrientation }
  }),

  setLiveViewSelection: (serverId, cameraIndex) => set(state => {
    if (state.liveViewServerSelection !== serverId || state.liveViewCameraSelection !== cameraIndex) {
      // If live view is active, then stop on old server before changing
      if (state.liveViewActive && state.liveViewServerSelection !== serverId) {
        // Stop previous server
        const oldSocket = state.socketList.find(socket => socket.serverId === state.liveViewServerSelection)
        if (oldSocket?.socket) {
          // Stop the live view
          console.log('Stopping socket liveView on', state.liveViewServerSelection)
          oldSocket.socket.off('LiveViewImage')
          oldSocket.socket.emit('stopLiveView')
        }
      }

      // Syncronize live view state on NEW server (if ready)
      if (state.liveViewServerSelection >= 0) {
        const serverSocket = state.socketList.find(socket => socket.serverId === serverId)
        if (serverSocket?.socket) {
          updateLiveView(serverSocket.socket, cameraIndex, state.liveViewCallback, state.openTimeoutDialog)
        }
      }

      console.log(`Updating Live View Selection: ${serverId} - ${cameraIndex}`)
      return {
        liveViewServerSelection: serverId,
        liveViewCameraSelection: cameraIndex
      }
    }
  }),

  setLiveViewCallback: (newCallback) => set(state => {
    if (newCallback !== state.liveViewCallback) {
      // Syncronize live view state
      if (state.liveViewServerSelection >= 0) {
        const serverSocket = state.socketList.find(socket => socket.serverId === state.liveViewServerSelection)
        if (serverSocket?.socket) {
          updateLiveView(serverSocket.socket, state.liveViewCameraSelection, newCallback, state.openTimeoutDialog)
        }
      }

      console.log('Updating Live View callback')
      return { liveViewCallback: newCallback }
    }
  }),

  startLiveView: () => set(state => {
    if (!state.liveViewActive) {
      // Syncronize live view state
      if (state.liveViewServerSelection >= 0) {
        const serverSocket = state.socketList.find(socket => socket.serverId === state.liveViewServerSelection)
        if (serverSocket?.socket) {
          updateLiveView(serverSocket.socket, state.liveViewCameraSelection, state.liveViewCallback, state.openTimeoutDialog)
        }
      }

      console.log('Setting live view active')
      return { liveViewActive: true }
    } else {
      console.error('Failed start live view')
      console.error('Failed to find socket for server', state.liveViewServerSelection)
    }
  }),

  stopLiveView: () => set(state => {
    if (state.liveViewActive) {
      // Find server socket
      const serverSocket = state.socketList.find(socket => socket.serverId === state.liveViewServerSelection)
      if (serverSocket?.socket) {
        // Stop the live view
        console.log('Stopping socket liveView on', state.liveViewServerSelection)
        serverSocket.socket.off('LiveViewImage')
        serverSocket.socket.emit('stopLiveView')

        // Update state
        return { liveViewActive: false, liveViewCallback: null }
      } else {
        console.error('Failed stop live view')
        console.error('Failed to find socket for server', state.liveViewServerSelection)
      }
    }
  }),

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

        // Subscribe to needed events
        socket.on('connect', () => {
          socket.emit('subscribe', ['CameraList', 'Download-*', 'TriggerBox-*'])
        })

        return { serverId: server.id, socket }
      }
      return socketSession
    })

    // Update the state
    return { socketList: newSocketList }
  })
}))

// Expose for other modules to import
export default useSocketState
