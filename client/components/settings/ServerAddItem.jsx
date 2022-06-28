import React from 'react'

import localDB from '../../state/localDB.js'

import { ListItem, IconButton, ListItemText, TextField, Grid } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'

// Matches IP v4 addresses with an optional port
const IP_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

export default function ServerAddItem () {
  const [serverIP, setServerIP] = React.useState('127.0.0.1')
  const [serverPort, setServerPort] = React.useState(42424)
  const [serverNickname, setServerNickname] = React.useState('')

  const addServer = async (newServer) => {
    try {
      const id = await localDB.servers.add(newServer)
      console.info('Server added with id', id)
      setServerIP('127.0.0.1')
      setServerPort(42424)
      setServerNickname('')
    } catch (error) {
      window.alert('Failed to add server')
      console.error('Failed to add server', error)
    }
  }

  const onAddClicked = () => {
    // Validate contents
    if (IP_REGEX.test(serverIP) && serverPort >= 0 && serverPort < 65354 && serverNickname !== '') {
      addServer({
        IP: serverIP,
        port: serverPort,
        nickname: serverNickname
      })
    }
  }

  const updatePort = (value) => {
    const newIntValue = parseInt(value)
    if (isNaN(newIntValue)) {
      setServerPort(0)
    } else {
      setServerPort(newIntValue)
    }
  }

  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="add server"
          onClick={onAddClicked}
          disabled={!IP_REGEX.test(serverIP) || serverPort < 0 || serverPort > 65353 || serverNickname === ''}
        >
          <AddIcon />
        </IconButton>
      }
      disablePadding
    >
      <ListItemText primary={
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <TextField
              fullWidth
              value={serverIP}
              onChange={(e) => setServerIP(e.target.value)}
              label='IP Address'
              error={!IP_REGEX.test(serverIP)}
              variant="standard"
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              value={serverPort}
              onChange={({ target }) => updatePort(target.value)}
              label='Port'
              error={serverPort < 0 || serverPort > 65353}
              variant="standard"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              fullWidth
              label='Nickname'
              value={serverNickname}
              onChange={(e) => setServerNickname(e.target.value)}
              error={serverNickname === ''}
              variant="standard"
            />
          </Grid>
        </Grid>
      }
      />
    </ListItem>
  )
}
