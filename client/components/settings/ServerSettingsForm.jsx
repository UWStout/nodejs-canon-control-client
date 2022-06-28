import React from 'react'

import { useLiveQuery } from 'dexie-react-hooks'
import localDB from '../../state/localDB.js'

import { List, IconButton, ListItem, ListItemText, Divider } from '@mui/material'
import { Remove as RemoveIcon } from '@mui/icons-material'

import ServerAddItem from './ServerAddItem.jsx'

export default function ServerSettingsForm () {
  // Subscribe to changes to servers array
  const serverList = useLiveQuery(() => localDB.servers.toArray())

  return (
    <List sx={{ marginLeft: 2, marginRight: 2, marginBottom: 2 }}>
      {Array.isArray(serverList) && serverList.map((server) => (
        <ListItem
          key={server.id}
          secondaryAction={
            <IconButton
              edge="end"
              aria-label="remove server"
              onClick={() => localDB.servers.where('id').equals(server.id).delete()}
            >
              <RemoveIcon />
            </IconButton>
          }
        >
          <ListItemText primary={server.nickname} secondary={`${server.IP}:${server.port}`} />
        </ListItem>
      ))}
      {(Array.isArray(serverList) && serverList.length > 0) ? <Divider /> : null}
      <ServerAddItem />
    </List>
  )
}
