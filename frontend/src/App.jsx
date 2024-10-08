import LogIn from './login/LogIn'
import { useEffect, useState } from 'react';
import SignUp from './signup/SignUp';
import { useNavigate } from 'react-router-dom';

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

    return (
        <>
        <div>
            <p>Hi</p>
            <a href="test">Test Page</a>
            <button onClick={handleOpenLogIn}>Log in</button>
            {openLogIn && (
                <LogIn openLogIn={openLogIn} setOpenLogIn={setOpenLogIn} />
            )}
            <button onClick={handleOpenSignUp}>Sign up</button>
            {openSignUp && (
                <SignUp openSignUp={openSignUp} setOpenSignUp={setOpenSignUp} />
            )}
        </div>
        </>
    )
}

export default App