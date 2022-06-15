import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Tooltip
} from '@mui/material'

import {
  PhotoCamera as CameraIcon,
  ShutterSpeed as ShutterIcon,
  Camera as ApertureIcon,
  Exposure as ISOSpeedIcon,
  PhotoSizeSelectLarge as SizeQualityIcon,
  WbSunny as WhiteBalanceIcon
} from '@mui/icons-material'

import PropertySelectMenu from './PropertySelectMenu.jsx'

import { CameraObjShape } from '../state/dataModel.js'
import { getCameraDetails } from '../helpers/serverHelper.js'
import { trimProp } from '../helpers/utility.js'

const PROPERTY_IDS = [
  'Tv',
  'Av',
  'ISOSpeed',
  'ImageQuality',
  'WhiteBalance'
]

export default function CameraListItem (props) {
  const { cameraSummary, serverIP } = props

  // Currently shown settings menu
  const [openMenu, setOpenMenu] = React.useState('')
  const closeMenu = () => {
    setOpenMenu('')
  }

  // Details for the indicated camera
  const [cameraObj, setCameraObj] = React.useState(null)
  useEffect(() => {
    const retrieveDetails = async () => {
      const details = await getCameraDetails(serverIP, cameraSummary.index)
      setCameraObj(details)
    }
    if (openMenu === '') {
      retrieveDetails()
    }
  }, [cameraSummary.index, openMenu, serverIP])

  // Map for the icon elements
  const iconMap = {
    Tv: <ShutterIcon />,
    Av: <ApertureIcon />,
    ISOSpeed: <ISOSpeedIcon />,
    ImageQuality: <SizeQualityIcon />,
    WhiteBalance: <WhiteBalanceIcon />
  }

  // Refs for all the property menus
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
        !!cameraObj &&
        PROPERTY_IDS.map(propID => (
          <Tooltip key={`${propID}-icon`} placement="top" title={trimProp(cameraObj[propID].label)} ref={propRefs[propID]}>
            <IconButton role={undefined} size='large' onClick={() => setOpenMenu(propID)}>{iconMap[propID]}</IconButton>
          </Tooltip>
        ))
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
      {PROPERTY_IDS.map((propID) => (
        <PropertySelectMenu
          key={`${propID}-menu`}
          anchorElement={propRefs[propID].current}
          propID={propID}
          camera={cameraSummary.index}
          serverIP={serverIP}
          open={openMenu === propID}
          onClose={closeMenu}
        />
      ))}

    </ListItem>
  )
}

CameraListItem.propTypes = {
  cameraSummary: PropTypes.shape(CameraObjShape).isRequired,
  serverIP: PropTypes.string.isRequired
}
