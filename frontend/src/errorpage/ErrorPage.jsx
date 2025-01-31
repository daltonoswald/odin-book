import { Link, useNavigate, useRouteError } from "react-router-dom";
import './errorpage.styles.css';

export default function ErrorPage() {
    const navigate = useNavigate();
    const error = useRouteError();

    function logout() {
        localStorage.removeItem('authenticationToken');
        localStorage.removeItem('username');
        navigate('/');
    }

    return (
        <>
            <div className="error-page">
                <p>Uh oh! You&apos;ve seem to have run into an error!</p>
                <p>{error.status} {error.data}</p>
                {/* <p>{error.toString()}</p> */}
                <Link to='/'>
                    Go back to the Homepage
                </Link>
                <p>Still not working? Try logging out.</p>
                <button onClick={logout}>Log out</button>

            </div>
        </>
    )
}