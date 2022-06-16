import React from 'react'

import {
  CssBaseline,
  Container,
  Button,
  Fab,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions
} from '@mui/material'
import { Settings as SettingsIcon } from '@mui/icons-material'

import C4AppBar from './components/C4AppBar.jsx'
import CameraList from './components/CameraList.jsx'
import ServerSettingsForm from './components/ServerSettingsForm.jsx'

export default function App () {
  const [showSettings, setShowSettings] = React.useState(false)

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl">
        {/* Header */}
        <C4AppBar />

        {/* Main Camera list with Bulk Settings Menu */}
        <Grid container sx={{ bgcolor: '#cfe8fc', padding: '16px' }}>
          <Grid item xs={12}>
            <CameraList />
          </Grid>
        </Grid>

        {/* Button to toggle server settings */}
        <Fab
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          aria-label={'Server Settings'}
          onClick={() => setShowSettings(true)}
        >
          <SettingsIcon />
        </Fab>

        {/* Server Settings Modal */}
        <Dialog fullWidth maxWidth='sm' onClose={() => setShowSettings(false)} open={showSettings}>
          <DialogTitle>{'Configure Server List'}</DialogTitle>
          <ServerSettingsForm />
          <DialogActions>
            <Button onClick={() => setShowSettings(false)}>{'Save'}</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </React.Fragment>
  )
}
