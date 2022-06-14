import React from 'react'
import PropTypes from 'prop-types'

import { ListItem, IconButton, ListItemText, TextField, Grid } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'

// Matches IP v4 addresses with an optional port
const IP_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:[0-9]+)?$/

export default function ServerAddItem (props) {
  const [serverIP, setServerIP] = React.useState('127.0.0.1')
  const [serverNickname, setServerNickname] = React.useState('North')

  const { onAdd } = props
  const onAddClicked = () => {
    // Validate contents
    if (IP_REGEX.test(serverIP) && serverNickname !== '') {
      if (onAdd) {
        onAdd({ IP: serverIP, nickname: serverNickname })
      }
    }
  }

  return (
    <ListItem
      secondaryAction={
        <IconButton edge="end" aria-label="add server" onClick={onAddClicked}>
          <AddIcon />
        </IconButton>
      }
      disablePadding
    >
      <ListItemText primary={
        <Grid container spacing={1}>
          <Grid item xs={5}>
            <TextField
              fullWidth
              value={serverIP}
              onChange={(e) => setServerIP(e.target.value)}
              label='IP Address'
              error={!IP_REGEX.test(serverIP)}
              variant="standard"
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

ServerAddItem.propTypes = {
  onAdd: PropTypes.func
}

ServerAddItem.defaultProps = {
  onAdd: null
}
