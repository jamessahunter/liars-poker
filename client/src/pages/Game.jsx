import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { getRoomUser, getUser, addCard } from '../utils/api';

const Game = () =>{
    const [cookies, setCookie, removeCookie] = useCookies(['sessionId']);
    const [players, setPlayers] = useState([]);
    const [userTurn, setUserTurn] = useState();
    const [playersIn, setPlayersIn] = useState([]);
    const [started, setStarted] = useState(false);
    let code = window.location.toString().split('/')[
        window.location.toString().split('/').length-1
    ];
    const cards={};
    for(let i=0;i<52;i++){
        cards[i]=1;
    }
    // console.log(cards);
    // let players;

    useEffect(() => {
        console.log(playersIn);
      }, [playersIn]);
    let maxCards;
    useEffect (() =>{
        getPlayers()
        },[players])
    const getPlayers = async () =>{
        try{
            let res=await getRoomUser(code);
            let players = await res.json();
    //   console.log(players)
      if(players.length>6){
        maxCards=4;
      }else{
        maxCards=5;
      }
      setPlayers(players)
        } catch(err){
            console.error(err)
        }
    }
    // getPlayers();
    const handleButtonClick = async (event) => {
        event.preventDefault();
        setStarted(true)
        // console.log(started)
        for(let i=0;i<players.length;i++){
            let res = await getUser(players[i])
            let user = await res.json()
            // console.log(user)
            // console.log(cookies.sessionId);
            if(user.stillIn){
                setPlayersIn((prevPlayersIn) => [...prevPlayersIn, user.username]);
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
    }

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
            <>
            {playersIn[0]===cookies.sessionId ? (
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