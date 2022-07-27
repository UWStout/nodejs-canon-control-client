import React from 'react'

import localDB, { updateSetting } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'
import { useSnackbar } from 'notistack'

import { subscribe } from '../../sockets/socketComms.js'

import ProgressBarBufferedLabeled from './ProgressBarBufferedLabeled.jsx'

export default function ImageDownloadBar() {

  const { enqueueSnackbar } = useSnackbar()
  
  const [currentValue, setCurrentValue] = React.useState(0)
  const [maxValue, setMaxValue] = React.useState(1)
  const [currentBuffer, setCurrentBuffer] = React.useState(0)
  const [downloadInProgress, setDownloadInProgress] = React.useState(true)

  const autoIncrementCapture = useLiveQuery(() => localDB.settings.get('autoIncrementCapture'))
  const currentCaptureNumber = useLiveQuery(() => localDB.settings.get('currentCaptureNumber'))
  
  const serverList = useLiveQuery(() => localDB.servers.toArray())

  const incrementValue = () =>
  {
    console.log('value++')
    setCurrentValue(currentValue + 1)
  }

  const incrementBuffer = () =>
  {
    console.log('buffer++')
    setCurrentBuffer(currentBuffer + 1)
  }

  
  React.useEffect(() => {
    if (Array.isArray(serverList)) {
      serverList.forEach(server => {
        // Skip deactivated servers
        if (server.deactivated) return 
        subscribe('DownloadStart', incrementBuffer, server.hostname, server.port)
        subscribe('DownloadEnd', incrementValue, server.hostname, server.port)
      })
    }
  })


  if (downloadInProgress && currentValue === maxValue)
  {
    enqueueSnackbar('Image Download Completed', { variant: 'success' })
    setDownloadInProgress(false)
    if (autoIncrementCapture)
    {
      updateSetting('currentCaptureNumber', currentCaptureNumber + 1)
    }
  }

  return (
    <ProgressBarBufferedLabeled 
      currentValue={currentValue}
      maxValue={maxValue}
      currentBuffer={currentBuffer}
      label="Downloading Images:"
      hidden={!downloadInProgress}
    />
  )
}