import React from 'react'
import PropTypes from 'prop-types'

import useGlobalState from '../state/useGlobalState.js'

import { IconButton, Tooltip } from '@mui/material'

import {
  ShutterSpeed as ShutterIcon,
  Camera as ApertureIcon,
  Exposure as ISOSpeedIcon,
  PhotoSizeSelectLarge as SizeQualityIcon,
  WbSunny as WhiteBalanceIcon
} from '@mui/icons-material'

import { CameraObjShape, PropertyIDsShape } from '../state/dataModel.js'
import { trimProp } from '../helpers/utility.js'

const PROPERTY_IDS = Object.keys(PropertyIDsShape)

export default function CameraPropertyButtons (props) {
  const { cameraObj, readOnly, propRefs, onOpenMenu, useBulkValues } = props
  const { bulkModeSettings } = useGlobalState(state => state)

  // Map for the icon elements
  const iconMap = {
    Tv: <ShutterIcon />,
    Av: <ApertureIcon />,
    ISOSpeed: <ISOSpeedIcon />,
    ImageQuality: <SizeQualityIcon />,
    WhiteBalance: <WhiteBalanceIcon />
  }

  return (
    (useBulkValues || cameraObj !== null
      ? PROPERTY_IDS.map(propID => (
        <Tooltip
          key={`${propID}-icon`}
          placement="top"
          title={useBulkValues
            ? (bulkModeSettings?.[propID] ? trimProp(bulkModeSettings[propID]) : 'loading')
            : trimProp(cameraObj[propID].label)}
          ref={propRefs[propID]}
        >
          <span>
            <IconButton
              role={undefined}
              size='large'
              disabled={readOnly}
              onClick={readOnly ? null : () => onOpenMenu(propID)}
            >
              {iconMap[propID]}
            </IconButton>
          </span>
        </Tooltip>
      ))
      : null)
  )
}

CameraPropertyButtons.propTypes = {
  cameraObj: PropTypes.shape(CameraObjShape),
  readOnly: PropTypes.bool,
  propRefs: PropTypes.shape(PropertyIDsShape),
  onOpenMenu: PropTypes.func,
  useBulkValues: PropTypes.bool
}

CameraPropertyButtons.defaultProps = {
  cameraObj: null,
  readOnly: false,
  propRefs: null,
  onOpenMenu: null,
  useBulkValues: false
}
