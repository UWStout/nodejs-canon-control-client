import React from 'react'
import PropTypes from 'prop-types'

import localDB, { refreshCameraDetails } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'
import { useSnackbar } from 'notistack'

import useGlobalState from '../../state/useGlobalState.js'

import { List, Grid, Stack, Typography, ButtonGroup, Button, IconButton, Tooltip } from '@mui/material'
import { Refresh as RefreshIcon } from '@mui/icons-material'

import CameraListItem from './CameraListItem.jsx'
import ServerTabPanel from './ServerTabPanel.jsx'
// import BulkPropertiesCollapse from './BulkPropertiesCollapse.jsx'

export default function CameraListPanel (props) {
  const { serverId, index } = props
  const { enqueueSnackbar } = useSnackbar()

  // Subscribe to changes to servers and cameras
  const server = useLiveQuery(() => localDB.servers.get(serverId))
  const cameraList = useLiveQuery(() => localDB.cameras.where({ serverId }).toArray())

  // Subscribe to persistent settings
  const bulkModeEnabled = useLiveQuery(() => localDB.settings.get('bulkModeEnabled'))
  const cameraSortField = useLiveQuery(() => localDB.settings.get('cameraSortField'))
  const cameraErrorsAtTop = useLiveQuery(() => localDB.settings.get('cameraErrorsAtTop'))

  // Subscribe to camera selection global state
  const selectionState = useGlobalState(state => ({
    selectedCameras: state.selectedCameras,
    addCameraToSelection: state.addCameraToSelection,
    removeCameraFromSelection: state.removeCameraFromSelection,
    clearSelectedCameras: state.clearSelectedCameras,
    showGroupManagementDialog: state.showGroupManagementDialog
  }))

  // Show the group creation/management dialog
  const createGroup = () => {
    selectionState.showGroupManagementDialog()
  }

  // Function to refresh all camera details for this server
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const refreshAllCameraDetails = async () => {
    enqueueSnackbar(`Starting Camera Refresh for ${server?.nickname}`)
    setIsRefreshing(true)
    for (let i = 0; i < cameraList.length; i++) {
      await refreshCameraDetails(serverId, cameraList[i].id)
    }
    setIsRefreshing(false)
    enqueueSnackbar(`Camera Refresh Complete for ${server?.nickname}`, { variant: 'success' })
  }

  // Build camera widget list
  let serverStats = {}
  let cameraListItems = []
  let serverCams = cameraList
  if (server && Array.isArray(serverCams)) {
    // Compute server camera stats
    serverStats = serverCams.reduce(
      (prev, camera) => ({
        expected: prev.expected + 1,
        missing: prev.missing + (camera.missing ? 1 : 0)
      }),
      { expected: 0, missing: 0 }
    )

    // Sort the cameras
    if (typeof cameraSortField?.value === 'string') {
      serverCams = serverCams.sort((a, b) => {
        // Should cameras with errors be at the top?
        if (cameraErrorsAtTop?.value) {
          if (!a.missing || !b.missing) {
            if (a.missing) { return -1 }
            if (b.missing) { return 1 }
          }
        }

        // Sort by the select sorting field
        return ('' + a[cameraSortField.value]).localeCompare(b[cameraSortField.value])
      })
    }

    // Convert camera objects to CameraListItem components
    cameraListItems = serverCams.map(camera => (
      <CameraListItem
        key={camera.BodyIDEx.value}
        cameraID={camera.id}
        serverID={server.id}
        readOnly={camera.missing || bulkModeEnabled?.value}
      />
    ))
  }

  return (
    <ServerTabPanel serverId={serverId} index={index}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {!!server &&
            <Stack direction='row' spacing={1} alignItems='baseline' sx={{ paddingTop: 1 }}>
              <Typography variant='h6' component='div'>{server.nickname}</Typography>
              <Typography variant='body1' sx={{ flexGrow: 1 }}>{`(${server.IP}:${server.port})`}</Typography>
              <Typography variant='body1'>
                {`${serverStats.missing > 0 ? serverStats.missing + ' missing of ' : ''}`}
                {`${serverStats.expected || 0} cameras`}
              </Typography>
              <Tooltip title={isRefreshing ? 'Working ...' : 'Refresh Camera Details'}>
                <span>
                  <IconButton aria-label="refresh" onClick={refreshAllCameraDetails} disabled={isRefreshing}>
                    <RefreshIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>}
        </Grid>
        <Grid item xs={12}>
          <List
            sx={{
              padding: 0,
              width: '100%',
              bgcolor: 'background.paper',
              overflow: 'auto',
              height: (bulkModeEnabled?.value ? '51vh' : '59vh')
            }}
          >
            {cameraListItems}
          </List>
        </Grid>
        <Grid item xs={12}>
          <Stack direction='row' spacing={1} alignItems='baseline' sx={{ paddingBottom: 1, width: '100%' }}>
            <Typography variant='body1'>{'Camera Grouping:'}</Typography>
            <ButtonGroup variant='text' size='small'>
              <Button onClick={() => selectionState.addCameraToSelection(cameraList.map(cam => cam.id))}>{'select all'}</Button>
              <Button onClick={() => selectionState.removeCameraFromSelection(cameraList.map(cam => cam.id))}>{'remove all'}</Button>
              <Button onClick={() => selectionState.clearSelectedCameras()}>{'clear selection'}</Button>
            </ButtonGroup>
            {/* eslint-disable-next-line react/forbid-component-props */}
            <Button variant='contained' size='small' style={{ marginLeft: 'auto' }} onClick={createGroup} disabled={selectionState.selectedCameras.length <= 0}>{'add to group'}</Button>
          </Stack>
        </Grid>
      </Grid>
    </ServerTabPanel>
  )
}

CameraListPanel.propTypes = {
  serverId: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
}
