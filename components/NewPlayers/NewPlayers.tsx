import { Button, Stack, Text } from '@mantine/core';
import { WhitelistEntry } from '@/app/api/whitelist/route';
import { PlayerCard } from '../PlayerCard';

export function NewPlayers(props: {
  uuids: WhitelistEntry[];
  whitelist: WhitelistEntry[];
  addToWhitelist: (entry: WhitelistEntry) => void;
}) {
  const newPlayers = props.uuids
    .filter((entry) => !props.whitelist.some((w) => w.uuid === entry.uuid))
    .slice(0, 5);
  if (newPlayers.length === 0) {
    return;
  }
  return (
    <Stack gap="xs">
      {newPlayers.map((entry, i) => {
        return (
          <PlayerCard key={i} entry={entry} isOnline="hide">
            <Button
              size="xs"
              onClick={() => props.addToWhitelist(entry)}
              disabled={entry.name === 'MCScans'}
            >
              Add to whitelist
            </Button>
          </PlayerCard>
        );
      })}
      <Text c="dimmed" size="sm" ta="center" pt={16}>
        Join the server without being whitelisted and refresh the page.
      </Text>
    </Stack>
  );
}
