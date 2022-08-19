import * as React from 'react'
import PropTypes from 'prop-types'

import { Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { timeString } from '../../helpers/utility.js'
import { getLiveViewTimeoutOnServer, setLiveViewTimeoutOnServer } from '../../helpers/serverHelper.js'
import useSocketState from '../../state/useSocketState.js'
import { ServerObjShape } from '../../state/dataModel.js'

// Default options for timeout
// [Never, 5s, 1m, 2m, 3m, 5m, 10m, 15m, 30m, 1h]
const DEFAULT_TIMEOUT_OPTIONS = [
  0,
  5000,
  60000,
  120000,
  180000,
  300000,
  600000,
  900000,
  1800000,
  3600000
]
export default function LiveViewTimoutSelect (props) {
  const { serverList } = props

  // Subscribe to live view server selection
  const { selectedServer } = useSocketState(state => ({
    selectedServer: state.liveViewServerSelection
  }))

  // Select box state
  const [LVTimeoutOptions, setLVTimeoutOptions] = React.useState(DEFAULT_TIMEOUT_OPTIONS)
  const [selectValue, setSelectValue] = React.useState('')

  // Fetch server's live view timeout setting whenever server changes
  React.useEffect(() => {
    async function fetchLVTimeout () {
      // Find currently selected server
      const server = serverList.find(server => server.id === selectedServer)
      if (server !== undefined) {
        const result = await getLiveViewTimeoutOnServer(server)
        // If server's current Live View Selection isn't a default option, add it
        if (!LVTimeoutOptions.includes(parseInt(result.timeout))) {
          setLVTimeoutOptions(LVTimeoutOptions => [...LVTimeoutOptions, result.timeout])
        }

        // Update selected timeout to server's timeout
        setSelectValue(result.timeout)
      }
    }

    fetchLVTimeout()
  }, [serverList, selectedServer]) // TODO: Need to reconsider dependency list

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
    <FormControl sx={{ minWidth: '160px' }}>
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

LiveViewTimoutSelect.propTypes = {
  serverList: PropTypes.arrayOf(ServerObjShape).isRequired
}
