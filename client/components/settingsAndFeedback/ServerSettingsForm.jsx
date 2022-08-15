import React from 'react'

import { useLiveQuery } from 'dexie-react-hooks'
import localDB from '../../state/localDB.js'
import { useConfirm } from 'material-ui-confirm'

import { Stack, Typography, List, IconButton, ListItem, ListItemText, ListItemButton, ListItemIcon, Checkbox, Divider } from '@mui/material'
import { Remove as RemoveIcon } from '@mui/icons-material'

import ServerAddItem from './ServerAddItem.jsx'

export default function ServerSettingsForm () {
  // Subscribe to changes to servers array
  const serverList = useLiveQuery(() => localDB.servers.toArray())

  // Activating/deactivating a server
  const toggleActivation = (event, serverId) => {
    localDB.servers.update(serverId, { deactivated: !event.target.checked })
  }

  // Delete confirm
  const confirm = useConfirm()
  const handleRemoval = (serverId) => {
    confirm({
      description:
        'Are you sure you want to permenantly remove the indicated server?\n\n' +
        'This is NOT recommended as any cameras that reference this server in the ' +
        'local DB will no longer function correctly. Consider deactivating it instead.'
    })
      .then(() => { localDB.servers.where('id').equals(serverId).delete() })
      .catch(() => { /* Just ignore on cancel */ })
  }

  return (
    <List
      subheader={
        <Stack direction='row' sx={{ borderBottom: '1px solid gray' }}>
          <Typography variant='body1' sx={{ marginLeft: 2 }}>{'Active'}</Typography>
          <Typography variant='body1' sx={{ marginLeft: 3, marginRight: 'auto' }}>{'Server Info'}</Typography>
          <Typography variant='body1'>{'Remove'}</Typography>
        </Stack>
      }
      sx={{ marginLeft: 2, marginRight: 2, marginBottom: 2 }}
    >
      {Array.isArray(serverList) && serverList.map((server) => (
        <ListItem
          key={server.id}
          secondaryAction={
            <IconButton
              edge="end"
              aria-label="remove server"
              onClick={() => handleRemoval(server.id)}
            >
              <RemoveIcon />
            </IconButton>
          }
        >
          <ListItemButton
            role={undefined}
            onClick={(e) => toggleActivation(e, server.id)}
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={!server.deactivated}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText primary={server.nickname} secondary={`${server.IP}:${server.port}`} />
          </ListItemButton>
        </ListItem>
      ))}
      {(Array.isArray(serverList) && serverList.length > 0) ? <Divider /> : null}
      <ServerAddItem />
    </List>
  )
}
