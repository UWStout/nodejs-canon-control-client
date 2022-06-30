import { createTheme } from '@mui/material'

const defaultTheme = createTheme()
const C4_THEME = createTheme(defaultTheme, {
  components: {
    // Name of the component
    MuiListSubheader: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          color: defaultTheme.palette.getContrastText(
            defaultTheme.palette.primary.main
          ),
          backgroundColor: defaultTheme.palette.primary.main
        }
      }
    }
  }
})

export default C4_THEME
