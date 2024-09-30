import { Link, useNavigate } from "react-router-dom";

export default function Nav() {
    const navigate = useNavigate()

    function logout() {
        localStorage.removeItem('authenticationToken');
        localStorage.removeItem('username');
        navigate('/');
    }

    return (
        <div className='nav'>
            <div className="nav-left">
                <Link to='/home'>Home</Link>
            </div>
            <div className="nav-right">
                {localStorage.getItem('authenticationToken') && (
                    <>
                        <p>{localStorage.getItem('username')}</p>
                        <button onClick={logout}>Log out</button>
                    </>
                )}
                {!localStorage.getItem('authenticationToken') && (
                    <>
                        <Link to='/'>Log In</Link>
                        <Link to='/'>Sign Up</Link>
                    </>
                )}
            </div>
        </div>
    )
}