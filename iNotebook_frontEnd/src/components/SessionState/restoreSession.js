import { fetchSecretKeyFromServer } from '../Requests/getSecretKey';
import { login, logout, setSecretKey } from './sessionSlice';

const restoreSession = () => {
  return async (dispatch) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/getstate`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      const json = await res.json();
      if (json.error) {
        return;
      }
      if (json.status === 1) {
        dispatch(login({
          isAdmin: json.data.isAdminUser,
          permissions: json.data.permissions,
        }));
        dispatch(setSecretKey(await fetchSecretKeyFromServer()));
      } else {
        dispatch(logout());
      }
    } catch (err) {
      console.error("Session fetch failed:", err);
      dispatch(logout());
    }
  };
};

export default restoreSession;
