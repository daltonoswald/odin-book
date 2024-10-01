import { useState } from 'react';
import Nav from '../src/nav/Nav';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
    const navigate = useNavigate();

    return (
        <>
        <Nav />
        <div className='content'>     
        </div>
        </>
    )
}

export default Homepage