import { Text, Title } from '@mantine/core';
import classes from './DashboardTitle.module.css';

export function DashboardTitle() {
  return (
    <>
      <Title className={classes.title} ta="center" mt={30} mb={30}>
        <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'yellow' }}>
          Minecraft Server
        </Text>
        <br />
        Dashboard
      </Title>
    </>
  );
}
