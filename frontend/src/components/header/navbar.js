import { Link } from 'react-router-dom';

const Navbar = () => {
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
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
