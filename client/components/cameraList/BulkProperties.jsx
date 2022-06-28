import React, { useEffect } from 'react'

import localDB, { refreshCameraDetails } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import useGlobalState from '../../state/useGlobalState.js'

import { ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material'
import { PhotoCamera as CameraIcon } from '@mui/icons-material'

import PropertySelectMenu from './PropertySelectMenu.jsx'
import CameraPropertyButtons from './CameraPropertyButtons.jsx'

import { PropertyIDsShape } from '../../state/dataModel.js'

const PROPERTY_IDS = Object.keys(PropertyIDsShape)

export default function BulkProperties () {
  const { bulkProperties, updateBulkProperties, bulkCameraId } = useGlobalState(state => state)

  // Currently shown settings menu
  const [openMenu, setOpenMenu] = React.useState('')
  const closeMenu = () => { setOpenMenu('') }

  // Subscribe to changes to the camera object
  const camera = useLiveQuery(() => localDB.cameras.get(bulkCameraId))

  // Stay in sync with camera bulk properties
  useEffect(() => {
    const refreshBulkProperties = async () => {
      if (camera) {
        if (!camera.AEMode) {
          await refreshCameraDetails(camera.serverId, camera.id)
        } else {
          console.log('Innitializing settings from camera', camera.Id)
          const newSettings = {}
          PROPERTY_IDS.forEach((propID) => {
            newSettings[propID] = camera[propID].label
          })
          console.log('Settings are', newSettings)
          updateBulkProperties(newSettings)
        }
      }
    }

    refreshBulkProperties()
  }, [camera, updateBulkProperties])

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
          cameraID={bulkCameraId}
          serverID={camera?.serverId || -1}
          open={openMenu === propID}
          onClose={closeMenu}
          overrideValue={bulkProperties?.[propID]}
        />
      ))}

    </ListItem>
  )
}
