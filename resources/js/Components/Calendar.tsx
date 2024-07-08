import React, { useState, useCallback, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { EventInput, DateInput } from "@fullcalendar/core";
import Modal from "../Components/Modal";
import TextInput from "../Components/TextInput";
import InputLabel from "../Components/InputLabel";
import { CalendarProps } from "../types";
import { addEvent, deleteEvent, updateEvent } from "../../api";

const Calendar: React.FC<CalendarProps> = ({ chocos }) => {
    const [events, setEvents] = useState<EventInput[]>([]);
    const [eventName, setEventName] = useState("");
    const [eventColor, setEventColor] = useState("#ffcccc");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedStart, setSelectedStart] = useState<DateInput | undefined>(
        undefined
    );
    const [selectedEnd, setSelectedEnd] = useState<DateInput | undefined>(
        undefined
    );

    useEffect(() => {
        if (chocos && chocos.length > 0) {
            const eventInputs: EventInput[] = chocos.map((choco) => ({
                id: choco.id.toString(),
                title: choco.title,
                color: choco.color,
                start: choco.start,
                end: choco.end,
                allDay: choco.allDay,
            }));
            setEvents(eventInputs);
        }
    }, []);

    useEffect(() => {
        console.log(events);
    }, [events]);

    // event作成----------------------------------------------------------------
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (selectedStart) {
            const newEvent = {
                title: eventName,
                color: eventColor,
                start: selectedStart,
                end: selectedEnd,
                allDay: true,
            };

            try {
                const response = await addEvent(newEvent);
                const data = await response.json();
                const storedChocoId = data.stored_choco_id;
                const storedEvent = {
                    id: storedChocoId.toString(),
                    title: eventName,
                    color: eventColor,
                    start: selectedStart,
                    end: selectedEnd,
                    allDay: true,
                };

                setEvents([...events, storedEvent]);
            } catch (error) {
                console.error("Error creating event:", error);
            }
        }

        setModalIsOpen(false);
        setSelectedStart(undefined);
        setSelectedEnd(undefined);
        setEventName("");
        setEventColor("#ffcccc");
    };

    const handleDateSelect = (selectInfo: EventInput) => {
        setModalIsOpen(true);
        setSelectedStart(selectInfo.startStr);
        setSelectedEnd(selectInfo.endStr);
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
        setSelectedStart(undefined);
        setSelectedEnd(undefined);
        setEventName("");
        setEventColor("#ffcccc");
    };

    // event削除----------------------------------------------------------------
    const handleEventClick = useCallback(async (clickInfo: EventInput) => {
        if (
            window.confirm(
                `このイベント「${clickInfo.event.title}」を削除しますか`
            )
        ) {
            let id = clickInfo.event.id;

            await deleteEvent(id);

            setEvents((prevEvents) =>
                prevEvents.filter((event) => event.id !== clickInfo.event.id)
            );
        }
    }, []);

    // 作成したeventをドラッグする-------------------------------------
    const handleEventDrop = async (info: EventInput) => {
        const dragEvent = {
            id: info.event.id,
            start: info.event.start,
            end: info.event.end,
            allDay: info.event.allDay,
        };

        await updateEvent(dragEvent);

        setEvents(
            events.map((event) =>
                event.id === info.event.id
                    ? {
                          ...event,
                          start: info.event.start,
                          end: info.event.end,
                          allDay: info.event.allDay,
                      }
                    : event
            )
        );
    };

    const elRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!elRef.current) return;

        const draggable = new Draggable(elRef.current, {
            eventData: function (eventEl) {
                return {
                    title: eventEl.innerText,
                    create: true,
                };
            },
        });

        return () => draggable.destroy();
    }, []);

    // 作成したeventをリサイズする
    const handleEventResize = async (resizeInfo: EventInput) => {
        const resizeEvent = {
            id: resizeInfo.event.id,
            start: resizeInfo.event.start,
            end: resizeInfo.event.end,
            allDay: resizeInfo.event.allDay,
        };
        await updateEvent(resizeEvent);

        setEvents(
            events.map((event) =>
                event.id === resizeInfo.event.id
                    ? {
                          ...event,
                          start: resizeInfo.event.start,
                          end: resizeInfo.event.end,
                          allDay: resizeInfo.event.allDay,
                      }
                    : event
            )
        );
    };

    return (
        <>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                headerToolbar={{
                    start: "prev,next today",
                    center: "title",
                    end: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                selectable={true}
                select={handleDateSelect}
                eventClick={handleEventClick}
                eventDrop={handleEventDrop}
                eventContent={renderEventContent}
                editable={true}
                droppable={true}
                eventResizableFromStart={true}
                eventResize={handleEventResize}
            />

            <Modal show={modalIsOpen} onClose={handleCloseModal} maxWidth="sm">
                <div className="relative px-8 pb-8 pt-16">
                    <form onSubmit={handleFormSubmit}>
                        <div className="flex items-center gap-2 mb-4">
                            <InputLabel
                                htmlFor="eventName"
                                value="イベント名："
                            />
                            <TextInput
                                id="eventName"
                                type="text"
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <InputLabel htmlFor="color" value="カラー" />
                            <TextInput
                                id="color"
                                type="color"
                                value={eventColor}
                                onChange={(e) => setEventColor(e.target.value)}
                            />
                        </div>
                        <input
                            className="bg-fuchsia-500 px-8 py-4 rounded-full text-white block mx-auto cursor-pointer"
                            type="submit"
                            value="eventを作成"
                        />
                    </form>
                    <button
                        className="absolute top-4 right-4 bg-zinc-100 rounded-full w-12 h-12"
                        onClick={handleCloseModal}
                    >
                        ×
                    </button>
                </div>
            </Modal>
        </>
    );
};

function renderEventContent(eventInfo: EventInput) {
    console.log(eventInfo);
    const className =
        eventInfo.view.type === "dayGridMonth" && !eventInfo.event.allDay
            ? "disc"
            : "";
    return (
        <>
            <b className={className}>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    );
}

export default Calendar;
