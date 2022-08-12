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

  // Camera List
  const cameraList = useLiveQuery(() => localDB.cameras.toArray(), [], [])

  // Global settings
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
      if (autoIncrementCapture?.value) {
        // Watch out for an undefined setting value
        const currentNumber = (typeof currentCaptureNumber?.value === 'number'
          ? currentCaptureNumber.value
          : 0
        )

        // Wait a short time and then increment the capture number
        setTimeout(() => {
          updateSetting('currentCaptureNumber', currentNumber + 1)
          newCapture(Array.isArray(cameraList) ? cameraList.length : 0)
        }, 3000)
      }
    }
  }, [autoIncrementCapture?.value, cameraList, currentCaptureNumber, currentValue, downloadInProgress, enqueueSnackbar, maxValue, newCapture])

  const onStop = () => {
    haltCapture(cameraList)
  }

  const onReset = () => {
    newCapture(Array.isArray(cameraList) ? cameraList.length : 0)
  }

  return (
    <Stack direction="row" spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
      <LinearProgress variant="determinate" sx={{ flexGrow: 1 }} value={100 * (capture.succeeded + capture.failed) / capture.expected} />
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {`${capture.succeeded + capture.failed}/${capture.expected}`}
      </Typography>
      <Divider orientation="vertical" variant="middle" flexItem />
      <Button disabled={!downloadInProgress} onClick={onStop} variant="contained">{'Stop'}</Button>
      <Button disabled={!downloadInProgress} onClick={onReset} variant="contained">{'Reset'}</Button>
    </Stack>
  )
}
