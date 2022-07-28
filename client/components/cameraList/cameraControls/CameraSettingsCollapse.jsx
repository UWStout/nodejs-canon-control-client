import React from 'react'

import { PropTypes } from 'prop-types'

import { Stack, Divider, Box, Collapse, Fade } from '@mui/material'
import {
  ArrowBackIosRounded as BackArrowIcon
} from '@mui/icons-material'

import CameraActionAndPropertyButtons from './CameraActionAndPropertyButtons'

export default function CameraSettingsCollapse(props) {
  const { hidden, readOnly, ...other } = props

  return (
    <Stack spacing={1} direction="row" alignItems="center">
      <Fade orientation="horizontal" in={hidden} unmountOnExit mountOnEnter>
        <BackArrowIcon color={(readOnly) ? 'disabled' : 'action'}/>
      </Fade>
      <Divider orientation="vertical" flexItem />
      <Collapse orientation="horizontal" in={!hidden} unmountOnExit mountOnEnter>
        <Box><CameraActionAndPropertyButtons readOnly={readOnly} {...other} /></Box>
      </Collapse>
    </Stack>
  )
}

CameraActionAndPropertyButtons.propTypes = {
  hidden: PropTypes.bool,
  readOnly: PropTypes.bool
}

CameraActionAndPropertyButtons.defaultProps = {
  hidden: true,
  readOnly: false
}