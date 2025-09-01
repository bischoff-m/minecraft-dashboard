import type { Meta, StoryObj } from '@storybook/react';
import { PlayerCard } from './PlayerCard';

const meta: Meta<typeof PlayerCard> = {
  title: 'PlayerCard',
  component: PlayerCard,
};

export default meta;

export const Default: StoryObj<typeof PlayerCard> = {
  render: () => (
    <PlayerCard entry={{ name: 'Player1', uuid: '1234-5678-9012-3456' }} isOnline="yes" />
  ),
};
