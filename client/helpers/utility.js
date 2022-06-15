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
