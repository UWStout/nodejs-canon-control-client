import React from 'react'
import PropTypes from 'prop-types'

import { IconButton, Stack, Tooltip, Divider } from '@mui/material'

import {
  AddPhotoAlternate as TakePhotoIcon,
  CenterFocusStrong as FocusIcon,
  Camera as ReleaseSutterIcon,
  SettingsSuggest as ExposurePropertiesIcon
} from '@mui/icons-material'

import ExposurePropertiesMenu from './ExposurePropertiesMenu.jsx'

export default function CameraListItemButtons (props) {
  const { serverID, cameraID, readOnly, useBulkValues } = props

  // Menu anchor refs
  const exposureAnchorRef = React.useRef()

  // Menu anchor state
  const [exposureMenuAnchor, setExposureMenuAnchor] = React.useState(null)
  const onOpenMenu = () => {
    setExposureMenuAnchor(exposureAnchorRef.current)
  }

  // Camera control callbacks
  const onTakePhoto = () => {
    console.log('Photo requested for camera', cameraID)
  }

  const onAutoFocus = () => {
    console.log('Auto-focus requested for camera', cameraID)
  }

  const onReleaseShutter = () => {
    console.log('Shutter release requested for camera', cameraID)
  }

  return (
    <React.Fragment>
      <Stack direction='row' spacing={1}>
        {/* Take Photo Button */}
        <Tooltip placement="top" title={'Take Photo w/ Focus'}>
          <span>
            <IconButton
              role={undefined}
              size='large'
              disabled={readOnly}
              onClick={readOnly ? null : onTakePhoto}
            >
              <TakePhotoIcon />
            </IconButton>
          </span>
        </Tooltip>

        {/* Auto Focus Button */}
        <Tooltip placement="top" title={'Do Auto-focus'}>
          <span>
            <IconButton
              role={undefined}
              size='large'
              disabled={readOnly}
              onClick={readOnly ? null : onAutoFocus}
            >
              <FocusIcon />
            </IconButton>
          </span>
        </Tooltip>

        {/* Shutter Release Button */}
        <Tooltip placement="top" title={'Release Shutter (no focus)'}>
          <span>
            <IconButton
              role={undefined}
              size='large'
              disabled={readOnly}
              onClick={readOnly ? null : onReleaseShutter}
            >
              <ReleaseSutterIcon />
            </IconButton>
          </span>
        </Tooltip>

        {/* Divider between control buttons and exposure menu */}
        <Divider orientation="vertical" flexItem />

        {/* Exposure Settings Menu Button */}
        <Tooltip placement="top" title={'Change Exposure Settings'} ref={exposureAnchorRef}>
          <span>
            <IconButton
              role={undefined}
              size="large"
              disabled={readOnly}
              onClick={readOnly ? null : onOpenMenu}
            >
              <ExposurePropertiesIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      {/* The actual exposure properties menu */}
      <ExposurePropertiesMenu
        serverID={serverID}
        cameraID={cameraID}
        useBulkValues={useBulkValues}
        anchor={exposureMenuAnchor}
        onClose={() => setExposureMenuAnchor(null)}
      />
    </React.Fragment>
  )
}

CameraListItemButtons.propTypes = {
  serverID: PropTypes.number,
  cameraID: PropTypes.string,
  readOnly: PropTypes.bool,
  useBulkValues: PropTypes.bool
}

CameraListItemButtons.defaultProps = {
  serverID: -1,
  cameraID: '',
  readOnly: false,
  useBulkValues: false
}
