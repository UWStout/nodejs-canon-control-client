import * as React from 'react'
import PropTypes from 'prop-types'

import { Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

export default function ConfirmImportDialog (props) {
  const { onClose, open, ...other } = props
  const handleCancel = () => { onClose(false) }
  const handleOk = () => { onClose(true) }

  return (
    <Dialog maxWidth="xs" open={open} {...other}>
      <DialogTitle>Confirm Import</DialogTitle>
      <DialogContent dividers>
        <Typography>Importing data will OVERWRITE current local data. Are you sure you want to proceed?</Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Yes</Button>
      </DialogActions>
    </Dialog>
  )
}

ConfirmImportDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}
