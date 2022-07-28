import React from 'react'
import PropTypes from 'prop-types'

import localDB from '../../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'
import useBulkTaskState from '../../../state/useBulkTaskState.js'

import { Button, IconButton, Stack, Tooltip, Divider } from '@mui/material'
import {
  AddPhotoAlternate as TakePhotoIcon,
  CenterFocusStrong as FocusIcon,
  Camera as ReleaseSutterIcon,
  AvTimer as SyncClockIcon,
  SettingsSuggest as ExposurePropertiesIcon
} from '@mui/icons-material'
import { useSnackbar } from 'notistack'

import ExposurePropertiesMenu from './ExposurePropertiesMenu.jsx'

import { takeAPhoto, doAutoFocus, releaseShutter, syncronizeTime } from '../../../helpers/serverHelper.js'
import { CameraObjShape, ServerObjShape } from '../../../state/dataModel.js'

export default function CameraActionAndPropertyButtons (props) {
  const { server, camera, readOnly, useBulkValues, onApply, bulkBusy } = props
  const { enqueueSnackbar } = useSnackbar()

  // Subscribe to the bits of bulk state we need
  const bulkState = useBulkTaskState(state => ({
    newBulkTask: state.newBulkTask,
    done: state.done
  }))

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
    if (useBulkValues) {
      if (!bulkState.done) {
        enqueueSnackbar('Please wait for current task to finish', { variant: 'warning' })
        return
      }

      const taskIds = []
      for (let i = 0; i < serverList.length; i++) {
        const server = serverList[i]
        try {
          const results = await takeAPhoto(server, '*')
          taskIds.push(results.taskId)
        } catch (error) {
          enqueueSnackbar(`Bulk photo capture failed for ${server.nickname}`, { variant: 'error' })
        }
      }
      if (taskIds.length > 0) {
        enqueueSnackbar('Bulk photo capture started')
        bulkState.newBulkTask('Bulk photo capture', taskIds)
      }
    } else {
      try {
        if (!server || !camera) {
          throw new Error(`Cannot take photo: server and/or camera are null (${server?.id}/${camera?.id})`)
        } else {
          await takeAPhoto(server, camera)
        }
      } catch (error) {
        enqueueSnackbar(`Failed to take photo on camera ${camera?.nickname || camera?.BodyIDEx?.value}`, { variant: 'error' })
        console.error(error)
      }
    }
  }

  const onAutoFocus = async () => {
    if (useBulkValues) {
      if (!bulkState.done) {
        enqueueSnackbar('Please wait for current task to finish', { variant: 'warning' })
        return
      }

      const taskIds = []
      for (let i = 0; i < serverList.length; i++) {
        const server = serverList[i]
        try {
          const results = await doAutoFocus(server, '*')
          taskIds.push(results.taskId)
        } catch (error) {
          enqueueSnackbar(`Bulk auto-focus failed for ${server.nickname}`, { variant: 'error' })
        }
      }
      if (taskIds.length > 0) {
        enqueueSnackbar('Bulk auto-focus started')
        bulkState.newBulkTask('Bulk auto-focus', taskIds)
      }
    } else {
      try {
        if (!server || !camera) {
          throw new Error(`Cannot auto-focus: server and/or camera are null (${server?.id}/${camera?.id})`)
        } else {
          await doAutoFocus(server, camera)
        }
      } catch (error) {
        enqueueSnackbar(`Auto-focus failed on camera ${camera?.nickname || camera?.BodyIDEx?.value}`, { variant: 'error' })
        console.error(error)
      }
    }
  }

  const onReleaseShutter = async () => {
    if (useBulkValues) {
      if (!bulkState.done) {
        enqueueSnackbar('Please wait for current task to finish', { variant: 'warning' })
        return
      }

      const taskIds = []
      for (let i = 0; i < serverList.length; i++) {
        const server = serverList[i]
        try {
          const results = await releaseShutter(server, '*')
          taskIds.push(results.taskId)
        } catch (error) {
          enqueueSnackbar(`Bulk shutter release failed for ${server.nickname}`, { variant: 'error' })
        }
      }
      if (taskIds.length > 0) {
        enqueueSnackbar('Bulk shutter release started')
        bulkState.newBulkTask('Bulk shutter release', taskIds)
      }
    } else {
      try {
        if (!server || !camera) {
          throw new Error(`Cannot release shutter: server and/or camera are null (${server?.id}/${camera?.id})`)
        } else {
          console.log('Releasing for', camera)
          await releaseShutter(server, camera)
        }
      } catch (error) {
        enqueueSnackbar(`Shutter release failed on camera ${camera?.nickname || camera?.ProductName?.value}`, { variant: 'error' })
        console.error(error)
      }
    }
  }

  const onSyncTime = async () => {
    if (useBulkValues) {
      if (!bulkState.done) {
        enqueueSnackbar('Please wait for current task to finish', { variant: 'warning' })
        return
      }

      const taskIds = []
      for (let i = 0; i < serverList.length; i++) {
        const server = serverList[i]
        try {
          const results = await syncronizeTime(server, '*')
          taskIds.push(results.taskId)
        } catch (error) {
          enqueueSnackbar(`Bulk clock sync failed for ${server.nickname}`, { variant: 'error' })
        }
      }
      if (taskIds.length > 0) {
        enqueueSnackbar('Bulk clock sync started')
        bulkState.newBulkTask('Bulk clock sync', taskIds)
      }
    } else {
      try {
        if (!server || !camera) {
          throw new Error(`Cannot sync clock: server and/or camera are null (${server?.id}/${camera?.id})`)
        } else {
          console.log('Releasing for', camera)
          await releaseShutter(server, camera)
        }
      } catch (error) {
        enqueueSnackbar(`Clock sync failed on camera ${camera?.nickname || camera?.ProductName?.value}`, { variant: 'error' })
        console.error(error)
      }
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
