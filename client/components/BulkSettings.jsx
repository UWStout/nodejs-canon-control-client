import React, { useEffect } from 'react'

import useGlobalState from '../state/useGlobalState.js'

import { ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material'
import { PhotoCamera as CameraIcon } from '@mui/icons-material'

import PropertySelectMenu from './PropertySelectMenu.jsx'
import CameraPropertyButtons from './CameraPropertyButtons.jsx'

import { PropertyIDsShape } from '../state/dataModel.js'
import { getCameraDetails } from '../helpers/serverHelper.js'

const PROPERTY_IDS = Object.keys(PropertyIDsShape)

export default function BulkSettings () {
  const { bulkModeSettings, updateBulkModeSettings, bulkCameraIndex, bulkServerIP } = useGlobalState(state => state)

  // Currently shown settings menu
  const [openMenu, setOpenMenu] = React.useState('')
  const closeMenu = () => {
    setOpenMenu('')
  }

  // Initialize bulk mode values
  useEffect(() => {
    const initializeBulkSettings = async () => {
      console.log('Innitializing settings from', bulkServerIP, 'cam', bulkCameraIndex)
      const details = await getCameraDetails(bulkServerIP, bulkCameraIndex)

      const newSettings = {}
      PROPERTY_IDS.forEach((propID) => {
        newSettings[propID] = details[propID].label
      })
      console.log('Settings are', newSettings)
      updateBulkModeSettings(newSettings)
    }

    if (!bulkModeSettings) {
      initializeBulkSettings()
    }
  }, [bulkCameraIndex, bulkModeSettings, bulkServerIP, updateBulkModeSettings])

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
          camera={bulkCameraIndex}
          serverIP={bulkServerIP}
          open={openMenu === propID}
          onClose={closeMenu}
          overrideValue={bulkModeSettings?.[propID]}
        />
      ))}

    </ListItem>
  )
}
