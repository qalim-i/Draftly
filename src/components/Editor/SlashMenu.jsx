import React, { useEffect, useRef } from 'react';
import styles from './Editor.module.css';

const COMMANDS = [
    { type: 'text', label: 'Text', icon: 'T' },
    { type: 'heading1', label: 'Heading 1', icon: 'H1' },
    { type: 'heading2', label: 'Heading 2', icon: 'H2' },
    { type: 'heading3', label: 'Heading 3', icon: 'H3' },
    { type: 'bulleted-list', label: 'Bulleted List', icon: '•' },
    { type: 'numbered-list', label: 'Numbered List', icon: '1.' },
];

const SlashMenu = ({ position, selectedIndex, onSelect, onClose }) => {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    // Ensure menu stays within viewport (basic check)
    const style = {
        top: position.y + 24, // below the block
        left: position.x,
    };

    return (
        <div
            ref={menuRef}
            className={styles.slashMenu}
            style={style}
        >
            {COMMANDS.map((cmd, index) => (
                <div
                    key={cmd.type}
                    className={`${styles.slashItem} ${index === selectedIndex ? styles.slashItemActive : ''}`}
                    onClick={() => onSelect(cmd.type)}
                    onMouseEnter={() => {
                        // Optional: can handle hover state here, 
                        // but index is managed by parent for keyboard support.
                        // Ideally parent updates index on hover, but keeping simple for MVP.
                    }}
                >
                    <span className={styles.slashIcon}>{cmd.icon}</span>
                    <span>{cmd.label}</span>
                </div>
            ))}
        </div>
    );
};

export default SlashMenu;
export { COMMANDS };
