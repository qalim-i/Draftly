import React, { useState } from 'react';
import Sidebar from './Sidebar';
import styles from './Layout.module.css';
import Editor from '../Editor/Editor';
import Calendar from '../Calendar/Calendar';
import HabitsPage from '../Habits/HabitsPage';

const Layout = ({ onOpenSettings }) => {
    const [currentView, setCurrentView] = useState('editor'); // 'editor' | 'calendar'
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <div className={styles.container}>
            <Sidebar
                currentView={currentView}
                onNavigate={setCurrentView}
                onOpenSettings={onOpenSettings}
                isMobileOpen={isMobileSidebarOpen}
                onCloseMobile={() => setIsMobileSidebarOpen(false)}
            />
            <main className={styles.main}>
                {/* Mobile Toggle Button */}
                <button
                    className={styles.mobileToggle}
                    onClick={() => setIsMobileSidebarOpen(true)}
                >
                    ☰
                </button>

                {currentView === 'editor' ? (
                    <Editor />
                ) : currentView === 'calendar' ? (
                    <Calendar />
                ) : (
                    <HabitsPage />
                )}
            </main>
        </div>
    );
};

export default Layout;
