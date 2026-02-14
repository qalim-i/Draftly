import React, { useState } from 'react';
import { format } from 'date-fns';
import { useHabits } from '../../context/HabitContext';
import HabitCalendar from './HabitCalendar';
import styles from './HabitsPage.module.css';

const HabitsPage = () => {
    const { habits, addHabit, toggleHabit, isHabitCompleted, deleteHabit } = useHabits();
    const [currentDate, setCurrentDate] = useState(new Date()); // For calendar nav
    const [selectedDate, setSelectedDate] = useState(new Date()); // Selected day
    const [isAdding, setIsAdding] = useState(false);
    const [newHabitTitle, setNewHabitTitle] = useState('');

    const handleAddHabit = (e) => {
        e.preventDefault();
        if (newHabitTitle.trim()) {
            addHabit(newHabitTitle.trim());
            setNewHabitTitle('');
            setIsAdding(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.calendarSection}>
                <HabitCalendar
                    currentDate={currentDate}
                    onDateChange={setCurrentDate}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                />
            </div>

            <div className={styles.agendaSection}>
                <div className={styles.agendaHeader}>
                    <span>{format(selectedDate, 'd MMMM yyyy')}</span>
                    <button
                        className={styles.addButton}
                        onClick={() => setIsAdding(true)}
                        title="Add Habit"
                    >
                        +
                    </button>
                </div>

                {isAdding && (
                    <form onSubmit={handleAddHabit} className={styles.addInputContainer}>
                        <input
                            type="text"
                            className={styles.addInput}
                            placeholder="New habit name..."
                            value={newHabitTitle}
                            onChange={(e) => setNewHabitTitle(e.target.value)}
                            autoFocus
                        />
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={() => setIsAdding(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.addButton}
                            style={{ width: 'auto', borderRadius: '8px', padding: '0 12px', fontSize: '14px' }}
                        >
                            Add
                        </button>
                    </form>
                )}

                {habits.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No habits yet. Click + to start tracking!</p>
                    </div>
                ) : (
                    <ul className={styles.habitList}>
                        {habits.map(habit => {
                            const isCompleted = isHabitCompleted(habit.id, selectedDate);
                            return (
                                <li key={habit.id} className={`${styles.habitItem} ${isCompleted ? styles.completed : ''}`}>
                                    <div className={styles.habitInfo}>
                                        <span className={styles.habitIcon}>{habit.icon}</span>
                                        <span className={styles.habitTitle}>{habit.title}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <button
                                            className={`${styles.checkButton} ${isCompleted ? styles.checked : ''}`}
                                            onClick={() => toggleHabit(habit.id, selectedDate)}
                                        >
                                            {isCompleted && '✓'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Delete this habit logic?')) deleteHabit(habit.id);
                                            }}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.3, fontSize: '12px' }}
                                            title="Delete Habit"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default HabitsPage;
