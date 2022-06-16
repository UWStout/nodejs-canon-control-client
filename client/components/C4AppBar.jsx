import React from 'react'

import useGlobalState from '../state/useGlobalState.js'

import { AppBar, Toolbar, Typography, IconButton, FormControlLabel, Switch } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'

export default function ButtonAppBar () {
  const { bulkModeEnabled, setBulkModeEnabled } = useGlobalState(state => state)

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {'Canon Cam Control Client'}
        </Typography>
        <FormControlLabel
          color="inherit"
          control={
            <Switch color="secondary" checked={bulkModeEnabled} onChange={(e) => setBulkModeEnabled(e.target.checked)} />
          }
          label="Bulk Mode"
        />
      </Toolbar>
    </AppBar>
  )
}
