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

  cursorPointer: {
    cursor: "pointer",
  },
}));
