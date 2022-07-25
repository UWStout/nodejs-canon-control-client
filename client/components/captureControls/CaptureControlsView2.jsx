import React from 'react'

import { Grid, Stack } from '@mui/material'

import SessionCaptureSelect from './SessionCaptureSelect.jsx'

export default function CaptureControlsView () {
  return (
    <React.Fragment>
      {/* Quck Settings */}
      <Stack
        direction='row'
        spacing={1}
        alignItems='center'
        sx={{ bgcolor: 'background.capture', padding: 1, paddingBottom: 0 }}
      >
        <SessionCaptureSelect />
        {/*
        <ErrorsAtTopCheckbox sx={{ flexGrow: 1 }} />
        <BulkModeSwitch /> */}
      </Stack>

      <Grid container sx={{ bgcolor: 'background.capture', padding: 2, paddingTop: 0 }}>
        <Grid item xs={12}>
          {/* <CameraList /> */}
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
