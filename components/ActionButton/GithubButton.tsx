import { IconBrandGithub } from '@tabler/icons-react';
import { ActionIcon, Group } from '@mantine/core';

export function GithubButton(props: { url: string }) {
  return (
    <Group justify="center">
      <ActionIcon
        onClick={() => window.open(props.url, '_blank')}
        variant="default"
        size="xl"
        radius="md"
        aria-label="Open GitHub repository"
      >
        <IconBrandGithub stroke={1.5} />
      </ActionIcon>
    </Group>
  );
}
