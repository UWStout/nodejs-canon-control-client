import * as React from 'react'
import PropTypes from 'prop-types'

// State of the underlying Socket.io connections
import useSocketState from '../../state/useSocketState.js'

import { Box } from '@mui/material'

export default function CameraLiveView (props) {
  const { serverId, cameraIndex } = props
  const { socketList } = useSocketState(state => state)

  // The server and index currently running a live view
  const [currentServer, setCurrentServer] = React.useState(-1)

  // Receive the current live-view image
  const receiveImage = (message) => {
    console.log('Image Received')
  }

  // Synchronize the socket listeners
  React.useEffect(() => {
    if (Array.isArray(socketList)) {
      // Stop any previously running liveView
      if (currentServer >= 0) {
        const oldSocket = socketList.find(socket => socket.serverId === currentServer)
        oldSocket?.socket.emit('stopLiveView')
      }

      // Start up new one
      const newSocket = socketList.find(socket => socket.serverId === currentServer)
      if (newSocket?.socket) {
        // Reset the listener
        newSocket.socket.off('LiveViewImage')
        newSocket.socket.on('LiveViewImage', receiveImage)

        // Start new Live view
        newSocket.socket.emit('startLiveView', cameraIndex)
        setCurrentServer(serverId)

        // When unmounting, clean up!
        return () => {
          newSocket.socket.emit('stopLiveView')
          newSocket.socket.off('LiveViewImage')
        }
      }
    }
  }, [cameraIndex, currentServer, serverId, socketList])

  return (
    <Box sx={{ margins: 2, height: '90vh' }}>
      {'test'}
    </Box>
  )
}

CameraLiveView.propTypes = {
  serverId: PropTypes.number,
  cameraIndex: PropTypes.number
}

CameraLiveView.defaultProps = {
  serverId: -1,
  cameraIndex: -1
}
