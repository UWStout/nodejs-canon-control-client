import React from 'react'

import localDB from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { Collapse, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material'
import { PhotoCamera as CameraIcon } from '@mui/icons-material'

import CameraActionAndPropertyButtons from './cameraControls/CameraActionAndPropertyButtons.jsx'
export default function BulkPropertiesItem () {
  const bulkModeEnabled = useLiveQuery(() => localDB.settings.get('bulkModeEnabled'))

  return (
    <Collapse in={bulkModeEnabled?.value} timeout="auto" unmountOnExit>
      <List sx={{ padding: 0, width: '100%', bgcolor: 'background.paper' }}>
        <ListItem
          secondaryAction={
            // Buttons for controlling the camera and setting properties
            <CameraActionAndPropertyButtons useBulkValues />
          }
        >
          {/* Basic camera icon indicating status */}
          <ListItemAvatar>
            <Avatar>
              <CameraIcon />
            </Avatar>
          </ListItemAvatar>

          {/* Camera Text Info with a nickname that can be edited */}
          <ListItemText primary="Bulk Mode Control/Settings" />
        </ListItem>
      </List>
    </Collapse>
  )
}
