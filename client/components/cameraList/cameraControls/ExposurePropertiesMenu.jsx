import React from 'react'
import PropTypes from 'prop-types'

import localDB from '../../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'
import useGlobalState from '../../../state/useGlobalState.js'

import { Menu, MenuItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material'

import {
  ShutterSpeed as ShutterIcon,
  Camera as ApertureIcon,
  Exposure as ISOSpeedIcon,
  PhotoSizeSelectLarge as SizeQualityIcon,
  WbSunny as WhiteBalanceIcon
} from '@mui/icons-material'

import PropertySelectMenu from './PropertySelectMenu.jsx'

import { PropertyIDsShape } from '../../../state/dataModel.js'
import { trimProp } from '../../../helpers/utility.js'

const PROPERTY_IDS = Object.keys(PropertyIDsShape)

export default function ExposurePropertiesMenu (props) {
  const { serverID, cameraID, useBulkValues, anchor, onClose, needsRefresh } = props
  const { bulkModeSettings } = useGlobalState(state => state)

  // Subscribe to changes to the camera object
  const camera = useLiveQuery(() => localDB.cameras.get(cameraID))

  // Force a re-render
  const [rerender, setRerender] = React.useState(false)

  // Map for the icon elements
  const iconMap = {
    Tv: <ShutterIcon />,
    Av: <ApertureIcon />,
    ISOSpeed: <ISOSpeedIcon />,
    ImageQuality: <SizeQualityIcon />,
    WhiteBalance: <WhiteBalanceIcon />
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
      setRerender(!rerender)
    }
  }

  // Refs for all the property menu anchors
  const propSubMenuRefs = {
    Tv: React.useRef(),
    Av: React.useRef(),
    ISOSpeed: React.useRef(),
    ImageQuality: React.useRef(),
    WhiteBalance: React.useRef()
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
                    ? (bulkModeSettings?.[propID] ? trimProp(bulkModeSettings[propID]) : 'loading')
                    : (camera?.[propID] ? trimProp(camera[propID].label) : 'loading')}
                </ListItemText>
              </MenuItem>
            </Tooltip>

            {/* Exposure Property sub-menu */}
            <PropertySelectMenu
              anchorElement={propSubMenuRefs[propID].current}
              propID={propID}
              cameraID={cameraID}
              serverID={serverID}
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
  serverID: PropTypes.number,
  cameraID: PropTypes.string,
  anchor: PropTypes.instanceOf(Element),
  onClose: PropTypes.func,
  needsRefresh: PropTypes.func,
  useBulkValues: PropTypes.bool
}

ExposurePropertiesMenu.defaultProps = {
  serverID: -1,
  cameraID: '',
  anchor: null,
  onClose: null,
  needsRefresh: null,
  useBulkValues: false
}
