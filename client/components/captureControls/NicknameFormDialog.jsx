import * as React from 'react'
import PropTypes from 'prop-types'

import { Dialog, DialogTitle, DialogContent, Button, ButtonGroup, TextField } from '@mui/material'

export default function NicknameFormDialog(props) {
  // Deconstruct props
  const {open, onClose, title, ...other} = props

  // Initialize state
  const [nickname, setNickname] = React.useState('')

  // Confirm button callback
  const onConfirm = () =>
  {
    onClose(true, nickname)
    setNickname('')
  }
  
  // Cancel button callback
  const onCancel = () =>
  {
    onClose(false)
    setNickname('')
  }

  // Validate input
  const regex = new RegExp('[~`!@#$%^&*()+={}\\[\\]|\\\\:;"\'<,>.?\\/]')
  const invalidEntry = (
    (!isNaN(nickname) && nickname != '') ||
    regex.test(nickname) ||
    nickname.toLowerCase().indexOf('capture_') !== -1 ||
    nickname.toLowerCase().indexOf('ses_') !== -1 ||
    nickname.toLowerCase().indexOf('at_') !== -1
  )

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm" {...other}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <TextField
          autoFocus
          fullWidth
          label='Nickname'
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          error={invalidEntry}
          variant="standard"
          helperText=
          {
            (invalidEntry) ? "Cannot be an integer. Cannot contain: SES_ , AT_ , Capture_ , or special characters."
            : "If no nickname is provided, the system will provide a default"
          }
        />
      </DialogContent>
      <ButtonGroup variant="text" fullWidth>
        <Button onClick={onCancel}>Cancel</Button>
        <Button disabled={invalidEntry} onClick={onConfirm}>Confirm</Button>
      </ButtonGroup>
    </Dialog>
  )
}
