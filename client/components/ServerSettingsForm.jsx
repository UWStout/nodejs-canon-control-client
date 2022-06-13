import React from 'react'

import { List, IconButton, ListItem, ListItemText, Divider } from '@mui/material'
import { Remove as RemoveIcon } from '@mui/icons-material'

import ServerAddItem from './ServerAddItem.jsx'

export default function ServerList () {
  // Maintain list of servers
  const [serverList, setServerList] = React.useState([])
  const onAddServer = (newServer) => {
    if (serverList.find((server) => (
      server.IP === newServer.IP ||
      server.nickname.toLowerCase() === newServer.nickname.toLowerCase()
    ))) {
      window.alert('Duplicate server')
    } else {
      setServerList([...serverList, newServer])
    }
  }
  const onRemoveServer = (serverIP) => {
    const index = serverList.findIndex((server) => (server.IP === serverIP))
    if (index < 0) {
      window.alert('Server not found')
    } else {
      const newList = [...serverList]
      newList.splice(index, 1)
      setServerList(newList)
    }
  }

  return (
    <List sx={{ marginLeft: 2, marginRight: 2, marginBottom: 2 }}>
      {serverList.map((server) => (
        <ListItem
          key={server.IP}
          secondaryAction={
            <IconButton edge="end" aria-label="remove server" onClick={() => onRemoveServer(server.IP)}>
              <RemoveIcon />
            </IconButton>
          }
        >
          <ListItemText primary={server.nickname} secondary={server.IP} />
        </ListItem>
      ))}
      {serverList.length > 0 && <Divider />}
      <ServerAddItem onAdd={onAddServer} />
    </List>
  )
}
