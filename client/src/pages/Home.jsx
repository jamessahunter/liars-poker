import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { createUser, getAllUser, createRoom, addUser, AnotherUser, getRoomStarted } from '../utils/api';
import Game from './Game';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';

const Home = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['sessionId']);
  const [userFormData, setUserFormData] = useState({ username: '', room: '' });
  const [message, setMessage] = useState('');
  const handleButtonClick = async (event) => {
    event.preventDefault();
  // Get the id of the clicked button
  const buttonId = event.target.id;
  let taken=false;
  let roomCode='';
  // Check which button was clicked
  if (buttonId === 'create') {
    // Create a game logic
    if(userFormData.username===""){

      setMessage("Please enter a username")
      return
    }
    try {
      const res = await getAllUser(userFormData.room.toUpperCase())
      if(!res.ok){
        throw new Error('Cant get users')
      }
      const users = await res.json();

      for(let i=0;i<users.length;i++){
        if(users[i].username===userFormData.username){
          setMessage("This username is already being used in this room please select another")
          taken=true;
          return;
        }
      }
    }catch(err){
      console.error(err)
    }
    //checks that username isnt take
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
    //creates a random room
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
    //adds the user to room
    try {
      const res = await addUser(userFormData.username,roomCode)
      if(!res.ok){
        throw new Error('Cant add user room')
      }
    }
    catch (err) {
      console.error(err);
    }
    navigate(`/Game/${roomCode}`);
  }
}
   else if (buttonId === 'room') {
    // Join a game logic
    if(userFormData.username===""){

      setMessage("Please enter a username")
      return
    } else if(userFormData.room===""){

      setMessage("Please enter a room code or click create a game")
      return
    }
    try {
      //checks that the room exists
      let res = await getRoomStarted(userFormData.room.toUpperCase())

      let ans = await res.json()

      if(!res.ok){
        setMessage(`That room doesn't exist`)
        throw new Error('Cant get users')
      } else if(ans===true){
        setMessage('This game has already started')
        return;
      }
      //checks for unique username
      res = await getAllUser(userFormData.room.toUpperCase())
      if(!res.ok){
        throw new Error('Cant get users')
      }
      const users = await res.json();
      if(users.length>=8){
        setMessage("This room is full. Click Create a game to make an empty one.")
        return;
      }

      for(let i=0;i<users.length;i++){
        if(users[i].username===userFormData.username){
          setMessage("This username is already being used please select another")
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

  }
  }

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setUserFormData({ ...userFormData, [id]: value });
    setMessage('');
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
      setIsModalOpen(true);
  };

  const closeModal = () => {
      setIsModalOpen(false);
  };

  return (
    <Container className='bg-white rounded align-items-center ' >
      <Row className='justify-content-center align-items-center '>
        <Col xs={6} className='justify-content-flex-end'>
        <h1>Liar's Poker</h1>
        </Col>
        <Col xs={6} className='d-flex justify-content-end'>
            <Button onClick={openModal}>How to Play</Button>
        </Col>
      </Row>
        <Row className="justify-content-space-between align-items-center bg-white">
          <Col >
      <FloatingLabel
        label="Username"
        className="mb-3"
      >
        <Form.Control as="input" placeholder="username" id='username' value={userFormData.username} onChange={handleInputChange}/>
      </FloatingLabel>
      <FloatingLabel controlId="floatingPassword" label="Room Code"         className="mb-3">
        <Form.Control as="input" placeholder="CODE" id='room' value={userFormData.room} onChange={handleInputChange}/>
      </FloatingLabel>
      </Col>
      </Row>
      <Row className="justify-content-center mb-3">
        <Col xs={3} className="text-center mb-3">   
        <Button type='submit'id='create' onClick={handleButtonClick}>Create a Game</Button>
        </Col>
        <Col xs={3} className="text-center">
      <Button type='submit'id='room' onClick={handleButtonClick}>Join a Game</Button>
      </Col>
      </Row>
      <h2 style={{ color: 'red' }}>{message}</h2>
      <Modal show={isModalOpen} onHide={closeModal} scrollable={true}>
                <Modal.Header closeButton>
                    <Modal.Title>How to Play</Modal.Title>
                </Modal.Header>
                <Modal.Body>                
                  <p>Liar's Poker is a game similar to Liar's Dice but instead of calling the number of dice showing a certain face 
                  on the table Liar's Poker the user calls a poker hand. The game starts where each person is dealt two cards. 
                  The person whose turn it has the option to call B.S. on the previous person meaning that they don't think that the 
                  hand called is there when all dealt cards are shown. The user can also select a poker hand as long as it beats the previous hand.
                  The user can play the same hand but with a higher suit that go in alphabetical order i.e. Clubs, Diamonds, Hearts, Spades</p>
                  <ol>The hands possible are:
                  <li>High Card: A single card</li>
                  <li> One Pair: One set of two cards of the same rank. </li>
                  <li> Two Pair: Two sets of pairs, each of the same rank.</li>
                  <li> Three of a Kind: Three cards of the same rank.</li>
                  <li>  Flush: Five cards of the same suit, not in sequence.</li>
                  <li> Straight: Five consecutive cards of different suits.</li>
                  <li>  Full House: Three cards of one rank and two cards of another rank.</li>
                  <li>   Four of a Kind: Four cards of the same rank.</li>
                  <li>  Straight Flush: Five consecutive cards of the same suit.</li>
                  <li> Royal Flush: A, K, Q, J, 10, all of the same suit.  </li>
                  </ol>
                  <h4>Note: A Straigt is consider to be a higher rank due to the ease of achieving a Flush</h4>

                  <p>Once B.S. is called the gmae checks to see if the hand is there. If the hand is there the person who called B.S receives
                  an additional card. If the hand is not there the person who called the hand receives an additional card. Once a player has 5
                  cards and is incorrect they are out. This limit is 4 in games larger than 6.</p>
                </Modal.Body>
                <Modal.Footer>
                <Button className='btn'onClick={closeModal}>Close</Button>
                </Modal.Footer>
            </Modal>
    </Container>
    
  );
};

export default Home;