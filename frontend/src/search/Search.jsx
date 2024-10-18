/* eslint-disable react/jsx-key */
import { useEffect, useState } from 'react';
import Nav from '../nav/Nav';
import { Link, useNavigate } from 'react-router-dom';
import { handleFollow, handleUnfollow } from '../utils/postUtils'
import followIcon from '../assets/icons/heartplus.svg'
import followedIcon from '../assets/icons/heart.svg'
import unfollowIcon from '../assets/icons/heartbroken.svg'
import './search.styles.css'

const Search = () => {
    const [token, setToken] = useState(localStorage.getItem('authenticationToken'))
    const [searchResults, setSearchResults] = useState(null);
    const [user, setUser] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token])

    const handleSearch = async (event) => {
        event.preventDefault();
        const url = `http://localhost:3000/user/find-users`;
        const formData = {
            username: event.target.username.value
        };
        console.log(formData);
        try {
            const token = localStorage.getItem('authenticationToken');
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData),
                mode: "cors",
            });
            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                setSearchResults(data.userList);
            }
        } catch (error) {
            console.error(`Error requesting:`, error);
        }
    }

    return (
        <>
        <Nav />
        <div className='content'>
            <form onSubmit={handleSearch} className='search-form'>
                <textarea
                    type='text'
                    id='username'
                    name='username'
                    placeholder='Find users' />
                <button className='submit-button' type='submit'>Search</button>
            </form>
            <div className='search-results'>
                {(searchResults === null) && (
                    <>
                        <p>Search for users</p>
                    </>
                )}
                {(searchResults !== null && searchResults.length === 0) && (
                    <>
                        <p>No users found.</p>
                    </>
                )}
                {(searchResults !== null && searchResults.length > 0) && (
                    <>
                    {searchResults.map((searchResult) => (
                        <div className='user' key={searchResult.id} id={searchResult.id}>
                            <Link
                                to={`/profile/${searchResult.username}`}
                                key={searchResult.id}
                                >{searchResult.username}</Link>
                            <p>{searchResult._count.followed_by} Followers</p>
                            {(searchResult.followed_by.length > 0) && (
                                <div className='follow-container'>
                                    <img className='followed icon' id={searchResult.id} src={followedIcon} alt='unfollow user' 
                                    onClick={handleUnfollow}
                                    onMouseOver={e => (e.currentTarget.src= unfollowIcon)} 
                                    onMouseOut={e => (e.currentTarget.src= followedIcon)} 
                                     />
                                </div>
                            )}
                            {(searchResult.followed_by.length < 1) && (
                                <div className='follow-container'>
                                    <img className='follow icon' id={searchResult.id} src={followIcon} alt='follow user' onClick={handleFollow} />
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

export default Search