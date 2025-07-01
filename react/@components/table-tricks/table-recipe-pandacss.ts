import { defineRecipe } from "@pandacss/dev";

export const tableContainer = defineRecipe({
  className: "tableContainer",
  description: "Styles for the TableContainer component",
  base: {
    w: "full",
    overflow: "auto",
  },
});

export const tableRoot = defineRecipe({
  className: "table",
  description: "Styles for the Table component",
  base: {
    w: "full",
    captionSide: "bottom",
    textStyle: "sm",
  },
  variants: {
    asFlex: {
      true: {
        display: "block",
      },
    },
  },
});

export const tableHeader = defineRecipe({
  className: "tableHeader",
  description: "Styles for the TableHeader component",
  base: {
    "& tr": {
      borderBottom: "1px solid",
      borderColor: "red",
    },
    bg: "bg.muted/50",
  },
});

export const tableBody = defineRecipe({
  className: "tableBody",
  description: "Styles for the TableBody component",
  base: {
    "& tr": {
      _last: {
        borderBottom: "transparent",
      },
    },
  },
  variants: {
    asFlex: {
      true: {
        display: "flex",
        w: "full",
        flexDirection: "column",
      },
    },
  },
});

export const tableFooter = defineRecipe({
  className: "tableFooter",
  description: "Styles for the TableFooter component",
  base: {
    bg: "primary",
    fontWeight: "medium",
    color: "accent.fg",
  },
});

export const tableRow = defineRecipe({
  className: "tableRow",
  description: "Styles for the TableRow component",
  base: {
    borderBottom: "1px solid",
    borderColor: "border.muted",
    transition: "colors",

    "&:not(thead > tr):hover": {
      bg: "bg.muted/50",
    },

    "&[data-state=selected]": {
      bg: "bg.muted/100",
    },
  },
  variants: {
    expanded: {
      true: {
        "&:last-child": {
          borderBottom: "1px solid",
          borderColor: "border.muted",
        },
        bg: "bg.muted/50",
      },
    },
    asFlex: {
      true: {
        display: "flex",
      },
    },
  },
});

export const tableHead = defineRecipe({
  className: "tableHead",
  description: "Styles for the TableHead component",
  base: {
    h: "12",
    px: "4",
    textAlign: "left",
    verticalAlign: "middle",
    fontWeight: "medium",
    color: "fg.muted",

    "&:has([role=checkbox])": {
      pr: "0",
    },
  },
  variants: {
    asFlex: {
      true: {
        display: "flex",
        alignItems: "center",
        flex: "1",
        minWidth: "0",

        "&[data-state=resizable]": {
          flex: "0 0 auto",
        },
      },
    },
  },
});

export const tableCell = defineRecipe({
  className: "tableCell",
  description: "Styles for the TableCell component",
  base: {
    p: "4",
    verticalAlign: "middle",

    "&:has([role=checkbox])": {
      pr: "0",
    },
  },
  variants: {
    asFlex: {
      true: {
        display: "flex",
        alignItems: "center",
        flex: 1,
        minWidth: "0",

        "&[data-state=resizable]": {
          flex: "0 0 auto",
        },
      },
    },
  },
});

export const tableCaption = defineRecipe({
  className: "tableCaption",
  description: "Styles for the TableCaption component",
  base: {
    mt: "4",
    textStyle: "sm",
    color: "fg.muted",
  },
});
