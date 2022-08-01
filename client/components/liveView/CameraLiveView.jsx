import * as React from 'react'
import PropTypes from 'prop-types'

// State of the underlying Socket.io connections
import useSocketState from '../../state/useSocketState.js'

import { Box } from '@mui/material'

// For decoding the imgBuffer
const bufferDecoder = new TextDecoder()

export default function CameraLiveView (props) {
  const { serverId, cameraIndex, title } = props
  const { socketList } = useSocketState(state => state)
  const imgTagRef = React.useRef()

  // The server and index currently running a live view
  const [currentServer, setCurrentServer] = React.useState(-1)

  // Receive the current live-view image
  const receiveImage = (message) => {
    console.log('Image Received')
    if (imgTagRef?.current && message.imageData) {
      imgTagRef.current.src = `data:image/jpeg;base64,${bufferDecoder.decode(message.imageData)}`
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
        const newSocket = socketList.find(socket => socket.serverId === currentServer)
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
