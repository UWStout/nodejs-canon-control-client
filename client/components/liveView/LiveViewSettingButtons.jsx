import React from 'react'
import PropTypes from 'prop-types'

import localDB from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'
import useSocketState from '../../state/useSocketState.js'

import { IconButton, Select, MenuItem, Divider, Stack, Typography } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { ServerObjShape } from '../../state/dataModel.js'
import { getCameraImagePropeties } from '../../helpers/serverHelper.js'

export default function LiveViewSettingButtons (props) {
  // Props from parent's state
  const { serverList, onClose } = props

  const liveViewState = useSocketState(state => ({
    setLiveViewOrientation: state.setLiveViewOrientation,
    selectedServer: state.liveViewServerSelection,
    selectedCamera: state.liveViewCameraSelection,
    setLiveViewSelection: state.setLiveViewSelection
  }))

  // Subscribe to list cameras for current server
  const cameraList = useLiveQuery(
    () => localDB.cameras.where({ serverId: liveViewState.selectedServer }).toArray(),
    [liveViewState.selectedServer],
    null
  )?.sort((A, B) => A.nickname?.localeCompare(B.nickname))

  const setSelectedServer = (newValue) => {
    liveViewState.setLiveViewSelection(newValue, liveViewState.selectedCamera)
  }

  const setSelectedCamera = async (newValue) => {
    console.log('Reading image info')
    try {
      const imageProps = await getCameraImagePropeties(
        serverList.find(server => server.id === liveViewState.selectedServer),
        newValue
      )
      liveViewState.setLiveViewOrientation(imageProps.orientation)
    } catch (error) {
      console.error('Failed to read orientation')
      console.error(error)
    }

    liveViewState.setLiveViewSelection(liveViewState.selectedServer, newValue)
  }

  return (
    <Stack direction='row' spacing={2} alignItems='center' sx={{ width: '100%' }}>
      <IconButton
        edge="start"
        color="inherit"
        onClick={onClose}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>

      <Typography variant="h6" component="div">
        {'Camera Live View:'}
      </Typography>

      <Select
        value={liveViewState.selectedServer}
        label="Server"
        color="primary"
        onChange={(e) => setSelectedServer(e.target.value)}
        disabled={!Array.isArray(serverList)}
        size="small"
        sx={{ flexGrow: 1 }}
      >
        <MenuItem value={-1}>{'Select a server'}</MenuItem>
        <Divider />
        {Array.isArray(serverList) && serverList.map(server => (
          <MenuItem key={server.id} value={server.id}>{server.nickname}</MenuItem>
        ))}
      </Select>
      <Select
        value={(Array.isArray(cameraList) && cameraList.length > 0) ? liveViewState.selectedCamera : -1}
        label="Camera"
        color="primary"
        onChange={(e) => setSelectedCamera(e.target.value)}
        disabled={!Array.isArray(cameraList)}
        size="small"
        sx={{ flexGrow: 1 }}
      >
        <MenuItem value={-1}>
          {!Array.isArray(cameraList) ? '(pick a server first)' : 'Select a Camera'}
        </MenuItem>
        <Divider />
        {!!(Array.isArray(cameraList) && cameraList.length > 0) &&
          cameraList.map(camera => (
            <MenuItem key={camera.id} value={camera.index}>{camera.nickname}</MenuItem>
          ))}
      </Select>
    </Stack>
  )
}

LiveViewSettingButtons.propTypes = {
  serverList: PropTypes.arrayOf(PropTypes.shape(ServerObjShape)),
  onClose: PropTypes.func.isRequired
}

LiveViewSettingButtons.defaultProps = {
  serverList: []
}
