import { Link } from "react-router-dom";
import Nav from "../nav/Nav";

export default function ErrorPage() {
    return (
        <>
            <Nav />
            <div>
                <p>Uh oh</p>
                <Link to='/'>
                    Go Back
                </Link>
            </div>
        </>
    )
}