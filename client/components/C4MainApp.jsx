import React from 'react'

import { CssBaseline, Container, Grid } from '@mui/material'

import C4AppBar from './C4AppBar.jsx'
import CameraList from './cameraList/CameraList.jsx'
import ServerSettingsDialog from './settings/ServerSettingsDialog.jsx'
import ImportExportDialog from './settings/ImportExportDialog.jsx'

export default function App () {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        {/* Header AppBar with Settings Menu and BulkMode toggle */}
        <C4AppBar />

        {/* Main Camera list with Bulk Settings widget */}
        <Grid container sx={{ bgcolor: '#cfe8fc', padding: '16px' }}>
          <Grid item xs={12}>
            <CameraList />
          </Grid>
        </Grid>

        {/* Various app-wide dialogs */}
        <ServerSettingsDialog />
        <ImportExportDialog />

      </Container>
    </React.Fragment>
  )
}
