import React from 'react';
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
    subMonths
} from 'date-fns';
import { useHabits } from '../../context/HabitContext';
import styles from './HabitCalendar.module.css';

const HabitCalendar = ({ currentDate, onDateChange, selectedDate, onSelectDate }) => {
    const { getDayCompletion } = useHabits();

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const nextMonth = () => onDateChange(addMonths(currentDate, 1));
    const prevMonth = () => onDateChange(subMonths(currentDate, 1));

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
                    const completion = getDayCompletion(day);

                    let indicator = null;
                    if (completion === 1) {
                        indicator = <span className={styles.checkmark}>✔</span>;
                    } else if (completion > 0) {
                        indicator = <span className={`${styles.dot} ${styles.partial}`}></span>;
                    }

                    return (
                        <div
                            key={day.toString()}
                            className={`${styles.day} ${!isCurrentMonth ? styles.disabled : ''} ${isSelected ? styles.selected : ''} ${isToday ? styles.today : ''}`}
                            onClick={() => onSelectDate(day)}
                        >
                            <span className={styles.dayNumber}>{format(day, 'd')}</span>
                            <div className={styles.dotContainer}>
                                {indicator}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HabitCalendar;
