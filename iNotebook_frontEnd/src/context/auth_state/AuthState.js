import AuthContext from './authContext';
import { history } from '../../components/History';
import { useState, useEffect, useCallback } from 'react';

const AuthState = (props) => {
    const [userState, setUserState] = useState({
        loggedIn: false,
        isAdminUser: false,
    });

    const handleSessionExpiry = useCallback((json) => {
        if (json.sessionexpired) {
            setUserState({ loggedIn: false, isAdminUser: false });
            history.navigate('/login');
        }
    }, []);

    const fetchUserState = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/getstate`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const json = await response.json();
            if (json.error) {
                handleSessionExpiry(json);
            }
            if (json.status === 1) {
                setUserState(json.data);
                return json.data;
            }
            return userState;
        } catch (err) {
            console.error('Error fetching user state:', err);
        }
    }, []);

    const getUserState = async () => {
        // if (!userState.loggedIn) {
        //     return await fetchUserState();
        // }
        return userState;
    };

    const resetUserState = () => {
        setUserState({ loggedIn: false, isAdminUser: false });
    };

    useEffect(() => {
        fetchUserState();
    }, [fetchUserState]);

    return (
        <AuthContext.Provider
            value={{
                userState,
                getUserState,
                fetchUserState,
                handleSessionExpiry,
                resetUserState,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthState;
