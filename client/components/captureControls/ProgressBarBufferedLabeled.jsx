import React from 'react'
import { LinearProgress, Typography, Box } from '@mui/material'
import { PropTypes } from 'prop-types'

export default function ProgressBarBufferedLabeled (props) {
  const { currentValue, maxValue, currentBuffer, label, hidden } = props

  const toPercent = (numerator, denominator) => {
    return Math.round(100 * (numerator / denominator))
  }

  if (hidden) { return <div /> }

  return (
    <React.Fragment>
      <LinearProgress
        sx={{ flexGrow: 1 }}
        value={toPercent(currentValue, maxValue)}
        // valueBuffer={toPercent(currentBuffer, maxValue)}
      />
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {`${label} ${Math.round(currentValue)}/${Math.round(maxValue)}`}
      </Typography>
    </React.Fragment>
  )
}

ProgressBarBufferedLabeled.propTypes = {
  currentValue: PropTypes.number,
  maxValue: PropTypes.number,
  currentBuffer: PropTypes.number,
  label: PropTypes.string,
  hidden: PropTypes.bool
}

ProgressBarBufferedLabeled.defaultProps = {
  currentValue: 0,
  maxValue: 0,
  currentBuffer: 0,
  label: '',
  hidden: true
}
