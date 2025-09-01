import type { Meta, StoryObj } from '@storybook/react';
import { DashboardCard } from './DashboardCard';

const meta: Meta<typeof DashboardCard> = {
  title: 'DashboardCard',
  component: DashboardCard,
};

export default meta;

export const Default: StoryObj<typeof DashboardCard> = {
  render: () => <DashboardCard title="Default Title" />,
};
