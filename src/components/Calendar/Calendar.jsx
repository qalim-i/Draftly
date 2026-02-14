import React, { useState } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    addDays
} from 'date-fns';
import styles from './Calendar.module.css';
import { useCalendar } from '../../context/CalendarContext';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Use Context
    const { events, addEvent } = useCalendar();

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', description: '', location: '' });

    const toggleAddEvent = () => {
        setIsAddEventOpen(!isAddEventOpen);
        setNewEvent({ title: '', description: '', location: '' }); // Reset form
    };

    const handleSaveEvent = async () => {
        if (!newEvent.title.trim()) return;

        await addEvent({
            title: newEvent.title,
            description: newEvent.description,
            location: newEvent.location,
            date: selectedDate
        });

        toggleAddEvent();
    };

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const handleDateClick = (day) => {
        setSelectedDate(day);
    };

    const addToGoogleCalendar = (event) => {
        // Format: YYYYMMDDTHHMMSSZ
        const formatDate = (date) => format(date, "yyyyMMdd'T'HHmmss");
        const start = formatDate(event.date);
        const end = formatDate(addDays(event.date, 1)); // Default 1 day for now or 1 hour

        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.location || '')}`;

        window.open(url, '_blank');
    };

    const selectedDayEvents = events.filter(event => isSameDay(event.date, selectedDate));

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.monthSelector}>
                    <span className={styles.monthName}>{format(currentDate, 'MMMM')}</span>
                    <span className={styles.yearName}>{format(currentDate, 'yyyy')}</span>
                </div>
                <div className={styles.navButtons}>
                    <button onClick={prevMonth}>&lt;</button>
                    <button onClick={nextMonth}>&gt;</button>
                </div>
            </header>

            <div className={styles.grid}>
                {weekDays.map(day => (
                    <div key={day} className={styles.weekDayHeader}>{day}</div>
                ))}

                {calendarDays.map(day => {
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isSelected = isSameDay(day, selectedDate);
                    const isToday = isSameDay(day, new Date());
                    const dayEvents = events.filter(e => isSameDay(e.date, day));

                    return (
                        <div
                            key={day.toString()}
                            className={`${styles.day} ${!isCurrentMonth ? styles.disabled : ''} ${isSelected ? styles.selected : ''} ${isToday ? styles.today : ''}`}
                            onClick={() => handleDateClick(day)}
                        >
                            <span className={styles.dayNumber}>{format(day, 'd')}</span>
                            <div className={styles.eventDots}>
                                {dayEvents.map(ev => (
                                    <span key={ev.id} className={styles.dot}></span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={styles.agenda}>
                <h3 className={styles.agendaHeader}>
                    {format(selectedDate, 'd MMMM yyyy')}
                    <button className={styles.addEventButton} onClick={toggleAddEvent}>
                        +
                    </button>
                </h3>

                {selectedDayEvents.length === 0 ? (
                    <p className={styles.noEvents}>No events</p>
                ) : (
                    <ul className={styles.eventList}>
                        {selectedDayEvents.map(event => (
                            <li key={event.id} className={styles.eventItem}>
                                <div className={styles.eventInfo}>
                                    <span className={styles.eventTitle}>{event.title}</span>
                                    <span className={styles.eventTime}>All Day</span>
                                </div>
                                <button
                                    className={styles.syncButton}
                                    onClick={() => addToGoogleCalendar(event)}
                                    title="Add to Google Calendar"
                                >
                                    📅 Sync
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Add Event Modal */}
            {isAddEventOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h4 className={styles.modalTitle}>New Event</h4>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Title</label>
                            <input
                                className={styles.input}
                                value={newEvent.title}
                                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                placeholder="Event Title"
                                autoFocus
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Location</label>
                            <input
                                className={styles.input}
                                value={newEvent.location}
                                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                placeholder="Location"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Description</label>
                            <textarea
                                className={styles.textarea}
                                value={newEvent.description}
                                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                placeholder="Notes"
                            />
                        </div>
                        <div className={styles.modalActions}>
                            <button className={styles.cancelButton} onClick={toggleAddEvent}>Cancel</button>
                            <button className={styles.saveButton} onClick={handleSaveEvent}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
