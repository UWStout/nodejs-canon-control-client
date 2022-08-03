import * as React from 'react'

// State of the underlying Socket.io connections
import useSocketState from '../../state/useSocketState.js'

import localDB, { updateSetting } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { Stack, Box, IconButton, Button } from '@mui/material'
import {
  Rotate90DegreesCcw as RotateCCWIcon,
  Rotate90DegreesCw as RotateCWIcon
} from '@mui/icons-material/'

import BasicSwitch from './BasicSwitch'

export default function CameraLiveView (props) {
  const canvasTagRef = React.useRef()

  // Subscribe to socketList state changes
  const { liveViewOrientation, setLiveViewCallback, startLiveView, stopLiveView } = useSocketState(state => ({
    liveViewOrientation: state.liveViewOrientation,
    setLiveViewCallback: state.setLiveViewCallback,
    startLiveView: state.startLiveView,
    stopLiveView: state.stopLiveView
  }))

  // Rotation state (in 90deg units)
  const [rotation, setRotation] = React.useState(0)
  const doLVAutoRotate = useLiveQuery(() => localDB.settings.get('doLVAutoRotate'))

  React.useEffect(() => {
    if (!!doLVAutoRotate?.value) {
      switch (liveViewOrientation) {
        case 0: case 1: setRotation(0); break
        case 3: setRotation(2); break
        case 6: setRotation(1); break
        case 8: setRotation(-1); break
        default: console.error('Unknown Orientation:', liveViewOrientation); break
      }
    } else {
      setRotation(0)
    }
  }, [liveViewOrientation, doLVAutoRotate])

  const onRotateCCW = () => {
    let newRotation = rotation - 1
    if (newRotation < -2) { newRotation += 4 }
    setRotation(newRotation)
  }

  const onRotateCW = () => {
    let newRotation = rotation + 1
    if (newRotation > 2) { newRotation -= 4 }
    setRotation(newRotation)
  }

  // The current live view image
  const [imageData, setImageData] = React.useState(null)

  // Receive the current live-view image
  const receiveImage = React.useCallback((message) => {
    if (message.imageData) {
      setImageData(message.imageData)
    }
  }, [])

  // Update the canvas whenever the image changes
  React.useEffect(() => {
    if (canvasTagRef?.current && imageData !== null) {
      const img = new Image()
      img.src = 'data:image/jpeg;base64,' + imageData
      img.onload = () => {
        // Determine image dims with rotation
        const imgDims = { width: img.width, height: img.height }
        if (Math.abs(rotation) === 1) {
          imgDims.width = img.height
          imgDims.height = img.width
        }

        // Resize canvas
        if (canvasTagRef.current.width !== imgDims.width) {
          canvasTagRef.current.width = imgDims.width
          canvasTagRef.current.height = imgDims.height
        }

        // Clear the canvas context
        const ctx = canvasTagRef.current.getContext('2d')
        ctx.resetTransform()
        ctx.clearRect(0, 0, canvasTagRef.current.width, canvasTagRef.current.height)

        // Setup the rotation transform
        ctx.translate(imgDims.width / 2, imgDims.height / 2)
        ctx.rotate(rotation * Math.PI / 2)
        ctx.translate(-img.width / 2, -img.height / 2)

        // Draw the image
        ctx.drawImage(img, 0, 0, img.width, img.height)
      }

      img.onerror = (error) => {
        console.error('Error drawing image:', error)
      }
    }
  }, [imageData, rotation, canvasTagRef])

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
    <Stack spacing={2} sx={{ maxHeight: '80vh', marginBottom: 1 }}>
      <Box sx={{ margin: 2, marginBottom: 0, flexGrow: 1, textAlign: 'center' }}>
        <canvas
          ref={canvasTagRef}
          width="800"
          height="600"
          sx={{ height: '100%' }}
        />
      </Box>
      <Stack direction="row" spacing={2} sx={{ paddingLeft: 2, paddingRight: 2 }}>
        <IconButton onClick={onRotateCCW}><RotateCCWIcon /></IconButton>
        <IconButton onClick={onRotateCW}><RotateCWIcon /></IconButton>
        <BasicSwitch
          label="Auto Rotate"
          checked={!!doLVAutoRotate?.value}
          setChecked={(newValue) => updateSetting('doLVAutoRotate', newValue)}
        />
        <Button variant="contained" onClick={onRefresh} sx={{ flexGrow: 1 }}>{'Refresh'}</Button>
      </Stack>
    </Stack>
  )
}
