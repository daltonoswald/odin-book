import { useEffect, useState } from 'react';
import Nav from '../nav/Nav';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const Homepage = () => {
    const [token, setToken] = useState(localStorage.getItem('authenticationToken'))
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
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
                    console.log(postData.posts);
                    console.log(postData.user);
                    setPosts(postData.posts);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error(`Errors: ${error}`);
            }
        }
        getPosts();
    }, [token])

    const handleNewComment = async (event) => {
        event.preventDefault();
        console.log('new comment');
    }

    const handleLikePost = async (event) => {
        event.preventDefault();
        console.log('liked post')
    }

    return (
        <>
        <Nav />
        <div className='content'>
            <div className='post-feed'>
                {(posts.length > 0 && !isLoading) && (
                    <>
                        {posts.map((post) => (
                            <div className='post' key={post.id}>
                                <div className='post-info'>
                                    <p className='post-name'>{post.user.first_name} {post.user.last_name}</p>
                                    <p className='post-username'>{post.user.username}</p>
                                    <p className='post-date'>{format(post.created_at, 'EEEE, MMMM dd, yyyy')}</p>
                                </div>
                                <div className='post-content'>{post.content}</div>
                                <div className='post-interactions'>
                                    <div className='post-likes'>{post.likes.length} likes</div>
                                    <button onClick={handleLikePost}>Like</button>
                                    <form onSubmit={handleNewComment} className='new-comment-form'>
                                        <input 
                                            type='text'
                                            id='content'
                                            name='content'
                                            required />
                                        <button className='new-comment-button' type='submit'>Reply</button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </>
                )}
                {(posts.length === 0 && !isLoading) && (
                    <>
                        <div className='no-posts'>
                            <p>No posts yet...</p>
                        </div>
                    </>
                )}
                {(isLoading) && (
                    <p>Loading posts...</p>
                )}
            </div>     
        </div>
        </>
    )
}

export default Homepage