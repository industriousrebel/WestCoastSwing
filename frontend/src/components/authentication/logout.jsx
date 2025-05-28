import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
    const { logout, isAuthenticated } = useAuth0();

    const handleLogout = () => {
        logout({
            logoutParams: {
                returnTo: window.location.origin
            }
        });
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <button onClick={handleLogout} className="logout-button">
            Log Out
        </button>
    );
};

export default LogoutButton;