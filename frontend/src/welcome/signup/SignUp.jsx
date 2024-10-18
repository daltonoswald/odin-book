/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './signup.styles.css';

export default function SignUp({openSignUp, setOpenSignUp, setOpenLogIn}) {
    const navigate = useNavigate();
    const [message, setMessage] = useState();

    const handleOpenLogIn = () => {
        setOpenSignUp(false);
        setOpenLogIn(true);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const url = `http://localhost:3000/user/sign-up`
        const formData = {
            first_name: event.target.first_name.value,
            last_name: event.target.last_name.value,
            username: event.target.username.value,
            password: event.target.password.value,
            confirm_password: event.target.confirm_password.value,
            bio: event.target.bio.value,
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
                    <button className="submit-button" type='submit'>Sign Up</button>
                </form>
                <p>Already have an account? <button onClick={handleOpenLogIn}>Log in</button></p>
                {message && (
                    <p className="error-message">{message}</p>
                )}
            </div>
        </>
    )
}