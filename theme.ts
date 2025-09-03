'use client';

import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'orange',
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
