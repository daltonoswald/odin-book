import { useEffect, useState } from 'react';
import Nav from '../nav/Nav';
import { useNavigate, useParams } from 'react-router-dom';
import { handleFollow, handleUnfollow } from '../utils/postUtils'
import followIcon from '../assets/icons/heartplus.svg'
import unfollowIcon from '../assets/icons/heartbroken.svg'
import followedIcon from '../assets/icons/heart.svg';
import odinIcon from '../assets/icons/the-odin-project.svg'
import './profile.styles.css'
import Postfeed from '../homepage/Postfeed';
import Trending from '../nav/Trending';
import EditProfile from './EditProfile';

const Profile = () => {
    // const [token, setToken] = useState(localStorage.getItem('authenticationToken'))
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState();
    const [me, setMe] = useState();
    const [following, setFollowing] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        const getProfile = async () => {
            // const url = `http://localhost:3000/user/profile/${params.username}`;
            const url =`https://daltonoswald-odinbook.up.railway.app/user/profile/${params.username}`
            const token = localStorage.getItem('authenticationToken');
            if (!token) {
                // navigate('/', {state: {errorMessage: 'JWT Token'}});
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
                if (!response.ok) {
                    const errorData = await response.json();
                    setIsLoading(false);
                    console.error(`errorData`, errorData.error);
                    setError(errorData)
                }
                if (response.ok) {
                    const profileData = await response.json();
                    setProfileData(profileData.profile);
                    profileData.profile.followed_by.forEach((element) => {
                        if (element.followed_by.id === profileData.user.user.id) {
                            setFollowing(true)
                        }
                    })
                    setMe(profileData.user);
                    setError(null);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error(`Errors: ${error}`);
            }
        }
        getProfile();
    }, [params.username, navigate])

    if (isLoading) {
        return (
            <p>Loading...</p>
        )
    }

    const handleOpenEdit = () => {
        setOpenEdit(true);
    }

    if (!isLoading && error) {
        console.log(error.error)
        return (
            <>
                <Nav />
                <div className='content'>
                    <div className='profile-error'>
                        {error.error}
                    </div>
                </div>
                <Trending />
            </>
        )
        
    }

    if (!isLoading && !error) {
    return (
        <>
        <Nav />
        <div className='content'>
            <div className='profile-header'>
                <div className='profile-header-top'>
                    <div className='profile-header-top-left'>
                            <img src={profileData.picture || odinIcon} className='profile-page-picture' alt='profile picture' />
                            <div className='profile-header-top-name'>
                            <h1>{profileData.first_name} {profileData.last_name}</h1>
                            <h2>@{profileData.username}</h2>
                        </div>
                    </div>
                    {(profileData.id === me.user.id && profileData.username !== 'Guest')  && (
                        <button className='edit-profile-button' id={profileData.id} onClick={handleOpenEdit}>Edit Profile</button>
                    )}
                    {(profileData.id === me.user.id && profileData.username === 'Guest') && (
                        <button className='edit-profile-button'>Edit Profile Disabled</button>
                    )}
                    {(following && (profileData.id !== me.user.id)) && (
                        <div className='follow-container'>
                            <img className='followed icon' id={profileData.id} src={followedIcon} alt='unfollow user' 
                                onClick={handleUnfollow} 
                                onMouseOver={e => (e.currentTarget.src= unfollowIcon)} 
                                onMouseOut={e => (e.currentTarget.src= followedIcon)} 
                                />
                        </div>
                    )}
                    {/* {((profileData.followed_by.length < 1) && (profileData.id !== me.user.id)) && ( */}
                    {(!following && (profileData.id !== me.user.id)) && (
                        <div className='follow-container'>
                            <img className='follow icon' id={profileData.id} src={followIcon} alt='follow user' onClick={handleFollow} />
                        </div>
                    )}
                </div>
                {/* <p>{profileData.bio}</p> */}
                <p dangerouslySetInnerHTML={{ __html: profileData.bio} }></p>
                <div className='following-data'>
                    <p>{profileData._count.followed_by} Followers</p>
                    <p>{profileData._count.following} Following</p>
                </div>
                {( openEdit && !isLoading) && (
                    <EditProfile  setOpenEdit={setOpenEdit} profileData={profileData} setMe={setMe} />
                )}
            </div>
            <Postfeed posts={profileData.posts} me={me} isLoading={isLoading} />
        </div>
        <Trending />
        </>
    )
}
}

export default Profile