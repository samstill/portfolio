import { FC } from 'react';
import { ThemeSwitch } from '../ThemeSwitch/ThemeSwitch';

export const Header: FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-50 bg-transparent backdrop-blur-sm">
      <div>
        {/* Logo or brand name can go here */}
      </div>
      <nav className="flex items-center gap-4">
        <ThemeSwitch />
      </nav>
    </header>
  );
};
