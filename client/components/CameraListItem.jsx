import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material'
import { PhotoCamera as CameraIcon } from '@mui/icons-material'

import PropertySelectMenu from './PropertySelectMenu.jsx'
import CameraPropertyButtons from './CameraPropertyButtons.jsx'

import { CameraObjShape, ServerObjShape, PropertyIDsShape } from '../state/dataModel.js'
import { getCameraDetails } from '../helpers/serverHelper.js'

const PROPERTY_IDS = Object.keys(PropertyIDsShape)

export default function CameraListItem (props) {
  const { cameraSummary, server, readOnly } = props

  // Currently shown settings menu
  const [openMenu, setOpenMenu] = React.useState('')
  const closeMenu = () => {
    setOpenMenu('')
  }

  // Details for the indicated camera
  const [cameraObj, setCameraObj] = React.useState(null)
  useEffect(() => {
    const retrieveDetails = async () => {
      const details = await getCameraDetails(server, cameraSummary.index)
      setCameraObj(details)
    }
    if (openMenu === '') {
      retrieveDetails()
    }
  }, [cameraSummary.index, openMenu, server])

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
        <CameraPropertyButtons readOnly={readOnly} cameraObj={cameraObj} propRefs={propRefs} onOpenMenu={setOpenMenu} />
      }
    >
      {/* Basic Camera Icon */}
      <ListItemAvatar>
        <Avatar>
          <CameraIcon />
        </Avatar>
      </ListItemAvatar>

      {/* Camera Info */}
      <ListItemText primary={cameraSummary.ProductName.value} secondary={cameraSummary.BodyIDEx.value} />

      {/* Property selection menus */}
      {!readOnly && PROPERTY_IDS.map((propID) => (
        <PropertySelectMenu
          key={`${propID}-menu`}
          anchorElement={propRefs[propID].current}
          propID={propID}
          camera={cameraSummary.index}
          server={server}
          open={openMenu === propID}
          onClose={closeMenu}
        />
      ))}

    </ListItem>
  )
}

CameraListItem.propTypes = {
  cameraSummary: PropTypes.shape(CameraObjShape).isRequired,
  server: PropTypes.shape(ServerObjShape).isRequired,
  readOnly: PropTypes.bool
}

CameraListItem.defaultProps = {
  readOnly: false
}
