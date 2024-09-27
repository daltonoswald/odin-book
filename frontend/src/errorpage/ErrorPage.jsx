import { Link } from "react-router-dom";

export default function ErrorPage() {
    return (
        <div>
            <p>Uh oh</p>
            <Link to='/'>
                Go Back
            </Link>
        </div>
    )
}