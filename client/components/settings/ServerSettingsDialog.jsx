import React from 'react'

import useGlobalState from '../../state/useGlobalState.js'

import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

import ServerSettingsForm from './ServerSettingsForm.jsx'

export default function ServerSettingsDialog (props) {
  const { serverEditDialogVisible, hideServerEditDialog } = useGlobalState(state => state)

  const requestClose = () => {
    // TODO: Check for un-committed changes first
    hideServerEditDialog()
  }

  return (
    <Dialog fullWidth maxWidth='sm' onClose={requestClose} open={serverEditDialogVisible}>
      <DialogTitle>{'Edit Server List'}</DialogTitle>
      <DialogContent dividers>
        <ServerSettingsForm />
      </DialogContent>
      <DialogActions>
        <Button onClick={requestClose}>{'Done'}</Button>
      </DialogActions>
    </Dialog>
  )
}
