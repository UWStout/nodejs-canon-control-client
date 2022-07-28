import React from 'react'

import localDB from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'
import useGlobalState from '../../state/useGlobalState.js'

import { Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material'
import { syncronizeCameraNicknames } from '../../helpers/serverHelper.js'

export default function CameraNicknameSyncDialog (props) {
  // Subscribe to server and camera lists
  const serverList = useLiveQuery(() => localDB.servers.toArray())
  const cameraList = useLiveQuery(() => localDB.cameras.toArray())

  const { cameraNicknameSyncDialogVisible, hideCameraNicknameSyncDialog } = useGlobalState(state => state)
  const sendNicknames = async () => {
    // Build nickname list
    const nicknameList = {}
    cameraList.forEach(camera => { nicknameList[camera.id] = camera.nickname })

    // Send to all servers
    for (let i = 0; i < serverList.length; i++) {
      await syncronizeCameraNicknames(serverList[i], nicknameList)
    }

    // Close the dialog
    hideCameraNicknameSyncDialog()
  }

  return (
    <Dialog fullWidth maxWidth='sm' onClose={hideCameraNicknameSyncDialog} open={cameraNicknameSyncDialogVisible}>
      <DialogTitle>{'Syncronize Camera Nicknames'}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          {'Would you like to send the list of camera nicknames to the servers?'}
          <br />
          {'Note: This will overwrite any nicknames already stored on the servers.'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={hideCameraNicknameSyncDialog}>{'Cancel'}</Button>
        <Button onClick={sendNicknames}>{'Send'}</Button>
      </DialogActions>
    </Dialog>
  )
}
