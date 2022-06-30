import React from 'react'

import { CssBaseline, ThemeProvider, Container, Grid, Stack } from '@mui/material'

import C4AppBar from './C4AppBar.jsx'
import CameraSortingSelect from './CameraSortingSelect.jsx'
import BulkModeSwitch from './BulkModeSwitch.jsx'
import CameraList from './cameraList/CameraList.jsx'
import ServerSettingsDialog from './settings/ServerSettingsDialog.jsx'
import ImportExportDialog from './settings/ImportExportDialog.jsx'
import ErrorsAtTopCheckbox from './ErrorsAtTopCheckbox.jsx'

import C4_THEME from './C4Theme.js'

export default function App () {
  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={C4_THEME}>
        <Container maxWidth="lg">
          {/* Header AppBar with Settings Menu and BulkMode toggle */}
          <C4AppBar />

          {/* Quck Settings */}
          <Stack direction='row' spacing={1} alignItems='center' sx={{ bgcolor: '#cfe8fc', padding: 1, paddingBottom: 0 }}>
            <CameraSortingSelect />
            <ErrorsAtTopCheckbox sx={{ flexGrow: 1 }} />
            <BulkModeSwitch />
          </Stack>

          {/* Main Camera list with Bulk Settings widget */}
          <Grid container sx={{ bgcolor: '#cfe8fc', padding: 2, paddingTop: 0 }}>
            <Grid item xs={12}>
              <CameraList />
            </Grid>
          </Grid>

          {/* Various app-wide dialogs */}
          <ServerSettingsDialog />
          <ImportExportDialog />

        </Container>
      </ThemeProvider>
    </React.Fragment>
  )
}
