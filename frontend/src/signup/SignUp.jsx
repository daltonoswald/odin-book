// import { useNavigate } from "react-router-dom";
import './signup.styles.css';

export default function SignUp({openSignUp, setOpenSignUp}) {
    // const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('sign-up-submit');
    }

    const closeModal = () => {
        console.log(openSignUp)
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
                <p>Don&apos;t have an account? Sign up</p>
            </div>
        </>
    )
}