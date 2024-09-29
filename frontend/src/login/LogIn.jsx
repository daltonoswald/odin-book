import { useNavigate } from "react-router-dom";
import './login.styles.css';

export default function LogIn({openLogIn, setOpenLogIn}) {
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const url = `http://localhost:3000/user/log-in`
        const formData = {
            username: event.target.username.value,
            password: event.target.password.value,
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
                console.log(`response`, response)
                console.log(`data`, data)
                // navigate('/');
            } else {
                console.error("Error requesting authentication:", data.message);
                // setMessage(data.message)
            }
        } catch (error) {
            console.error('Error requesting authentication:', error);
        }
    }

    const closeModal = () => {
        console.log(openLogIn)
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
                <p>Don&apos;t have an account? Sign up</p>
            </div>
        </>
    )
}