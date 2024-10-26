/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './login.styles.css';

export default function LogIn({ setOpenLogIn, setOpenSignUp}) {
    const navigate = useNavigate();
    const [message, setMessage] = useState();

    const handleSubmit = async (event) => {
        event.preventDefault();
        // const url = `http://localhost:3000/user/log-in`
        const url = `https://odin-book-production-20fa.up.railway.app/user/log-in`
        const formData = {
            username: event.target.username.value,
            password: event.target.password.value,
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
                localStorage.setItem('authenticationToken', data.token);
                localStorage.setItem('username', data.user.username);
                navigate('/home');
            } else {
                console.error("Error requesting authentication:", data.message);
                setMessage(data.message)
            }
        } catch (error) {
            console.error('Error requesting authentication:', error);
        }
    }

    const handleGuestLogIn = async (event) => {
        event.preventDefault();
        // const url = `http://localhost:3000/user/log-in`
        const url = `https://daltonoswald-odinbook.up.railway.app/user/log-in`
        const formData = {
            username: 'Guest',
            password: 'testuser',
        };
        console.log(formData)
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
                localStorage.setItem('authenticationToken', data.token);
                localStorage.setItem('username', data.user.username);
                navigate('/home');
            } else {
                console.error("Error requesting authentication:", data.message);
                // setMessage(data.message)
            }
        } catch (error) {
            console.error('Error requesting authentication:', error);
        }
    }

    const handleOpenSignUp = () => {
        setOpenSignUp(true);
        setOpenLogIn(false);
    }

    const closeModal = () => {
        setOpenLogIn(false);
    }

    return (
        <>
            <div className="log-in-hero">
                <h1>Sign into OdinBook</h1>
                <button onClick={closeModal} className="close-modal">X</button>
                <form onSubmit={handleSubmit} className="log-in-form">
                    <label htmlFor="username">Username</label>
                    <input  
                        type='text'
                        id='username'
                        name='username'
                        required />
                    <label htmlFor="password">Password</label>
                    <input
                        type='password'
                        id='password'
                        name='password'
                        minLength={8}
                        required />
                    <button className="submit-button" type='submit'>Log in</button>
                </form>
                <p>Don&apos;t have an account? <button onClick={handleOpenSignUp}>Sign up</button></p>
                <button onClick={handleGuestLogIn} className="guest-log-in">Sign in as a guest</button>
                {message && (
                    <p className="error-message">{message}</p>
                )}
            </div>
        </>
    )
}