import { IconTrash } from '@tabler/icons-react';
import { ActionIcon, Stack } from '@mantine/core';
import type { WhitelistEntry } from '@/app/api/whitelist/route';
import { PlayerCard } from '../PlayerCard';

function CardWrapper(props: {
  entry: WhitelistEntry;
  isOnline: 'yes' | 'no' | 'hide';
  removeFromWhitelist: (uuid: string) => void;
}) {
  return (
    <PlayerCard key={props.entry.uuid} entry={props.entry} isOnline={props.isOnline}>
      <ActionIcon
        variant="subtle"
        aria-label="Settings"
        onClick={() => props.removeFromWhitelist(props.entry.uuid)}
      >
        <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
      </ActionIcon>
    </PlayerCard>
  );
}

export function PlayersList(props: {
  players: string[];
  whitelist: WhitelistEntry[];
  removeFromWhitelist: (uuid: string) => void;
}) {
  const whitelist = props.whitelist.sort((a, b) => a.name.localeCompare(b.name));
  if (whitelist.length === 0) {
    return;
  }

  const playersOnline = props.whitelist.filter((entry) =>
    props.players.some((player) => player.toLowerCase() === entry.name.toLowerCase())
  );
  const playersOffline = props.whitelist.filter((entry) => !playersOnline.includes(entry));

  return (
    <Stack gap="xs">
      {[
        playersOnline.map((entry) => (
          <CardWrapper
            key={entry.uuid}
            entry={entry}
            isOnline="yes"
            removeFromWhitelist={props.removeFromWhitelist}
          />
        )),
        playersOffline.map((entry) => (
          <CardWrapper
            key={entry.uuid}
            entry={entry}
            isOnline="no"
            removeFromWhitelist={props.removeFromWhitelist}
          />
        )),
      ]}
    </Stack>
  );
}
