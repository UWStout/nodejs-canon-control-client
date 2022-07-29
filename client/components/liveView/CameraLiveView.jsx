import * as React from 'react'
import PropTypes from 'prop-types'

import { Box } from '@mui/material'

export default function CameraLiveView (props) {
  const { liveViewURL, title } = props
  return (
    <Box sx={{ margins: 2, height: '90vh' }}>
      {liveViewURL !== '' &&
        <iframe
          style={{ width: '100%', height: '100%' }}
          sandbox='allow-same-origin'
          src={liveViewURL}
          title={title}
        />}
    </Box>
  )
}

CameraLiveView.propTypes = {
  liveViewURL: PropTypes.string,
  title: PropTypes.string
}

CameraLiveView.defaultProps = {
  liveViewURL: '',
  title: ''
}
