import React from 'react'

import localDB from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { ensureCaptureOnServer, ensureSessionOnServer, setCaptureOnServer } from '../../helpers/serverHelper.js'
import { useSnackbar } from 'notistack'

export function useServerCaptureSession (currentSession, currentCapture, captureNumber) {
  const [readyStatus, setReadyStatus] = React.useState('unready')
  const serverList = useLiveQuery(() => localDB.servers.toArray())
  const { enqueueSnackbar } = useSnackbar()

  React.useEffect(() => {
    const setupServerSessions = async () => {
      let errorOccured = false
      for (let i = 0; i < serverList.length; i++) {
        const server = serverList[i]
        try {
          await ensureSessionOnServer(
            server, currentSession.nickname, currentSession.path, currentSession.time, true
          )

          await ensureCaptureOnServer(
            server, currentSession.path, currentCapture, captureNumber, true
          )

          await setCaptureOnServer(
            server, currentSession.path, currentCapture, captureNumber
          )
        } catch (error) {
          errorOccured = true
          enqueueSnackbar(`${server.nickname} failed to set capture folder`, { variant: 'error' })
        }
      }
      if (!errorOccured) {
        enqueueSnackbar('Capture folder set on servers', { variant: 'success' })
        setReadyStatus('ready')
      } else {
        setReadyStatus('unready')
      }
    }

    if (Array.isArray(serverList) && currentSession && typeof currentCapture === 'string' &&
        currentCapture !== '' && currentCapture !== 'NEW_CAPTURE') {
      setupServerSessions()
    } else {
      setReadyStatus('unready')
    }
  }, [captureNumber, currentCapture, currentSession, enqueueSnackbar, serverList])

  return readyStatus
}
