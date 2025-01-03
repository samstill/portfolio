import { FC } from 'react';
import { ThemeSwitch } from '@/presentation/components/ThemeSwitch/ThemeSwitch';

const Home: FC = () => {
  return (
    <div>
      <header className="fixed top-0 right-0 m-4">
        <ThemeSwitch />
      </header>
      {/* ...existing home content... */}
    </div>
  );
};

export default Home;
