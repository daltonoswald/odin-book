import { useEffect, useState } from 'react';
import Nav from '../nav/Nav';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { handleLikePost, handleUnlikePost, handleLikeComment, handleUnlikeComment, handleDeletePost, handleDeleteComment } from '../utils/postUtils'
import './homepage.styles.css';

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
                    setMe(postData.user);
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
        const url = `http://localhost:3000/post/new-comment`
        const commentData = {
            content: event.target.content.value,
            postId: event.target.parentNode.parentNode.id
        }
        try {
            const token = localStorage.getItem('authenticationToken');
            const response = await fetch(url, 
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(commentData)
                })
                const data = await response.json();
                if (response.ok) {
                    console.log(data);
                    window.location.reload();
                }
        } catch (error) {
            console.error('Error requesting:', error);
        }
    }

    return (
        <>
        <Nav />
        <div className='content'>
            <div className='post-feed'>
                {(posts.length > 0 && !isLoading) && (
                    <>
                        {posts.map((post) => (
                            <div className='post' key={post.id} id={post.id}>
                                <div className='post-info'>
                                    <p className='post-name'>{post.user.first_name} {post.user.last_name}</p>
                                    <p className='post-username'>{post.user.username}</p>
                                    <p className='post-date'>{format(post.created_at, 'EEEE, MMMM dd, yyyy')}</p>
                                    {(post.userId === me.id) && (
                                        <button onClick={handleDeletePost}>Delete</button>
                                    )}
                                </div>
                                {/* <div className='post-content'>{post.content}</div> */}
                                <div className='post-content' dangerouslySetInnerHTML={{ __html: post.content} }></div>
                                <div className='post-interactions'>
                                    {(post.likes.length > 0) && (
                                        <button onClick={handleUnlikePost} id={post.id}>Unlike</button>
                                    )}
                                    {(post.likes.length === 0) && (
                                        <button onClick={handleLikePost} id={post.id}>Like</button>
                                    )}
                                    <p>{post._count.likes} Likes</p>
                                    {post.comments.map((comment) => (
                                        <div className='comment' key={comment.id} id={comment.id}>
                                            <div className='comment-info'>
                                                <p className='comment-name'>{comment.user.first_name} {comment.user.last_name}</p>
                                                <p className='comment-username'>{comment.user.username}</p>
                                                <p className='comment-date'>{format(comment.created_at, 'EEEE, MMMM dd, yyyy')}</p>
                                                {(comment.user.id === me.id) && (
                                                    <button onClick={handleDeleteComment}>Delete</button>
                                                )}
                                            </div>
                                            {/* <div className='comment-content'>{comment.content}</div> */}
                                            <div className='comment-content' dangerouslySetInnerHTML={{ __html: comment.content} }></div>
                                            <div className='comment-interactions'>
                                                {(comment.likes.length > 0) && (
                                                    <button onClick={handleUnlikeComment} id={comment.id}>Unlike</button>
                                                )}
                                                {(comment.likes.length === 0) && (
                                                    <button onClick={handleLikeComment} id={comment.id}>Like</button>
                                                )}
                                                <p>{comment._count.likes} Likes</p>
                                            </div>
                                        </div>
                                    ))}
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