import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getAllMatchups } from '../utils/api';
import UserHand from './UserHand';
import Lobby from './Lobby';

// Uncomment import statements below after building queries and mutations
// import { useQuery } from '@apollo/client';
// import { QUERY_MATCHUPS } from '../utils/queries';

const Home = () => {
  const navigate = useNavigate();
  const [userFormData, setUserFormData] = useState({ username: '', room: '' });
  const handleButtonClick = async (event) => {
    event.preventDefault();
  // Get the id of the clicked button
  // console.log( event.currentTarget.id)
  const buttonId = event.target.id;
    // console.log('test')
    // console.log(buttonId)
  // Check which button was clicked
  if (buttonId === 'create') {
    // Create a game logic
    console.log('Create a game');
    navigate('/lobby');
  } else if (buttonId === 'room') {
    // Join a game logic
    console.log('Join a game');
  }
  }
  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setUserFormData({ ...userFormData, [id]: value });
  };
  return (
    <div className="card bg-white card-rounded w-50">
      <form>
      <label>Username</label>
      <input id='username' value={userFormData.username} onChange={handleInputChange}></input>
      <button type='submit'id='create' onClick={handleButtonClick}>Create a Game</button>
      <label>Room ID</label>
      <input id='room'value={userFormData.room} onChange={handleInputChange}></input>
      <button type='submit'id='room' onClick={handleButtonClick}>Join a Game</button>
      </form>
      {/* <Lobby></Lobby> */}
      {/* <UserHand></UserHand> */}
    </div>
  );
};

export default Home;
