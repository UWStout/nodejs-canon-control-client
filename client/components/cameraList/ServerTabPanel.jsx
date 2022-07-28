import * as React from 'react'
import PropTypes from 'prop-types'

import localDB from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { Box } from '@mui/material'

function a11yProps (serverId) {
  return {
    'aria-labelledby': `server-tab-${serverId}`,
    id: `server-tabpanel-${serverId}`
  }
}

export default function ServerTabPanel (props) {
  const { children, serverId, index, ...other } = props

  // Subscribe to persistent settings
  const currentServerTabIndex = useLiveQuery(() => localDB.settings.get('currentServerTabIndex'))
  const visible = ((currentServerTabIndex?.value || 0) === index)

  return (
    <div
      role="tabpanel"
      hidden={!visible}
      {...a11yProps(serverId)}
      {...other}
    >
      {visible
        ? <Box sx={{ p: 0 }}>{children}</Box>
        : null}
    </div>
  )
}

ServerTabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  serverId: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
}
