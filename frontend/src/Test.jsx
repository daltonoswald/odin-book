import Nav from "./nav/Nav";

const Test = () => {

    const testUser = async (event) => {
        event.preventDefault();
        const url = `http://localhost:3000/user/testUser`
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
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

    return (
        <>
            <Nav />
            <div>
                <p>Hi</p>
                <a href="/">Home Page</a>
                <button onClick={testUser}>Test</button>
            </div>
        </>
    )
}

export default Test