'use client';

import { useEffect, useState } from 'react';
import { Container, Grid, Loader, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { DashboardCard } from '@/components/DashboardCard/DashboardCard';
import { NewPlayers } from '@/components/NewPlayers';
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
  const [envVars, setEnvVars] = useState<Record<string, string | undefined> | null>(null);

  // Fetch players and uuidMessages (initial load)
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/log-history').then((res) => res.json()),
      fetch('/api/whitelist').then((res) => res.json()),
      fetch('/api/env').then((res) => res.json()),
    ])
      .then(([logs, whitelistData, envData]) => {
        setWhitelist(whitelistData || []);
        setLogState(parseState(logs as LogMessage[]));
        setEnvVars(envData || {});
      })
      .catch(() => {
        notifications.show({
          title: 'Error',
          message: 'Failed to fetch data',
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

      <Container>
        <DashboardTitle />
        <DashboardCard title="Environment Variables">
          <pre style={{ maxHeight: 200, overflow: 'auto', fontSize: 12 }}>
            {envVars ? JSON.stringify(envVars, null, 2) : 'Loading...'}
          </pre>
        </DashboardCard>
        {loading ? (
          <div style={{ textAlign: 'center', margin: '60px 0' }}>
            <Loader />
          </div>
        ) : (
          <>
            <Text fz="h2" fw={600} ta="center" mb="md">
              {logState.players.length} Players Online
            </Text>
            <Grid>
              <Grid.Col span={6}>
                <DashboardCard title="Whitelist">
                  <PlayersList
                    players={logState.players}
                    whitelist={whitelist}
                    removeFromWhitelist={setUuidToRemove}
                  />
                </DashboardCard>
              </Grid.Col>
              <Grid.Col span={6}>
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
