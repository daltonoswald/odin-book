import LogIn from './login/LogIn'
import { useState } from 'react';
import SignUp from './signup/SignUp';

const App = () => {
    const [openLogIn, setOpenLogIn] = useState(false);
    const [openSignUp, setOpenSignUp] = useState(false);

    const handleLogout = async (event) => {
        event.preventDefault();
        const url = `http://localhost:3000/user/logout`
        try {
            const response = await fetch(url, {
                method: "POST",
                // credentials: 'include',
                mode: "cors",
            });

            if (!response.ok) {
                throw new Error("Network error.");
            }
        } catch (error) {
            console.error('Error during logout: ', error);
        }
    }

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

    return (
        <div>
            <p>Hi</p>
            <a href="test">Test Page</a>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleOpenLogIn}>Log in</button>
            {openLogIn && (
                <LogIn openLogIn={openLogIn} setOpenLogIn={setOpenLogIn} />
            )}
            <button onClick={handleOpenSignUp}>Sign up</button>
            {openSignUp && (
                <SignUp openSignUp={openSignUp} setOpenSignUp={setOpenSignUp} />
            )}
        </div>
    )
}

export default App