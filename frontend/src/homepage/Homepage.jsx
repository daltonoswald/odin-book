import { useEffect, useState } from 'react';
import Nav from '../nav/Nav';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { handleNewPost, handleLikePost, handleUnlikePost, 
            handleLikeComment, handleUnlikeComment, handleDeletePost,
            handleDeleteComment, handleNewComment } from '../utils/postUtils'
import smileIcon from '../assets/icons/smile.svg'
import './homepage.styles.css';
import Postfeed from './Postfeed';
import Trending from '../nav/Trending';

const Homepage = () => {
    const [token, setToken] = useState(localStorage.getItem('authenticationToken'))
    const [posts, setPosts] = useState([]);
    const [me, setMe] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getPosts = async () => {
            const url = `http://localhost:3000/post/find-posts`;
            const token = localStorage.getItem('authenticationToken');
            if (!token) {
                navigate('/');
            }
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (response.ok) {
                    const postData = await response.json()
                    setPosts(postData.posts);
                    setMe(postData.user);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error(`Errors: ${error}`);
            }
        }
        getPosts();
    }, [token])

    return (
        <>
        <Nav />
        <div className='content'>
            <div className='homepage-new-post'>
                <form onSubmit={handleNewPost} className="new-post-form">
                    {/* <input  
                        type='text'
                        id='content'
                        name='content'
                        placeholder='What is happening?'
                        required /> */}
                        <textarea 
                            id='content'
                            name='content'
                            placeholder='What is happening?'
                            maxLength={250}
                            required />
                    <button className="submit-button" type='submit'>Post</button>
                </form>
            </div>
            <Postfeed posts={posts} me={me} isLoading={isLoading} />    
        </div>
        <Trending />
        </>
    )
}

export default Homepage