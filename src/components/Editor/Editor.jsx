import React, { useState, useEffect } from 'react';
import Block from './Block';
import SlashMenu, { COMMANDS } from './SlashMenu';
import styles from './Editor.module.css';
import { getById, putItem } from '../../utils/db';

const generateId = () => Math.random().toString(36).substr(2, 9);
const EDITOR_ID = 'root-editor';

const Editor = () => {
    const [blocks, setBlocks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [focusedBlockId, setFocusedBlockId] = useState(null);

    useEffect(() => {
        const loadBlocks = async () => {
            try {
                const doc = await getById('notes', EDITOR_ID);
                if (doc && doc.content) {
                    setBlocks(doc.content);
                } else {
                    // Default init
                    setBlocks([
                        { id: generateId(), type: 'heading1', content: 'Untitled' },
                        { id: generateId(), type: 'text', content: '' }
                    ]);
                }
            } catch (error) {
                console.error("Failed to load editor content", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadBlocks();
    }, []);

    const saveBlocks = async (newBlocks) => {
        try {
            await putItem('notes', { id: EDITOR_ID, content: newBlocks, updatedAt: new Date() });
        } catch (error) {
            console.error("Failed to save editor content", error);
        }
    };

    // Wrapper to update state and db
    const setBlocksAndSave = (newBlocksOrFn) => {
        setBlocks(prev => {
            const newBlocks = typeof newBlocksOrFn === 'function' ? newBlocksOrFn(prev) : newBlocksOrFn;
            // Debouncing could be added here, but for now direct save
            saveBlocks(newBlocks);
            return newBlocks;
        });
    };

    // Slash Menu State
    const [menuState, setMenuState] = useState({
        isOpen: false,
        position: { x: 0, y: 0 },
        blockId: null,
        selectedIndex: 0
    });

    const updateBlock = (id, content, type = null) => {
        setBlocksAndSave(blocks.map(b => {
            if (b.id !== id) return b;
            const updates = { content };
            if (type) updates.type = type;
            return { ...b, ...updates };
        }));
    };

    const closeMenu = () => {
        setMenuState(prev => ({ ...prev, isOpen: false }));
    };

    const openMenu = (blockId, rect) => {
        setMenuState({
            isOpen: true,
            position: { x: rect.left, y: rect.bottom },
            blockId,
            selectedIndex: 0
        });
    };

    const handleMenuSelect = (type) => {
        if (!menuState.blockId) return;
        updateBlock(menuState.blockId, '', type);
        closeMenu();
        setFocusedBlockId(menuState.blockId);
    };

    const handleMenuNav = (direction) => {
        if (!menuState.isOpen) return;

        if (direction === 'up') {
            setMenuState(prev => ({
                ...prev,
                selectedIndex: Math.max(0, prev.selectedIndex - 1)
            }));
        } else if (direction === 'down') {
            setMenuState(prev => ({
                ...prev,
                selectedIndex: Math.min(COMMANDS.length - 1, prev.selectedIndex + 1)
            }));
        } else if (direction === 'enter') {
            handleMenuSelect(COMMANDS[menuState.selectedIndex].type);
        } else if (direction === 'close') {
            closeMenu();
        }
    };

    const addBlock = (afterId) => {
        const newBlock = { id: generateId(), type: 'text', content: '' };
        const index = blocks.findIndex(b => b.id === afterId);
        const newBlocks = [...blocks];
        newBlocks.splice(index + 1, 0, newBlock);

        // If current block is a list item, make the new one match
        const currentBlock = blocks[index];
        if (currentBlock.type === 'bulleted-list' || currentBlock.type === 'numbered-list') {
            newBlock.type = currentBlock.type;
        }

        setBlocksAndSave(newBlocks);
        setFocusedBlockId(newBlock.id);
    };

    const deleteBlock = (id) => {
        if (blocks.length <= 1) return; // Don't delete last block
        const index = blocks.findIndex(b => b.id === id);
        const newBlocks = blocks.filter(b => b.id !== id);

        // Focus previous block
        if (index > 0) {
            setFocusedBlockId(newBlocks[index - 1].id);
        }
        setBlocksAndSave(newBlocks);
    };

    const focusPrev = (id) => {
        const index = blocks.findIndex(b => b.id === id);
        if (index > 0) setFocusedBlockId(blocks[index - 1].id);
    };

    const focusNext = (id) => {
        const index = blocks.findIndex(b => b.id === id);
        if (index < blocks.length - 1) setFocusedBlockId(blocks[index + 1].id);
    };

    // Calculate numbering for lists
    let numberCounter = 0;

    return (
        <div className={styles.editorContainer}>
            {menuState.isOpen && (
                <SlashMenu
                    position={menuState.position}
                    selectedIndex={menuState.selectedIndex}
                    onSelect={handleMenuSelect}
                    onClose={closeMenu}
                />
            )}

            {blocks.map((block, index) => {
                // Reset counter if not a numbered list or if previous block wasn't numbered list
                if (block.type === 'numbered-list') {
                    if (index === 0 || blocks[index - 1].type !== 'numbered-list') {
                        numberCounter = 1;
                    } else {
                        numberCounter++;
                    }
                } else {
                    numberCounter = 0;
                }

                return (
                    <Block
                        key={block.id}
                        block={block}
                        index={numberCounter} // Pass the calculated number
                        onUpdate={updateBlock}
                        onAdd={addBlock}
                        onDelete={deleteBlock}
                        onFocusPrev={focusPrev}
                        onFocusNext={focusNext}
                        isFocused={focusedBlockId === block.id}
                        // Menu props
                        isMenuOpen={menuState.isOpen && menuState.blockId === block.id}
                        onOpenMenu={(rect) => openMenu(block.id, rect)}
                        onMenuNav={handleMenuNav}
                    />
                );
            })}
        </div>
    );
};

export default Editor;
