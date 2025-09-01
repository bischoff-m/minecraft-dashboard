import { Stack, Title } from '@mantine/core';

export function DashboardCard(props: { children?: React.ReactNode; title: string }) {
  return (
    <Stack gap="xs">
      <Title order={4} mt="md" mb={0}>
        {props.title}
      </Title>
      {props.children}
    </Stack>
  );
}
