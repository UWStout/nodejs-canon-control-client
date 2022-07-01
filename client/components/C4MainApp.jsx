import React from 'react'

import { CssBaseline, ThemeProvider, Container } from '@mui/material'
import { SnackbarProvider } from 'notistack'

import C4AppBar from './C4AppBar.jsx'
import C4TabPanel from './C4TabPanel.jsx'

import CaptureControlsView from './captureControls/CaptureControlsView.jsx'
import CameraListView from './cameraList/CameraListView.jsx'
import TestingButtonsView from './testingButtons/TestingButonsView.jsx'

import ServerSettingsDialog from './settings/ServerSettingsDialog.jsx'
import ImportExportDialog from './settings/ImportExportDialog.jsx'

import C4_THEME from './C4Theme.js'

export default function App () {
  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={C4_THEME}>
        <SnackbarProvider maxSnack={3}>
          <Container maxWidth="lg">
            {/* Header AppBar with Settings Menu and BulkMode toggle */}
            <C4AppBar tabLabels={['Capture', 'List', 'Testing']} />

            {/* Primary capture controls */}
            <C4TabPanel index={0}>
              <CaptureControlsView />
            </C4TabPanel>

            {/* Main Camera list with Bulk Settings widget */}
            <C4TabPanel index={1}>
              <CameraListView />
            </C4TabPanel>

            {/* Quick Interface for Hardware Testing */}
            <C4TabPanel index={2}>
              <TestingButtonsView />
            </C4TabPanel>

            {/* Various app-wide dialogs */}
            <ServerSettingsDialog />
            <ImportExportDialog />

          </Container>
        </SnackbarProvider>
      </ThemeProvider>
    </React.Fragment>
  )
}
