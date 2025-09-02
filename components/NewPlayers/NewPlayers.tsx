import { Button } from '@mantine/core';
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
  return (
    <>
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
    </>
  );
}
