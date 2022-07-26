import React from 'react'

import localDB, { addNewSession, addNewCapture, updateSetting } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { FormControl, InputLabel, Select, MenuItem, Paper, Typography, Grid, Divider } from '@mui/material'
import { ArrowForwardIosRounded as RightArrowIcon } from '@mui/icons-material'

import NicknameFormDialog from './NicknameFormDialog.jsx'

import { createNewSession, getSessionList } from '../../helpers/serverHelper.js'

const readyColors = { ready: 'success.light', unready: 'warning.light' }
const readyMessage = { ready: 'Ready For Capture', unready: 'Awaiting Setup' }

export default function SessionCaptureSelect (props) {
  // Subscribe to current session and capture values
  const currentSessionField = useLiveQuery(() => localDB.settings.get('currentSessionField'))
  const currentCaptureField = useLiveQuery(() => localDB.settings.get('currentCaptureField'))

  const sessionList = useLiveQuery(() => localDB.sessions.toArray())

  // Initialize states
  const [readyStatus, setReadyStatus] = React.useState('unready')
  const [showCreateSession, setShowCreateSession] = React.useState(false)
  const [showCreateCapture, setShowCreateCapture] = React.useState(false)

  // Close session dialog, create new session, and set form field
  const closeNewSession = async (confirmed, sessionNickname = '') => {
    setShowCreateSession(false)
    if (confirmed) {
      const sessionData = await addNewSession(Date.now(), sessionNickname)
      await updateSetting('currentSessionField', sessionData.id)
    }
  }

  // Close capture dialog, create new capture, and set form field
  const closeNewCapture = async (confirmed, captureNickname = '') => {
    setShowCreateCapture(false)
    if (confirmed) {
      const newCapture = await addNewCapture(currentSessionField?.value, captureNickname)
      await updateSetting('currentCaptureField', newCapture)
    }
  }

  // Build capture menu items
  const captures = sessionList?.find(element => element.id === currentSessionField?.value)?.captures || []
  const captureMenuItems = captures.map(capture => (
    <MenuItem key={capture} value={capture}>{capture}</MenuItem>
  ))

  // Build session menu items
  const sessionMenuItems = (Array.isArray(sessionList)
    ? sessionList.map(session => (
      <MenuItem key={session.id} value={session.id}>{session.nickname}</MenuItem>
    ))
    : []
  )

  // Session dropdown callback
  const onChangeSession = async (event) => {
    // Is this a new session or an exiting session
    if (event.target.value === 'NEW_SESSION') {
      setShowCreateSession(true)
    } else {
      await updateSetting('currentSessionField', event.target.value)
    }

    // Clear any selected capture field
    await updateSetting('currentCaptureField', '')
  }

  // Capture dropdown callback
  const onChangeCapture = async (event) => {
    if (event.target.value === 'NEW_CAPTURE') {
      setShowCreateCapture(true)
    } else {
      await updateSetting('currentCaptureField', event.target.value)
    }
  }

  return (
    <React.Fragment>
      <Grid
        container
        alignItems='center'
        justifyContent='space-around'
      >
        <Grid item xs={11} sm={5} md={3}>
          <FormControl fullWidth sx={{ m: 1 }} size='small'>
            <InputLabel id="session-select-label">Session</InputLabel>
            <Select
              labelId="session-select-label"
              id="session-select"
              value={(sessionMenuItems.length > 0 && currentSessionField?.value) || ''}
              label="Session"
              onChange={onChangeSession}
            >
              <MenuItem value={'NEW_SESSION'}>Create New Session</MenuItem>
              <Divider />
              {sessionMenuItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <RightArrowIcon sx={{ textAlign: 'center', width: '100%' }} />
        </Grid>
        <Grid item xs={11} sm={5} md={3}>
          <FormControl fullWidth sx={{ m: 1 }} size='small'>
            <InputLabel id="capture-select-label">Capture</InputLabel>
            <Select
              labelId="capture-select-label"
              id="capture-select"
              value={(captureMenuItems.length > 0 && currentCaptureField?.value) || ''}
              label="Capture"
              onChange={onChangeCapture}
            >
              <MenuItem value={'NEW_CAPTURE'}>Create New Capture</MenuItem>
              <Divider />
              {captureMenuItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <RightArrowIcon sx={{ textAlign: 'center', width: '100%' }} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ bgcolor: readyColors[readyStatus], m: 1, height: 40 }}>
            <Typography padding='7px' align='center'>
              {readyMessage[readyStatus]}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <NicknameFormDialog title="Create New Session" open={showCreateSession} onClose={closeNewSession} />
      <NicknameFormDialog title="Create new Capture" open={showCreateCapture} onClose={closeNewCapture} />
    </React.Fragment>
  )
}
