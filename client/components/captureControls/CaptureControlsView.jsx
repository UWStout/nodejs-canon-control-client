import React from 'react'

import { Divider, Stack } from '@mui/material'

import SessionCaptureSelect from './SessionCaptureSelect.jsx'
import BulkPropertiesItem from '../cameraList/BulkPropertiesItem.jsx'
import ImageDownloadBar from './ImageDownloadBar.jsx'

export default function CaptureControlsView () {
  return (
    <Stack
      alignItems='center'
      spacing={2}
      sx={{ bgcolor: 'background.capture', padding: 2 }}
    >
      {/* Session and capture settings */}
      <SessionCaptureSelect />
      <Divider sx={{ width: '100%' }} />

      {/* Bulk Exposure settings */}
      <BulkPropertiesItem />
      <Divider sx={{ width: '100%' }} />

      <ImageDownloadBar/>
    </Stack>
  )
}
