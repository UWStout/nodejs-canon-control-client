import React from 'react'

import localDB, { clearCameraStatus, reloadCameraList } from '../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { CssBaseline, ThemeProvider, Container } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { ConfirmProvider } from 'material-ui-confirm'

import C4AppBar from './C4AppBar.jsx'
import C4TabPanel from './C4TabPanel.jsx'

import CaptureControlsView from './captureControls/CaptureControlsView.jsx'
import CameraListView from './cameraList/CameraListView.jsx'
import TestingButtonsView from './testingButtons/TestingButonsView.jsx'

import ServerSettingsDialog from './settings/ServerSettingsDialog.jsx'
import ImportExportDialog from './settings/ImportExportDialog.jsx'

import C4_THEME from './C4Theme.js'

import { useServerSockets } from './socketHooks.js'

export default function App () {
  // Subscribe to changes in the server list
  const serverList = useLiveQuery(() => localDB.servers.toArray())

  // Always reset camera status on first render
  React.useEffect(() => {
    (async () => {
      try {
        await clearCameraStatus()
        console.log('Camera status cleared')
      } catch (error) {
        alert('Failed to clear camera status')
        console.error(error)
      }
    })()
  }, [])

  // Setup and syncronize the socket.io connections
  useServerSockets(serverList)

  // Syncronize camera list when servers change
  React.useEffect(() => {
    // Async function to refresh list of cameras
    const updateCameraList = async () => {
      if (Array.isArray(serverList)) {
        for (let i = 0; i < serverList.length; i++) {
          if (!serverList[i].deactivated) {
            await reloadCameraList(serverList[i])
          }
        }
      }
    }

    // Start async function
    updateCameraList()
  }, [serverList])

  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={C4_THEME}>
        <ConfirmProvider>
          <SnackbarProvider maxSnack={6}>
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
        </ConfirmProvider>
      </ThemeProvider>
    </React.Fragment>
  )
}
