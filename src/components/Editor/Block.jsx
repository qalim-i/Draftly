import React, { useRef, useEffect } from 'react';
import styles from './Editor.module.css';

const Block = ({
    block,
    index,
    onUpdate,
    onAdd,
    onDelete,
    onFocusNext,
    onFocusPrev,
    isFocused,
    isMenuOpen,
    onOpenMenu,
    onMenuNav
}) => {
    const contentRef = useRef(null);

    useEffect(() => {
        if (isFocused && contentRef.current) {
            contentRef.current.focus();

            // Move text cursor to the end when focusing a new block
            /* Note: This is a simplification. Ideally, we care about where correct selection is.
               But for simple "enter to new line", this is often assumed. 
               However, fixing caret position on every focus is tricky. 
               Let's rely on browser default for now or improve later. */
        }
    }, [isFocused]);

    const handleKeyDown = (e) => {
        if (isMenuOpen) {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                onMenuNav('up');
                return;
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                onMenuNav('down');
                return;
            } else if (e.key === 'Enter') {
                e.preventDefault();
                onMenuNav('enter');
                return;
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onMenuNav('close');
                return;
            }
        }

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onAdd(block.id);
        } else if (e.key === 'Backspace') {
            if (block.content === '') {
                // If empty, delete
                e.preventDefault();
                onDelete(block.id);
            } else if (document.getSelection().anchorOffset === 0) {
                // If at start of list item, convert to text
                if (block.type !== 'text') {
                    e.preventDefault();
                    onUpdate(block.id, block.content, 'text');
                }
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            onFocusPrev(block.id);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            onFocusNext(block.id);
        }
    };

    const handleChange = (e) => {
        const text = e.target.innerText;

        // Slash Command Trigger
        if (text === '/') {
            const rect = e.target.getBoundingClientRect();
            onOpenMenu(rect);
        } else if (isMenuOpen && text !== '/') {
            onMenuNav('close');
        }

        // Markdown Shortcuts
        if (block.type === 'text') {
            if (text === '- ' || text === '* ') {
                onUpdate(block.id, '', 'bulleted-list');
                if (contentRef.current) contentRef.current.innerText = ''; // Clear DOM immediately
                return;
            }
            if (text === '1. ') {
                onUpdate(block.id, '', 'numbered-list');
                if (contentRef.current) contentRef.current.innerText = '';
                return;
            }
        }

        onUpdate(block.id, text);
    };

    const renderMarker = () => {
        if (block.type === 'bulleted-list') {
            return <span className={styles.listMarker}><span className={styles.bullet}>•</span></span>;
        }
        if (block.type === 'numbered-list') {
            return <span className={styles.listMarker}><span className={styles.number}>{index}.</span></span>;
        }
        return null;
    };

    // Sync content changes from props to DOM, but only if they differ significantly
    // (e.g., loaded from DB or changed by another block), to avoid cursor jumps.
    useEffect(() => {
        if (contentRef.current && contentRef.current.innerText !== block.content) {
            contentRef.current.innerText = block.content;
        }
    }, [block.content]);

    return (
        <div className={styles.blockWrapper}>
            {/* Render List Marker if applicable */}
            {(block.type === 'bulleted-list' || block.type === 'numbered-list') ? (
                <div className={styles.listWrapper} style={{ width: '100%' }}>
                    {renderMarker()}
                    <div
                        ref={contentRef}
                        className={`${styles.listContent} ${styles[block.type]}`}
                        contentEditable
                        suppressContentEditableWarning
                        onKeyDown={handleKeyDown}
                        onInput={handleChange}
                        data-placeholder="List item"
                    />
                </div>
            ) : (
                <div
                    ref={contentRef}
                    className={`${styles.block} ${styles[block.type]}`}
                    contentEditable
                    suppressContentEditableWarning
                    onKeyDown={handleKeyDown}
                    onInput={handleChange}
                    data-placeholder={block.type === 'text' ? "Type '/' for commands" : "Heading"}
                />
            )}
        </div>
    );
};

export default Block;
