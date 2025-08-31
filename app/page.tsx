import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { PlayersList } from '../components/PlayersList/PlayersList';
import { Welcome } from '../components/Welcome/Welcome';

export default function HomePage() {
  return (
    <>
      <Welcome />
      <ColorSchemeToggle />
      <PlayersList />
    </>
  );
}
