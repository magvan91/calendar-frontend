import { useDispatch } from "react-redux";
import { useCalendarStore } from "../../hooks";

export const FabDelete = () => {
  const dispatch = useDispatch();
  const { hasEventActive, startDeletingEvent, activeEvent } =
    useCalendarStore();
  const handleClickDelete = () => {
    dispatch(startDeletingEvent());
  };
  return (
    <button
      style={{ display: hasEventActive && activeEvent.id ? "" : "none" }}
      className="btn btn-danger fab-delete"
      onClick={handleClickDelete}
    >
      <i className="fas fa-trash"></i>
    </button>
  );
};
