import React from 'react'

import userServerStore from '../state/useServerStore.js'

import { List, IconButton, ListItem, ListItemText, Divider } from '@mui/material'
import { Remove as RemoveIcon } from '@mui/icons-material'

import ServerAddItem from './ServerAddItem.jsx'

export default function ServerList () {
  // Manage global server list state
  // Access to the global state store
  const {
    serverList, addServer, removeServerByIP
  } = userServerStore(state => state)

  return (
    <List sx={{ marginLeft: 2, marginRight: 2, marginBottom: 2 }}>
      {serverList.map((server) => (
        <ListItem
          key={server.IP}
          secondaryAction={
            <IconButton
              edge="end"
              aria-label="remove server"
              onClick={() => removeServerByIP(server.IP)}
            >
              <RemoveIcon />
            </IconButton>
          }
        >
          <ListItemText primary={server.nickname} secondary={server.IP} />
        </ListItem>
      ))}
      {serverList.length > 0 && <Divider />}
      <ServerAddItem onAdd={addServer} />
    </List>
  )
}
