import * as React from 'react'
import PropTypes from 'prop-types'

import localDB, { updateSetting } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

// State of the underlying Socket.io connections
import useSocketState from '../../state/useSocketState.js'

import { Stack, Box, IconButton, FormGroup, FormControlLabel, Slider, Button, Divider } from '@mui/material'
import {
  Rotate90DegreesCcw as RotateCCWIcon,
  Rotate90DegreesCw as RotateCWIcon
} from '@mui/icons-material/'

import CrosshairIcon from './Crosshair.jsx'

import { clearCanvas, drawImageToCanvas } from '../../helpers/canvasHelper.js'
import { ServerObjShape } from '../../state/dataModel.js'
import { getCameraImagePropeties } from '../../helpers/serverHelper.js'

import BasicSwitch from './BasicSwitch.jsx'

export default function CameraLiveView (props) {
  const { serverList } = props
  const canvasTagRef = React.useRef()

  // Subscribe to persistent settings
  const showLiveViewCrosshair = useLiveQuery(() => localDB.settings.get('showLiveViewCrosshair'))
  const doLVAutoRotate = useLiveQuery(() => localDB.settings.get('doLVAutoRotate'))

  // Coordinate local state and database
  const [localZoom, setLocalZoom] = React.useState(1.0)

  // Subscribe to live view state changes
  const { startLiveView, stopLiveView, setLiveViewCallback, ...liveViewState } = useSocketState(state => ({
    liveViewOrientation: state.liveViewOrientation,
    setLiveViewOrientation: state.setLiveViewOrientation,
    setLiveViewCallback: state.setLiveViewCallback,
    startLiveView: state.startLiveView,
    stopLiveView: state.stopLiveView,
    selectedServer: state.liveViewServerSelection,
    selectedCamera: state.liveViewCameraSelection
  }))

  // The current live view image
  const [imageData, setImageData] = React.useState(null)

  // Receive the current live-view image
  const receiveImage = React.useCallback((message) => {
    if (message.imageData) {
      setImageData(message.imageData)
    }
  }, [])

  // Rotation state (in 90deg units)
  const [rotation, setRotation] = React.useState(0)

  React.useEffect(() => {
    if (doLVAutoRotate?.value) {
      switch (liveViewState.liveViewOrientation) {
        case 0: case 1: setRotation(0); break
        case 3: setRotation(2); break
        case 6: setRotation(1); break
        case 8: setRotation(-1); break
        default: console.error('Unknown Orientation:', liveViewState.liveViewOrientation); break
      }
    } else {
      setRotation(0)
    }

    setImageData(null)
    if (canvasTagRef?.current) { clearCanvas(canvasTagRef.current) }
  }, [liveViewState.liveViewOrientation, doLVAutoRotate])

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

  // Update the canvas whenever the image changes
  React.useEffect(() => {
    if (canvasTagRef?.current && imageData !== null) {
      drawImageToCanvas(canvasTagRef.current, imageData, rotation, localZoom, true)
    }
  }, [imageData, rotation, canvasTagRef, localZoom])

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
  const onResetLiveView = async () => {
    // Stop live view and wait a moment
    stopLiveView()
    setImageData(null)
    if (canvasTagRef?.current) { clearCanvas(canvasTagRef.current) }
    await new Promise(resolve => setTimeout(() => resolve(), 500))

    // Re-read the image properties
    try {
      const imageProps = await getCameraImagePropeties(
        serverList.find(server => server.id === liveViewState.selectedServer),
        liveViewState.selectedCamera
      )
      liveViewState.setLiveViewOrientation(imageProps.orientation)
    } catch (error) {
      console.error('Failed to read orientation')
      console.error(error)
    }

    // Start live view again
    await new Promise(resolve => setTimeout(() => resolve(), 500))
    setLiveViewCallback(receiveImage)
    startLiveView()
  }

  return (
    <Stack spacing={2} sx={{ maxHeight: '80vh', marginBottom: 1 }}>
      <Box sx={{ margin: 2, marginBottom: 0, flexGrow: 1, textAlign: 'center', position: 'relative' }}>
        <canvas
          ref={canvasTagRef}
          width="800"
          height="600"
          sx={{ height: '100%' }}
        />
        {!!(showLiveViewCrosshair?.value && imageData !== null) &&
          <CrosshairIcon sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 150 * localZoom
          }}
          />}
      </Box>
      <Stack direction="row" spacing={2} sx={{ paddingLeft: 2, paddingRight: 2 }}>
        {/* Rotation buttons */}
        <IconButton onClick={onRotateCCW}><RotateCCWIcon /></IconButton>
        <IconButton onClick={onRotateCW}><RotateCWIcon /></IconButton>
        <BasicSwitch
          label="Auto Rotate"
          checked={!!doLVAutoRotate?.value}
          setChecked={(newValue) => updateSetting('doLVAutoRotate', newValue)}
        />

        {/* Crosshair checkbox */}
        <BasicSwitch
          label="Show Crosshair"
          checked={!!showLiveViewCrosshair?.value}
          setChecked={(newValue) => updateSetting('showLiveViewCrosshair', newValue)}
        />
        <Divider orientation="vertical" variant="middle" flexItem />

        {/* Zoom Slider */}
        <FormGroup sx={{ flexGrow: 1, justifyContent: 'center' }}>
          <FormControlLabel
            label='Zoom'
            labelPlacement='start'
            control={
              <Slider
                value={localZoom}
                onChange={e => setLocalZoom(e.target.value)}
                valueLabelDisplay="auto"
                step={0.1}
                marks
                min={1.0}
                max={4.0}
                sx={{ marginLeft: 4, marginRight: 4 }}
              />
            }
          />
        </FormGroup>
        <Divider orientation="vertical" variant="middle" flexItem />

        {/* Live View Reset Button */}
        <Button variant="contained" onClick={onResetLiveView}>{'Reset Live View'}</Button>
      </Stack>
    </Stack>
  )
}

CameraLiveView.propTypes = {
  serverList: PropTypes.arrayOf(PropTypes.shape(ServerObjShape))
}

CameraLiveView.defaultProps = {
  serverList: []
}
