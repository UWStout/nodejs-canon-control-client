import * as React from 'react'

import localDB from '../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'
import useGlobalState from '../state/useGlobalState.js'

import { Dialog, AppBar, Toolbar, IconButton, Box, Slide, Select, MenuItem, Divider, Stack, Typography } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function C4LiveViewDialog () {
  // Global dialog visibility state
  const { liveViewDialogVisible, hideLiveViewDialog } = useGlobalState(state => state)

  // Local GUI State
  const [selectedServer, setSelectedServer] = React.useState(-1)
  const [selectedCamera, setSelectedCamera] = React.useState(-1)

  // Subscribe to lists of servers and cameras
  const serverList = useLiveQuery(() => localDB.servers.toArray())
  const cameraList = useLiveQuery(
    () => localDB.cameras.where({ serverId: selectedServer }).toArray(),
    [selectedServer],
    null
  )

  // Clear selected camera whenever selected server changes
  React.useEffect(() => {
    if (selectedServer >= 0) {
      setSelectedCamera(-1)
    }
  }, [selectedServer])

  // Build the live view URL if we can
  const curServer = serverList?.find(server => server.id === selectedServer)
  let liveViewURL = ''
  if (curServer && selectedCamera >= 0) {
    liveViewURL = `https://${curServer.IP}:${curServer.port}/camera/${selectedCamera}/liveView`
  }

  return (
    <Dialog
      fullScreen
      open={liveViewDialogVisible}
      onClose={hideLiveViewDialog}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Stack direction='row' spacing={2} alignItems='center' sx={{ width: '100%' }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={hideLiveViewDialog}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" component="div">
              {'Camera Live View:'}
            </Typography>
            <Select
              value={selectedServer}
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
              value={selectedCamera}
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
        </Toolbar>
      </AppBar>
      <Box sx={{}}>
        {liveViewURL !== '' &&
          <iframe
            style={{ width: '100%', height: '100%' }}
            sandbox='allow-same-origin'
            src={liveViewURL}
            title={`Live view of camera ${selectedCamera} on server ${curServer?.nickname}`}
          />}
      </Box>
    </Dialog>
  )
}
