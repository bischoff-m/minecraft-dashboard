import { Button, Group, Modal, Text } from '@mantine/core';

export function RemovePlayerModal(props: {
  opened: boolean;
  resolve: () => void;
  reject: () => void;
}) {
  return (
    <Modal.Root opened={props.opened} onClose={props.reject} centered>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title fz="h4" fw="bold">
            Remove From Whitelist
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <Text>
            Are you sure you want to remove the player from the whitelist? This will kick the player
            immediately.
          </Text>
          <Group mt="lg">
            <Button variant="outline" onClick={props.reject}>
              Cancel
            </Button>
            <Button onClick={props.resolve}>Remove</Button>
          </Group>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
