/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './profile.styles.css'

export default function EditProfile({ setOpenEdit, profileData, setMe}) {
    const navigate = useNavigate();
    const [image, setImage] = useState('');
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

    const handlePictureSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData()
            data.append('file', image)
            data.append('upload_preset', 'oujmgi7l');
            data.append('cloud_name', 'djqgww7lw')
            await fetch("https://api.cloudinary.com/v1_1/djqgww7lw/image/upload", {
                method: "post",
                body: data
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                console.log(data.secure_url);
                sendData(data);
            })
    }

    async function sendData(data) {
        const token = localStorage.getItem('authenticationToken');
        const url = `http://localhost:3000/user/edit-profile-picture`
        const formData = {
            picture: data.secure_url
        };
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData),
                mode: 'cors',
            });

            if (response.ok) {
                setOpenEdit(false);
                navigate(0);
            }
        } catch (error) {
            console.error(`Error requesting authentication:`, error);
        }
    }

    async function handleEditSubmit(event) {
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
                console.log(event.target.username.value);
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
            <div className="edit-profile-picture">
                <img src={profileData.picture} className={'edit-profile-picture-image'} />
                <input type='file' onChange={(e) => setImage(e.target.files[0])}></input>
                <button onClick={handlePictureSubmit}>Upload</button>
            </div>
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
            {message && (
                <p className="error-message">{message}</p>
            )}
        </div>
    )
}