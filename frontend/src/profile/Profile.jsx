/* eslint-disable react/jsx-key */
import { useEffect, useState } from 'react';
import Nav from '../nav/Nav';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { handleLikePost, handleUnlikePost, handleLikeComment, handleUnlikeComment, handleDeletePost, handleDeleteComment, handleNewComment,
    handleFollow, handleUnfollow
 } from '../utils/postUtils'
// import './profile.styles.css'

const Search = () => {
    // const [token, setToken] = useState(localStorage.getItem('authenticationToken'))
    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState();
    const [me, setMe] = useState();
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        const getProfile = async () => {
            const url = `http://localhost:3000/user/profile/${params.username}`;
            const token = localStorage.getItem('authenticationToken');
            const userToFind = {
                userToFind: params.username
            }
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(userToFind),
                    mode: "cors",
                })
                if (response.ok) {
                    const profileData = await response.json()
                    console.log(`Me: `, profileData.user.user.id)
                    console.log(profileData.profile)
                    setProfileData(profileData.profile);
                    setMe(profileData.user);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error(`Errors: ${error}`);
            }
        }
        getProfile();
    }, [params.username])

    if (isLoading) {
        return (
            <p>Loading...</p>
        )
    }

    return (
        <>
        <Nav />
        <div className='content'>
            <div className='profile-header'>
                <h1>{profileData.first_name} {profileData.last_name}</h1>
                <h2>{profileData.username}</h2>
                <p>{profileData.bio}</p>
                <div className='following-data'>
                    <p>{profileData._count.followed_by} Followers</p>
                    <p>{profileData._count.following} Following</p>
                </div>
                {(profileData.id === me.user.id) && (
                    <p>Thats me</p>
                )}
                {((profileData.followed_by.length > 0) && (profileData.id !== me.user.id)) && (
                    <button className='follow-button' onClick={handleUnfollow} id={profileData.id}>Unfollow</button>
                )}
                {((profileData.followed_by.length < 1) && (profileData.id !== me.user.id)) && (
                    <button className='follow-button' onClick={handleFollow} id={profileData.id}>Follow</button>
                )}
            </div>
            <div className='post-feed'>
                {(profileData.posts.length > 0 && !isLoading) && (
                    <>
                        {profileData.posts.map((post) => (
                            <div className='post' key={post.id} id={post.id}>
                                <div className='post-info'>
                                    {/* <p className='post-name'>{post.user.first_name} {post.user.last_name}</p> */}
                                    {/* <p className='post-username'>{post.user.username}</p> */}
                                    <Link 
                                        to={`/profile/${post.user.username}`}
                                        key={post.user.id}
                                        >{post.user.username}</Link>
                                    <p className='post-date'>{format(post.created_at, 'EEEE, MMMM dd, yyyy')}</p>
                                    {(post.user.id === me.user.id) && (
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
                                                {/* <p className='comment-username'>{comment.user.username}</p> */}
                                                <Link
                                                    to={`/profile/${comment.user.username}`}
                                                    key={comment.user.id}
                                                    >{comment.user.username}</Link>
                                                <p className='comment-date'>{format(comment.created_at, 'EEEE, MMMM dd, yyyy')}</p>
                                                {(comment.user.id === me.user.id) && (
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
                {(profileData.posts.length === 0 && !isLoading) && (
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

export default Search