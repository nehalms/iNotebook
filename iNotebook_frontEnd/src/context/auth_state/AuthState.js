import React, { useState, useEffect, useCallback } from 'react';
import AuthContext from './authContext';
import { history } from '../../components/History';

const AuthState = (props) => {
    const [userState, setUserState] = useState({
        loggedIn: false,
        isAdminUser: false,
        permissions: [],
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
                return;
            }
            if (json.status === 1) {
                setUserState(json.data);
                return json.data;
            }

        } catch (err) {
            console.error('Error fetching user state:', err);
        }
    }, [handleSessionExpiry]);

    const resetUserState = useCallback(() => {
        setUserState({ loggedIn: false, isAdminUser: false });
    }, []);

    useEffect(() => {
        fetchUserState();
    }, [fetchUserState]);

    return (
        <AuthContext.Provider
            value={{
                userState,
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