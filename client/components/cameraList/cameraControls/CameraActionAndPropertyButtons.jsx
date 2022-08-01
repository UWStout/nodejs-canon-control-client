import React from 'react'
import PropTypes from 'prop-types'

import localDB from '../../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import useGlobalState from '../../../state/useGlobalState.js'
import useSocketState from '../../../state/useSocketState.js'
import useBulkTaskState from '../../../state/useBulkTaskState.js'

import { Button, IconButton, Stack, Tooltip, Divider } from '@mui/material'
import {
  AddPhotoAlternate as TakePhotoIcon,
  CenterFocusStrong as FocusIcon,
  Camera as ReleaseSutterIcon,
  AvTimer as SyncClockIcon,
  SettingsSuggest as ExposurePropertiesIcon,
  Cast as LiveViewIcon
} from '@mui/icons-material'
import { useSnackbar } from 'notistack'

import ExposurePropertiesMenu from './ExposurePropertiesMenu.jsx'

import { bulkAction, singleCamAction } from '../../../helpers/cameraActionHelper.js'
import { takeAPhoto, doAutoFocus, releaseShutter, syncronizeTime } from '../../../helpers/serverHelper.js'

import { CameraObjShape, ServerObjShape } from '../../../state/dataModel.js'

export default function CameraActionAndPropertyButtons (props) {
  const { server, camera, readOnly, useBulkValues, onApply, bulkBusy } = props
  const { enqueueSnackbar } = useSnackbar()

  // For starting up live view
  const { showLiveViewDialog } = useGlobalState(state => state)
  const { setLiveViewSelection } = useSocketState(state => state)

  // Subscribe to the bits of bulk state we need
  const bulkState = useBulkTaskState(state => ({
    newBulkTask: state.newBulkTask,
    done: state.done
  }))

  // Needed browser data and state
  const serverList = useLiveQuery(() => localDB.servers.toArray())

  // Camera control callbacks
  const onTakePhoto = () => {
    if (useBulkValues) {
      if (!bulkState.done) {
        enqueueSnackbar('Please wait for current task to finish', { variant: 'warning' })
        return
      }
      bulkAction('Bulk photo capture', takeAPhoto, serverList, bulkState, enqueueSnackbar)
    } else {
      singleCamAction('take photo', takeAPhoto, server, camera, enqueueSnackbar)
    }
  }

  const onAutoFocus = async () => {
    if (useBulkValues) {
      if (!bulkState.done) {
        enqueueSnackbar('Please wait for current task to finish', { variant: 'warning' })
        return
      }
      bulkAction('Bulk auto-focus', doAutoFocus, serverList, bulkState, enqueueSnackbar)
    } else {
      singleCamAction('auto-focus', doAutoFocus, server, camera, enqueueSnackbar)
    }
  }

  const onReleaseShutter = async () => {
    if (useBulkValues) {
      if (!bulkState.done) {
        enqueueSnackbar('Please wait for current task to finish', { variant: 'warning' })
        return
      }
      bulkAction('Bulk shutter release', releaseShutter, serverList, bulkState, enqueueSnackbar)
    } else {
      singleCamAction('release shutter', releaseShutter, server, camera, enqueueSnackbar)
    }
  }

  const onSyncTime = async () => {
    if (useBulkValues) {
      if (!bulkState.done) {
        enqueueSnackbar('Please wait for current task to finish', { variant: 'warning' })
        return
      }
      bulkAction('Bulk clock sync', syncronizeTime, serverList, bulkState, enqueueSnackbar)
    } else {
      singleCamAction('sync clock', syncronizeTime, server, camera, enqueueSnackbar)
    }
  }

  const onStartLiveView = () => {
    setLiveViewSelection(server.id, camera.index)
    showLiveViewDialog()
  }

  // Menu anchor refs
  const exposureAnchorRef = React.useRef()

  // Menu anchor state
  const [exposureMenuAnchor, setExposureMenuAnchor] = React.useState(null)
  const onOpenMenu = () => {
    setExposureMenuAnchor(exposureAnchorRef.current)
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
              disabled={readOnly || (useBulkValues && bulkBusy)}
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
              disabled={readOnly || (useBulkValues && bulkBusy)}
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
              disabled={readOnly || (useBulkValues && bulkBusy)}
              onClick={readOnly ? null : onReleaseShutter}
            >
              <ReleaseSutterIcon />
            </IconButton>
          </span>
        </Tooltip>

        {/* Clock Sync Button */}
        <Tooltip placement="top" title={'Syncronize Clock'}>
          <span>
            <IconButton
              role={undefined}
              size='large'
              disabled={readOnly || (useBulkValues && bulkBusy)}
              onClick={readOnly ? null : onSyncTime}
            >
              <SyncClockIcon />
            </IconButton>
          </span>
        </Tooltip>

        {/* Start Live View Button */}
        <Tooltip placement="top" title={'Start Live View'}>
          <span>
            <IconButton
              role={undefined}
              size='large'
              disabled={readOnly || useBulkValues}
              onClick={readOnly ? null : onStartLiveView}
            >
              <LiveViewIcon />
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
              disabled={readOnly || (useBulkValues && bulkBusy)}
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
                disabled={!!(useBulkValues && bulkBusy)}
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
  bulkBusy: PropTypes.bool
}

CameraActionAndPropertyButtons.defaultProps = {
  server: null,
  camera: null,
  readOnly: false,
  useBulkValues: false,
  onApply: null,
  bulkBusy: true
}
