'use client';

import { useEffect, useState } from 'react';
import { Alert, Card, List, Loader, Text, Title } from '@mantine/core';

type ApiPlayersResponse = {
  players: string[];
  uuidMessages: string[];
};

export function PlayersList() {
  const [players, setPlayers] = useState<string[]>([]);
  const [uuidMessages, setUuidMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/players')
      .then((res) => res.json())
      .then((data: ApiPlayersResponse) => {
        setPlayers(data.players || []);
        setUuidMessages(data.uuidMessages || []);
        setError(null);
      })
      .catch(() => {
        setError('Failed to fetch players');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={3} mb="md">
        Online Players
      </Title>
      {loading && <Loader />}
      {error && <Alert color="red">{error}</Alert>}
      {!loading && !error && (
        <>
          {players.length > 0 ? (
            <List mb="md">
              {players.map((player) => (
                <List.Item key={player}>{player}</List.Item>
              ))}
            </List>
          ) : (
            <Text mb="md">No players online.</Text>
          )}
          <Title order={4} mt="md" mb="xs">
            UUID Log Messages
          </Title>
          {uuidMessages.length > 0 ? (
            <List size="sm">
              {uuidMessages.map((msg, i) => (
                <List.Item key={i} style={{ fontFamily: 'monospace' }}>
                  {msg}
                </List.Item>
              ))}
            </List>
          ) : (
            <Text size="sm">No UUID log messages found.</Text>
          )}
        </>
      )}
    </Card>
  );
}
