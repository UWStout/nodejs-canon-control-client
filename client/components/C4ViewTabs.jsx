import * as React from 'react'
import PropTypes from 'prop-types'

import { Box, Tabs, Tab } from '@mui/material'

// Helper for generating proper tab a11y/aria props
function a11yProps (index) {
  return {
    id: `c4-tab-${index}`,
    'aria-controls': `c4-tabpanel-${index}`
  }
}

// Used internally only
function TabPanel (props) {
  const { children, visible, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={!visible}
      id={`c4-tabpanel-${index}`}
      aria-labelledby={`c4-tab-${index}`}
      {...other}
    >
      {visible
        ? <Box sx={{ p: 3 }}>{children}</Box>
        : null}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  visible: PropTypes.bool.isRequired
}

export default function C4ViewTabs (props) {
  const { labels, children } = props

  // State of which tab is current active
  const [tabIndex, setTabIndex] = React.useState(0)

  // Check that labels and children panels match
  const childrenArray = React.Children.toArray(children)
  if (!Array.isArray(labels) || labels.length !== childrenArray.length) {
    console.error('Tabs Error: The number of labels does not match the number of children')
    return (null)
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Create the tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={(e, index) => setTabIndex(index)} aria-label="c4 View Tabs">
          {labels.map((label, i) => (<Tab key={`c4tab-${i}`} label={label} {...a11yProps(i)} />))}
        </Tabs>
      </Box>

      {/* Create the tab panels */}
      {childrenArray.map((child, i) => (
        <TabPanel key={`c4tabpanel-${i}`} visible={tabIndex === i} index={i}>
          {child}
        </TabPanel>
      ))}
    </Box>
  )
}

C4ViewTabs.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired
}
