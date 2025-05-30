import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserSignupStatus } from '../services/user';

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
    const [apiResult, setApiResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { isAuthenticated, isLoading: auth0Loading, user } = useAuth0();

    useEffect(() => {
        const fetchSignupStatus = async () => {
            // Wait for Auth0 to finish loading
            if (auth0Loading) return;
            
            // Only fetch if user is authenticated
            if (!isAuthenticated) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const result = await getUserSignupStatus();
                setApiResult(result);
               console.log(result); 
                // Auto-redirect to profile if signup is incomplete
                if (result['signup'] === false) {
                    navigate('/profile');
                }
            } catch (err) {
                console.error('Error fetching signup status:', err);
                setError(err.message || 'Failed to fetch signup status');
            } finally {
                setLoading(false);
            }
        };

        fetchSignupStatus();
    }, [isAuthenticated, auth0Loading, user, navigate]);

    const handleSignupResult = (result) => {
        setApiResult(result);
        if (result === false) {
            navigate('/profile');
        }
    };

    const contextValue = {
        apiResult,
        setApiResult,
        handleSignupResult,
        loading,
        error,
        isAuthenticated
    };

    return (
        <ApiContext.Provider value={contextValue}>
            {children}
        </ApiContext.Provider>
    );
};

export const useApiContext = () => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error('useApiContext must be used within an ApiProvider');
    }
    return context;
};