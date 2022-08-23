import * as React from 'react'
import PropTypes from 'prop-types'

import useSocketState from '../../state/useSocketState.js'

import { Dialog, DialogTitle, DialogContent, Button, Typography } from '@mui/material'

import { timeString } from '../../helpers/utility.js'
import { getLiveViewTimeoutOnServer } from '../../helpers/serverHelper.js'
import { ServerObjShape } from '../../state/dataModel.js'

export default function LiveViewTImeoutDialog (props) {
  const { serverList, ...other } = props

  // Subscribe to Live View State
  const { timeoutDialogVisible, closeTimeoutDialog, selectedServer } = useSocketState(state => ({
    timeoutDialogVisible: state.timeoutDialogVisible,
    closeTimeoutDialog: state.closeTimeoutDialog,
    selectedServer: state.liveViewServerSelection
  }))

  // Fetch server's current timeout setting
  const [currentLVTimeout, setCurrentLVTimeout] = React.useState('')
  React.useEffect(() => {
    async function fetchLVTimeout () {
      const currentServer = serverList.find(server => server.id === selectedServer)
      const result = await getLiveViewTimeoutOnServer(currentServer)
      setCurrentLVTimeout(result.timeout)
    }
    fetchLVTimeout()
  }, [timeoutDialogVisible, serverList, selectedServer])

  return (
    <Dialog
      open={timeoutDialogVisible}
      fullWidth maxWidth="sm"
      {...other}
      align='center'
    >
      <DialogTitle>Live View has been running for a while</DialogTitle>
      <DialogContent dividers>
        <Typography>{`To conserve resources Live View times out after ${timeString(currentLVTimeout)}`}</Typography>
      </DialogContent>
      <Button variant="text" fullWidth onClick={closeTimeoutDialog}>Confirm</Button>
    </Dialog>
  )
}

LiveViewTImeoutDialog.propTypes = {
  serverList: PropTypes.arrayOf(PropTypes.shape(ServerObjShape))
}

LiveViewTImeoutDialog.defaultProps = {
  serverList: []
}
