import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  onAddNewEvent,
  onDeleteEvent,
  onLoadEvents,
  onSetActiveEvent,
  onUpdateEvent,
} from "../store";
import { useAuthStore } from "./useAuthStore";
import calendarApi from "../api/calendarApi";
import { convertEventsToDateEvents } from "../helpers";

export const useCalendarStore = () => {
  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector((state) => state.calendar);
  const { user } = useAuthStore((state) => state.auth);

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  };

  const startLoadingEvents = async () => {
    try {
      const { data } = await calendarApi.get("/events");
      const events = convertEventsToDateEvents(data.eventos);
      dispatch(onLoadEvents(events));
    } catch (error) {
      console.error(error);
    }
  };

  const startSavingEvent = async (calendarEvent) => {
    try {
      if (calendarEvent.id) {
        await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);
        dispatch(onUpdateEvent({ ...calendarEvent, user }));
        return;
      }
      //* Se agrega un nuevo evento
      const { data } = await calendarApi.post("/events/", calendarEvent);
      dispatch(onAddNewEvent({ ...calendarEvent, id: data.evento.id, user }));
    } catch (error) {
      Swal.fire(
        "Error al actualizar el evento.",
        error.response.data.msg,
        "error"
      );
    }
  };

  const startDeletingEvent = async () => {
    try {
      await calendarApi.delete(`/events/${activeEvent.id}`);
      dispatch(onDeleteEvent({ ...activeEvent, user }));
    } catch (error) {
      Swal.fire(
        "Error al eliminar el evento.",
        error.response.data.msg,
        "error"
      );
    }
  };

  return {
    //* Propiedades
    events,
    activeEvent,
    hasEventActive: !!activeEvent,
    //* Metodos
    setActiveEvent,
    startLoadingEvents,
    startSavingEvent,
    startDeletingEvent,
  };
};
