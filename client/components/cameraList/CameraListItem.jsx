import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import localDB, { refreshCameraDetails } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { ListItem, ListItemAvatar, Avatar } from '@mui/material'

import { PhotoCamera as CameraIcon } from '@mui/icons-material'

import EditableListItemText from './EditableListItemText.jsx'
import CameraListItemButtons from './cameraControls/CameraListItemButtons.jsx'

export default function CameraListItem (props) {
  const { cameraID, serverID, readOnly } = props

  // Subscribe to changes to the camera object
  const camera = useLiveQuery(() => localDB.cameras.get(cameraID))

  // Track if camera details refresh is needed
  const [needsRefresh, setNeedsRefresh] = React.useState(false)
  React.useEffect(() => {
    // Catch if camera has no details but is only a summary
    if (camera && !camera.AEMode) { setNeedsRefresh(true) }
  }, [camera])

  // Refresh the camera details any time a menu is closed
  useEffect(() => {
    // Asynchronous funciton to update camera details
    const retrieveDetails = async () => {
      await refreshCameraDetails(serverID, cameraID)
    }

    // If a refresh is needed, do it (and clear the flag)
    if (needsRefresh) {
      setNeedsRefresh(false)
      retrieveDetails()
    }
  }, [cameraID, serverID, needsRefresh])

  return (
    <ListItem
      secondaryAction={
        <CameraListItemButtons serverID={serverID} cameraID={cameraID} readOnly={readOnly} />
      }
    >
      {/* Basic Camera Icon */}
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: camera?.missing ? 'error.light' : 'success.light' }}>
          <CameraIcon />
        </Avatar>
      </ListItemAvatar>

      {/* Camera Text Info */}
      <EditableListItemText
        serverID={serverID}
        cameraID={cameraID}
        needsRefresh={() => setNeedsRefresh(true)}
        readOnly={readOnly}
      />

    </ListItem>
  )
}

CameraListItem.propTypes = {
  cameraID: PropTypes.string.isRequired,
  serverID: PropTypes.number.isRequired,
  readOnly: PropTypes.bool
}

CameraListItem.defaultProps = {
  readOnly: false
}
