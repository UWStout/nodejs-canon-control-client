import React from 'react'
import PropTypes from 'prop-types'

import { List } from '@mui/material'

export default function CameraList (props) {
  const { children } = props
  return (
    <React.StrictMode>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {children}
      </List>
    </React.StrictMode>
  )
}

CameraList.propTypes = {
  children: PropTypes.node
}

CameraList.defaultProps = {
  children: null
}
