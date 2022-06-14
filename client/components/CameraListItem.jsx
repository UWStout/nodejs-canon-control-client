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
  Exposure as ExposureIcon,
  PhotoSizeSelectLarge as SizeQualityIcon,
  WbSunny as WhiteBalanceIcon,
  CameraEnhance as AEModeIcon
} from '@mui/icons-material'

import { CameraObjShape } from '../state/dataModel.js'
import { getCameraDetails } from '../helpers/serverHelper.js'

function trimProp (propertyValue) {
  if (typeof propertyValue !== 'string') {
    return propertyValue
  }

  const index = propertyValue.lastIndexOf('.')
  if (index >= 0) {
    return propertyValue.substring(index + 1)
  }
  return propertyValue
}

export default function CameraListItem (props) {
  const { cameraSummary, serverIP } = props

  const [cameraObj, setCameraObj] = React.useState(null)
  useEffect(() => {
    const retrieveDetails = async () => {
      const details = await getCameraDetails(serverIP, cameraSummary.index)
      setCameraObj(details)
    }
    retrieveDetails()
  }, [cameraSummary.index, serverIP])

  // Callback for clicking AE Mode icon
  const onAEModeClick = () => {
    console.log(`AE Mode button clicked (${cameraSummary.BodyIDEx.value})`)
  }

  // Callback for clicking shutter icon
  const onShutterClick = () => {
    console.log(`Shutter button clicked (${cameraSummary.BodyIDEx.value})`)
  }

  // Callback for clicking aperture icon
  const onApertureClick = () => {
    console.log(`Aperture button clicked (${cameraSummary.BodyIDEx.value})`)
  }

  // Callback for clicking exposure icon
  const onExposureClick = () => {
    console.log(`Exposure button clicked (${cameraSummary.BodyIDEx.value})`)
  }

  // Callback for clicking size-quality icon
  const onSizeQualityClick = () => {
    console.log(`Size/Quality button clicked (${cameraSummary.BodyIDEx.value})`)
  }

  // Callback for clicking white balance icon
  const onWhiteBalanceClick = () => {
    console.log(`White Balance button clicked (${cameraSummary.BodyIDEx.value})`)
  }

  return (
    <ListItem
      secondaryAction={
        !!cameraObj &&
        <React.Fragment>
          <Tooltip position="top" title={trimProp(cameraObj.AEMode.label)}>
            <IconButton role={undefined} size='large' onClick={onAEModeClick}><AEModeIcon /></IconButton>
          </Tooltip>
          <Tooltip position="top" title={trimProp(cameraObj.Tv.label)}>
            <IconButton role={undefined} size='large' onClick={onShutterClick}><ShutterIcon /></IconButton>
          </Tooltip>
          <Tooltip position="top" title={trimProp(cameraObj.Av.label)}>
            <IconButton role={undefined} size='large' onClick={onApertureClick}><ApertureIcon /></IconButton>
          </Tooltip>
          <Tooltip position="top" title={trimProp(cameraObj.ExposureCompensation.label)}>
            <IconButton role={undefined} size='large' onClick={onExposureClick}><ExposureIcon /></IconButton>
          </Tooltip>
          <Tooltip position="top" title={trimProp(cameraObj.ImageQuality.label)}>
            <IconButton role={undefined} size='large' onClick={onSizeQualityClick}><SizeQualityIcon /></IconButton>
          </Tooltip>
          <Tooltip position="top" title={trimProp(cameraObj.WhiteBalance.label)}>
            <IconButton role={undefined} size='large' onClick={onWhiteBalanceClick}><WhiteBalanceIcon /></IconButton>
          </Tooltip>
        </React.Fragment>
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

    </ListItem>
  )
}

CameraListItem.propTypes = {
  cameraSummary: PropTypes.shape(CameraObjShape).isRequired,
  serverIP: PropTypes.string.isRequired
}
