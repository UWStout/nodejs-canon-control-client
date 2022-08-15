import * as React from 'react'

import { Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { timeString } from '../../helpers/utility'
import { getLiveViewTimeoutOnServer, setLiveViewTimeoutOnServer } from '../../helpers/serverHelper'
import useSocketState from '../../state/useSocketState'


export default function LiveViewTimoutSelect(props) {
  const { serverList } = props

  // Subscribe to live view server selection
  const { selectedServer} = useSocketState(state => ({
    selectedServer: state.liveViewServerSelection
  }))
  
  // Default selection and options for timeout
  // Never, 5s, 1m, 2m, 3m, 5m, 10m, 15m, 30m, 1h
  const [LVTimeoutOptions, setLVTimeoutOptions] = React.useState([0, 5000, 60000, 120000, 180000, 300000, 600000, 900000, 1800000, 3600000])
  const [selectValue, setSelectValue] = React.useState('')
  
  // Fetch server's live view timeout setting whenever server changes
  React.useEffect(() => {
    async function fetchLVTimeout() {
      // Find currently selected server
      const server = serverList.find(server => server.id === selectedServer)
      if (server !== undefined)
      {
        const result = await getLiveViewTimeoutOnServer(server)
        // If server's current Live View Selection isn't a default option, add it
        if (!LVTimeoutOptions.includes(parseInt(result.timeout)))
        {
          setLVTimeoutOptions(LVTimeoutOptions => [...LVTimeoutOptions, result.timeout])
        }
        // Update selected timeout to server's timeout
        setSelectValue(result.timeout)
      }
    }
      fetchLVTimeout()
  }, [serverList, selectedServer])

  // Convert options into MenuItems for Select Component
  const LVTimeoutMenuItems = LVTimeoutOptions.map(option => (
    <MenuItem key={option} value={option}>{timeString(option)}</MenuItem>
  ))

  // Set Select to current option and update server timeout settings
  const handleChange = (event) => {
    const value = event.target.value
    setSelectValue(value)
    serverList.forEach(server => {
      setLiveViewTimeoutOnServer(server, value)
    })
  }

  return (
    <FormControl sx={{minWidth: '160px' }}>
      <InputLabel id="live-view-timeout-select">Timeout</InputLabel>
      <Select
        size="small"
        label="Timeout"
        value={selectValue}
        onChange={handleChange}
      >
        {LVTimeoutMenuItems}
      </Select>
    </FormControl>
  )
}
