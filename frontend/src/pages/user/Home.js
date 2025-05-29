import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserCoaches } from '../../services/user';
import Navbar from '../../components/header/navbar';

const Home = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCoaches = async () => {
            try {
                const data = await getUserCoaches();
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
        <div className="min-h-screen bg-black">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-white mb-8 text-center">
                    Your Coaches
                </h1>
                <div className="mb-6 text-center">
                    <Link 
                        to="/newcoachlist" 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                    >
                        View All Coaches
                    </Link>
                </div>
                <div className="space-y-6">
                    {coaches.map(coach => (
                        <div key={coach.id} className="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-700 flex items-center">
                            <div className="flex-1">
                                <div className="flex items-center mb-2">
                                    <h3 className="text-xl font-semibold text-white mr-3">
                                        {coach.name}
                                    </h3>
                                    {coach.reviewed_all && (
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    )}
                                </div>
                                <div className="text-gray-300">
                                    {coach.specialty && (
                                        <p className="text-sm">Specialty: {coach.specialty}</p>
                                    )}
                                    {coach.experience && (
                                        <p className="text-sm">Experience: {coach.experience}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {coaches.length === 0 && (
                    <div className="text-center text-gray-400 mt-8">
                        No coaches found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
