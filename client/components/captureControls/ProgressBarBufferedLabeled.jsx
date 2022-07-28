import React from 'react'
import { LinearProgress, Typography, Box } from '@mui/material'
import { PropTypes } from 'prop-types'

export default function ProgressBarBufferedLabeled(props) {
  const { currentValue, maxValue, currentBuffer, label, hidden } = props

  const toPercent = (numerator, denominator) =>
  {
    return Math.round(100 * (numerator / denominator))
  }
  
  if (hidden)
  return <></>

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
      <LinearProgress
        sx={{ width: '100%' }}
        variant="buffer"
        value={toPercent(currentValue, maxValue)}
        valueBuffer={toPercent(currentBuffer, maxValue)} />
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {`${label} ${Math.round(currentValue)}/${Math.round(maxValue)}`}
      </Typography>  
    </Box>
  )
}

ProgressBarBufferedLabeled.propTypes = {
  currentValue: PropTypes.number,
  maxValue: PropTypes.number,
  currentBuffer: PropTypes.number,
  labal: PropTypes.string,
  hidden: PropTypes.bool
}

ProgressBarBufferedLabeled.defaultProps = {
  currentValue: 0,
  maxValue: 0,
  currentBuffer: 0,
  labal: '',
  hidden: true
}
