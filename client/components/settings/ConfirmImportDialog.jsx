import * as React from 'react'
import PropTypes from 'prop-types'

import { Button, FormGroup, FormControlLabel, Checkbox, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

export default function ConfirmImportDialog (props) {
  const { onClose, open, ...other } = props

  const [servers, setServers] = React.useState(true)
  const [cameras, setCameras] = React.useState(true)
  const handleCancel = () => { onClose(false) }
  const handleOk = () => { onClose(true, servers, cameras) }

  return (
    <Dialog maxWidth="xs" open={open} {...other}>
      <DialogTitle>Confirm Import</DialogTitle>
      <DialogContent dividers>
        <Typography>Importing data will OVERWRITE current local data. Are you sure you want to proceed?</Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox checked={servers} onChange={e => setServers(e.target.checked)} />
            }
            label="Include Server Data"
          />
          <FormControlLabel
            control={
              <Checkbox checked={cameras} onChange={e => setCameras(e.target.checked)} />
            }
            label="Include Camera Data"
          />
        </FormGroup>
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
