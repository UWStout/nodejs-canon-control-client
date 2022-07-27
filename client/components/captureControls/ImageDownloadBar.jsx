import React from 'react'

import localDB, { updateSetting } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'
import { useSnackbar } from 'notistack'
import useCaptureState from '../../state/useCaptureState.js'

import ProgressBarBufferedLabeled from './ProgressBarBufferedLabeled.jsx'

export default function ImageDownloadBar () {
  const { enqueueSnackbar } = useSnackbar()

  // Local GUI state
  const [currentValue, setCurrentValue] = React.useState(0)
  const [maxValue, setMaxValue] = React.useState(0)
  const [currentBuffer, setCurrentBuffer] = React.useState(0)
  const [downloadInProgress, setDownloadInProgress] = React.useState(false)

  // Global settings
  const autoIncrementCapture = useLiveQuery(() => localDB.settings.get('autoIncrementCapture'))
  const currentCaptureNumber = useLiveQuery(() => localDB.settings.get('currentCaptureNumber'))

  // Subscribe to changes in the capture state
  const { newCapture, expected, inProgress, succeeded, failed } = useCaptureState(state => ({
    newCapture: state.newCapture,
    expected: state.expectedCount,
    inProgress: state.inProgress.length,
    succeeded: state.succeeded.length,
    failed: state.failed.length
  }))

  // Syncronize with the capture state
  React.useEffect(() => {
    setMaxValue(expected)
    setCurrentBuffer(inProgress)
    setDownloadInProgress(inProgress > 0 || (succeeded + failed) > 0)
    setCurrentValue(succeeded + failed)
  }, [expected, failed, inProgress, succeeded])

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
          newCapture(116)
        }, 3000)
      }
    }
  }, [autoIncrementCapture?.value, currentCaptureNumber, currentValue, downloadInProgress, enqueueSnackbar, maxValue, newCapture])

  return (
    <ProgressBarBufferedLabeled
      currentValue={currentValue}
      maxValue={maxValue}
      currentBuffer={currentBuffer}
      label="Downloading Images:"
      hidden={!downloadInProgress}
    />
  )
}
