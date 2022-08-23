import React from 'react'

import localDB, { clearCameraStatus, reloadCameraList } from '../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'
import { useServerSockets } from './socketHooks.js'

import { CssBaseline, ThemeProvider, Container } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { ConfirmProvider } from 'material-ui-confirm'

import C4AppBar from './C4AppBar.jsx'
import C4TabPanel from './C4TabPanel.jsx'

import CaptureControlsView from './captureControls/CaptureControlsView.jsx'
import CameraListView from './cameraList/CameraListView.jsx'
import TestingButtonsView from './testingButtons/TestingButonsView.jsx'

import ServerSettingsDialog from './settingsAndFeedback/ServerSettingsDialog.jsx'
import ImportExportDialog from './settingsAndFeedback/ImportExportDialog.jsx'
import CameraNicknameSyncDialog from './settingsAndFeedback/CameraNicknameSyncDialog.jsx'
import LiveViewDialog from './liveView/LiveViewDialog.jsx'

import C4_THEME from './C4Theme.js'
import BulkTaskFeedback from './settingsAndFeedback/BulkTaskFeedback.jsx'
import ServerStatusVerifier from './settingsAndFeedback/ServerStatusVerifier.jsx'
import GroupManagementDialog from './settingsAndFeedback/GroupManagementDialog.jsx'

export default function C4MainApp () {
  // Subscribe to changes in the server list
  const serverList = useLiveQuery(() => localDB.servers.toArray())

  // Setup and syncronize the socket.io connections
  useServerSockets(serverList)

  // Always reset camera status on first render
  const [resetDone, setResetDone] = React.useState(false)
  React.useEffect(() => {
    (async () => {
      try {
        await clearCameraStatus()
        console.log('Camera status cleared')
      } catch (error) {
        alert('Failed to clear camera status')
        console.error(error)
      }
      setResetDone(true)
    })()
  }, [])

  // Syncronize camera list when servers change
  const [syncronizedServers, setSyncronizedServers] = React.useState([])
  React.useEffect(() => {
    // Async function to refresh list of cameras
    const updateCameraList = async () => {
      if (Array.isArray(serverList)) {
        // Keep track of changes to the list of syncronized servers
        let changed = false
        const newSyncServers = [...syncronizedServers]

        // go through and syncronized any servers that have been added or activated
        for (let i = 0; i < serverList.length; i++) {
          const server = serverList[i]

          // If it's deactivated, make sure it is NOT in the syncronized list
          if (server.deactivated) {
            const index = newSyncServers.findIndex(serverId => serverId === server.id)
            if (index >= 0) {
              newSyncServers.splice(index, 1)
              changed = true
            }
          } else {
            // Has this one been syncronized already
            if (!newSyncServers.includes(server.id)) {
              newSyncServers.push(server.id)
              reloadCameraList(serverList[i])
              changed = true
            }
          }
        }

        // Update list of synchronized servers only if needed
        if (changed) {
          setSyncronizedServers(newSyncServers)
        }
      }
    }

    // Start async function
    if (resetDone) {
      updateCameraList()
    }
  }, [resetDone, serverList, syncronizedServers])

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
              <CameraNicknameSyncDialog />
              <LiveViewDialog />
              <BulkTaskFeedback />
              <GroupManagementDialog />

              {/* Invisible Server Tester */}
              <ServerStatusVerifier serverList={serverList} />

            </Container>
          </SnackbarProvider>
        </ConfirmProvider>
      </ThemeProvider>
    </React.Fragment>
  )
}
