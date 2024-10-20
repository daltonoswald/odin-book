/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './profile.styles.css'

export default function EditProfile({openEdit, setOpenEdit, profileData, me, setMe}) {
    const navigate = useNavigate();
    const [message, setMessage] = useState();
    const params = useParams();

    const closeModal = () => {
        setOpenEdit(false);
    }

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
                    console.log(profileData);
                    setMe(profileData.user);
                }
            } catch (error) {
                console.error(`Errors: ${error}`);
            }
        }
        getProfile();
    }, [])

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('authenticationToken');
        const url = `http://localhost:3000/user/edit-profile`
        const formData = {
            first_name: event.target.first_name.value,
            last_name: event.target.last_name.value,
            username: event.target.username.value,
            bio: event.target.bio.value,
        };
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData),
                mode: "cors",
            });
            const data = await response.json();

            if (response.ok) {
                console.log(data.updatedUser.username)
                localStorage.setItem('username', data.updatedUser.username);
                setMe(data.user)
                setOpenEdit(false);
                navigate(`/profile/${event.target.username.value}`)
                navigate(0);
            } else {
                console.error("Error requesting authentication:", data.message);
                setMessage(data.message)
            }
        } catch (error) {
            console.error('Error requesting authentication:', error);
        }
    }

    return (
        <div className="edit-profile-modal">
            <button onClick={closeModal} className="close-modal">X</button>
            <form onSubmit={handleEditSubmit} className="edit-profile-form">
                <h1>Edit Profile</h1>
                <label htmlFor="first_name">First Name</label>
                <input 
                    type='text'
                    id='first_name'
                    name='first_name' 
                    defaultValue={profileData.first_name}
                    required />
                <label htmlFor="last_name">Last Name</label>
                <input 
                    type='text'
                    id='last_name'
                    name='last_name' 
                    defaultValue={profileData.last_name}
                    required />
                <label htmlFor="username">Username</label>
                <input 
                    type='text'
                    id='user_name'
                    name='username' 
                    defaultValue={profileData.username}
                    required />
                <label htmlFor="bio">About Me</label>
                <input 
                    type='text'
                    id='bio'
                    name='bio' 
                    defaultValue={profileData.bio}
                    required />
                <button className="submit-button">Save</button>
            </form>
        </div>
    )
}