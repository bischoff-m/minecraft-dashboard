import type { Meta, StoryObj } from '@storybook/react';
import { PlayersList } from './PlayersList';

const meta: Meta<typeof PlayersList> = {
  title: 'PlayersList',
  component: PlayersList,
};

export default meta;

export const Default: StoryObj<typeof PlayersList> = {
  render: () => <PlayersList players={[]} whitelist={[]} removeFromWhitelist={() => {}} />,
};
