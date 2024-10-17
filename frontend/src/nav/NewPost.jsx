/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import './nav.styles.css';
import { handleNewPost } from "../utils/postUtils";

export default function NewPost({openNewPost, setOpenNewPost}) {
    const navigate = useNavigate();

    const closeModal = () => {
        setOpenNewPost(false);
    }

    return (
        <>
            <div className="new-post-modal">
                <h1>New Post</h1>
                <button onClick={closeModal} className="close-modal">X</button>
                <form onSubmit={handleNewPost} className="new-post-form">
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