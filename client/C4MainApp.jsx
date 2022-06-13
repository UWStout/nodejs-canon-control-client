import React from 'react'
import { CssBaseline, Container, Button, Fab, Box, Typography, Dialog, DialogTitle, DialogActions } from '@mui/material'
import { Settings as SettingsIcon } from '@mui/icons-material'

import CameraList from './components/CameraList.jsx'
import CameraListItem from './components/CameraListItem.jsx'
import ServerSettingsForm from './components/ServerSettingsForm.jsx'

const TEST_CAMS = [
  { serial: '012070021526', server: '10.0.1.101', model: 'Test Camera EOS T6' },
  { serial: '012070021527', server: '10.0.1.101', model: 'Test Camera EOS T6' },
  { serial: '012070021528', server: '10.0.1.101', model: 'Test Camera EOS T6' },
  { serial: '012070021529', server: '10.0.1.101', model: 'Test Camera EOS T6' },
  { serial: '012070021530', server: '10.0.1.101', model: 'Test Camera EOS T6' },
  { serial: '012070021531', server: '10.0.1.101', model: 'Test Camera EOS T6' }
]

export default function App () {
  const [showSettings, setShowSettings] = React.useState(false)

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl">
        {/* Main Camera list */}
        <Box sx={{ bgcolor: '#cfe8fc', height: '100vh', padding: '16px' }}>
          <Typography variant="h1">{'Canon Cam Control Client'}</Typography>
          <CameraList>
            {TEST_CAMS.map((cam, i) => (<CameraListItem key={i} cameraObj={{ ...cam, index: i }} />))}
          </CameraList>
        </Box>

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
