/* eslint-disable react/jsx-key */
import { useEffect, useState } from 'react';
import Nav from '../nav/Nav';
import { useNavigate } from 'react-router-dom';
import './search.styles.css'

const Search = () => {
    const [token, setToken] = useState(localStorage.getItem('authenticationToken'))
    const [searchResults, setSearchResults] = useState(null);
    const navigate = useNavigate();

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
                console.log(data.users);
                setSearchResults(data.users);
            }
        } catch (error) {
            console.error(`Error requesting:`, error);
        }
    }

    const handleFollow = async (event) => {
        event.preventDefault();
        const url = `http://localhost:3000/user/follow-user`;
        const followId = {
            userToFollow: event.target.id
        }
        console.log(followId);
        try {
            const token = localStorage.getItem('authenticationToken');
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(followId),
                mode: "cors",
            });
            const data = await response.json();
            if (response.ok) {
                console.log(data);
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
                <label htmlFor='username'>Find Users</label>
                <input 
                    type='text'
                    id='username'
                    name='username'
                    placeholder='Search' />
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
                            <p>{searchResult.username}</p>
                            <button className='follow-button' onClick={handleFollow} id={searchResult.id}>Follow</button>
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