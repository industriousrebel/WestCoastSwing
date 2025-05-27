import React, { useState, useEffect } from 'react';
import { getUserCoaches } from '../../services/user';

const Home = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCoaches = async () => {
            try {
                const data = await getUserCoaches();
                console.log('Fetched coaches:', data);
                setCoaches(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCoaches();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Coaches</h1>
            <ul>
                {coaches.map(coach => (
                    <li key={coach.id}>{coach.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
