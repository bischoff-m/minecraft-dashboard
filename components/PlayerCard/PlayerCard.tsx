import { Card, Group, Stack, Text } from '@mantine/core';
import { WhitelistEntry } from '@/pages/api/whitelist';
import classes from './PlayerCard.module.css';

export function PlayerCard(props: {
  children?: React.ReactNode;
  entry: WhitelistEntry;
  isOnline?: 'yes' | 'no' | 'hide';
}) {
  const { entry, isOnline } = props;
  return (
    <div key={entry.uuid}>
      <Card className={classes.item} shadow="sm" padding={6} px={12} radius="md">
        <Group gap={12} w="100%">
          <div
            className={
              classes.indicator +
              (isOnline !== undefined &&
                {
                  yes: ` ${classes.indicatorOnline}`,
                  no: ` ${classes.indicatorOffline}`,
                  hide: ` ${classes.indicatorHidden}`,
                }[isOnline])
            }
          />
          <Stack gap={0} flex={1}>
            <Text>{entry.name}</Text>
            <Text size="xs" c="dimmed">
              UUID: {entry.uuid}
            </Text>
          </Stack>
          {props.children}
        </Group>
      </Card>
    </div>
  );
}
