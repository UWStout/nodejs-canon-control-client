import * as React from 'react'

// State of the underlying Socket.io connections
import useSocketState from '../../state/useSocketState.js'

import { Stack, Box, IconButton, Button } from '@mui/material'
import {
  Rotate90DegreesCcw as RotateCCWIcon,
  Rotate90DegreesCw as RotateCWIcon
} from '@mui/icons-material/'

export default function CameraLiveView (props) {
  const canvasTagRef = React.useRef()

  // Subscribe to socketList state changes
  const { setLiveViewCallback, startLiveView, stopLiveView } = useSocketState(state => ({
    setLiveViewCallback: state.setLiveViewCallback,
    startLiveView: state.startLiveView,
    stopLiveView: state.stopLiveView
  }))

  // Rotation state
  const [rotation, setRotation] = React.useState(0)

  const onRotateCCW = () => {
    let newRotation = rotation - (Math.PI / 2)
    if (newRotation > Math.PI) { newRotation += Math.PI * 2 }
    setRotation(newRotation)
  }

  const onRotateCW = () => {
    let newRotation = rotation + (Math.PI / 2)
    if (newRotation < -Math.PI) { newRotation -= Math.PI * 2 }
    setRotation(newRotation)
  }

  // Receive the current live-view image
  const receiveImage = React.useCallback((message) => {
    if (canvasTagRef?.current && message.imageData) {
      const img = new Image()
      img.src = 'data:image/jpeg;base64,' + message.imageData
      img.onload = () => {
        const ctx = canvasTagRef.current.getContext('2d')
        ctx.resetTransform()
        ctx.rotate(rotation)
        ctx.drawImage(img, 0, 0, canvasTagRef?.current.width, canvasTagRef?.current.height)
      }
      img.onerror = (error) => {
        console.error('Error drawing image:', error)
      }
    }
  }, [rotation])

  // Start/Stop live view session
  React.useEffect(() => {
    startLiveView()
    return () => { stopLiveView() }
  }, [startLiveView, stopLiveView])

  // Synchronize the live view callback
  React.useEffect(() => {
    setLiveViewCallback(receiveImage)
  }, [receiveImage, setLiveViewCallback])

  // Try to clean up and reconnect
  const onRefresh = () => {
    console.log('Need refresh')
  }

  return (
    <Stack spacing={2} sx={{ margin: 2 }}>
      <Box
        ref={canvasTagRef}
        component="canvas"
        width="800"
        height="600"
      />
      <Stack direction="row" spacing={2}>
        <IconButton onClick={onRotateCCW}><RotateCCWIcon /></IconButton>
        <IconButton onClick={onRotateCW}><RotateCWIcon /></IconButton>
        <Button variant="contained" onClick={onRefresh} sx={{ marginLeft: 'auto', flexGrow: 1 }}>{'Refresh'}</Button>
      </Stack>
    </Stack>
  )
}
