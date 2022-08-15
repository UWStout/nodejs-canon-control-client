import React from 'react'

import useGlobalState from '../../state/useGlobalState.js'

import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

import ImportExportForm from './ImportExportForm.jsx'

export default function ImportExportDialog (props) {
  const { importExportDialogVisible, hideImportExportDialog } = useGlobalState(state => state)

  return (
    <Dialog fullWidth maxWidth='sm' onClose={hideImportExportDialog} open={importExportDialogVisible}>
      <DialogTitle>{'Import / Export Local Data'}</DialogTitle>
      <DialogContent dividers>
        <ImportExportForm />
      </DialogContent>
      <DialogActions>
        <Button onClick={hideImportExportDialog}>{'Close'}</Button>
      </DialogActions>
    </Dialog>
  )
}
