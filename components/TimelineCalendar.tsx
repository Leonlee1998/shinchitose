import React, { useState, useMemo } from 'react';
import { Task, Meeting, SocialContent, TaskStatus } from '../types';
import { ICONS } from '../constants';

interface TimelineCalendarProps {
    tasks: Task[];
    meetings: Meeting[]
    ;
    socials: SocialContent[];
    onTaskClick: (taskId: string) => void;
    onMeetingClick: (meetingId: string) => void;
    onSocialClick: (socialId: string) => void;
}

type CalendarView = 'month' | 'week';

interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    type: 'task' | 'meeting' | 'social';
    color: string;
    hasTime: boolean;
}

const TimelineCalendar: React.FC<TimelineCalendarProps> = ({
    tasks,
    meetings,
    socials,
    onTaskClick,
    onMeetingClick,
    onSocialClick
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<CalendarView>('month');

    // Aggregate all events
    const events = useMemo<CalendarEvent[]>(() => {
        const allEvents: CalendarEvent[] = [];

        // Add tasks
        tasks.forEach(task => {
            if (task.dueDate) {
                allEvents.push({
                    id: task.id,
                    title: task.name,
                    date: new Date(task.dueDate),
                    type: 'task',
                    color: 'bg-blue-500',
                    hasTime: false
                });
            }
        });

        // Add meetings
        meetings.forEach(meeting => {
            if (meeting.time) {
                const meetingDate = new Date(meeting.time);
                allEvents.push({
                    id: meeting.id,
                    title: meeting.title,
                    date: meetingDate,
                    type: 'meeting',
                    color: 'bg-purple-500',
                    hasTime: true
                });
            }
        });

        // Add social posts
        socials.forEach(social => {
            const dateStr = social.publishTime || social.date;
            if (dateStr) {
                const socialDate = new Date(dateStr);
                allEvents.push({
                    id: social.id,
                    title: social.title,
                    date: socialDate,
                    type: 'social',
                    color: 'bg-pink-500',
                    hasTime: !!social.publishTime
                });
            }
        });

        return allEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [tasks, meetings, socials]);

    // Get calendar days for month view
    const getMonthDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days: Date[] = [];
        const current = new Date(startDate);

        for (let i = 0; i < 42; i++) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        return days;
    };

    // Get calendar days for week view
    const getWeekDays = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

        const days: Date[] = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            days.push(day);
        }

        return days;
    };

    const days = view === 'month' ? getMonthDays() : getWeekDays();

    // Get events for a specific day
    const getEventsForDay = (day: Date) => {
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getFullYear() === day.getFullYear() &&
                eventDate.getMonth() === day.getMonth() &&
                eventDate.getDate() === day.getDate();
        });
    };

    // Get events for a specific day and hour (for week view)
    const getEventsForDayAndHour = (day: Date, hour: number) => {
        return events.filter(event => {
            if (!event.hasTime) return false;
            const eventDate = new Date(event.date);
            return eventDate.getFullYear() === day.getFullYear() &&
                eventDate.getMonth() === day.getMonth() &&
                eventDate.getDate() === day.getDate() &&
                eventDate.getHours() === hour;
        });
    };

    // Get all-day events (events without specific time)
    const getAllDayEventsForDay = (day: Date) => {
        return events.filter(event => {
            if (event.hasTime) return false;
            const eventDate = new Date(event.date);
            return eventDate.getFullYear() === day.getFullYear() &&
                eventDate.getMonth() === day.getMonth() &&
                eventDate.getDate() === day.getDate();
        });
    };

    // Navigation handlers
    const goToPrevious = () => {
        const newDate = new Date(currentDate);
        if (view === 'month') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else {
            newDate.setDate(newDate.getDate() - 7);
        }
        setCurrentDate(newDate);
    };

    const goToNext = () => {
        const newDate = new Date(currentDate);
        if (view === 'month') {
            newDate.setMonth(newDate.getMonth() + 1);
        } else {
            newDate.setDate(newDate.getDate() + 7);
        }
        setCurrentDate(newDate);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const handleEventClick = (event: CalendarEvent) => {
        if (event.type === 'task') {
            onTaskClick(event.id);
        } else if (event.type === 'meeting') {
            onMeetingClick(event.id);
        } else if (event.type === 'social') {
            onSocialClick(event.id);
        }
    };

    const isToday = (day: Date) => {
        const today = new Date();
        return day.getFullYear() === today.getFullYear() &&
            day.getMonth() === today.getMonth() &&
            day.getDate() === today.getDate();
    };

    const isCurrentMonth = (day: Date) => {
        return day.getMonth() === currentDate.getMonth();
    };

    const formatMonthYear = () => {
        return currentDate.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' });
    };

    const formatWeekRange = () => {
        const weekDays = getWeekDays();
        const start = weekDays[0];
        const end = weekDays[6];
        return `${start.getMonth() + 1}/${start.getDate()} - ${end.getMonth() + 1}/${end.getDate()}, ${end.getFullYear()}`;
    };

    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    // Render week view with time slots
    const renderWeekView = () => {
        const weekDaysList = getWeekDays();

        return (
            <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
                {/* All-day events section */}
                <div className="border-b border-slate-100">
                    <div className="grid grid-cols-8 gap-px bg-slate-100">
                        <div className="bg-slate-50 px-3 py-2 text-xs font-bold text-slate-400"></div>
                        {weekDaysList.map((day, index) => {
                            const allDayEvents = getAllDayEventsForDay(day);
                            const isTodayDate = isToday(day);

                            return (
                                <div key={index} className="bg-white p-2 min-h-[60px]">
                                    <div className={`text-center mb-2 ${isTodayDate ? 'text-blue-600 font-black' : 'text-slate-600 font-bold'}`}>
                                        <div className="text-xs">{weekDays[index]}</div>
                                        <div className={`text-lg ${isTodayDate ? 'bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto' : ''}`}>
                                            {day.getDate()}
                                        </div>
                                    </div>
                                    {allDayEvents.map((event, eventIndex) => (
                                        <button
                                            key={eventIndex}
                                            onClick={() => handleEventClick(event)}
                                            className={`w-full text-left px-2 py-1 rounded text-xs font-bold text-white truncate hover:opacity-80 transition-opacity mb-1 ${event.color}`}
                                            title={event.title}
                                        >
                                            {event.title}
                                        </button>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Time slots */}
                <div className="overflow-auto max-h-[600px]">
                    <div className="grid grid-cols-8 gap-px bg-slate-100">
                        {/* Time column */}
                        <div className="bg-white">
                            {hours.map(hour => (
                                <div key={hour} className="h-16 border-b border-slate-100 px-2 py-1 text-right">
                                    <span className="text-xs text-slate-400 font-medium">
                                        {hour.toString().padStart(2, '0')}:00
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Day columns */}
                        {weekDaysList.map((day, dayIndex) => (
                            <div key={dayIndex} className="bg-white">
                                {hours.map(hour => {
                                    const hourEvents = getEventsForDayAndHour(day, hour);
                                    const isTodayDate = isToday(day);

                                    return (
                                        <div
                                            key={hour}
                                            className={`h-16 border-b border-slate-100 p-1 relative ${isTodayDate ? 'bg-blue-50/30' : ''}`}
                                        >
                                            {hourEvents.map((event, eventIndex) => (
                                                <button
                                                    key={eventIndex}
                                                    onClick={() => handleEventClick(event)}
                                                    className={`w-full text-left px-2 py-1 rounded text-xs font-bold text-white truncate hover:opacity-80 transition-opacity mb-1 ${event.color}`}
                                                    title={`${event.title} - ${new Date(event.date).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}`}
                                                >
                                                    {event.title}
                                                </button>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // Render month view
    const renderMonthView = () => {
        return (
            <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                {/* Week day headers */}
                {weekDays.map((day, index) => (
                    <div key={index} className="bg-slate-50 px-3 py-3 text-center">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{day}</span>
                    </div>
                ))}

                {/* Calendar days */}
                {days.map((day, index) => {
                    const dayEvents = getEventsForDay(day);
                    const isTodayDate = isToday(day);
                    const isCurrentMonthDate = isCurrentMonth(day);

                    return (
                        <div
                            key={index}
                            className={`bg-white min-h-[120px] p-2 ${!isCurrentMonthDate ? 'opacity-40' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span
                                    className={`text-sm font-bold ${isTodayDate
                                        ? 'bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center'
                                        : isCurrentMonthDate
                                            ? 'text-slate-900'
                                            : 'text-slate-400'
                                        }`}
                                >
                                    {day.getDate()}
                                </span>
                            </div>

                            {/* Events */}
                            <div className="space-y-1">
                                {dayEvents.slice(0, 3).map((event, eventIndex) => (
                                    <button
                                        key={eventIndex}
                                        onClick={() => handleEventClick(event)}
                                        className={`w-full text-left px-2 py-1 rounded text-xs font-bold text-white truncate hover:opacity-80 transition-opacity ${event.color}`}
                                        title={event.title}
                                    >
                                        {event.title}
                                    </button>
                                ))}
                                {dayEvents.length > 3 && (
                                    <div className="text-xs text-slate-400 font-bold px-2">
                                        +{dayEvents.length - 3} 更多
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-black text-slate-900">
                        {view === 'month' ? formatMonthYear() : formatWeekRange()}
                    </h3>
                    <button
                        onClick={goToToday}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors"
                    >
                        今天
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    {/* View Toggle */}
                    <div className="flex gap-1 p-1 bg-slate-50 rounded-xl border border-slate-100">
                        <button
                            onClick={() => setView('month')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'month' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            月
                        </button>
                        <button
                            onClick={() => setView('week')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            週
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-2">
                        <button
                            onClick={goToPrevious}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={goToNext}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs font-bold text-slate-600">任務</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-xs font-bold text-slate-600">會議</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                    <span className="text-xs font-bold text-slate-600">貼文</span>
                </div>
            </div>

            {/* Calendar View */}
            {view === 'month' ? renderMonthView() : renderWeekView()}
        </div>
    );
};

export default TimelineCalendar;
