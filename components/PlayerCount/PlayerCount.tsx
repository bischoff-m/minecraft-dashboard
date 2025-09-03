import { Stack, Text } from '@mantine/core';
import classes from './PlayerCount.module.css';

export function PlayerCount(props: { count: number }) {
  return (
    <Stack className={classes.container} gap={0}>
      <Text ta="center" fw={600} fz={90} ff="monospace" lh={1.4}>
        {props.count}
      </Text>
      <Text ta="center" size="sm" ff="monospace">
        Players Online
      </Text>
    </Stack>
  );
}
