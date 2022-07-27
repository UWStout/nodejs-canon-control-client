import React from 'react'
import PropTypes from 'prop-types'

import { Menu, MenuItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material'

import {
  ShutterSpeed as ShutterIcon,
  Camera as ApertureIcon,
  Exposure as ISOSpeedIcon,
  PhotoSizeSelectLarge as SizeQualityIcon,
  WbSunny as WhiteBalanceIcon,
  SaveAlt as SaveToIcon
} from '@mui/icons-material'

import localDB from '../../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import PropertySelectMenu from './PropertySelectMenu.jsx'

import { CameraObjShape, PropertyIDsShape, ServerObjShape } from '../../../state/dataModel.js'
import { trimProp } from '../../../helpers/utility.js'

const PROPERTY_IDS = Object.keys(PropertyIDsShape)

export default function ExposurePropertiesMenu (props) {
  const { server, camera, useBulkValues, anchor, onClose, needsRefresh } = props
  const bulkExposureSettings = useLiveQuery(() => localDB.settings.get('bulkExposureSettings'))

  // Map for the icons for exposure properties
  const iconMap = {
    Tv: <ShutterIcon />,
    Av: <ApertureIcon />,
    ISOSpeed: <ISOSpeedIcon />,
    ImageQuality: <SizeQualityIcon />,
    WhiteBalance: <WhiteBalanceIcon />,
    SaveTo: <SaveToIcon />
  }

  const handleMenuClose = (e, reason) => {
    if (onClose) { onClose(reason) }
  }

  // Currently shown settings menu
  const [openSubMenu, setOpenSubMenu] = React.useState('')
  const closeSubMenu = (valueChanged = true) => {
    setOpenSubMenu('')
    if (valueChanged && needsRefresh) {
      needsRefresh(true)
    }
  }

  // Refs for all the property menu anchors
  const propSubMenuRefs = {
    Tv: React.useRef(),
    Av: React.useRef(),
    ISOSpeed: React.useRef(),
    ImageQuality: React.useRef(),
    WhiteBalance: React.useRef(),
    SaveTo: React.useRef()
  }

  return (
    <Menu
      anchorEl={anchor}
      open={!!anchor}
      onClose={handleMenuClose}
      sx={{ width: 300 }}
      anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
      transformOrigin={{ vertical: 'center', horizontal: 'right' }}
    >
      {useBulkValues || camera
        ? PROPERTY_IDS.map(propID => (
          <div key={`${propID}-value`}>
            {/* Exposure Property Menu Item */}
            <Tooltip placement="left" title={propID} ref={propSubMenuRefs[propID]}>
              <MenuItem onClick={() => setOpenSubMenu(propID)}>
                <ListItemIcon>{iconMap[propID]}</ListItemIcon>
                <ListItemText>
                  {useBulkValues
                    ? (bulkExposureSettings?.[propID] ? trimProp(bulkExposureSettings?.[propID]) : 'none')
                    : (camera?.[propID] ? trimProp(camera[propID].label) : 'loading')}
                </ListItemText>
              </MenuItem>
            </Tooltip>

            {/* Exposure Property sub-menu */}
            <PropertySelectMenu
              anchorElement={propSubMenuRefs[propID].current}
              propID={propID}
              useBulkValues={useBulkValues}
              camera={camera}
              server={server}
              open={openSubMenu === propID}
              onClose={closeSubMenu}
            />
          </div>
        ))
        : null}
    </Menu>
  )
}

ExposurePropertiesMenu.propTypes = {
  server: PropTypes.shape(ServerObjShape),
  camera: PropTypes.shape(CameraObjShape),
  anchor: PropTypes.instanceOf(Element),
  onClose: PropTypes.func,
  needsRefresh: PropTypes.func,
  useBulkValues: PropTypes.bool
}

ExposurePropertiesMenu.defaultProps = {
  server: null,
  camera: null,
  anchor: null,
  onClose: null,
  needsRefresh: null,
  useBulkValues: false
}
