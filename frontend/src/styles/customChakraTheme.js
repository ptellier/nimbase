import {extendTheme} from "@chakra-ui/react";

const ALL_FONTS = "inika, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', " +
  "'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;"

const customTheme = extendTheme({
  fonts: {
    body: ALL_FONTS,
    heading: ALL_FONTS,
    mono: "Menlo, monospace",
  },
  components: {
    Button: {
      baseStyle: {
      },
      variants: {
        customDefault: {
          width: "max-content",
          padding: "10px 20px",
          border: "none",
          fontSize: "1.0rem",
          fontWeight: "medium",
          borderRadius: "2px",
          fontFamily: "inika, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', " +
            "'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
          backgroundImage: "linear-gradient(to top right, rgba(125, 47, 62, 0.51), rgba(237, 137, 157, 0.5))",
          backgroundColor:" #ffffff",
          color: "#390000",
          cursor: "pointer",
          outline: "none",
          transition: "background-color 0.1s ease-in-out",
          _hover: {
            backgroundColor: "#978383",
          },
          _active: {
            backgroundColor: "#390000",
            color: "#ffffff",
          }
        },
      },
      defaultProps: {
        variant: 'customDefault'
      }
    },
  },
});

export default customTheme;