import React from 'react'

import { AppBar, Toolbar, Typography } from '@mui/material'
import SettingsMenu from './settings/SettingsMenu.jsx'

export default function ButtonAppBar (props) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          {'Canon Cam Control Client'}
        </Typography>
        <SettingsMenu />
      </Toolbar>
    </AppBar>
  )
}
