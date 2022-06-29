import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import localDB, { refreshCameraDetails } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { ListItem, ListItemAvatar, Avatar } from '@mui/material'
import { PhotoCamera as CameraIcon } from '@mui/icons-material'

import EditableListItemText from './EditableListItemText.jsx'
import PropertySelectMenu from './PropertySelectMenu.jsx'
import CameraPropertyButtons from './CameraPropertyButtons.jsx'

import { PropertyIDsShape } from '../../state/dataModel.js'

const PROPERTY_IDS = Object.keys(PropertyIDsShape)

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

  // Currently shown settings menu
  const [openMenu, setOpenMenu] = React.useState('')
  const closeMenu = (valueChanged = true) => {
    setOpenMenu('')
    if (valueChanged) {
      setNeedsRefresh(true)
    }
  }

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

  // Refs for all the property menu anchors
  const propRefs = {
    Tv: React.useRef(),
    Av: React.useRef(),
    ISOSpeed: React.useRef(),
    ImageQuality: React.useRef(),
    WhiteBalance: React.useRef()
  }

  return (
    <ListItem
      secondaryAction={
        <CameraPropertyButtons
          readOnly={readOnly}
          cameraID={cameraID}
          propRefs={propRefs}
          onOpenMenu={setOpenMenu}
        />
      }
    >
      {/* Basic Camera Icon */}
      <ListItemAvatar>
        <Avatar>
          <CameraIcon />
        </Avatar>
      </ListItemAvatar>

      {/* Camera Text Info */}
      <EditableListItemText cameraID={cameraID} />

      {/* Property selection menus */}
      {!readOnly && PROPERTY_IDS.map((propID) => (
        <PropertySelectMenu
          key={`${propID}-menu`}
          anchorElement={propRefs[propID].current}
          propID={propID}
          cameraID={cameraID}
          serverID={serverID}
          open={openMenu === propID}
          onClose={closeMenu}
        />
      ))}

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
