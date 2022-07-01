import React from 'react'

import { Grid } from '@mui/material'
import CameraTestButtonGrid from './CameraTestButtonGrid.jsx'

export default function TestingButtonsView () {
  return (
    <Grid container sx={{ bgcolor: 'background.testing', padding: 2 }}>
      <Grid item xs={12}>
        <CameraTestButtonGrid />
      </Grid>
    </Grid>
  )
}
