import React from 'react'

import localDB, { updateSetting } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { Box, FormControl, InputLabel, Select, MenuItem , Stack, Paper, Typography} from '@mui/material'
import {
  ArrowForwardIosRounded as RightArrowIcon,
  KeyboardArrowDownRounded as DownArrowIcon
} from '@mui/icons-material'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

import { createNewSession, getSessionList } from '../../helpers/serverHelper.js'

export default function SessionCaptureSelect (props) {
  // Subscribe to persistent settings
  const currentSessionField = useLiveQuery(() => localDB.settings.get('currentSessionField'))
  const currentCaptureField = useLiveQuery(() => localDB.settings.get('currentCaptureField'))
  const serverList = useLiveQuery(() => localDB.servers.toArray())
  const sessionDataList = useLiveQuery(() => localDB.settings.get('sessionDataList'))
  
  const [sessionList, setSessionList] = React.useState([])
  const [readyStatus, setReadyStatus] = React.useState("unready")

  // Syncronize session list when database responds
  React.useEffect(() => {
    if (sessionDataList != undefined)
    {
      const values = Object.values(sessionDataList)
      values.pop() // Remove Last element (The name of the array object)
      setSessionList(values)
    }
  }, [sessionDataList])

  const readyColors = { ready: 'success.light', unready: 'warning.light' }
  const readyMessage = { ready: 'Ready For Capture', unready: 'Awaiting Setup'}

  function numStrLeadZeros (num, digits) {
    let numStr = ''
    for (let i = num.toString().length; i < digits; ++i) {
      numStr += '0'
    }
    return numStr + num
  }

  const createNewSessionInDB = (time, nickname = '') => {
    nickname = nickname || time
    const date = new Date(parseInt(time))
    const path = `SES_${nickname || time}_AT_${numStrLeadZeros(date.getHours(), 2)}_${numStrLeadZeros(date.getMinutes(), 2)}_${date.toDateString()}`.replaceAll(' ', '_')
    const sessionData =  {
      nickname,
      path,
      time,
      captures: []
    }
    const newList = sessionList
    newList.push(sessionData)
    updateSetting('sessionDataList', newList)
    return sessionData
  }

  const createNewCaptureInDB = (nickname = '') => {
    const newList = sessionList
    const session = newList.find(element => element.path === currentSessionField.value)
    const captureData = nickname || `capture_${numStrLeadZeros(session.captures.length + 1, 3)}`
    session.captures.push(captureData)
    updateSetting('sessionDataList', newList)
    return captureData
  }

  const getCaptureMenuItems = () => {
    const captures = sessionList.find(element => element.path === currentSessionField.value)?.captures || []
    return captures.map(capture => (<MenuItem key={capture} value={capture}>{capture}</MenuItem> ))
  }

  const sessionMenuItems = (Array.isArray(sessionList) && sessionList.length > 0) ?
    sessionList.map(session => ( <MenuItem key={session.time} value={session.path}>{session.nickname}</MenuItem> )) : []

  const captureMenuItems = getCaptureMenuItems()

  const onChangeSession = (event) => {
    if (event.target.value === 'NEW_SESSION')
    {
      const sessionData = createNewSessionInDB(Date.now())  
      updateSetting('currentSessionField', sessionData.path)
    }
    else
    {
      updateSetting('currentSessionField', event.target.value)
    }
    updateSetting('currentCaptureField', 'EMPTY')
  }

  const onChangeCapture = (event) => {
    const newValue = (event.target.value === 'NEW_CAPTURE') ? createNewCaptureInDB() : event.target.value
    updateSetting('currentCaptureField', newValue)
  }

  return (
    <Box {...props}>
      <Stack
        width='100%'
        direction={{xs: 'column', lg: 'row'}}
        spacing={1}
        alignItems='center'
        sx={{ bgcolor: 'background.capture', padding: 1, paddingBottom: 0 }}
      >
        <FormControl sx={{ m: 1, minWidth: 300 }} size='small'>
          <InputLabel id="session-select-label">Session</InputLabel>
          <Select
            labelId="session-select-label"
            id="session-select"
            value={currentSessionField?.value || 'id'}
            label="Session"
            onChange={(e) => onChangeSession(e)}
          >
            <MenuItem value={'NEW_SESSION'}>Create New Session</MenuItem>
            {sessionMenuItems}
          </Select>
        </FormControl>
        <RightArrowIcon/>
        <FormControl sx={{ m: 1, minWidth: 300 }} size='small'>
          <InputLabel id="capture-select-label">Capture</InputLabel>
          <Select
            labelId="capture-select-label"
            id="capture-select"
            value={currentCaptureField?.value || 'id'}
            label="Capture"
            onChange={(e) => onChangeCapture(e)}
          >
            <MenuItem value={'NEW_CAPTURE'}>Create New Capture</MenuItem>
            {captureMenuItems}
          </Select>
          </FormControl>
          <RightArrowIcon/>
          <Box >
            <Paper sx={{ bgcolor: readyColors[readyStatus], m: 1, minWidth: 300, height: 40}}>
              <Typography padding='7px' align='center'>
                {readyMessage[readyStatus]}
              </Typography>
            </Paper>
          </Box>
        </Stack>
    </Box>
  )
}
