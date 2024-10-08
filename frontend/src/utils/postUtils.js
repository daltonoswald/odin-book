const handleNewPost = async (event) => {
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
            if (response.ok) {
                window.location.reload();
            }
    } catch (error) {
        console.error('Error requesting:', error);
    }
}

const handleLikePost = async (event) => {
    event.preventDefault();
    const url = `http://localhost:3000/post/like-post`;
    const postToLike = {
        postToLike: event.target.id
    }
    try {
        const token = localStorage.getItem('authenticationToken');
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(postToLike),
            mode: "cors",
        });
        if (response.ok) {
            window.location.reload();
        }
    } catch (error) {
        console.error(`Error requesting:`, error);
    }
}

const handleUnlikePost = async (event) => {
    event.preventDefault();
    const url = `http://localhost:3000/post/unlike-post`;
    const postToUnlike = {
        postToUnlike: event.target.id
    }
    try {
        const token = localStorage.getItem('authenticationToken');
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(postToUnlike),
            mode: "cors",
        });
        if (response.ok) {
            window.location.reload();
        }
    } catch (error) {
        console.error(`Error requesting:`, error);
    }
}

const handleLikeComment = async (event) => {
    event.preventDefault();
    const url = `http://localhost:3000/post/like-comment`;
    const commentToLike = {
        commentToLike: event.target.id
    }
    try {
        const token = localStorage.getItem('authenticationToken');
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(commentToLike),
            mode: "cors",
        });
        if (response.ok) {
            window.location.reload();
        }
    } catch (error) {
        console.error(`Error requesting:`, error);
    }
}

const handleUnlikeComment = async (event) => {
    event.preventDefault();
    const url = `http://localhost:3000/post/unlike-comment`;
    const commentToUnlike = {
        commentToUnlike: event.target.id
    }
    try {
        const token = localStorage.getItem('authenticationToken');
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(commentToUnlike),
            mode: "cors",
        });
        if (response.ok) {
            window.location.reload();
        }
    } catch (error) {
        console.error(`Error requesting:`, error);
    }
}

export { handleNewPost, handleLikePost, handleUnlikePost, handleLikeComment, handleUnlikeComment }