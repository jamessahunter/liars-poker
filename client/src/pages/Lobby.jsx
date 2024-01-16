import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const Lobby = () =>{
    return (
        <div>Players
            <Link to="/game/:id">Start Game</Link>
        </div>
        
    )
        
 }

export default Lobby;