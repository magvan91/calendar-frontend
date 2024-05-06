import { useEffect, useState } from "react";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  CalenadarModal,
  CalendarEvent,
  FabAddNew,
  FabDelete,
  NavBar,
} from "../";
import { getMessages, localizer } from "../../helpers";
import { useAuthStore, useCalendarStore, useUiStore } from "../../hooks";

export const CalendarPage = () => {
  const { user } = useAuthStore();

  const { openDateModal } = useUiStore();
  const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();

  const [lastView, setLastView] = useState(
    localStorage.getItem("lastView") || "week"
  );

  const eventStyleGetter = (event, start, end, isSelected) => {
    const isMyEVent =
      user.uid === event.user._id || user.uid === event.user.uid;
    const style = {
      backgroundColor: isMyEVent ? "#347CF7" : "#465660",
      borderRadius: "0px",
      opacity: 0.8,
      color: "white",
    };
    return { style };
  };

  const onDoubleClick = (event) => {
    openDateModal();
  };

  const onSelect = (event) => {
    setActiveEvent(event);
  };

  const onViewChanged = (event) => {
    localStorage.setItem("lastView", event);
    setLastView(event);
  };

  useEffect(() => {
    startLoadingEvents();
  }, []);

  return (
    <>
      <NavBar />
      <Calendar
        defaultView={lastView}
        culture="es"
        events={events}
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "calc(100vh - 80px)" }}
        messages={getMessages()}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CalendarEvent,
        }}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect}
        onView={onViewChanged}
      />

      <CalenadarModal />
      <FabAddNew />
      <FabDelete />
    </>
  );
};
