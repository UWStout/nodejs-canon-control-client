import { createTheme } from '@mui/material'

const defaultTheme = createTheme()
const C4_THEME = createTheme(defaultTheme, {
  palette: {
    // Some custom colors for view backgrounds
    background: {
      capture: '#DDEFFD',
      cameraList: '#EAEFCC',
      testing: '#F4C5BD'
    },

    // A grayscale button theme
    monochrome: {
      main: '#e0e0e0',
      light: '#FFFFFF',
      dark: '#9e9e9e',
      contrastText: '#424242'
    }
  },

  // Component styling overrides
  components: {
    // Name of the component
    MuiListSubheader: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          color: defaultTheme.palette.getContrastText(
            '#7C8C2C'
          ),
          backgroundColor: '#7C8C2C'
        }
      }
    }
  }
})

export default C4_THEME
