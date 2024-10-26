/* eslint-disable react/prop-types */
import { useState } from "react";
import './signup.styles.css';

export default function SignUp({ setOpenSignUp, setOpenLogIn }) {
    const [message, setMessage] = useState();
    const [image, setImage] = useState();
    // const [profilePictureURL, setProfilePictureURL] = useState();

    const handleOpenLogIn = () => {
        setOpenSignUp(false);
        setOpenLogIn(true);
    }

    const handleSubmit = async (event) => {
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
                handleSend(event, data);
            })
    }

    const handleSend = async (event, data) => {
        event.preventDefault();

        // const url = `http://localhost:3000/user/sign-up`
        // const url = `https://odin-book-production-20fa.up.railway.app/user/sign-up`
        const url = `https://daltonoswald-odinbook.up.railway.app/user/sign-up`
        const formData = {
            first_name: event.target.first_name.value,
            last_name: event.target.last_name.value,
            username: event.target.username.value,
            password: event.target.password.value,
            confirm_password: event.target.confirm_password.value,
            bio: event.target.bio.value,
            picture: data.secure_url || "https://res.cloudinary.com/djqgww7lw/image/upload/v1729526394/jq7lzspb5b1eycw7vg6x.png"
        };
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
                mode: "cors",
            });
            const data = await response.json();

            if (response.ok) {
                setOpenSignUp(false);
                setOpenLogIn(true)
            } else {
                console.error("Error requesting authentication:", data.message);
                setMessage(data.message)
            }
        } catch (error) {
            console.error('Error requesting authentication:', error);
        }
    }

    const closeModal = () => {
        setOpenSignUp(false);
    }

    return (
        <>
            <div className="sign-up-hero">
                <h1>Sign into OdinBook</h1>
                <button onClick={closeModal} className="close-modal">X</button>
                <div className="sign-up-container">
                    <div className="sign-up-picture-container">
                        <img src={ image ? URL.createObjectURL(image) : "https://res.cloudinary.com/djqgww7lw/image/upload/v1729526394/jq7lzspb5b1eycw7vg6x.png"} className='sign-up-picture' />
                    </div>
                    <form onSubmit={handleSubmit} className="sign-up-form">
                        <label htmlFor="first_name">First Name</label>
                        <input
                            type='text'
                            id='first_name'
                            name='first_name'
                            required />
                        <label htmlFor="last_name">Last Name</label>
                        <input
                            type='text'
                            id='last_name'
                            name='last_name'
                            required />
                        <label htmlFor="username">Username</label>
                        <input  
                            type='text'
                            id='username'
                            name='username'
                            maxLength={50}
                            required />
                        <label htmlFor="bio">About Me</label>
                        <input  
                            type='text'
                            id='usernamebio'
                            name='bio'
                            maxLength={200}
                            required />
                        <label htmlFor="password">Password</label>
                        <input
                            type='password'
                            id='password'
                            name='password'
                            minLength={8}
                            required />
                        <label htmlFor="confirm_password">Confirm Password</label>
                        <input
                            type='password'
                            id='confirm_password'
                            name='confirm_password'
                            minLength={8}
                            required />
                            <input type='file' onChange={(e) => setImage(e.target.files[0])}></input>
                        <button className="submit-button" type='submit'>Sign Up</button>
                    </form>
                </div>
                <p>Already have an account? <button onClick={handleOpenLogIn}>Log in</button></p>
                {message && (
                    <p className="error-message">{message}</p>
                )}
            </div>
        </>
    )
}