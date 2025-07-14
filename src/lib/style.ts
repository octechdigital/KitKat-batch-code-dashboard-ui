import { createTheme } from "@mui/material";

export const muiTheme = createTheme({
  typography: {
    fontFamily: "Inter",
    fontSize: 15,
  },
  palette: {
    primary: {
      main: "#1537E2",
      contrastText: "#fff",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "Inter",
          textTransform: "capitalize",
          display: "flex",
          height: "40px",
          padding: "8px 16px",
          borderRadius: ".5rem",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height: "50px",
          fontSize: "14px",
        },
        // input: {
        //   padding: "10px 14px",
        // },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: "50px",
          fontSize: "14px",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "14px",
        },
      },
    },
  },
});
