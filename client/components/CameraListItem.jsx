import React from 'react'
import PropTypes from 'prop-types'

import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemButton
} from '@mui/material'

import {
  PhotoCamera as CameraIcon,
  ShutterSpeed as ShutterIcon,
  Camera as ApertureIcon,
  Exposure as ExposureIcon,
  PhotoSizeSelectLarge as SizeQualityIcon,
  WbSunny as WhiteBalanceIcon,
  CameraEnhance as AEModeIcon
} from '@mui/icons-material'

import { CameraObjShape } from '../dataModel.js'

export default function CameraListItem (props) {
  const { cameraObj } = props

  // Callback for clicking AE Mode icon
  const onAEModeClick = () => {
    console.log(`AE Mode button clicked (${cameraObj.serial})`)
  }

  // Callback for clicking shutter icon
  const onShutterClick = () => {
    console.log(`Shutter button clicked (${cameraObj.serial})`)
  }

  // Callback for clicking aperture icon
  const onApertureClick = () => {
    console.log(`Aperture button clicked (${cameraObj.serial})`)
  }

  // Callback for clicking exposure icon
  const onExposureClick = () => {
    console.log(`Exposure button clicked (${cameraObj.serial})`)
  }

  // Callback for clicking size-quality icon
  const onSizeQualityClick = () => {
    console.log(`Size/Quality button clicked (${cameraObj.serial})`)
  }

  // Callback for clicking white balance icon
  const onWhiteBalanceClick = () => {
    console.log(`White Balance button clicked (${cameraObj.serial})`)
  }

  return (
    <ListItem>
      {/* Basic Camera Icon */}
      <ListItemAvatar>
        <Avatar>
          <CameraIcon />
        </Avatar>
      </ListItemAvatar>

      {/* Camera Info */}
      <ListItemText primary={cameraObj.model} secondary={cameraObj.serial} />

      {/* Exposure Setting Icons */}
      <ListItemButton role={undefined} onClick={onAEModeClick}>
        <AEModeIcon />
      </ListItemButton>
      <ListItemButton role={undefined} onClick={onShutterClick}>
        <ShutterIcon />
      </ListItemButton>
      <ListItemButton role={undefined} onClick={onApertureClick}>
        <ApertureIcon />
      </ListItemButton>
      <ListItemButton role={undefined} onClick={onExposureClick}>
        <ExposureIcon />
      </ListItemButton>
      <ListItemButton role={undefined} onClick={onSizeQualityClick}>
        <SizeQualityIcon />
      </ListItemButton>
      <ListItemButton role={undefined} onClick={onWhiteBalanceClick}>
        <WhiteBalanceIcon />
      </ListItemButton>

    </ListItem>
  )
}

CameraListItem.propTypes = {
  cameraObj: PropTypes.shape(CameraObjShape).isRequired
}
