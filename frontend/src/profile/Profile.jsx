/* eslint-disable react/jsx-key */
import { useEffect, useState } from 'react';
import Nav from '../nav/Nav';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { handleLikePost, handleUnlikePost, handleLikeComment, handleUnlikeComment, handleDeletePost, handleDeleteComment, handleNewComment,
    handleFollow, handleUnfollow
 } from '../utils/postUtils'
import followIcon from '../assets/icons/heartplus.svg'
import unfollowIcon from '../assets/icons/heartbroken.svg'
import followedIcon from '../assets/icons/heart.svg';
import './profile.styles.css'
import Postfeed from '../homepage/Postfeed';

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
            if (!token) {
                navigate('/');
            }
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
                <div className='profile-header-top'>
                    <div className='profile-header-top-name'>
                        <h1>{profileData.first_name} {profileData.last_name}</h1>
                        <h2>{profileData.username}</h2>
                    </div>
                    {(profileData.id === me.user.id) && (
                        <button className='edit-profile-button' id={profileData.id}>Edit Profile</button>
                    )}
                    {((profileData.followed_by.length > 0) && (profileData.id !== me.user.id)) && (
                        <div className='follow-container'>
                            <img className='followed icon' id={profileData.id} src={followedIcon} alt='unfollow user' 
                                onClick={handleUnfollow} 
                                onMouseOver={e => (e.currentTarget.src= unfollowIcon)} 
                                onMouseOut={e => (e.currentTarget.src= followedIcon)} 
                                />
                        </div>
                    )}
                    {((profileData.followed_by.length < 1) && (profileData.id !== me.user.id)) && (
                        <div className='follow-container'>
                            <img className='follow icon' id={profileData.id} src={followIcon} alt='follow user' onClick={handleFollow} />
                        </div>
                    )}
                </div>
                <p>{profileData.bio}</p>
                <div className='following-data'>
                    <p>{profileData._count.followed_by} Followers</p>
                    <p>{profileData._count.following} Following</p>
                </div>
            </div>
            <Postfeed posts={profileData.posts} me={me} isLoading={isLoading} />
        </div>
        </>
    )
}

export default Search