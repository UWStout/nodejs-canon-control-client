/**
 * Draw an image into a canvas element
 * @param {HTMLCanvasElement} canvas A canvas image element
 * @param {string} imageData Base64 encoded JPEG image data
 * @param {number} rotation Rotation value in 90 deg units
 * @param {boolean} clear Should we clear the canvas first
 */
export function drawImageToCanvas (canvas, imageData, rotation, clear = false) {
  const img = new Image()
  img.src = 'data:image/jpeg;base64,' + imageData
  img.onload = () => {
    // Determine image dims with rotation
    const imgDims = { width: img.width, height: img.height }
    if (Math.abs(rotation) === 1) {
      imgDims.width = img.height
      imgDims.height = img.width
    }

    // Resize canvas
    if (canvas.width !== imgDims.width) {
      canvas.width = imgDims.width
      canvas.height = imgDims.height
    }

    // Clear the canvas context
    const ctx = canvas.getContext('2d')
    ctx.resetTransform()
    if (clear) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    // Setup the rotation transform
    ctx.translate(imgDims.width / 2, imgDims.height / 2)
    ctx.rotate(rotation * Math.PI / 2)
    ctx.translate(-img.width / 2, -img.height / 2)

    // Draw the image
    ctx.drawImage(img, 0, 0, img.width, img.height)
  }

  img.onerror = (error) => {
    console.error('Error drawing image:', error)
  }

  drawCenterTargetToCanvas(canvas, 50, 1)
}

/**
 * Draw a central target into a canvas element
 * @param {HTMLCanvasElement} canvas A canvas image element
 * @param {number} radius Radius of the target circle
 * @param {number} lineWidth Thickness of the line width
 * @param {boolean} clear Should we clear the canvas first
 */
export function drawCenterTargetToCanvas (canvas, radius, lineWidth, clear = false) {
  // Clear the canvas context
  const ctx = canvas.getContext('2d')
  ctx.resetTransform()
  if (clear) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  // Move to center
  ctx.translate(canvas.width / 2, canvas.height / 2)

  // Set the line stroke style
  ctx.strokeStyle = 'black'
  ctx.lineWidth = lineWidth

  // Draw a circle
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, Math.PI * 2)
  ctx.stroke()

  // Draew a cross hair
  ctx.beginPath()
  ctx.moveTo(-radius, 0)
  ctx.lineTo(radius, 0)
  ctx.moveTo(0, -radius)
  ctx.lineTo(0, radius)
  ctx.stroke()
}
