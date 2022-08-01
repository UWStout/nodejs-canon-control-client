import * as React from 'react'
import PropTypes from 'prop-types'

// State of the underlying Socket.io connections
import useSocketState from '../../state/useSocketState.js'

import { Box } from '@mui/material'

export default function CameraLiveView (props) {
  const { serverId, cameraIndex, title } = props
  const imgTagRef = React.useRef()

  // Subscribe to socketList state changes
  const { socketList } = useSocketState(state => state)

  // The server and index currently running a live view
  const [currentServer, setCurrentServer] = React.useState(-1)

  // Receive the current live-view image
  const receiveImage = (message) => {
    if (imgTagRef?.current && message.imageData) {
      imgTagRef.current.src = `data:image/jpeg;base64,${message.imageData}`
    }
  }

  // Synchronize the socket listeners
  React.useEffect(() => {
    if (Array.isArray(socketList)) {
      // Stop any previously running liveView
      if (currentServer >= 0) {
        const oldSocket = socketList.find(socket => socket.serverId === currentServer)
        console.log('Stopping socket liveView on', currentServer)
        oldSocket?.socket.emit('stopLiveView')
      }

      if (serverId >= 0 && cameraIndex >= 0) {
        // Start up new one
        const newSocket = socketList.find(socket => socket.serverId === serverId)
        if (newSocket?.socket) {
          // Reset the listener
          newSocket.socket.off('LiveViewImage')
          newSocket.socket.on('LiveViewImage', receiveImage)

          // Start new Live view
          console.log('Starting socket liveView on', serverId, 'for', cameraIndex)
          newSocket.socket.emit('startLiveView', cameraIndex)
          setCurrentServer(serverId)

          // When unmounting, clean up!
          return () => {
            console.log('CLEANUP: Stopping socket liveView on', serverId)
            newSocket.socket.emit('stopLiveView')
            newSocket.socket.off('LiveViewImage')
          }
        } else {
          console.error('No socket found for', serverId)
        }
      }
    }
  }, [cameraIndex, currentServer, serverId, socketList])

  return (
    <Box sx={{ margins: 2, height: '90vh' }}>
      <img ref={imgTagRef} alt={title} />
    </Box>
  )
}

CameraLiveView.propTypes = {
  serverId: PropTypes.number,
  cameraIndex: PropTypes.number,
  title: PropTypes.string
}

CameraLiveView.defaultProps = {
  serverId: -1,
  cameraIndex: -1,
  title: ''
}
