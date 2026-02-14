import React, { useState } from 'react';
import Layout from './components/Layout/Layout';
import { ThemeProvider } from './context/ThemeContext';
import { HabitProvider } from './context/HabitContext';
import { CalendarProvider } from './context/CalendarContext';
import SettingsModal from './components/Settings/SettingsModal';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <ThemeProvider>
      <HabitProvider>
        <CalendarProvider>
          <div style={{ height: '100%', width: '100%' }}>
            <Layout onOpenSettings={() => setIsSettingsOpen(true)} />
            {isSettingsOpen && (
              <SettingsModal onClose={() => setIsSettingsOpen(false)} />
            )}
          </div>
        </CalendarProvider>
      </HabitProvider>
    </ThemeProvider>
  );
}

export default App;
