import React from 'react'

import localDB from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { FormControl, InputLabel, Select, MenuItem, Button, Grid, Divider } from '@mui/material'

import { getTriggerBoxList, releaseTriggerBox } from '../../helpers/serverHelper.js'

export default function TriggerControl () {
  // Subscribe to changes to servers and cameras
  const serverList = useLiveQuery(() => localDB.servers.toArray(), [], [])

  // Initialize states
  const [selectedTrigger, setSelectedTrigger] = React.useState('NONE')
  const [triggerList, setTriggerList] = React.useState([])

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
      // send release command
      await releaseTriggerBox(trigger.server, trigger.boxIndex)
    }
  }

  React.useEffect(() => {
    refreshList()
  }, [refreshList])

  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid item xs={7}>
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
      </Grid>
      <Grid item xs={2}>
        <Button variant='contained' onClick={fireTrigger} disabled={selectedTrigger === 'NONE'}>
          {'Fire'}
        </Button>
      </Grid>
      <Grid item xs={3}>
        <Button variant='contained' onClick={refreshList}>
          {'Refresh List'}
        </Button>
      </Grid>
    </Grid>
  )
}
