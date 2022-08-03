import React from 'react'

import localDB, { setExposureStatus } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'
import useBulkTaskState from '../../state/useBulkTaskState.js'

import { List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material'
import { PhotoCamera as CameraIcon } from '@mui/icons-material'
import { useSnackbar } from 'notistack'

import CameraActionAndPropertyButtons from './cameraControls/CameraActionAndPropertyButtons.jsx'
import { bulkAction } from '../../helpers/cameraActionHelper.js'
import { setCameraProperties } from '../../helpers/serverHelper.js'

export default function BulkPropertiesItem () {
  const { enqueueSnackbar } = useSnackbar()

  // Subscribe to bulk mode changes
  const bulkExposureSettings = useLiveQuery(() => localDB.settings.get('bulkExposureSettings'))

  // Subscribe to the bits of bulk state we need
  const { bulkTaskDone, ...bulkState } = useBulkTaskState(state => ({
    newBulkTask: state.newBulkTask,
    bulkTaskDone: state.done
  }))

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
    if (!bulkTaskDone) {
      enqueueSnackbar('Please wait for current task to finish', { variant: 'warning' })
      return
    }

    // Build exposure settings object without the 'name' property
    const propertyObject = { ...bulkExposureSettings }
    delete propertyObject.name

    // Start applying changes
    bulkAction('Bulk property setting', setCameraProperties, serverList, bulkState, enqueueSnackbar, propertyObject)
  }, [bulkExposureSettings, bulkState, bulkTaskDone, enqueueSnackbar, serverList])

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
