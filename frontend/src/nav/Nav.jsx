import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NewPost from "./NewPost";
import './nav.styles.css';

export default function Nav() {
    const navigate = useNavigate()
    const [openNewPost, setOpenNewPost] = useState(false);

    function logout() {
        localStorage.removeItem('authenticationToken');
        localStorage.removeItem('username');
        navigate('/');
    }

    function handleNewPost() {
        if (!openNewPost) {
            setOpenNewPost(true);
        } else {
            setOpenNewPost(false);
        }
    }

    return (
        <>
        <div className='nav'>
            <div className='nav-top'>
                <Link to='/home'>OdinBook</Link>
                <Link to='/home'>Home</Link>
                <Link to='/search'>Explore</Link>
                <button onClick={handleNewPost}>New Post</button>          
            </div>
            <div className="nav-bottom">
                <Link to='profile'>{localStorage.getItem('username')}</Link>
                <button onClick={logout}>Logout</button>
            </div>
        </div>

        {openNewPost && (
            <NewPost openNewPost={openNewPost} setOpenNewPost={setOpenNewPost} />
        )}
        </>
    )
}