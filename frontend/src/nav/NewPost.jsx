/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import './nav.styles.css';

export default function NewPost({openNewPost, setOpenNewPost}) {
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const url = `http://localhost:3000/post/new-post`
        const postData = {
            content: event.target.content.value
        }
        try {
            const token = localStorage.getItem('authenticationToken');
            const response = await fetch(url, 
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(postData)
                })
                const data = await response.json();
                if (response.ok) {
                    console.log(data);
                    window.location.reload();
                }
        } catch (error) {
            console.error('Error requesting:', error);
        }
        console.log(postData)
    }

    const closeModal = () => {
        console.log(openNewPost)
        setOpenNewPost(false);
    }

    return (
        <>
            <div className="new-post-modal">
                <h1>New Post</h1>
                <button onClick={closeModal} className="close-modal">X</button>
                <form onSubmit={handleSubmit} className="new-post-form">
                    <label htmlFor="content">New Post</label>
                    <input  
                        type='text'
                        id='content'
                        name='content'
                        placeholder='What is happening?'
                        required />
                    <button className="submit-button" type='submit'>Post</button>
                </form>
            </div>
        </>
    )
}