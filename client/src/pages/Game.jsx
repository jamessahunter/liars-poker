import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { getRoomUser, getUser, addCard, getUserTurn, updateTurn } from '../utils/api';



const Game = () =>{

    const [cookies, setCookie, removeCookie] = useCookies(['sessionId']);
    const [players, setPlayers] = useState([]);
    const [userTurn, setUserTurn] = useState()
      // () => {
      //   const storedUserTurn = localStorage.getItem('userTurn');
      //   console.log("stored "+storedUserTurn)
      //   return storedUserTurn ? parseInt(storedUserTurn) : 0;
      // });
    const [playersIn, setPlayersIn] = useState([]);
    const [started, setStarted] = useState(false);
    let code = window.location.toString().split('/')[
        window.location.toString().split('/').length-1
    ];
    const cards={};
    for(let i=0;i<52;i++){
        cards[i]=1;
    }

    let maxCards;
    useEffect (() =>{
        getPlayers()
        },[players])
    useEffect(() => {
        //  localStorage.setItem('userTurn', userTurn.toString());
        console.log("test")
    }, [userTurn]);
    useEffect(()=>{
        console.log(started)
    },[started])

    const getTurn = async () =>{
      try{
        let resTurn=await getUserTurn(code);
        let turn  = await resTurn.json();
        console.log(turn)
        setUserTurn(turn);
      } catch(err){
          console.error(err)
      }
    }

    const getPlayers = async () =>{
        try{
            let res=await getRoomUser(code);
            let players = await res.json();
      // console.log(players)
      if(players.length>6){
        maxCards=4;
      }else{
        maxCards=5;
      }
      setPlayers(players)
      setPlayersIn(players)
    //   for(let i=0;i<players.length;i++){
    //   if(players.stillIn){
    //     setPlayersIn((prevPlayersIn) => [...prevPlayersIn, players.username]);
    // }
        } catch(err){
            console.error(err)
        }
        // console.log("test")
    }
    // getPlayers();
    const handleButtonClick = async (event) => {
        event.preventDefault();
        setStarted(true)
        for(let i=0;i<playersIn.length;i++){
            let res = await getUser(players[i])
            let user = await res.json()

            if(user.stillIn){
                // setPlayersIn((prevPlayersIn) => [...prevPlayersIn, user.username]);
                for(let i=0;i<user.card_count;i++){
                    let randomNumber = Math.floor(Math.random() * 52);
                    while(cards[randomNumber]!==1){
                        randomNumber = Math.floor(Math.random() * 52);
                    }
                    // console.log(cards[randomNumber])
                    addCard(user.username, randomNumber)
                    cards[randomNumber]=0;
                }
            }

        }
        console.log(playersIn);
        const message = [code, 'started', playersIn].flat();
        console.log(message)
        sendMessage(JSON.stringify(message));
    }

    const handleNextUser = async (event) => {
        // userTurn=localStorage.getItem('userTurn')
      if(userTurn+1>=playersIn.length){
        console.log('reset')
        updateTurn(0,code);
      } else {
        console.log('+1')
        updateTurn(userTurn+1,code);
      }
        getTurn();
        const message = [code, 'next user',userTurn];
        sendMessage(JSON.stringify(message));
    }
    const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080'); // Replace 'example.com/socket' with your server's WebSocket endpoint

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = async (event) => {
        // console.log('messae')
      const message = event.data;
    //   console.log(message)
      const parse=JSON.parse(message);
      console.log('Received message:', parse);
        if(parse[0]===code){
            if(parse[1]==='started'){
                setStarted(true);
                getTurn();
            } else if(parse[1]==='next user'){
              console.log(parse[2])
              console.log(playersIn.length)

                // let temp;
                // console.log("before " +userTurn);
                // console.log("players in length " +playersIn.length);
                // console.log(userTurn+1>=playersIn.length)
                // console.log(parse[2])
                // setUserTurn(parse[2]);
                // console.log("after " + userTurn);
            }
        }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
    setSocket(ws);
    // Clean up the WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, []);

  // Send messages to the server
  const sendMessage = (message) => {
    // console.log('started')
    if (socket) {
      socket.send(message);
    }
  };

    return (
        <>
        {!started ? (
            <>
            <h1>{code}</h1>
            <h2>Players</h2>
            <ul>
                {!players ? (
                <p>Loading...</p>
                ) : (
                players.map((player) => (
                    <li>{player}</li>
                ))
                )}
            </ul>
            <button type='submit' onClick={handleButtonClick}>Start Game</button>
            </>
        ) : (
            <>
            <div>started</div>
            <button type='submit' onClick={handleNextUser}>Next User</button>
            <>
            {playersIn[userTurn]===cookies.sessionId ? (
            <p>your turn</p>
            ) : (
            <p>some elses turn</p>
            )}
            </>
            </>
        )}
        </>
        
    )
        
 }

export default Game;

    // console.log(cards);
    // let players;
    // let userTurn=0;
    // useEffect(() => {
    //     console.log(playersIn);
    //   }, [playersIn]);