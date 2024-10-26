import { useEffect, useState } from 'react';
import Nav from '../nav/Nav';
import { useNavigate } from 'react-router-dom';
import { handleNewPost } from '../utils/postUtils'
import './homepage.styles.css';
import Postfeed from './Postfeed';
import Trending from '../nav/Trending';

const Homepage = () => {
    const token = localStorage.getItem('authenticationToken');
    const [error, setError] = useState();
    const [posts, setPosts] = useState([]);
    const [me, setMe] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getPosts = async () => {
            // const url = `http://localhost:3000/post/find-posts`;
            const url = `https://daltonoswald-odinbook.up.railway.app/post/find-posts`
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
                } else {
                    const errorData = await response.json();
                    setError(errorData.error);
                    console.error(`Errors: `, errorData.error)
                }
            } catch (err) {
                console.error(`Errors: ${err}`);
            }
        }
        getPosts();
    }, [token, navigate])

    return (
        <>
        <Nav />
        <div className='content'>
            <div className='homepage-new-post'>
                <form onSubmit={handleNewPost} className="new-post-form">
                        <textarea 
                            id='content'
                            name='content'
                            placeholder='What is happening?'
                            maxLength={250}
                            required />
                    <button className="submit-button" type='submit'>Post</button>
                </form>
            </div>
            <Postfeed posts={posts} me={me} isLoading={isLoading} error={error} />    
        </div>
        <Trending />
        </>
    )
}

export default Homepage