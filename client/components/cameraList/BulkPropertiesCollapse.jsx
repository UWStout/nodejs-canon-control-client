import React from 'react'

import localDB from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { Collapse } from '@mui/material'
import BulkPropertiesItem from './BulkPropertiesItem.jsx'

export default function BulkPropertiesCollapse () {
  // Subscribe to bulk mode changes
  const bulkModeEnabled = useLiveQuery(() => localDB.settings.get('bulkModeEnabled'))

  return (
    <Collapse in={bulkModeEnabled?.value} timeout="auto" unmountOnExit>
      <BulkPropertiesItem />
    </Collapse>
  )
}
