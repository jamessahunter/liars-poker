import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRoomUser, getUser, addCard } from '../utils/api';

const Game = () =>{
    let code = window.location.toString().split('/')[
        window.location.toString().split('/').length-1
    ];
    const cards={};
    for(let i=0;i<52;i++){
        cards[i]=1;
    }
    // console.log(cards);
    let players;
    let maxCards;
    const getPlayers = async () =>{
        try{
            let res=await getRoomUser(code);
            players = await res.json();
    //   console.log(players)
      if(players.length>6){
        maxCards=4;
      }else{
        maxCards=5;
      }
        } catch(err){
            console.error(err)
        }
    }
    getPlayers();
    const handleButtonClick = async (event) => {
        event.preventDefault();
        // console.log(players)
        for(let i=0;i<players.length;i++){
            let res = await getUser(players[i])
            let user = await res.json()
            console.log(user)
            if(user.stillIn){
                for(let i=0;i<user.card_count;i++){
                    let randomNumber = Math.floor(Math.random() * 52);
                    while(cards[randomNumber]!==1){
                        randomNumber = Math.floor(Math.random() * 52);
                    }
                    // console.log(cards[randomNumber])
                    addCard(user.username, randomNumber)
                }

            }

        }
    }

    return (
        <div>
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
            <button type='submit'onClick={handleButtonClick} >Start Game</button>
        </div>
        
    )
        
 }

export default Game;