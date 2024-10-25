import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogIn from './login/LogIn'
import SignUp from './signup/SignUp'
import odinIcon from '../assets/icons/the-odin-project.svg';
import './welcome.styles.css';

const App = () => {
    const navigate = useNavigate();
    const [openLogIn, setOpenLogIn] = useState(false);
    const [openSignUp, setOpenSignUp] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('authenticationToken')) {
            navigate('/home');
        }
    })

    const handleOpenLogIn = () => {
        if (!openLogIn) {
            setOpenLogIn(true);
            setOpenSignUp(false)
        } else {
            setOpenLogIn(false);
        }
    }

    const handleOpenSignUp = () => {
        if (!openSignUp) {
            setOpenSignUp(true)
            setOpenLogIn(false);
        } else {
            setOpenSignUp(false)
        }
    }

    
    const handleGuestLogIn = async (event) => {
        event.preventDefault();
        const url = `http://localhost:3000/user/log-in`
        const formData = {
            username: 'Guest',
            password: 'testuser',
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
                // setMessage(data.message)
            }
        } catch (error) {
            console.error('Error requesting authentication:', error);
        }
    }

    return (
        <div className='welcome-page'>
            <div className='welcome-left'>
                <img src={odinIcon} className='odin-icon'></img>
            </div>
            <div className='welcome-right'>
                <h1>Welcome to OdinBook</h1>
                <div className='welcome-log-in'>
                    <p>Already have an account?</p>
                    <button onClick={handleOpenLogIn}>Log in</button>
                </div>
                <div className='welcome-sign-up'>
                    <p>Don&apos;t have an account?</p>
                    <button onClick={handleOpenSignUp}>Sign up</button>
                </div>
                <div className='welcome-guest'>
                    <p>Want to sign in as a guest?</p>
                    <button onClick={handleGuestLogIn}>Guest Access</button>
                </div>
                {openLogIn && (
                    <LogIn setOpenLogIn={setOpenLogIn} setOpenSignUp={setOpenSignUp} />
                )}
                {openSignUp && (
                    <SignUp setOpenSignUp={setOpenSignUp} setOpenLogIn={setOpenLogIn} />
                )}
            </div>
        </div>
    )
}

export default App