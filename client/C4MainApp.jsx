import React from 'react'
import { CssBaseline, Container, Box, Typography } from '@mui/material'

export default function App () {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={{ bgcolor: '#cfe8fc', height: '100vh', padding: '16px' }}>
          <Typography variant="h1">{'Canon Cam Control Client'}</Typography>
          <Typography variant="body1">{'This is a basic test page'}</Typography>
        </Box>
      </Container>
    </React.Fragment>
  )
}
