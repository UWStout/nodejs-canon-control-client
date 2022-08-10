import React from 'react'

import localDB from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'
import useTriggerTaskState from '../../state/useTriggerTaskState.js'

import { FormControl, InputLabel, Select, MenuItem, Button, Divider, Stack, Typography } from '@mui/material'

import { getTriggerBoxList, releaseTriggerBox } from '../../helpers/serverHelper.js'

export default function TriggerControl () {
  // Subscribe to changes to servers and cameras
  const serverList = useLiveQuery(() => localDB.servers.toArray(), [], [])

  // Subscribe to global trigger task state
  const triggerTask = useTriggerTaskState(state => state)

  // Initialize states
  const [disableButtons, setDisableButtons] = React.useState(false)
  const [selectedTrigger, setSelectedTrigger] = React.useState('NONE')
  const [triggerList, setTriggerList] = React.useState([])

  React.useEffect(() => {
    setDisableButtons(triggerTask.triggerActive)
  }, [triggerTask.triggerActive])

  const onChangeTrigger = (event) => {
    setSelectedTrigger(event.target.value)
  }

  const refreshList = React.useCallback(async () => {
    let newBoxes = []
    if (Array.isArray(serverList)) {
      for (let i = 0; i < serverList.length; i++) {
        const server = serverList[i]
        const boxes = await getTriggerBoxList(server)
        newBoxes = [...newBoxes, ...boxes.map((box, i) => ({
          label: `${server.nickname}: ${box}`,
          server,
          boxIndex: i
        }))]
      }

      console.log(newBoxes)
      setTriggerList(newBoxes)
    }
  }, [serverList])

  const fireTrigger = async () => {
    // Determine server and index
    const trigger = triggerList.find(trigger => trigger.label === selectedTrigger)
    if (trigger) {
      // Start new task
      triggerTask.startTriggerTask(trigger.server.id, trigger.boxIndex)

      // send release command
      await releaseTriggerBox(trigger.server, trigger.boxIndex)
    }
  }

  React.useEffect(() => {
    refreshList()
  }, [refreshList])

  // Determine current status
  let statusString = 'Select a box'
  if (selectedTrigger !== 'NONE') {
    if (!triggerTask.triggerActive) {
      statusString = 'Ready'
    } else {
      switch (triggerTask.currentState) {
        case 'release:starting': statusString = 'Starting'; break
        case 'release:connecting': statusString = 'Connecting to box'; break
        case 'release:configuring': statusString = 'Configuring box'; break
        case 'release:focusing': statusString = 'Focusing cameras'; break
        case 'release:firing': statusString = 'Releasing Shutter'; break
        case 'release:cleanup': statusString = 'Cleanup'; break
        default: statusString = 'Unknown/Error'; break
      }
    }
  }

  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
      <FormControl fullWidth sx={{ m: 1, flexGrow: 0.5 }} size='small'>
        <InputLabel id="trigger-select-label">Trigger Box</InputLabel>
        <Select
          labelId="trigger-select-label"
          id="trigger-select"
          value={(triggerList.length > 0 && selectedTrigger) || ''}
          label="Trigger Box"
          onChange={onChangeTrigger}
        >
          <MenuItem value={'NONE'}>Select a Trigger Box</MenuItem>
          <Divider />
          {triggerList.map((trigger, i) => (
            <MenuItem key={i} value={trigger.label}>{trigger.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="body1" sx={{ minWidth: '300px' }}>{`Status: ${statusString}`}</Typography>
      <Button variant='contained' onClick={fireTrigger} disabled={selectedTrigger === 'NONE' || disableButtons}>
        {'Fire'}
      </Button>
      <Button variant='contained' onClick={refreshList} disabled={disableButtons} sx={{ minWidth: '200px' }}>
        {'Refresh List'}
      </Button>
    </Stack>
  )
}
