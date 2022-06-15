import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
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

  // Details for the indicated camera
  const [cameraObj, setCameraObj] = React.useState(null)
  useEffect(() => {
    const retrieveDetails = async () => {
      const details = await getCameraDetails(serverIP, cameraSummary.index)
      setCameraObj(details)
    }

    retrieveDetails()
  }, [cameraSummary.index, serverIP])

  // Map for the icon elements
  const iconMap = {
    Tv: <ShutterIcon size='large' />,
    Av: <ApertureIcon size='large' />,
    ISOSpeed: <ISOSpeedIcon size='large' />,
    ImageQuality: <SizeQualityIcon size='large' />,
    WhiteBalance: <WhiteBalanceIcon size='large' />
  }

  const propertyIcons = (cameraObj
    ? PROPERTY_IDS.map(propID => (
      <Tooltip key={`${propID}-icon`} placement="top" title={trimProp(cameraObj[propID].label)}>
        {iconMap[propID]}
      </Tooltip>
    ))
    : null)

  return (
    <ListItem secondaryAction={propertyIcons}>
      {/* Basic Camera Icon */}
      <ListItemAvatar>
        <Avatar><CameraIcon /></Avatar>
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
