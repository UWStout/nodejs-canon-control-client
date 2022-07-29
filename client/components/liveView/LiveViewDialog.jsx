import * as React from 'react'

import localDB from '../../state/localDB.js'
import useGlobalState from '../../state/useGlobalState.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { Dialog, AppBar, Toolbar, Slide } from '@mui/material'

import CameraLiveView from './CameraLiveView.jsx'
import LiveViewSettingButtons from './LiveViewSettingButtons.jsx'

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function LiveViewDialog () {
  // Global dialog visibility state
  const { liveViewDialogVisible, hideLiveViewDialog } = useGlobalState(state => state)

  // Local GUI State
  const [selectedServer, setSelectedServer] = React.useState(-1)
  const [selectedCamera, setSelectedCamera] = React.useState(-1)

  // Clear selected camera whenever selected server changes
  React.useEffect(() => {
    if (selectedServer >= 0) {
      setSelectedCamera(-1)
    }
  }, [selectedServer])

  // Subscribe to list of servers
  const serverList = useLiveQuery(() => localDB.servers.toArray())

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
          <LiveViewSettingButtons
            {...{
              serverList,
              selectedServer,
              selectedCamera,
              setSelectedServer,
              setSelectedCamera,
              onClose: hideLiveViewDialog
            }}
          />
        </Toolbar>
      </AppBar>
      <CameraLiveView
        liveViewURL={liveViewURL}
        title={`Live view of camera ${selectedCamera} on server ${curServer?.nickname}`}
      />
    </Dialog>
  )
}
