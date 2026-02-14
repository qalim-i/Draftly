/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAll, putItem, deleteItem } from '../utils/db';

const CalendarContext = createContext();

export const useCalendar = () => useContext(CalendarContext);

export const CalendarProvider = ({ children }) => {
    // Events: [{ id, title, description, location, date, createdAt }]
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const loadedEvents = await getAll('events');
                // Ensure date strings are converted back to Date objects if needed
                // But generally assume Date objects might need re-instantiation if stored as ISO strings
                // idb stores native Date objects fine usually, but safer to check/parse if logic demands
                setEvents(loadedEvents.map(ev => ({
                    ...ev,
                    date: ev.date instanceof Date ? ev.date : new Date(ev.date)
                })));
            } catch (err) {
                console.error("Failed to load events", err);
            }
        };
        loadEvents();
    }, []);

    const addEvent = async (eventData) => {
        const newEvent = {
            id: Date.now(), // or crypto.randomUUID()
            ...eventData,
            createdAt: new Date().toISOString()
        };

        // Optimistic update
        setEvents(prev => [...prev, newEvent]);

        // Persist
        await putItem('events', newEvent);
    };

    const deleteEvent = async (eventId) => {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        await deleteItem('events', eventId);
    };

    return (
        <CalendarContext.Provider value={{ events, addEvent, deleteEvent }}>
            {children}
        </CalendarContext.Provider>
    );
};
