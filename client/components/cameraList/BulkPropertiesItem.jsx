import React from 'react'

import localDB, { setExposureStatus } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'
import useBulkTaskState from '../../state/useBulkTaskState.js'

import { List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material'
import { PhotoCamera as CameraIcon } from '@mui/icons-material'
import { useSnackbar } from 'notistack'

import CameraActionAndPropertyButtons from './cameraControls/CameraActionAndPropertyButtons.jsx'
import { setCameraProperties } from '../../helpers/serverHelper.js'
export default function BulkPropertiesItem () {
  const { enqueueSnackbar } = useSnackbar()

  // Subscribe to bulk mode changes
  const bulkExposureSettings = useLiveQuery(() => localDB.settings.get('bulkExposureSettings'))

  // Subscribe to the bits of bulk state we need
  const bulkTaskDone = useBulkTaskState(state => state.done)

  // Grab the server list and the first camera in the first server
  const serverList = useLiveQuery(() => localDB.servers.toArray())
  const server = useLiveQuery(() => localDB.servers.toCollection().first())
  const camera = useLiveQuery(() => localDB.cameras.toCollection().first())

  // Do the bulk mode values have any changes
  React.useEffect(() => {
    if (bulkExposureSettings) {
      setExposureStatus('bad')
    }
  }, [bulkExposureSettings])

  // Apply exposure settings in bulk to all cameras
  const applyExposureValues = React.useCallback(async () => {
    // Build exposure settings object without the 'name' property
    const propertyObject = { ...bulkExposureSettings }
    delete propertyObject.name

    // Start applying changes
    if (Array.isArray(serverList) && serverList.length > 0) {
      for (let i = 0; i < serverList.length; i++) {
        const server = serverList[i]
        try {
          setCameraProperties(server, '*', propertyObject)
          enqueueSnackbar(`Bulk property setting started for ${server.nickname}`)
        } catch (error) {
          enqueueSnackbar(`Bulk property setting failed for ${server.nickname}`, { variant: 'error' })
        }
      }
    }
  }, [bulkExposureSettings, enqueueSnackbar, serverList])

  return (
    <List sx={{ padding: 0, width: '100%', bgcolor: 'background.paper' }}>
      <ListItem
        secondaryAction={
          // Buttons for controlling the camera and setting properties
          <CameraActionAndPropertyButtons
            camera={camera}
            server={server}
            useBulkValues
            onApply={applyExposureValues}
            bulkBusy={!bulkTaskDone}
          />
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
  )
}
