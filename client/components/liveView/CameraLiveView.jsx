import * as React from 'react'
import PropTypes from 'prop-types'

// State of the underlying Socket.io connections
import useSocketState from '../../state/useSocketState.js'

import { Stack, Box, IconButton, Button } from '@mui/material'
import {
  Rotate90DegreesCcw as RotateCCWIcon,
  Rotate90DegreesCw as RotateCWIcon
} from '@mui/icons-material/'

export default function CameraLiveView (props) {
  const { serverId, cameraIndex } = props
  const canvasTagRef = React.useRef()

  // Subscribe to socketList state changes
  const { socketList } = useSocketState(state => state)

  // The server id and camera index currently running a live view
  const [currentServer, setCurrentServer] = React.useState(-1)
  const [currentCamera, setCurrentCamera] = React.useState(-1)

  // Receive the current live-view image
  const receiveImage = (message) => {
    if (canvasTagRef?.current && message.imageData) {
      const img = new Image()
      img.src = 'data:image/jpeg;base64,' + message.imageData
      img.onload = () => {
        const ctx = canvasTagRef?.current.getContext('2d')
        ctx.drawImage(img, 0, 0, canvasTagRef?.current.width, canvasTagRef?.current.height)
      }
      img.onerror = (error) => {
        console.error('Error drawing image:', error)
      }
    }
  }

  // Synchronize the socket listeners
  React.useEffect(() => {
    const hasChanged = (currentServer !== serverId || currentCamera !== cameraIndex)
    if (Array.isArray(socketList)) {
      // Stop any previously running liveView
      if (currentServer >= 0 && hasChanged) {
        const oldSocket = socketList.find(socket => socket.serverId === currentServer)
        console.log('Stopping socket liveView on', currentServer)
        oldSocket?.socket.emit('stopLiveView')
        setCurrentServer(-1)
        setCurrentCamera(-1)
      }

      // Start up new one
      if (serverId >= 0 && cameraIndex >= 0) {
        const newSocket = socketList.find(socket => socket.serverId === serverId)
        if (newSocket?.socket) {
          // Reset the listener
          newSocket.socket.off('LiveViewImage')
          newSocket.socket.on('LiveViewImage', receiveImage)

          // Start new Live view
          console.log('Starting socket liveView on', serverId, 'for', cameraIndex)
          newSocket.socket.emit('startLiveView', cameraIndex)
          setCurrentServer(serverId)
          setCurrentCamera(cameraIndex)

          // When unmounting, clean up!
          return () => {
            console.log('CLEANUP: Stopping socket liveView on', serverId)
            newSocket.socket.emit('stopLiveView')
            newSocket.socket.off('LiveViewImage')
            setCurrentServer(-1)
            setCurrentCamera(-1)
          }
        } else {
          console.error('No socket found for', serverId)
        }
      }
    }
  }, [cameraIndex, currentCamera, currentServer, serverId, socketList])

  // Rotation state
  const [rotation, setRotation] = React.useState(0)

  const onRotateCCW = () => {
    let newRotation = rotation - 90
    if (newRotation > 180) { newRotation += 360 }
    setRotation(newRotation)
  }

  const onRotateCW = () => {
    let newRotation = rotation + 90
    if (newRotation < -180) { newRotation -= 360 }
    setRotation(newRotation)
  }

  // Try to clean up and reconnect
  const onRefresh = () => {
    console.log('Need refresh')
  }

  return (
    <Stack spacing={2} sx={{ margin: 2 }}>
      <Box
        ref={canvasTagRef}
        component="canvas"
        sx={{ width: 800, height: 600 }}
      />
      <Stack direction="row" spacing={2}>
        <IconButton onClick={onRotateCCW}><RotateCCWIcon /></IconButton>
        <IconButton onClick={onRotateCW}><RotateCWIcon /></IconButton>
        <Button variant="contained" onClick={onRefresh} sx={{ marginLeft: 'auto', flexGrow: 1 }}>{'Refresh'}</Button>
      </Stack>
    </Stack>
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
