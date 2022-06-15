import React from 'react'

import useGlobalState from './state/useGlobalState.js'

import {
  CssBaseline,
  Container,
  Button,
  Fab,
  FormControlLabel,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  Switch
} from '@mui/material'
import { Settings as SettingsIcon } from '@mui/icons-material'

import CameraList from './components/CameraList.jsx'
import ServerSettingsForm from './components/ServerSettingsForm.jsx'

export default function App () {
  const [showSettings, setShowSettings] = React.useState(false)
  const { bulkModeEnabled, toggleBulkMode } = useGlobalState(state => state)

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl">
        {/* Main Camera list */}
        <Grid container sx={{ bgcolor: '#cfe8fc', padding: '16px' }}>
          <Grid item xs={9}>
            <Typography variant="h4">{'Canon Cam Control Client'}</Typography>
          </Grid>
          <Grid item xs={3}>
            <FormControlLabel
              control={
                <Switch value={bulkModeEnabled} onClick={toggleBulkMode} />
              }
              label="Bulk Mode"
            />
          </Grid>
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
