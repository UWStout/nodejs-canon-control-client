import * as React from 'react'
import { createSvgIcon } from '@mui/material/utils'

// SVG Path Element Styles
const circleStyle = {
  strokeLinejoin: 'round',
  stroke: '#000000',
  strokeLinecap: 'square',
  strokeWidth: 15,
  fill: 'none'
}

const crossbarStyle = {
  stroke: '#000000',
  fill: 'none',
  strokeWidth: 4
}

const endCapStyle = {
  ...crossbarStyle,
  strokeWidth: 21.672
}

const hashMarkStyle = {
  ...crossbarStyle,
  strokeWidth: 9.391
}

/**
 * SVG originally by 'noxin' published under public domain by 'OpenClipart'
 * Source: https://freesvg.org/crosshairs-vector-drawing
 * Adapted and Modified by Seth Berrier
 */
const CrosshairSVG = createSvgIcon(
  <g transform="translate(-85.743 -163.82)">
    {/* Main Circle */}
    <path
      style={circleStyle}
      d="m250 0a250 250 0 1 1 -500 0.0 250 250 0 1 1 500 0.0z"
      transform="matrix(.72239 0 0 .72239 274.29 352.36)"
      shapeRendering="geometricPrecision"
    />
    {/* Horizontal cross bar */}
    <path id="path3134" style={crossbarStyle} shapeRendering="geometricPrecision" d="m93.689 352.36h361.19" />

    {/* Horizontal cross bar end caps */}
    <path id="path5074" style={endCapStyle} shapeRendering="geometricPrecision" d="m96.578 352.36h32.282" />
    <path id="path6045" style={endCapStyle} shapeRendering="geometricPrecision" d="m419.71 352.36h32.28" />

    {/* Horizontal hash marks */}
    <path id="path6099" style={hashMarkStyle} shapeRendering="geometricPrecision" d="m151.34 363.2v-21.67" />
    <path id="path6101" style={hashMarkStyle} shapeRendering="geometricPrecision" d="m192.32 363.2v-21.67" />
    <path id="path6103" style={hashMarkStyle} shapeRendering="geometricPrecision" d="m233.3 363.2v-21.67" />
    <path id="path6105" style={hashMarkStyle} shapeRendering="geometricPrecision" d="m315.27 363.2v-21.67" />
    <path id="path6107" style={hashMarkStyle} shapeRendering="geometricPrecision" d="m356.25 363.2v-21.67" />
    <path id="path6109" style={hashMarkStyle} shapeRendering="geometricPrecision" d="m397.23 363.2v-21.67" />

    {/* Vertical cross bar */}
    <path id="path6292" style={crossbarStyle} shapeRendering="geometricPrecision" d="m274.29 171.77v361.19" />

    {/* Vertical cross bar end caps */}
    <path id="path6294" style={endCapStyle} shapeRendering="geometricPrecision" d="m274.29 174.65v32.29" />
    <path id="path6296" style={endCapStyle} shapeRendering="geometricPrecision" d="m274.29 497.79v32.28" />

    {/* Vertical hash marks */}
    <path id="path6300" style={hashMarkStyle} shapeRendering="geometricPrecision" d="m263.45 229.41h21.67" />
    <path id="path6302" style={hashMarkStyle} shapeRendering="geometricPrecision" d="m263.45 270.4h21.67" />
    <path id="path6304" style={hashMarkStyle} shapeRendering="geometricPrecision" d="m263.45 311.38h21.67" />
    <path id="path6306" style={hashMarkStyle} shapeRendering="geometricPrecision" d="m263.45 393.35h21.67" />
    <path id="path6308" style={hashMarkStyle} shapeRendering="geometricPrecision" d="m263.45 434.33h21.67" />
    <path id="path6310" style={hashMarkStyle} shapeRendering="geometricPrecision" d="m263.45 475.31h21.67" />

    {/* Central Thick Cross */}
    {/* <path id="path6116" style={hashMarkStyle} shapeRendering="geometricPrecision" d="m274.29 363.2v-21.67" /> */}
    {/* <path id="path6312" style={hashMarkStyle} shapeRendering="geometricPrecision" d="m263.45 352.36h21.67" /> */}
  </g>,
  'Crosshair'
)

export default function CrosshairIcon (props) {
  return (
    <CrosshairSVG viewBox="0 0 377.09 377.09" {...props} />
  )
}
