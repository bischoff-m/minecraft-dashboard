'use client';

import { createTheme } from '@mantine/core';

export const theme = createTheme({
  components: {
    Title: {
      styles: {
        root: {
          fontFamily: 'Poppins, sans-serif',
          textTransform: 'uppercase',
        },
      },
    },
  },
});
