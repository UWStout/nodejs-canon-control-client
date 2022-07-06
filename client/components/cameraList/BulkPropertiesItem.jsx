import React from 'react'

import localDB from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { Collapse, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material'
import { PhotoCamera as CameraIcon } from '@mui/icons-material'
import { useSnackbar } from 'notistack'

import CameraActionAndPropertyButtons from './cameraControls/CameraActionAndPropertyButtons.jsx'
import { setCameraProperties } from '../../helpers/serverHelper.js'
export default function BulkPropertiesItem () {
  const { enqueueSnackbar } = useSnackbar()

  // Subscribe to bulk mode changes
  const bulkModeEnabled = useLiveQuery(() => localDB.settings.get('bulkModeEnabled'))
  const bulkExposureSettings = useLiveQuery(() => localDB.settings.get('bulkExposureSettings'))

  // Grab the server list and the first camera in the first server
  const serverList = useLiveQuery(() => localDB.servers.toArray())
  const server = useLiveQuery(() => localDB.servers.toCollection().first())
  const camera = useLiveQuery(() => localDB.cameras.toCollection().first())

  // Are we busy applying the bulk settings?
  const [applyBusy, setApplyBusy] = React.useState(false)

  // Do the bulk mode values have any changes
  const [changesDetected, setChangesDetected] = React.useState(false)
  React.useEffect(() => {
    if (bulkExposureSettings) {
      setChangesDetected(true)
    }
  }, [bulkExposureSettings])

  // Apply exposure settings in bulk to all cameras
  const applyExposureValues = React.useCallback(async () => {
    // Build exposure settings object without the 'name' property
    const propertyObject = { ...bulkExposureSettings }
    delete propertyObject.name

    // Start applying changes
    setApplyBusy(true)
    const results = await Promise.allSettled(
      serverList.map(
        curServer => setCameraProperties(curServer, '*', propertyObject)
      )
    )

    // Update state of apply button
    setApplyBusy(false)

    const badResponses = results.filter(result => result?.status === 'rejected')
    if (badResponses.length === results.length) {
      enqueueSnackbar('Bulk property update failed', { variant: 'error' })
      console.error(results)
    } else if (badResponses.length > 0) {
      enqueueSnackbar('Properties partially updated', { variant: 'warning' })
      console.error(badResponses)
    } else {
      enqueueSnackbar('Bulk properties updated', { variant: 'success' })
      setChangesDetected(false)
    }
  }, [bulkExposureSettings, enqueueSnackbar, serverList])

  return (
    <Collapse in={bulkModeEnabled?.value} timeout="auto" unmountOnExit>
      <List sx={{ padding: 0, width: '100%', bgcolor: 'background.paper' }}>
        <ListItem
          secondaryAction={
            // Buttons for controlling the camera and setting properties
            <CameraActionAndPropertyButtons
              camera={camera}
              server={server}
              useBulkValues
              onApply={applyExposureValues}
              disableApply={applyBusy || !changesDetected}
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
    </Collapse>
  )
}
