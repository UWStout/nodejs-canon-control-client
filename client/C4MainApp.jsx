import React from 'react'
import { CssBaseline, Container, Box, Typography } from '@mui/material'

import CameraList from './components/CameraList.jsx'
import CameraListItem from './components/CameraListItem.jsx'

const TEST_CAMS = [
  { serial: '012070021526', server: '10.0.1.101', model: 'Test Camera EOS T6' },
  { serial: '012070021527', server: '10.0.1.101', model: 'Test Camera EOS T6' },
  { serial: '012070021528', server: '10.0.1.101', model: 'Test Camera EOS T6' },
  { serial: '012070021529', server: '10.0.1.101', model: 'Test Camera EOS T6' },
  { serial: '012070021530', server: '10.0.1.101', model: 'Test Camera EOS T6' },
  { serial: '012070021531', server: '10.0.1.101', model: 'Test Camera EOS T6' }
]

export default function App () {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={{ bgcolor: '#cfe8fc', height: '100vh', padding: '16px' }}>
          <Typography variant="h1">{'Canon Cam Control Client'}</Typography>
          <CameraList>
            {TEST_CAMS.map((cam, i) => (<CameraListItem key={i} cameraObj={{ ...cam, index: i }} />))}
          </CameraList>
        </Box>
      </Container>
    </React.Fragment>
  )
}
