import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import styles from './SettingsModal.module.css';

const SettingsModal = ({ onClose }) => {
    const { theme, setSpecificTheme } = useTheme();

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Settings</h2>
                </div>

                <div className={styles.section}>
                    <h3>Appearance</h3>
                    <div className={styles.control}>
                        <label>Theme</label>
                        <select
                            value={theme}
                            onChange={(e) => setSpecificTheme(e.target.value)}
                            className={styles.select}
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.closeButton} onClick={onClose}>Done</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
