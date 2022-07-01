import * as React from 'react'
import PropTypes from 'prop-types'

import localDB from '../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { Box } from '@mui/material'

export default function C4TabPanel (props) {
  const { children, index, ...other } = props

  // Subscribe to persistent settings
  const currentViewTabIndex = useLiveQuery(() => localDB.settings.get('currentViewTabIndex'))
  const visible = (currentViewTabIndex?.value === index)

  return (
    <div
      role="tabpanel"
      hidden={!visible}
      id={`c4-tabpanel-${index}`}
      aria-labelledby={`c4-tab-${index}`}
      {...other}
    >
      {visible
        ? <Box sx={{ p: 0 }}>{children}</Box>
        : null}
    </div>
  )
}

C4TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired
}
