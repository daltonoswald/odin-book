import { useEffect, useRef } from "react"

const UploadWidget = ({profilePictureURL, setProfilePictureURL}) => {
    const cloudinaryRef = useRef();
    const widgetRef = useRef();
    
    useEffect(() => {
        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget({
            cloudName: 'djqgww7lw',
            uploadPreset: 'oujmgi7l'
        }, function(error, result) {
            if (result.event === 'success') {
                console.log(result.info);
                setProfilePictureURL(result.info.secure_url)
            }
        })
    }, [])

    return (
        <button type='button' onClick={() => widgetRef.current.open()}>
            Upload Image
        </button>
    )

}

export default UploadWidget