import { createStyles } from "@mantine/core";

export const useGlobalStyles = createStyles(() => ({
  link: {
    textDecoration: "none",
  },

  ellipsis: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  heartIcon: {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: 2,
    cursor: "pointer",
    stroke: "none"
  },

}));
