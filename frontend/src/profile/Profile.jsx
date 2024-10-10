/* eslint-disable react/jsx-key */
import { useEffect, useState } from 'react';
import Nav from '../nav/Nav';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
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
        </>
    )
}

export default Search