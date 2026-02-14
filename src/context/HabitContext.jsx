/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, subDays, isSameDay, parseISO } from 'date-fns';
import { getAll, putItem, deleteItem, getHabitRecordsObj, toggleHabitRecordInDb } from '../utils/db';

const HabitContext = createContext();

export const useHabits = () => useContext(HabitContext);

export const HabitProvider = ({ children }) => {
    // Habits: [{ id, title, icon, color, createdAt }]
    const [habits, setHabits] = useState([]);

    // Records: { [habitId]: { [dateString]: true } }
    const [records, setRecords] = useState({});

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                const [loadedHabits, loadedRecords] = await Promise.all([
                    getAll('habits'),
                    getHabitRecordsObj()
                ]);
                setHabits(loadedHabits);
                setRecords(loadedRecords);
            } catch (err) {
                console.error("Failed to load habits from DB", err);
            }
        };
        loadData();
    }, []);

    const addHabit = async (title, icon = '📝', color = '#4caf50') => {
        const newHabit = {
            id: crypto.randomUUID(),
            title,
            icon,
            color,
            createdAt: new Date().toISOString()
        };

        // Optimistic update
        setHabits(prev => [...prev, newHabit]);
        setRecords(prev => ({ ...prev, [newHabit.id]: {} }));

        // Persist
        await putItem('habits', newHabit);
    };

    const deleteHabit = async (habitId) => {
        // Optimistic update
        setHabits(prev => prev.filter(h => h.id !== habitId));
        setRecords(prev => {
            const newRecords = { ...prev };
            delete newRecords[habitId];
            return newRecords;
        });

        // Persist
        await deleteItem('habits', habitId);
        // Note: keeping orphan records for now or cleanup later
    };

    const toggleHabit = async (habitId, date) => {
        const dateStr = format(date, 'yyyy-MM-dd');

        let isNowCompleted = false;

        setRecords(prev => {
            const habitRecords = prev[habitId] || {};
            const isCompleted = !!habitRecords[dateStr];
            isNowCompleted = !isCompleted;

            const newHabitRecords = { ...habitRecords };
            if (isCompleted) {
                delete newHabitRecords[dateStr];
            } else {
                newHabitRecords[dateStr] = true;
            }

            return {
                ...prev,
                [habitId]: newHabitRecords
            };
        });

        // Persist
        await toggleHabitRecordInDb(habitId, dateStr, isNowCompleted);
    };

    const getHabitStreak = (habitId) => {
        const habitRecords = records[habitId] || {};
        let streak = 0;
        let currentCheckDate = new Date();

        const todayStr = format(currentCheckDate, 'yyyy-MM-dd');
        // If not done today, check if done yesterday to start streak count
        if (!habitRecords[todayStr]) {
            currentCheckDate = subDays(currentCheckDate, 1);
        }

        while (true) {
            const dateStr = format(currentCheckDate, 'yyyy-MM-dd');
            if (habitRecords[dateStr]) {
                streak++;
                currentCheckDate = subDays(currentCheckDate, 1);
            } else {
                break;
            }
        }
        return streak;
    };

    const isHabitCompleted = (habitId, date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return !!records[habitId]?.[dateStr];
    };

    // Calculate completion for a specific day (0.0 to 1.0)
    const getDayCompletion = (date) => {
        if (habits.length === 0) return 0;
        const total = habits.length;
        const completed = habits.filter(h => isHabitCompleted(h.id, date)).length;
        return completed / total;
    };

    return (
        <HabitContext.Provider value={{
            habits,
            records,
            addHabit,
            deleteHabit,
            toggleHabit,
            getHabitStreak,
            isHabitCompleted,
            getDayCompletion
        }}>
            {children}
        </HabitContext.Provider>
    );
};
