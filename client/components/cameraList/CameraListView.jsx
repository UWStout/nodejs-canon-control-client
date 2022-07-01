import React from 'react'

import { Grid, Stack } from '@mui/material'

import CameraList from './CameraList.jsx'
import CameraSortingSelect from './CameraSortingSelect.jsx'
import BulkModeSwitch from './BulkModeSwitch.jsx'
import ErrorsAtTopCheckbox from './ErrorsAtTopCheckbox.jsx'

export default function CameraListView () {
  return (
    <React.Fragment>
      {/* Quck Settings */}
      <Stack direction='row' spacing={1} alignItems='center' sx={{ bgcolor: '#cfe8fc', padding: 1, paddingBottom: 0 }}>
        <CameraSortingSelect />
        <ErrorsAtTopCheckbox sx={{ flexGrow: 1 }} />
        <BulkModeSwitch />
      </Stack>

      <Grid container sx={{ bgcolor: '#cfe8fc', padding: 2, paddingTop: 0 }}>
        <Grid item xs={12}>
          <CameraList />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
