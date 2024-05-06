import { useDispatch, useSelector } from "react-redux";
import calendarApi from "../api/calendarApi";
import {
  clearMessage,
  onChecking,
  onLogin,
  onLogout,
  onLogoutCalendar,
} from "../store";

export const useAuthStore = () => {
  const { status, user, errorMessage } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const startLogin = async ({ email, password }) => {
    try {
      dispatch(onChecking());
      const { data } = await calendarApi.post("/auth", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());
      dispatch(onLogin({ name: data.name, uid: data.uid }));
    } catch (error) {
      dispatch(onLogout("Credenciales incorrectas."));
      setTimeout(() => {
        dispatch(clearMessage());
      }, 10);
    }
  };

  const startRegister = async ({ email, password, name }) => {
    try {
      dispatch(onChecking());
      const { data } = await calendarApi.post("/auth/new", {
        email,
        password,
        name,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());
      dispatch(onLogin({ name: data.name, uid: data.uid }));
    } catch (error) {
      const errorsFieldsResponse = error.response.data.msg;
      const errorFieldsRegister =
        error.response.data.errors?.email?.msg ||
        error.response.data.errors?.password?.msg ||
        error.response.data.errors?.name?.msg;
      const errorFinal = errorFieldsRegister || errorsFieldsResponse;
      dispatch(onLogout(errorFinal || "Error en el sistema."));
      setTimeout(() => {
        dispatch(clearMessage());
      }, 10);
    }
  };

  const checkAuthToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return dispatch(onLogout());
    try {
      const { data } = await calendarApi.get("/auth/renew");
      localStorage.setItem("token", data.token);
      dispatch(onLogin({ name: data.name, uid: data.uid }));
    } catch (error) {
      localStorage.clear();
      dispatch(onLogout());
    }
  };

  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogout());
    dispatch(onLogoutCalendar());
  };

  return {
    //* Propiedades
    status,
    user,
    errorMessage,
    //* Metodos
    checkAuthToken,
    startLogin,
    startLogout,
    startRegister,
  };
};
