import { useState, useEffect } from 'react';
import Navbar from '../../components/header/navbar';
import { getAvailableCoaches } from '../../services/user';

const Coaches = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoaches = async () => {
            try {
                const availableCoaches = await getAvailableCoaches();
                setCoaches(availableCoaches);
            } catch (error) {
                console.error('Error fetching coaches:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCoaches();
    }, []);

    if (loading) {
        return <div className="text-gray-300 bg-gray-900 min-h-screen p-5">Loading coaches...</div>;
    }

    return (
        <div className="bg-gray-900 min-h-screen">
            <Navbar />
            <div className="p-5 max-w-6xl mx-auto">
                <h1 className="text-center mb-8 text-gray-300 text-2xl">Available Coaches</h1>
                <div className="space-y-4">
                    {coaches.map((coach) => (
                        <div 
                            key={coach.id} 
                            className="bg-gray-800 border border-gray-600 rounded-lg p-5 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                        >
                            <h3 className="mb-2 text-white text-xl font-medium">{coach.name}</h3>
                            <p className="mb-1 text-gray-400 font-medium">{coach.specialty}</p>
                            <p className="text-gray-500">{coach.experience}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Coaches;
