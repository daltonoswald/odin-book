import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import githubIcon from '../assets/icons/github-original.svg'
import linkedinIcon from '../assets/icons/linkedin-plain.svg'
import odinIcon from '../assets/icons/the-odin-project.svg'
import { handleFollow, handleUnfollow } from '../utils/postUtils'
import followIcon from '../assets/icons/heartplus.svg'
import followedIcon from '../assets/icons/heart.svg'
import unfollowIcon from '../assets/icons/heartbroken.svg'
import './trending.styles.css';

export default function Trending() {
    const [isLoading, setIsLoading] = useState(true);
    const [trendingUsers, setTrendingUsers] = useState();
    const navigate = useNavigate()

    useEffect(() => {
        const getTrending = async () => {
            // const url = `http://localhost:3000/user/trending-users`;
            const url = `https://daltonoswald-odinbook.up.railway.app/user/trending-users`
            const token = localStorage.getItem('authenticationToken');
            if (!token) {
                navigate('/');
            }
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (response.ok) {
                    const trendingUserData = await response.json();
                    setTrendingUsers(trendingUserData.trendingUsers);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error(`Errors: ${error}`)
            }
        }
        getTrending();
    }, [navigate])

    return (
        <>
            <div className="trending">
                <div className="topics">
                    <a href='https://www.theodinproject.com/lessons/node-path-nodejs-odin-book' className="footer-odin">
                        <img className="trending-icon" src={odinIcon} alt="The Odin Project Icon"></img>
                        <p>The Odin Project</p>
                    </a>
                    <a href='https://github.com/daltonoswald/odin-book' className="footer-github">
                            <img className="trending-icon" src={githubIcon} alt="github icon" />
                            <p>Github</p>
                    </a>
                    <a href='https://linkedin.com/in/dalton-oswald-8aa955148' className="footer-linkedin">
                        <img className="trending-icon" src={linkedinIcon} alt="linkedin icon" />
                        <p>LinkedIn</p>
                    </a>
                </div>
                <div className="trending-users">
                    <h3>Popular Users</h3>
                    {(trendingUsers !== null && !isLoading) && (
                        <>
                            {trendingUsers.map((user) => (
                                <div className="trending-user" key={user.id} id={user.id}>
                                    <div className='trending-left'>
                                        <img src={user.picture} className="trending-user-picture" alt='trending user profile picture' />
                                        <Link
                                            to={`/profile/${user.username}`}
                                            key={user.id}
                                            >@{user.username}</Link>
                                    </div>
                                {(user.followed_by.length > 0) && (
                                <div className='follow-container'>
                                    <img className='followed icon' id={user.id} src={followedIcon} alt='unfollow user' 
                                    onClick={handleUnfollow}
                                    onMouseOver={e => (e.currentTarget.src= unfollowIcon)} 
                                    onMouseOut={e => (e.currentTarget.src= followedIcon)} 
                                     />
                                </div>
                            )}
                            {(user.followed_by.length < 1) && (
                                <div className='follow-container'>
                                    <img className='follow icon' id={user.id} src={followIcon} alt='follow user' onClick={handleFollow} />
                                </div>
                            )}
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </>
    )
}