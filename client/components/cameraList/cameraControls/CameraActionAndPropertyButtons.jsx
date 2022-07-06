import React from 'react'
import PropTypes from 'prop-types'

import localDB from '../../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { Button, IconButton, Stack, Tooltip, Divider } from '@mui/material'
import {
  AddPhotoAlternate as TakePhotoIcon,
  CenterFocusStrong as FocusIcon,
  Camera as ReleaseSutterIcon,
  SettingsSuggest as ExposurePropertiesIcon
} from '@mui/icons-material'
import { useSnackbar } from 'notistack'

import ExposurePropertiesMenu from './ExposurePropertiesMenu.jsx'

import { takeAPhoto, doAutoFocus, releaseShutter } from '../../../helpers/serverHelper.js'
import { CameraObjShape, ServerObjShape } from '../../../state/dataModel.js'

export default function CameraActionAndPropertyButtons (props) {
  const { server, camera, readOnly, useBulkValues, onApply, disableApply } = props
  const { enqueueSnackbar } = useSnackbar()

  // Needed browser data and state
  const serverList = useLiveQuery(() => localDB.servers.toArray())

  // Menu anchor refs
  const exposureAnchorRef = React.useRef()

  // Menu anchor state
  const [exposureMenuAnchor, setExposureMenuAnchor] = React.useState(null)
  const onOpenMenu = () => {
    setExposureMenuAnchor(exposureAnchorRef.current)
  }

  // Camera control callbacks
  const onTakePhoto = async () => {
    try {
      if (useBulkValues) {
        await Promise.allSettled(serverList.map(server => takeAPhoto(server, '*')))
        enqueueSnackbar('Bulk photo capture complete', { variant: 'success' })
      } else if (!server || !camera) {
        throw new Error(`Cannot take photo: server and/or camera are null (${server?.id}/${camera?.id})`)
      } else {
        await takeAPhoto(server, camera)
      }
    } catch (error) {
      if (useBulkValues) {
        enqueueSnackbar('Failed to take photos in bulk', { variant: 'error' })
      } else {
        enqueueSnackbar(`Failed to take photo on camera ${camera?.nickname || camera?.BodyIDEx?.value}`, { variant: 'error' })
      }
      console.error(error)
    }
  }

  const onAutoFocus = async () => {
    try {
      if (useBulkValues) {
        await Promise.allSettled(serverList.map(server => doAutoFocus(server, '*')))
        enqueueSnackbar('Bulk auto-focus complete', { variant: 'success' })
      } else if (!server || !camera) {
        throw new Error(`Cannot auto-focus: server and/or camera are null (${server?.id}/${camera?.id})`)
      } else {
        await doAutoFocus(server, camera)
      }
    } catch (error) {
      if (useBulkValues) {
        enqueueSnackbar('Failed to Auto-focus cameras in bulk', { variant: 'error' })
      } else {
        enqueueSnackbar(`Auto-focus failed on camera ${camera?.nickname || camera?.BodyIDEx?.value}`, { variant: 'error' })
      }
      console.error(error)
    }
  }

  const onReleaseShutter = async () => {
    try {
      if (useBulkValues) {
        await Promise.allSettled(serverList.map(server => releaseShutter(server, '*')))
        enqueueSnackbar('Bulk shutter release complete', { variant: 'success' })
      } else if (!server || !camera) {
        throw new Error(`Cannot release shutter: server and/or camera are null (${server?.id}/${camera?.id})`)
      } else {
        await releaseShutter(server, camera)
      }
    } catch (error) {
      if (useBulkValues) {
        enqueueSnackbar('Failed to release camera shutters in bulk', { variant: 'error' })
      } else {
        enqueueSnackbar(`Shutter release failed on camera ${camera?.nickname || camera?.ProductName?.value}`, { variant: 'error' })
      }
      console.error(error)
    }
  }

  return (
    <React.Fragment>
      <Stack direction='row' spacing={1} alignItems="center">
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

        {!!onApply &&
          // Exposure Settings Apply Button
          <Tooltip placement="top" title={'Apply Exposure Settings'}>
            <span>
              <Button
                size="small"
                variant="contained"
                disabled={disableApply}
                onClick={onApply}
              >
                {'Apply'}
              </Button>
            </span>
          </Tooltip>}
      </Stack>

      {/* The actual exposure properties menu */}
      <ExposurePropertiesMenu
        server={server}
        camera={camera}
        useBulkValues={useBulkValues}
        anchor={exposureMenuAnchor}
        onClose={() => setExposureMenuAnchor(null)}
      />
    </React.Fragment>
  )
}

CameraActionAndPropertyButtons.propTypes = {
  server: PropTypes.shape(ServerObjShape),
  camera: PropTypes.shape(CameraObjShape),
  readOnly: PropTypes.bool,
  useBulkValues: PropTypes.bool,
  onApply: PropTypes.func,
  disableApply: PropTypes.bool
}

CameraActionAndPropertyButtons.defaultProps = {
  server: null,
  camera: null,
  readOnly: false,
  useBulkValues: false,
  onApply: null,
  disableApply: true
}