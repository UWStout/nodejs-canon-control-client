import React from 'react'
import PropTypes from 'prop-types'

import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  ButtonGroup
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
    <ListItem
      secondaryAction={
        <ButtonGroup variant="outlined">
          <Button role={undefined} size='large' onClick={onAEModeClick} startIcon={<AEModeIcon />}>
            {'M'}
          </Button>
          <Button role={undefined} size='large' onClick={onShutterClick} startIcon={<ShutterIcon />}>
            {'1/2000'}
          </Button>
          <Button role={undefined} size='large' onClick={onApertureClick} startIcon={<ApertureIcon />}>
            {'F22'}
          </Button>
          <Button role={undefined} size='large' onClick={onExposureClick} startIcon={<ExposureIcon />}>
            {'+0'}
          </Button>
          <Button role={undefined} size='large' onClick={onSizeQualityClick} startIcon={<SizeQualityIcon />}>
            {'L JPG'}
          </Button>
          <Button role={undefined} size='large' onClick={onWhiteBalanceClick} startIcon={<WhiteBalanceIcon />}>
            {'Daylight'}
          </Button>
        </ButtonGroup>
      }
    >
      {/* Basic Camera Icon */}
      <ListItemAvatar>
        <Avatar>
          <CameraIcon />
        </Avatar>
      </ListItemAvatar>

      {/* Camera Info */}
      <ListItemText primary={cameraObj.model} secondary={cameraObj.serial} />

    </ListItem>
  )
}

CameraListItem.propTypes = {
  cameraObj: PropTypes.shape(CameraObjShape).isRequired
}
