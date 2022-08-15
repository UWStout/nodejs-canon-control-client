import React from 'react'

import localDB from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'
import useTriggerTaskState from '../../state/useTriggerTaskState.js'

import { FormControl, InputLabel, Select, MenuItem, Button, Divider, Stack, Typography } from '@mui/material'

import { getTriggerBoxList, releaseTriggerBox, focusTriggerBox, primeTriggerBox, firePrimedTriggerBox, flushPrimedTriggerBox } from '../../helpers/serverHelper.js'

export default function TriggerControl () {
  // Subscribe to changes to servers and cameras
  const serverList = useLiveQuery(() => localDB.servers.toArray(), [], [])

  // Subscribe to global trigger task state
  const triggerTask = useTriggerTaskState(state => state)

  // Initialize states
  const [disableButtons, setDisableButtons] = React.useState(false)
  const [selectedTrigger, setSelectedTrigger] = React.useState('NONE')
  const [triggerList, setTriggerList] = React.useState([])
  const [statusString, setStatusString] = React.useState('---')
  const [primed, setPrimed] = React.useState(false)

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

  const fullRelease = async () => {
    // Determine server and index
    const trigger = triggerList.find(trigger => trigger.label === selectedTrigger)
    if (trigger) {
      // Start new task
      triggerTask.startTriggerTask(trigger.server.id, trigger.boxIndex, 'Take a photo')

      // send release command
      await releaseTriggerBox(trigger.server, trigger.boxIndex)
    }
  }

  const focus = async () => {
    // Determine server and index
    const trigger = triggerList.find(trigger => trigger.label === selectedTrigger)
    if (trigger) {
      // Start new task
      triggerTask.startTriggerTask(trigger.server.id, trigger.boxIndex, 'Focus')

      // send release command
      await focusTriggerBox(trigger.server, trigger.boxIndex)
    }
  }

  const prime = async () => {
    // Determine server and index
    const trigger = triggerList.find(trigger => trigger.label === selectedTrigger)
    if (trigger) {
      // Start new task
      triggerTask.startTriggerTask(trigger.server.id, trigger.boxIndex, 'Prime')

      // send release command
      await primeTriggerBox(trigger.server, trigger.boxIndex)
    }
  }

  const fire = async () => {
    // Determine server and index
    const trigger = triggerList.find(trigger => trigger.label === selectedTrigger)
    if (trigger) {
      // send release command
      await firePrimedTriggerBox(trigger.server)
    }
  }

  const flush = async () => {
    // Determine server and index
    const trigger = triggerList.find(trigger => trigger.label === selectedTrigger)
    if (trigger) {
      // send release command
      await flushPrimedTriggerBox(trigger.server)
    }
  }

  React.useEffect(() => {
    refreshList()
  }, [refreshList])

  // Determine current status
  React.useEffect(() => {
    switch (triggerTask.currentState) {
      // Taking photo / Priming
      case 'release:starting': case 'prime:starting':
        setStatusString('Starting')
        break
      case 'release:connecting': case 'prime:connecting':
        setStatusString('Connecting')
        break
      case 'release:configuring': case 'prime:configuring':
        setStatusString('Configuring')
        break
      case 'release:focusing': case 'prime:focusing':
        setStatusString('Focusing')
        break

      // Primed state
      case 'prime:complete': case 'fire:complete':
        setPrimed(true)
        break

      // Unprimed release
      case 'release:firing':
        setStatusString('Releasing')
        break

      // Cleanup/Flush
      case 'flush:cleanup': case 'release:cleanup':
        setPrimed(false)
        setStatusString('Cleanup')
        break

      // Errors
      case 'prime:error': case 'fire:error': case 'flush:error': case 'release:error':
        setPrimed(false)
        setStatusString('Error')
        break
    }
  }, [triggerTask.currentState])

  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
      <FormControl fullWidth sx={{ m: 1 }} size='small'>
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
      <Typography variant="body1" sx={{ minWidth: '150px' }}>
        {
          (selectedTrigger === 'NONE'
            ? '---'
            : (triggerTask.triggerActive
                ? statusString
                : (primed ? 'Primed' : 'Waiting'))
                )
        }
      </Typography>
      <Button variant='contained' onClick={fullRelease} disabled={primed || selectedTrigger === 'NONE' || disableButtons}>
        {'Photo'}
      </Button>
      <Button variant='contained' onClick={focus} disabled={primed || selectedTrigger === 'NONE' || disableButtons}>
        {'Focus'}
      </Button>
      <Divider orientation="vertical" flexItem />
      <Button variant='contained' onClick={primed ? flush : prime} disabled={selectedTrigger === 'NONE' || disableButtons} sx={{ minWidth: '100px' }}>
        {primed ? 'Unprime' : 'Prime'}
      </Button>
      <Button variant='contained' onClick={fire} disabled={!primed || selectedTrigger === 'NONE' || disableButtons}>
        {'Fire'}
      </Button>
      <Divider orientation="vertical" flexItem />
      <Button variant='contained' onClick={refreshList} disabled={disableButtons} sx={{ minWidth: '150px' }}>
        {'Refresh List'}
      </Button>
    </Stack>
  )
}
