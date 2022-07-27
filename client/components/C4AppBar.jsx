import React from 'react'
import PropTypes from 'prop-types'

import localDB, { updateSetting } from '../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'
import { useSnackbar } from 'notistack'

import { AppBar, Toolbar, Typography, Tabs, Tab, Box } from '@mui/material'
import SettingsMenu from './settings/SettingsMenu.jsx'

import useBulkTaskState from '../state/useBulkTaskState.js'

// Helper for generating proper tab a11y/aria props
function a11yProps (index) {
  return {
    id: `c4-tab-${index}`,
    'aria-controls': `c4-tabpanel-${index}`
  }
}

export default function C4AppBar (props) {
  const { tabLabels } = props

  // Subscribe to persistent settings
  const currentViewTabIndex = useLiveQuery(() => localDB.settings.get('currentViewTabIndex'))

  // Show bulk state snackbar on completion
  const { enqueueSnackbar } = useSnackbar()
  const bulkState = useBulkTaskState(state => state)
  React.useEffect(() => {
    if (bulkState.done && bulkState.completeCount > 0) {
      if (bulkState.failedCount === bulkState.completeCount) {
        enqueueSnackbar(`${bulkState.task?.type} failed`, { variant: 'error' })
      } else if (bulkState.failedCount > 0) {
        enqueueSnackbar(`${bulkState.task?.type} partial failure`, { variant: 'warning' })
      } else {
        enqueueSnackbar(`${bulkState.task?.type} complete`, { variant: 'success' })
      }
    }
  }, [bulkState.completeCount, bulkState.done, bulkState.failedCount, bulkState.task?.type, enqueueSnackbar])

  return (
    <AppBar position="static">
      <Toolbar>
        {/* App Title */}
        <Typography variant="h5" component="div">
          {'Canon Cam Control Client'}
        </Typography>

        {/* Create the tabs */}
        <Box sx={{ flexGrow: 1 }}>
          <Tabs
            textColor="inherit"
            value={currentViewTabIndex?.value || 0}
            onChange={(e, index) => updateSetting('currentViewTabIndex', index)}
            aria-label="c4 View Tabs"
            centered
          >
            {tabLabels.map((label, i) => (
              <Tab key={`c4tab-${i}`} label={label} {...a11yProps(i)} />
            ))}
          </Tabs>
        </Box>

        {/* Access to the global settings */}
        <SettingsMenu />
      </Toolbar>
    </AppBar>
  )
}

C4AppBar.propTypes = {
  tabLabels: PropTypes.arrayOf(PropTypes.string).isRequired
}
