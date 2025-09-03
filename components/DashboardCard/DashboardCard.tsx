import { Card, Stack, Text, Title } from '@mantine/core';
import classes from './DashboardCard.module.css';

export function DashboardCard(props: { children?: React.ReactNode; title: string }) {
  return (
    <Stack gap="xs">
      <Title order={4} mt="md" mb={0}>
        {props.title}
      </Title>
      <div className={classes.fallbackIfEmpty}>
        {props.children}

        <Card className={classes.fallback} shadow="md" ta="center" radius="md">
          <Text>Nothing here</Text>
        </Card>
      </div>
    </Stack>
  );
}
