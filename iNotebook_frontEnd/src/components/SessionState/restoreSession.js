import { fetchSecretKeyFromServer } from '../Requests/getSecretKey';
import { login, logout, setSecretKey, setLoading } from './sessionSlice';

const restoreSession = () => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
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
          email: json.data.email,
          isAdmin: json.data.isAdminUser,
          permissions: json.data.permissions,
          isPinSet: json.data.isPinSet,
        }));
        dispatch(setSecretKey(await fetchSecretKeyFromServer()));
      } else {
        dispatch(logout());
      }
    } catch (err) {
      console.error("Session fetch failed:", err);
      dispatch(logout());
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export default restoreSession;
