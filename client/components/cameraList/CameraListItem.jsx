import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import localDB, { refreshCameraDetails } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import useGlobalState from '../../state/useGlobalState.js'

import { ListItem, Collapse, ListItemAvatar, Avatar, Checkbox, Tooltip, Stack } from '@mui/material'
import { PhotoCamera as CameraIcon } from '@mui/icons-material'

import EditableListItemText from './EditableListItemText.jsx'
import CameraSettingsCollapse from './cameraControls/CameraSettingsCollapse.jsx'

export default function CameraListItem (props) {
  const { cameraID, serverID, readOnly } = props

  // Subscribe to changes to the camera and server objects
  const camera = useLiveQuery(() => localDB.cameras.get(cameraID), [cameraID], null)
  const server = useLiveQuery(() => localDB.servers.get(serverID), [serverID], null)

  // Subscribe to camera selection global state
  const selectionState = useGlobalState(state => ({
    selectedCameras: state.selectedCameras,
    addCameraToSelection: state.addCameraToSelection,
    removeCameraFromSelection: state.removeCameraFromSelection,
    clearSelectedCameras: state.clearSelectedCameras
  }))

  // Add/remove camera from selection list
  const toggleSelection = () => {
    if (selectionState.selectedCameras.includes(cameraID)) {
      selectionState.removeCameraFromSelection(cameraID)
    } else {
      selectionState.addCameraToSelection(cameraID)
    }
  }

  // Monitor if mouse is hovering
  const [mouseOver, setMouseOver] = React.useState(false)

  // Track if camera details refresh is needed
  const [needsRefresh, setNeedsRefresh] = React.useState(false)
  React.useEffect(() => {
    // Catch if camera has no details but is only a summary
    if (camera && !camera.AEMode) { setNeedsRefresh(true) }
  }, [camera])

  // Track the status of the camera
  const [statusColor, setStatusColor] = React.useState('error.light')
  React.useEffect(() => {
    if (!camera || camera?.missing) {
      setStatusColor('error.light')
    } else if (camera?.exposureStatus !== 'ok') {
      setStatusColor('warning.light')
    } else {
      setStatusColor('success.light')
    }
  }, [camera?.missing, camera?.exposureStatus, camera])

  // Refresh the camera details any time a menu is closed
  useEffect(() => {
    // Asynchronous funciton to update camera details
    const retrieveDetails = async () => {
      let keepTrying = true
      while (keepTrying) {
        try {
          await refreshCameraDetails(serverID, cameraID)
          keepTrying = false
        } catch (error) {
          if (!error.message.toLowerCase().includes('timeout exceeded')) {
            keepTrying = false
            console.error(`Failed to retrieve details for camera ${cameraID} on server ${serverID}`)
            console.error(error)
          }
        }
      }
    }

    // If a refresh is needed, do it (and clear the flag)
    if (needsRefresh) {
      setNeedsRefresh(false)
      retrieveDetails()
    }
  }, [cameraID, serverID, needsRefresh])

  // Easy variables for camera selection state
  const isSelected = selectionState.selectedCameras.includes(cameraID)
  const showCheckbox = selectionState.selectedCameras.length > 0

  return (
    <ListItem
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
      secondaryAction={
        // Buttons for controlling the camera and setting properties
        <CameraSettingsCollapse
          hidden={!mouseOver}
          server={server}
          camera={camera}
          readOnly={readOnly}
        />
      }
    >
      <Tooltip title={isSelected ? 'Deselect' : 'Select For Grouping'}>
        <Stack direction="row">
          {/* Camera Checkbox */}
          <Collapse orientation="horizontal" in={showCheckbox}>
            <Checkbox
              edge="start"
              checked={isSelected}
              onClick={toggleSelection}
              tabIndex={-1}
              disableRipple
              inputProps={{
                'aria-labelledby': `cameraListItem-${camera?.id || 'unknown'}`
              }}
            />
          </Collapse>

          {/* Basic camera icon indicating status */}
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: statusColor, cursor: 'pointer' }} onClick={toggleSelection}>
              <CameraIcon />
            </Avatar>
          </ListItemAvatar>
        </Stack>
      </Tooltip>

      {/* Camera Text Info with a nickname that can be edited */}
      <EditableListItemText
        camera={camera}
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
