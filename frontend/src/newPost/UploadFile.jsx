import { useState } from 'react'

export default function UploadFile() {
    const [image, setImage] = useState('');
    const [url, setUrl] = useState('');
    const uploadImage = () => {
        const data = new FormData()
        data.append('file', image)
        data.append('upload_preset', 'oujmgi7l');
        data.append('cloud_name', 'djqgww7lw')
        fetch("https://api.cloudinary.com/v1_1/djqgww7lw/image/upload", {
            method: "post",
            body: data
        })
        .then(response => response.json())
        .then(data => {
            setUrl(data.url)
        })
        .catch(err => console.log(err))
    }

    return (
        <div>
            <div>
                <input type='file' onChange={(e) => setImage(e.target.files[0])}></input>
                <button onClick={uploadImage}>Upload</button>
                <div>
                    <h1>Uploaded Image:</h1>
                    <img src={url} />
                </div>
            </div>
        </div>
    )
}