/* eslint-disable no-unused-vars */
import React from 'react';
import styles from './Sidebar.module.css';

const Sidebar = ({
    currentView,
    onNavigate,
    onOpenSettings,
    isMobileOpen,
    onCloseMobile
}) => {
    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className={styles.mobileOverlay}
                    onClick={onCloseMobile}
                />
            )}

            <aside
                className={`${styles.sidebar} ${isMobileOpen ? styles.open : ''}`}
            >
                <div className={styles.header}>
                    <div className={styles.userIcon}>U</div>
                    <span className={styles.userName}>User's Notion</span>
                </div>

                <nav className={styles.nav}>
                    <div
                        className={`${styles.navItem} ${currentView === 'editor' ? styles.active : ''}`}
                        onClick={() => {
                            onNavigate('editor');
                            if (isMobileOpen) onCloseMobile();
                        }}
                    >
                        <span className={styles.icon}>📄</span>
                        <span>Notes</span>
                    </div>

                    <div
                        className={`${styles.navItem} ${currentView === 'calendar' ? styles.active : ''}`}
                        onClick={() => {
                            onNavigate('calendar');
                            if (isMobileOpen) onCloseMobile();
                        }}
                    >
                        <span className={styles.icon}>📅</span>
                        <span>Calendar</span>
                    </div>

                    <div
                        className={`${styles.navItem} ${currentView === 'habits' ? styles.active : ''}`}
                        onClick={() => {
                            onNavigate('habits');
                            if (isMobileOpen) onCloseMobile();
                        }}
                    >
                        <span className={styles.icon}>✅</span>
                        <span>Habits</span>
                    </div>
                </nav>

                <div className={styles.footer}>
                    <div className={styles.navItem} onClick={() => {
                        onOpenSettings();
                        if (isMobileOpen) onCloseMobile();
                    }}>
                        <span className={styles.icon}>⚙️</span>
                        <span>Settings</span>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
