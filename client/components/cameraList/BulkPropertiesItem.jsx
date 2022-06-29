import React from 'react'

import localDB from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { Collapse, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material'
import { PhotoCamera as CameraIcon } from '@mui/icons-material'

import PropertySelectMenu from './PropertySelectMenu.jsx'
import CameraPropertyButtons from './CameraPropertyButtons.jsx'

import { PropertyIDsShape } from '../../state/dataModel.js'

const PROPERTY_IDS = Object.keys(PropertyIDsShape)

export default function BulkPropertiesItem () {
  const bulkModeEnabled = useLiveQuery(() => localDB.settings.get('bulkModeEnabled'))

  // Currently shown settings menu
  const [openMenu, setOpenMenu] = React.useState('')
  const closeMenu = () => { setOpenMenu('') }

  // Subscribe to changes to the camera object
  const camera = useLiveQuery(() => localDB.cameras.get(0))

  // Refs for all the property menu anchors
  const propRefs = {
    Tv: React.useRef(),
    Av: React.useRef(),
    ISOSpeed: React.useRef(),
    ImageQuality: React.useRef(),
    WhiteBalance: React.useRef()
  }

  return (
    <Collapse in={bulkModeEnabled?.value} timeout="auto" unmountOnExit>
      <List sx={{ padding: 0, width: '100%', bgcolor: 'background.paper' }}>
        <ListItem
          secondaryAction={
            <CameraPropertyButtons useBulkValues propRefs={propRefs} onOpenMenu={setOpenMenu} />
          }
        >
          {/* Basic Camera Icon */}
          <ListItemAvatar>
            <Avatar>
              <CameraIcon />
            </Avatar>
          </ListItemAvatar>

          {/* Camera Info */}
          <ListItemText primary={'Bulk Camera Settings'} />

          {/* Property selection menus */}
          {PROPERTY_IDS.map((propID) => (
            <PropertySelectMenu
              key={`${propID}-menu`}
              anchorElement={propRefs[propID].current}
              propID={propID}
              open={openMenu === propID}
              onClose={closeMenu}
              isBulkProperty
            />
          ))}

        </ListItem>
      </List>
    </Collapse>
  )
}
