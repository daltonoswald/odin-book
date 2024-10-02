import { useEffect, useState } from 'react';
import Nav from '../nav/Nav';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
    const [token, setToken] = useState(localStorage.getItem('authenticationToken'))
    const [posts, setPosts] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const getPosts = async () => {
            const url = `http://localhost:3000/post/find-posts`;
            const token = localStorage.getItem('authenticationToken');
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
                    console.log(postData.posts[0]);
                    setPosts(postData.posts[0])
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
            <div className='post-feed'>
            </div>     
        </div>
        </>
    )
}

export default Homepage