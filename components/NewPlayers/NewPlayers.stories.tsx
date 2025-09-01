import type { Meta, StoryObj } from '@storybook/react';
import { NewPlayers } from './NewPlayers';

const meta: Meta<typeof NewPlayers> = {
  title: 'NewPlayers',
  component: NewPlayers,
};

export default meta;

export const Default: StoryObj<typeof NewPlayers> = {
  render: () => <NewPlayers addToWhitelist={() => {}} uuids={[]} whitelist={[]} />,
};
