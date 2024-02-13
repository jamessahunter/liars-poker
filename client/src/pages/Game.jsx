import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { getRoomUser, getUser, addCard, getUserTurn, updateTurn, addDealt, getDealt, addHand, getHand } from '../utils/api';



const Game = () =>{

    const [cookies, setCookie, removeCookie] = useCookies(['sessionId']);
    const [players, setPlayers] = useState([]);
    const [userHand, setUserHand] = useState([]);
    const [userTurn, setUserTurn] = useState();
    const [playersIn, setPlayersIn] = useState([]);
    const [started, setStarted] = useState(false);
    const [userCount, setUserCount] = useState(2);
    let code = window.location.toString().split('/')[
        window.location.toString().split('/').length-1
    ];
    const cards={};
    const cardsArr=['2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', 'JC', 'QC', 'KC', 'AC',
    '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', 'JD', 'QD', 'KD', 'AD',
    '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', 'JH', 'QH', 'KH', 'AH',
    '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', 'JS', 'QS', 'KS', 'AS'];
    for(let i=0;i<52;i++){
        cards[cardsArr[i]]=1;
    }

    let maxCards;
    useEffect (() =>{
        getPlayers()
        },[players])
    useEffect(() => {
        console.log("test")
    }, [userTurn]);
    useEffect(()=>{
        console.log(started)
    },[started])
    useEffect(()=>{
      // console.log('hands')
      getHands();
    },[])
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
              setUserCount(user.card_count)
                // setPlayersIn((prevPlayersIn) => [...prevPlayersIn, user.username]);
                for(let i=0;i<user.card_count;i++){
                    let randomNumber = Math.floor(Math.random() * 52);
                    let res = await getDealt(code)
                    let dealt = await res.json();
                    // console.log(dealt)
                    for(let i=0;i<dealt.length;i++){
                      cards[dealt]=0;
                    }
                    while(cards[cardsArr[randomNumber]]!==1){
                        randomNumber = Math.floor(Math.random() * 52);
                    }
                    // console.log(cards[randomNumber])
                    addCard(user.username, cardsArr[randomNumber])
                    addDealt(code,cardsArr[randomNumber])

                    cards[cardsArr[randomNumber]]=0;
                }
            }

        }
        // console.log(playersIn);
        const message = [code, 'started', playersIn].flat();
        // console.log(message)
        sendMessage(JSON.stringify(message));
    }

    const handleNextUser = async (event) => {

      if(userTurn+1>=playersIn.length){
        // console.log('reset')
        updateTurn(0,code);
      } else {
        // console.log('+1')
        updateTurn(userTurn+1,code);
      }
        await getTurn();
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
                getHands();
                getTurn();
                let res= await getHand(code)
                let result = await res.json();
                setHand(result)
                console.log(hand)
            } else if(parse[1]==='next user'){
              // console.log(parse[2])
              // console.log(playersIn.length)
              await getTurn();
              getHand(code)
              let res= await getHand(code)
              let result = await res.json();
              setHand(result)
              console.log(result)
              // console.log(hand)
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

  let isVisible=false;
const hands = [{name:'None'},{name:'High Card',num:1}, {name:'Pair',num:2}, {name:'Two Pair',num:3}, {name:'Three of a Kind',num:4},
    {name:'Flush',num:5}, {name:'Straight',num:6}, {name:'Full House',num:7}, {name:'Four of a Kind',num:8},
    {name:'Straight Flush',num:9}, {name:'Royal Flush',num:10}];
    const allCards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const suits = ['Clubs', 'Daimonds', 'Hearts', 'Spades'];
    const [hand, setHand] = useState('None');
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        let card1=event.target.card1.value
        let card2=event.target.card2.value
        let suit=event.target.suit.value
        let chosenHand=event.target.hand.value;
        let chosenHandNum = null;
          // Find the object in the hands array that matches the selected hand
        const selectedHand = hands.find(hand => hand.name === chosenHand);

        if (selectedHand) {
            chosenHandNum = selectedHand.num;
        }
        console.log(selectedHand);
        console.log(chosenHandNum);
        addHand(code,selectedHand.name,card1,card2,suit)
        if(userTurn+1>=playersIn.length){
          // console.log('reset')
          updateTurn(0,code);
        } else {
          // console.log('+1')
          updateTurn(userTurn+1,code);
        }
          getTurn();
          const message = [code, 'next user',userTurn];
          sendMessage(JSON.stringify(message));
    };
    const handleInputChange = (event) => {
        // console.log(event.target.value)
        // const { name, value } = event.target;
        setHand(event.target.value);
        // console.log(hand)
      };

      const getHands = async()=>{
        let handRes= await getUser(cookies.sessionId);
        let result= await handRes.json()
        setUserHand(result.cards);
        console.log(userHand) 
      }
      const handleClickCard = ()=>{
        getHands()
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
            <p>{hand}</p>
            <ul>
            {userCount!== userHand.length ? <button onClick={handleClickCard} >Click to get Cards</button> :
            userHand.map((card) => (
              <li>{card}</li>
            ))}
            </ul>
            <button type='submit' onClick={handleNextUser}>Next User</button>
            <>
            {playersIn[userTurn]===cookies.sessionId ? (
              <>
            <p>your turn {userTurn}</p>
            <div className="card-body m-5">
            <form onSubmit={handleFormSubmit}>
            <label>Possible Hands: </label>
            <select name="hand" onChange={handleInputChange}>
                {hands.map((hand) => {
                return (
                    <option key={hand._id} value={hand.name}>
                    {hand.name}
                    </option>
                );
                })}
            </select>
            {(hand==='High Card') ? (
                <>
                <select name="card1" >
                    {allCards.map((card) => {
                        return (
                            <option key={card._id} value={card}>
                                {card}
                            </option>
                        );
                    })}
                </select>
                <select name="card2" value={null} disabled>
                </select>
                <label>Suit </label>
                <select name="suit" >
                    {suits.map((suit) => {
                        return (
                            <option key={suit._id} value={suit}>
                                    {suit}
                            </option>
                        );
                    })}
                </select>
                <button type='submit'>Submit</button>
                </>
            ) : null}
            {(hand==='Pair' || hand==='Three of a Kind'|| hand==='Four of a Kind') ? (
                <>
                <select name="card1" >
                    {allCards.map((card) => {
                        return (
                            <option key={card._id} value={card}>
                                {card}
                            </option>
                        );
                    })}
                </select>
                <select name="card2" value={null} disabled>
                </select>
                <label>Suit </label>
                <select name="suit" value={null} disabled>
                </select>
                <button type='submit'>Submit</button>
                </>
            ) : null}
            {(hand === 'Two Pair' || hand === 'Full House' || hand ==='Straight') ? (
                <>
                <label>Top Card, Three of a Kind</label>
                <select name="card1" >
                    {allCards.map((card) => {
                        return (
                            <option key={card._id} value={card}>
                                {card}
                            </option>
                        );
                    })}
                </select>
                <label>Bottom Card, Pair </label>
                <select name="card2" >
                    {allCards.map((card) => {
                        return (
                            <option key={card._id} value={card}>
                                {card}
                            </option>
                    );
                })}
                </select>
                <select name="suit" value={null} disabled>
                </select>
                <button type='submit'>Submit</button>
                </>
            ): null}
            {hand==='Flush' ?
            <>
             <select name="card1" value={null} disabled>
            </select>
            <select name="card2" value={null} disabled>
                </select>
            <label>Suit </label>
            <select name="suit" >
            {suits.map((suit) => {
                return (
                    <option key={suit._id} value={suit}>
                    {suit}
                    </option>
                );
                })}
            </select>
            <button type='submit'>Submit</button>
            </>
            : null}
            {hand ==='Straight Flush'|| hand==='Royal Flush' ?
            <>
            <label>Top Card </label>
            <select name="card1" >
                {allCards.map((card) => {
                    return (
                        <option key={card._id} value={card}>
                            {card}
                        </option>
                    );
                })}
            </select>
            <label>Bottom Card </label>
            <select name="card2" >
                {allCards.map((card) => {
                    return (
                        <option key={card._id} value={card}>
                            {card}
                        </option>
                );
            })}
            </select>
            <label>Suit </label>
            <select name="suit" >
            {suits.map((suit) => {
                return (
                    <option key={suit._id} value={suit}>
                    {suit}
                    </option>
                );
                })}
            </select>
            <button type='submit'>Submit</button>
            </>
        : null}
            </form>
        </div>
        </>
            ) : (
            <p>{playersIn[userTurn]} turn {userTurn}</p>
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