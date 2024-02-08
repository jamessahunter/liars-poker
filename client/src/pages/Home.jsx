import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { createUser, getAllUser, createRoom, addUser, AnotherUser } from '../utils/api';
import UserHand from './UserHand';
import Lobby from './Lobby';
import Game from './Game';

// Uncomment import statements below after building queries and mutations
// import { useQuery } from '@apollo/client';
// import { QUERY_MATCHUPS } from '../utils/queries';

const Home = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['sessionId']);
  const [userFormData, setUserFormData] = useState({ username: '', room: '' });
  const handleButtonClick = async (event) => {
    event.preventDefault();
  // Get the id of the clicked button
  const buttonId = event.target.id;
  let taken=false;
  let roomCode='';
  // Check which button was clicked
  if (buttonId === 'create') {
    // Create a game logic
    // console.log(userFormData.username)
    try {
      const res = await getAllUser(userFormData.room.toUpperCase())
      if(!res.ok){
        throw new Error('Cant get users')
      }
      const users = await res.json();
      // console.log(users)
      for(let i=0;i<users.length;i++){
        if(users[i].username===userFormData.username){
          alert("This username is already being used in this room please select another")
          taken=true;
          return;
        }
      }
    }catch(err){
      console.error(err)
    }
    console.log(taken)
    if(!taken){
    try {
      const res = await createUser(userFormData.username)
      if(!res.ok){
        throw new Error('Cant create user')
      }
    }
      catch (err) {
        console.error(err);
      }
    setCookie('sessionId', `${userFormData.username}`, { path: '/' });
    for(let i=0;i<4;i++){
    let randomIndex = Math.floor(Math.random() * 26);
    // Convert the random number to a letter
    let randomLetter = String.fromCharCode(65 + randomIndex);
    roomCode=roomCode+randomLetter;
    }
    try {
      const res = await createRoom(roomCode)
      if(!res.ok){
        throw new Error('Cant create room')
      }
    }
    catch (err) {
      console.error(err);
    }
    try {
      const res = await addUser(userFormData.username,roomCode)
      if(!res.ok){
        throw new Error('Cant add user room')
      }
    }
    catch (err) {
      console.error(err);
    }
    console.log('Create a game');
    console.log(cookies.sessionId);
    navigate(`/Game/${roomCode}`);
  }
}
   else if (buttonId === 'room') {
    // Join a game logic
    try {
      const res = await getAllUser(userFormData.room.toUpperCase())
      if(!res.ok){
        throw new Error('Cant get users')
      }
      const users = await res.json();
      console.log(users)
      for(let i=0;i<users.length;i++){
        if(users[i].username===userFormData.username){
          alert("This username is already being used in this room please select another")
          taken=true;
          return;
        }
      }
      if(!taken) {
        try {
          const res = await createUser(userFormData.username)
          if(!res.ok){
            throw new Error('Cant create user')
          }
        }
          catch (err) {
            console.error(err);
          }
          setCookie('sessionId', `${userFormData.username}`, { path: '/' });
        try {
      const res = await AnotherUser(userFormData.username,userFormData.room.toUpperCase())
      if(!res.ok){
        throw new Error('Cant add user room')
      }
    }
    catch (err) {
      console.error(err);
    }
        navigate(`/Game/${userFormData.room.toUpperCase()}`);
      }
    }
    catch (err) {
      console.error(err);
    }
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
      {/* <Game></Game> */}
      {/* <UserHand></UserHand> */}
    </div>
  );
};

export default Home;
