import React from 'react'

import localDB, { addNewSession, addNewCapture, updateSetting } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { Box, FormControl, InputLabel, Select, MenuItem, Stack, Paper, Typography } from '@mui/material'
import {
  ArrowForwardIosRounded as RightArrowIcon,
  KeyboardArrowDownRounded as DownArrowIcon
} from '@mui/icons-material'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'

import { createNewSession, getSessionList } from '../../helpers/serverHelper.js'

const readyColors = { ready: 'success.light', unready: 'warning.light' }
const readyMessage = { ready: 'Ready For Capture', unready: 'Awaiting Setup' }

export default function SessionCaptureSelect (props) {
  // Subscribe to current session and capture values
  const currentSessionField = useLiveQuery(() => localDB.settings.get('currentSessionField'))
  const currentCaptureField = useLiveQuery(() => localDB.settings.get('currentCaptureField'))

  // const serverList = useLiveQuery(() => localDB.servers.toArray())
  const sessionList = useLiveQuery(() => localDB.sessions.toArray())

  const [readyStatus, setReadyStatus] = React.useState('unready')

  // Syncronize session list when database responds
  // React.useEffect(() => {
  //   if (sessionDataList !== undefined) {
  //     const values = Object.values(sessionDataList)
  //     values.pop() // Remove Last element (The name of the array object)
  //     setSessionList(values)
  //   }
  // }, [sessionDataList])

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
      const sessionData = await addNewSession(Date.now())
      await updateSetting('currentSessionField', sessionData.id)
    } else {
      await updateSetting('currentSessionField', event.target.value)
    }

    // Clear any selected capture field
    await updateSetting('currentCaptureField', '')
  }

  // Capture dropdown callback
  const onChangeCapture = async (event) => {
    if (event.target.value === 'NEW_CAPTURE') {
      const newValue = await addNewCapture(currentSessionField?.value)
      await updateSetting('currentCaptureField', newValue)
    } else {
      await updateSetting('currentCaptureField', event.target.value)
    }
  }

  return (
    <Box {...props}>
      <Stack
        width='100%'
        direction={{ xs: 'column', lg: 'row' }}
        spacing={1}
        alignItems='center'
        sx={{ bgcolor: 'background.capture', padding: 1, paddingBottom: 0 }}
      >
        <FormControl sx={{ m: 1, minWidth: 300 }} size='small'>
          <InputLabel id="session-select-label">Session</InputLabel>
          <Select
            labelId="session-select-label"
            id="session-select"
            value={(sessionMenuItems.length > 0 && currentSessionField?.value) || ''}
            label="Session"
            onChange={onChangeSession}
          >
            <MenuItem value={'NEW_SESSION'}>Create New Session</MenuItem>
            {sessionMenuItems}
          </Select>
        </FormControl>
        <RightArrowIcon />
        <FormControl sx={{ m: 1, minWidth: 300 }} size='small'>
          <InputLabel id="capture-select-label">Capture</InputLabel>
          <Select
            labelId="capture-select-label"
            id="capture-select"
            value={(captureMenuItems.length > 0 && currentCaptureField?.value) || ''}
            label="Capture"
            onChange={onChangeCapture}
          >
            <MenuItem value={'NEW_CAPTURE'}>Create New Capture</MenuItem>
            {captureMenuItems}
          </Select>
        </FormControl>
        <RightArrowIcon />
        <Box >
          <Paper sx={{ bgcolor: readyColors[readyStatus], m: 1, minWidth: 300, height: 40 }}>
            <Typography padding='7px' align='center'>
              {readyMessage[readyStatus]}
            </Typography>
          </Paper>
        </Box>
      </Stack>
    </Box>
  )
}
