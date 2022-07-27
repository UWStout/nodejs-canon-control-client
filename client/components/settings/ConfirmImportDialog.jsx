import * as React from 'react'
import PropTypes from 'prop-types'

import { Button, FormGroup, FormControlLabel, Checkbox, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

export default function ConfirmImportDialog (props) {
  const { onClose, open, ...other } = props

  // State of the various checkboxes
  const [servers, setServers] = React.useState(true)
  const [cameras, setCameras] = React.useState(true)
  const [sessions, setSessions] = React.useState(true)
  const [settings, setSettings] = React.useState(false)

  // Callbacks for accepting or canceling the dialog
  const handleCancel = () => { onClose(false) }
  const handleOk = () => { onClose(true, servers, cameras, sessions, settings) }

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
          <FormControlLabel
            control={
              <Checkbox checked={sessions} onChange={e => setSessions(e.target.checked)} />
            }
            label="Include Session Data"
          />
          <FormControlLabel
            control={
              <Checkbox checked={settings} onChange={e => setSettings(e.target.checked)} />
            }
            label="Include Local Settings"
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
