import React, { useState } from 'react';
import Navbar from '../../components/header/navbar';
const Profile = () => {
    const [user, setUser] = useState({
        id: '',
        username: '',
        name: '',
        wsdc_id: '',
        level: '',
        primary_role: '',
        created_at: ''
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your save logic here
        setIsEditing(false);
    };

    const handleCancel = () => {
        // Reset form or reload original data
        setIsEditing(false);
    };

    return (
        <>
        <Navbar/>
        <div className="min-h-screen bg-base-200 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-6">User Profile</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Username</span>
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={user.username}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Name</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={user.name}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">WSDC ID</span>
                                </label>
                                <input
                                    type="text"
                                    name="wsdc_id"
                                    value={user.wsdc_id}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Level</span>
                                </label>
                                <input
                                    type="text"
                                    name="level"
                                    value={user.level}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Primary Role</span>
                                </label>
                                <input
                                    type="text"
                                    name="primary_role"
                                    value={user.primary_role}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="input input-bordered w-full"
                                />
                            </div>
                            
                            <div className="card-actions justify-end mt-6">
                                {isEditing ? (
                                    <div className="space-x-2">
                                        <button type="button" onClick={handleCancel} className="btn btn-ghost">
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Save
                                        </button>
                                    </div>
                                ) : (
                                    <button type="button" onClick={() => setIsEditing(true)} className="btn btn-primary">
                                        Edit
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Profile;