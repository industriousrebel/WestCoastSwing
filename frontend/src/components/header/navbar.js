import { use, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from '../authentication/logout';

const Navbar = () => {
    
const { user, isAuthenticated, isLoading } = useAuth0();
    return (
        <div className="navbar bg-base-100 shadow-lg">
            <div className="navbar-start">
                <Link to="/" className="btn btn-ghost text-xl font-bold">
                    WestCoastSwing
                </Link>
            </div>
            <div className="navbar-end">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <Link to="/" className="btn btn-ghost">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/newcoachlist" className="btn btn-ghost">
                            Coach List
                        </Link>
                    </li>
                    <li>
                        <Link to="/test" className="btn btn-ghost">
                            Video Platform
                        </Link>
                    </li>
                    
                    <li>
                        <Link to="/upload" className="btn btn-ghost">
                            Upload Video
                        </Link>
                    </li>
                </ul>
                {isAuthenticated && user && (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost">
                            Welcome, {user.name}
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            <li>
                                <LogoutButton />
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
