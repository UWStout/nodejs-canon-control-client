import * as React from 'react'
import { useSnackbar } from 'notistack'
import { pingServer } from '../../helpers/serverHelper'

export default function ServerStatusVerifier(props) {
  const { serverList } = props
  
  // Snackbar hooks
  const { enqueueSnackbar } = useSnackbar()

  React.useEffect(() => {
    async function checkServerStatus()
    {
      if (Array.isArray(serverList))
      {
        serverList.forEach(async server => {
          if (!server.deactivated)
          {
            const result = await pingServer(server)
            console.log("result")
            console.log(result)
            if (result.pong)
            {
              enqueueSnackbar(`Ping ${server.nickname}: Pong!` , { variant: 'success' })
            } else {
              enqueueSnackbar(`Unable to ping ${server.nickname} - ${result.message}`, { variant: 'error' })
            }
          }
        })
      }
    }
    checkServerStatus()
  }, [serverList])

  return (
    <></>
  )
}
