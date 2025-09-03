'use client';

import { useEffect, useState } from 'react';
import { Container, Grid, Loader } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { DashboardCard } from '@/components/DashboardCard/DashboardCard';
import { NewPlayers } from '@/components/NewPlayers';
import { PlayerCount } from '@/components/PlayerCount/PlayerCount';
import { RemovePlayerModal } from '@/components/RemovePlayerModal/RemovePlayerModal';
import { LogMessage } from '@/lib/log-parse';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { DashboardTitle } from '../components/DashboardTitle/DashboardTitle';
import { PlayersList } from '../components/PlayersList/PlayersList';
import type { WhitelistEntry } from './api/whitelist/route';

type LogState = {
  players: string[];
  uuids: WhitelistEntry[];
};

function parseState(logMessages: LogMessage[]): LogState {
  const online = new Set<string>();
  const uuids: WhitelistEntry[] = [];
  for (const log of logMessages) {
    const uuidMatch = log.message.match(/UUID of player (.*?) is (.*)/);
    if (uuidMatch) {
      const [, player, uuid] = uuidMatch;
      if (!uuids.some((entry) => entry.uuid === uuid)) {
        uuids.push({ name: player, uuid });
      }
    }
    const joinMatch = log.message.match(/^(.*?) joined the game/);
    if (joinMatch) {
      online.add(joinMatch[1]);
    }
    const leftMatch = log.message.match(/^(.*?) left the game/);
    if (leftMatch) {
      online.delete(leftMatch[1]);
    }
  }
  return { players: Array.from(online), uuids };
}

export default function HomePage() {
  const [logState, setLogState] = useState<LogState>({ players: [], uuids: [] });
  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>([]);
  const [uuidToRemove, setUuidToRemove] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch players and uuidMessages (initial load)
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/log-history').then((res) => res.json()),
      fetch('/api/whitelist').then((res) => res.json()),
    ])
      .then(([logs, whitelistData]) => {
        setWhitelist(whitelistData || []);
        setLogState(parseState(logs as LogMessage[]));
      })
      .catch((error) => {
        notifications.show({
          title: 'Error',
          message: `Failed to fetch data. Error: ${error.message}`,
          color: 'red',
          autoClose: false,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleAddToWhitelist(entry: WhitelistEntry) {
    try {
      const res = await fetch('/api/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (!res.ok) {
        notifications.show({
          title: 'Error',
          message: `Failed to add to whitelist. ${(await res.json()).error || ''}`,
          color: 'red',
          autoClose: false,
        });
      } else {
        setWhitelist((prev) => [...prev, entry]);
      }
    } catch (e: unknown) {
      notifications.show({
        title: 'Error',
        message: `Failed to add to whitelist. ${(e as Error).message || ''}`,
        color: 'red',
        autoClose: false,
      });
    }
  }

  async function handleRemoveFromWhitelist(uuid: string) {
    try {
      const res = await fetch('/api/whitelist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid }),
      });
      if (!res.ok) {
        notifications.show({
          title: 'Error',
          message: `Failed to remove from whitelist. ${(await res.json()).error || ''}`,
          color: 'red',
          autoClose: false,
        });
      } else {
        setWhitelist((prev) => prev.filter((item) => item.uuid !== uuid));
      }
    } catch (e) {
      notifications.show({
        title: 'Error',
        message: `Failed to remove from whitelist. ${(e as Error).message || ''}`,
        color: 'red',
        autoClose: false,
      });
    }
  }

  return (
    <>
      <RemovePlayerModal
        opened={!!uuidToRemove}
        resolve={() => {
          if (uuidToRemove) {
            handleRemoveFromWhitelist(uuidToRemove);
          }
          setUuidToRemove(null);
        }}
        reject={() => setUuidToRemove(null)}
      />

      <Container pos="absolute" top={16} right={0}>
        <ColorSchemeToggle />
      </Container>

      <Container style={{ justifyItems: 'center' }}>
        <DashboardTitle />
        {loading ? (
          <div style={{ textAlign: 'center', margin: '60px 0' }}>
            <Loader />
          </div>
        ) : (
          <>
            <PlayerCount count={logState.players.length} />
            <br />
            <Grid>
              <Grid.Col span={{ base: 12, xs: 6 }}>
                <DashboardCard title="Whitelist">
                  <PlayersList
                    players={logState.players}
                    whitelist={whitelist}
                    removeFromWhitelist={setUuidToRemove}
                  />
                </DashboardCard>
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 6 }}>
                <DashboardCard title="New Players">
                  <NewPlayers
                    uuids={logState.uuids}
                    whitelist={whitelist}
                    addToWhitelist={handleAddToWhitelist}
                  />
                </DashboardCard>
              </Grid.Col>
            </Grid>
          </>
        )}
      </Container>
    </>
  );
}
