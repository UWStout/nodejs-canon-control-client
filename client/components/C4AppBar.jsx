import React from 'react'

import useGlobalState from '../state/useGlobalState.js'

import { AppBar, Toolbar, Typography, FormControlLabel, Switch } from '@mui/material'

import SettingsMenu from './settings/SettingsMenu.jsx'

export default function ButtonAppBar (props) {
  // Manage bulk mode global state
  const { bulkModeEnabled, setBulkModeEnabled } = useGlobalState(state => state)

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {'Canon Cam Control Client'}
        </Typography>
        <FormControlLabel
          color="inherit"
          control={
            <Switch
              color="secondary"
              checked={bulkModeEnabled}
              onChange={(e) => setBulkModeEnabled(e.target.checked)}
            />
          }
          label="Bulk Mode"
        />
        <SettingsMenu />
      </Toolbar>
    </AppBar>
  )
}
