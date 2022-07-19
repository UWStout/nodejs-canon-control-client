
import { io } from 'socket.io-client'

// Existing server sessions
const socketList = []

/**
 * Initialize socket.io communications with a specific server.
 * @see {@link https://socket.io/docs/v3/client-api/#io-url-options}
 * @see {@link https://socket.io/docs/v3/client-api/#socket-on-eventName-callback}
 */
export function setupSocketCommunication (hostname, port) {
  // Find existing session or make a new one
  const socketSession = socketList.find(session => session.hostname === hostname)
  if (!socketSession) {
    // Make and return new socket session
    const socket = io(`https://${hostname}:${port}`, { path: '/socket.io' })
    socketList.push({ hostname, socket })
    return socket
  }

  // Return existing socket connection
  return socketSession.socket
}

/**
 * Retrieve the active Socket.io connection. Will initialize connection if needed.
 */
export function getSocket (hostname, port = '') {
  return setupSocketCommunication(hostname, port)
}

export function subscribe (messageName, callback, hostname, port = '') {
  const socket = getSocket(hostname, port)
  if (socket) {
    socket.on(messageName, callback)
  }
}
