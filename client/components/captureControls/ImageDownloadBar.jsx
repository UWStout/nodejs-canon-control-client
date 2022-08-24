import React from 'react'

import localDB, { updateSetting } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'
import { useSnackbar } from 'notistack'
import useCaptureState from '../../state/useCaptureState.js'

import { Button, Stack, Divider, LinearProgress, Typography } from '@mui/material'

export default function ImageDownloadBar () {
  const { enqueueSnackbar } = useSnackbar()

  // Local GUI state
  const [currentValue, setCurrentValue] = React.useState(0)
  const [maxValue, setMaxValue] = React.useState(0)
  const [downloadInProgress, setDownloadInProgress] = React.useState(false)

  // Subscribe to changes in a few global settings
  const bulkExposureSettings = useLiveQuery(() => localDB.settings.get('bulkExposureSettings'))
  const autoIncrementCapture = useLiveQuery(() => localDB.settings.get('autoIncrementCapture'))
  const currentCaptureNumber = useLiveQuery(() => localDB.settings.get('currentCaptureNumber'))

  // Subscribe to changes in the capture state
  const { newCapture, haltCapture, ...capture } = useCaptureState(state => ({
    newCapture: state.newCapture,
    haltCapture: state.haltCapture,

    expected: state.expectedCount,
    inProgress: state.inProgress.length,
    succeeded: state.succeeded.length,
    failed: state.failed.length,
    missing: state.failed.missing
  }))

  // Camera and server Lists
  const cameraList = useLiveQuery(() => localDB.cameras.toArray(), [], [])
  const serverList = useLiveQuery(() => localDB.servers.toArray(), [], [])
  const [activeCameraList, setActiveCameraList] = React.useState([])
  React.useEffect(() => {
    const active = cameraList.filter(camera => {
      const server = serverList.find(server => server.id === camera.serverId)
      return (!camera.missing && server && !server.deactivated)
    }, 0)
    setActiveCameraList(active)
    newCapture(active.length * (bulkExposureSettings?.ImageQuality === 'RAWAndLargeJPEGFine' ? 2 : 1))
    setDownloadInProgress(false)
  }, [bulkExposureSettings?.ImageQuality, cameraList, newCapture, serverList])

  // Syncronize with the capture state
  React.useEffect(() => {
    const newMaxValue = (capture.inProgress > 0 || (capture.succeeded + capture.failed) > 0) ? capture.expected : 0
    setMaxValue(newMaxValue)
    setDownloadInProgress(newMaxValue > 0)
    setCurrentValue(capture.succeeded + capture.failed)
  }, [capture.expected, capture.failed, capture.inProgress, capture.succeeded])

  // Detect a completed capture
  React.useEffect(() => {
    if (downloadInProgress && currentValue === maxValue) {
      enqueueSnackbar('Image Download Completed', { variant: 'success' })
      setDownloadInProgress(false)
      if (autoIncrementCapture?.value) {
        // Watch out for an undefined setting value
        const currentNumber = (typeof currentCaptureNumber?.value === 'number'
          ? currentCaptureNumber.value
          : 0
        )

        // Wait a short time and then increment the capture number
        setTimeout(() => {
          updateSetting('currentCaptureNumber', currentNumber + 1)
          newCapture(activeCameraList.length * (bulkExposureSettings?.ImageQuality === 'RawAndLargeJPEGFine' ? 2 : 1))
        }, 3000)
      }
    }
  }, [activeCameraList, autoIncrementCapture?.value, bulkExposureSettings?.ImageQuality, currentCaptureNumber, currentValue, downloadInProgress, enqueueSnackbar, maxValue, newCapture])

  const onStop = () => {
    haltCapture(activeCameraList, bulkExposureSettings?.ImageQuality === 'RawAndLargeJPEGFine')
    setDownloadInProgress(false)
  }

  const onReset = () => {
    newCapture(activeCameraList.length * (bulkExposureSettings?.ImageQuality === 'RawAndLargeJPEGFine' ? 2 : 1))
    setDownloadInProgress(false)
  }

  return (
    <Stack direction="row" spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
      <LinearProgress variant="determinate" sx={{ flexGrow: 1 }} value={100 * (capture.succeeded + capture.failed) / capture.expected} />
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', minWidth: '55px' }}>
        {`${capture.succeeded + capture.failed}/${capture.expected}`}
      </Typography>
      <Divider orientation="vertical" variant="middle" flexItem />
      <Button disabled={!downloadInProgress} onClick={onStop} variant="contained">{'Stop'}</Button>
      <Button disabled={!downloadInProgress} onClick={onReset} variant="contained">{'Reset'}</Button>
    </Stack>
  )
}
