/* eslint-disable react/prop-types */
import { format } from 'date-fns';
import {    handleLikePost, handleUnlikePost, 
            handleLikeComment, handleUnlikeComment, handleDeletePost,
            handleDeleteComment, handleNewComment } from '../utils/postUtils'
import smileIcon from '../assets/icons/smile.svg'
import frownIcon from '../assets/icons/frown.svg'
import './postfeed.styles.css'
import { Link } from "react-router-dom";

export default function Postfeed({posts, isLoading, me}) {

    return (
        <div className='post-feed'>
        {(posts.length > 0 && !isLoading) && (
            <>
                {posts.map((post) => (
                    <div className='post' key={post.id} id={post.id}>
                        <div className='post-info'>
                            <div className='post-info-left'>
                                <img src={post.user.picture} className='post-profile-picture' alt='user profile picture'></img>
                                <div className='post-names'>
                                    <p className='post-name'>{post.user.first_name} {post.user.last_name}</p>
                                    <Link 
                                        to={`/profile/${post.user.username}`}
                                        key={post.user.id}
                                        >@{post.user.username}</Link>
                                </div>
                            </div>
                            <div className='post-info-right'>
                            <p className='post-date'>{format(post.created_at, 'EEEE, MMMM dd, yyyy')}</p>
                                {(post.user.id === me.user.id) && (
                                    <button onClick={handleDeletePost}>Delete</button>
                                )}
                            </div>
                        </div>
                        {/* <div className='post-content'>{post.content}</div> */}
                        <div className='post-content' dangerouslySetInnerHTML={{ __html: post.content} }></div>
                        <div className='post-interactions'>
                            <div className='post-likes'>
                                {(post.likes.length > 0) && (
                                    <div className='icon-container'>
                                        <img className='unlike icon' id={post.id} src={smileIcon} alt='unlike post'
                                        onMouseOver={e => (e.currentTarget.src= frownIcon)}
                                        onMouseOut={e => (e.currentTarget.src= smileIcon)}
                                        onClick={handleUnlikePost} />
                                    </div>
                                )}
                                {(post.likes.length === 0) && (
                                    <div className='icon-container'>
                                        <img className='like icon' id={post.id} src={smileIcon} alt='like post' onClick={handleLikePost} />
                                    </div>
                                )}
                                <p>{post._count.likes} Likes</p>
                            </div>
                            {post.comments.map((comment) => (
                                <div className='comment' key={comment.id} id={comment.id}>
                                    <div className='comment-info'>
                                        <div className='comment-info-left'>
                                            <img src={comment.user.picture} className='comment-profile-picture' alt='user profile picture'></img>
                                            <div className='comment-names'>
                                                <p className='comment-name'>{comment.user.first_name} {comment.user.last_name}</p>
                                                {/* <p className='comment-username'>{comment.user.username}</p> */}
                                                <Link
                                                    to={`/profile/${comment.user.username}`}
                                                    key={comment.user.id}
                                                    >@{comment.user.username}</Link>
                                            </div>
                                        </div>
                                        <div className='comment-info-right'>
                                            <p className='comment-date'>{format(comment.created_at, 'EEEE, MMMM dd, yyyy')}</p>
                                            {(comment.user.id === me.user.id) && (
                                                <button onClick={handleDeleteComment}>Delete</button>
                                            )}
                                        </div>
                                    </div>
                                    {/* <div className='comment-content'>{comment.content}</div> */}
                                    <div className='comment-content' dangerouslySetInnerHTML={{ __html: comment.content} }></div>
                                    <div className='comment-interactions'>
                                        <div className='comment-likes'>
                                            {(comment.likes.length > 0) && (
                                                <div className='icon-container'>
                                                    <img className='unlike icon' id={comment.id} src={smileIcon} alt='unlike post' 
                                                    onMouseOver={e => (e.currentTarget.src= frownIcon)}
                                                    onMouseOut={e => (e.currentTarget.src= smileIcon)}
                                                    onClick={handleUnlikeComment} />
                                                </div>
                                            )}
                                            {(comment.likes.length === 0) && (
                                                <div className='icon-container'>
                                                    <img className='like icon' id={comment.id} src={smileIcon} alt='like post' onClick={handleLikeComment} />
                                                </div>
                                            )}
                                            <p>{comment._count.likes} Likes</p>
                                        </div>
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
    )
}