import React from 'react'

/**
 * Remove leading categories and names from an EDSDK property value.
 * @param {string|any} propertyValue EDSDK property value to be trimmed.
 *                                   Non-string values are returned unmodified.
 * @returns {string|any} The propertyValue with any leading names
 *                       removed or unchnaged if it is not a string.
 */
export function trimProp (propertyValue) {
  if (typeof propertyValue !== 'string') {
    return propertyValue
  }

  const index = propertyValue.lastIndexOf('.')
  if (index >= 0) {
    return propertyValue.substring(index + 1)
  }
  return propertyValue
}

/**
 * Simple hook that will help trace why a component is re-rendering. Will
 * log what props changed for that component.
 * @param {any} props Props of the component to trace
 */
export function useTraceUpdate (props) {
  const prev = React.useRef(props)
  React.useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v]
      }
      return ps
    }, {})
    if (Object.keys(changedProps).length > 0) {
      console.log('Changed props:', changedProps)
    }
    prev.current = props
  })
}
