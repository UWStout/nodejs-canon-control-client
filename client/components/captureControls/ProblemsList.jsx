import React from 'react'

import localDB from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'
import useCaptureState from '../../state/useCaptureState.js'

import { Typography, Divider } from '@mui/material'

// Convert the EDSDK settings to actual values
function buildExpectedExposure (bulkSettings) {
  const exposureFraction = bulkSettings?.Tv.split('/')
  return {
    shutterSpeed: parseInt(exposureFraction?.[0]) / parseInt(exposureFraction?.[1]),
    apertureValue: parseInt(bulkSettings?.Av.slice(1)),
    iso: parseInt(bulkSettings?.ISOSpeed),
    focalLength: 18
  }
}

export default function ProblemsList () {
  // Subscribe to bulk mode changes
  const bulkExposureSettings = useLiveQuery(() => localDB.settings.get('bulkExposureSettings'))
  const expectedExposure = buildExpectedExposure(bulkExposureSettings)

  // Subscribe to changes in the capture state
  const completedList = useCaptureState(state => (state.succeeded))

  // Build list of problems
  const problemList = completedList.map((image) => {
    if (Math.abs(image.exposureInfo.shutterSpeed - expectedExposure.shutterSpeed) > 1e-6) {
      return `${image.filename} has an unexpected shutter speed (${image.exposureInfo.shutterSpeed.toFixed(6)})`
    }

    if (image.exposureInfo.apertureValue !== expectedExposure.apertureValue) {
      return `${image.filename} has an unexpected aperture f-stop (${image.exposureInfo.apertureValue})`
    }

    if (image.exposureInfo.focalLength !== expectedExposure.focalLength) {
      return `${image.filename} has an unexpected focal length (${image.exposureInfo.focalLength} mm)`
    }

    if (image.exposureInfo.iso !== expectedExposure.iso) {
      return `${image.filename} has an unexpected ISO (${image.exposureInfo.iso})`
    }

    return ''
  }).filter(problemStr => problemStr !== '')

  // If there are problems, show them
  if (problemList.length > 0) {
    return (
      <React.Fragment>
        <Divider sx={{ width: '100%' }} />
        <Typography variant='h6' component='div' sx={{ width: '100%' }}>
          {'Problems'}
        </Typography>
        <Typography variant='body1' component='div' sx={{ whiteSpace: 'pre-wrap', width: '100%' }}>
          {problemList.map(problemString => `  - ${problemString}\n`)}
        </Typography>
      </React.Fragment>
    )
  }

  return (<div />)
}
