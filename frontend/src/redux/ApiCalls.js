import { loginFailure, loginStart, loginSuccess } from "./userRedux";
import axios from "axios";
import { createRoot } from "react-dom/client";
import Modal from "../components/Modal";

const showPopup = (msgType, msg) => {
    const rootElement = document.getElementById("modal");
    const existingRoot = rootElement._reactRootContainer;
    if (existingRoot) {
      existingRoot.render(<Modal msgType={msgType} msg={msg} />);
    } else {
      createRoot(rootElement).render(<Modal msgType={msgType} msg={msg} />);
    }
  };

const handleError = (err) => {
	switch (err?.response?.status) {
		case 401: {
			showPopup("warning", err.response.data?.message? err.response.data.message : err.response.data.msg);
			break;
		}
		case 422: {
			showPopup("warning", err.response.data);
			break;
		}
		default: {
			showPopup("error", "Something went wrong: " +  err.response.data?.message);
			break;
		}
	}
};

export const login = async (dispatch, user) => {
	dispatch(loginStart());
	try {
		const res = await axios.post(process.env.REACT_APP_BACKEND_URL + "/auth/login",user);
		dispatch(loginSuccess(res.data));
	} catch (err) {
		dispatch(loginFailure());
		handleError(err);
	}
};

export const register = async (dispatch, user) => {
	dispatch(loginStart());
	try {
		const res = await axios.post(
			process.env.REACT_APP_BACKEND_URL + "/auth/register",
			user
		);
		dispatch(loginFailure());
		showPopup("success", res.data.message);
	} catch (err) {
		dispatch(loginFailure());
		handleError(err);
    }
};