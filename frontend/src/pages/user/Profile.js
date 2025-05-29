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
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username:</label>
                <input
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
            </div>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
            </div>
            <div>
                <label>WSDC ID:</label>
                <input
                    type="text"
                    name="wsdc_id"
                    value={user.wsdc_id}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
            </div>
            <div>
                <label>Level:</label>
                <input
                    type="text"
                    name="level"
                    value={user.level}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
            </div>
            <div>
                <label>Primary Role:</label>
                <input
                    type="text"
                    name="primary_role"
                    value={user.primary_role}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
            </div>
            
            {isEditing ? (
                <div>
                    <button type="submit">Save</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                </div>
            ) : (
                <button type="button" onClick={() => setIsEditing(true)}>Edit</button>
            )}
        </form>
    );
};