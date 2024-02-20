import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { getRoomUser, getUser, addCard, getUserTurn, updateTurn, addDealt, getDealt, addHand, getHand,
addCount, resetCardsDealt, resetCardsPlayer, setPlayersIn, getIn } from '../utils/api';
import Modal from 'react-modal'
import Pusher from 'pusher-js';
// import { pusherConfig } from './pusherConfig';


const Game = () =>{

    const [cookies, setCookie, removeCookie] = useCookies(['sessionId']);
    const [players, setPlayers] = useState([]);
    const [userHand, setUserHand] = useState([]);
    const [userTurn, setUserTurn] = useState();
    const [playerList, setPlayerList] = useState([]);
    const [started, setStarted] = useState(false);
    const [userCount, setUserCount] = useState(2);
    const [maxCards, setMaxCards] = useState();
    const [winner, setWinner] = useState();
    const [allHands, setAllHands] = useState([]);
    let code = window.location.toString().split('/')[
        window.location.toString().split('/').length-1
    ];
    // const pusher = Pusher.getInstance();


    const cards={};
    const cardsArr=['2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', 'JC', 'QC', 'KC', 'AC',
    '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', 'JD', 'QD', 'KD', 'AD',
    '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', 'JH', 'QH', 'KH', 'AH',
    '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', 'JS', 'QS', 'KS', 'AS'];
    for(let i=0;i<52;i++){
        cards[cardsArr[i]]=1;
    }

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
    //   console.log('test')
      if(players.length>6){
        setMaxCards(4);
      }else{
        setMaxCards(5);
      }
      setPlayers(players)


        } catch(err){
            console.error(err)
        }
        // console.log("test")
    }


    const handleButtonClick = async (event) => {
        event.preventDefault();
        setStarted(true)
        await setPlayersIn(players,code)
        await dealCards();

        // console.log(playersIn);
        const message = [code, 'started'];
        // console.log(message)
        sendMessage(JSON.stringify(message));
    }


    const [socket, setSocket] = useState(null);

    const dealCards= async() => {
        let res= await getIn(code);
        let playersIn = await res.json();
        // console.log(playersIn)
        setPlayerList(playersIn)
        for(let i=0;i<playersIn.length;i++){
            let res = await getUser(playersIn[i])
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
    }


  useEffect(async() => {
    const ws = new WebSocket('http://localhost:8080'); // Replace 'example.com/socket' with your server's WebSocket endpoint
    // await pusher.init({
    //     apiKey: "536cdade0e1860d0eda7",
    //     cluster: "us3"
    //   });
        
    //   const pusher = new Pusher('536cdade0e1860d0eda7', {
    //         cluster: 'us3'
    //     });

    //     const channel = pusher.subscribe('chat-channel');

    //     channel.bind('new-message', data => {
    //         console.log('New message received:', data);
    //         // Update your UI with the new message data
    //     });

    //     return () => {
    //         pusher.unsubscribe('chat-channel');
    //     };
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
                let resP = await getIn(code)
                let playersIn = await resP.json()
                setPlayerList(playersIn)
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
              setSelected('None')
            } else if(parse[1]==='players'){
                setPlayersIn(parse[2])
                // setUserTurn(parse[3])
                setAllHands(parse[3])
                getHands();

            } else if(parse[1]==='winner'){
                setWinner(parse[2])
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

const hands = [{name:'None',num:0},{name:'High Card',num:1}, {name:'Pair',num:2}, {name:'Two Pair',num:3}, {name:'Three of a Kind',num:4},
    {name:'Flush',num:5}, {name:'Straight',num:6}, {name:'Full House',num:7}, {name:'Four of a Kind',num:8},
    {name:'Straight Flush',num:9}, {name:'Royal Flush',num:10}];
    const allCards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const suits = ['Clubs', 'Daimonds', 'Hearts', 'Spades'];
    const [hand, setHand] = useState('None');
    const [selected, setSelected] = useState('None');
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        let card1=event.target.card1.value
        let card2=event.target.card2.value
        let suit=event.target.suit.value
        let chosenHand=event.target.hand.value;
        let chosenHandNum = null;
          // Find the object in the hands array that matches the selected hand
        const selectedHand = hands.find(hand => hand.name === chosenHand);
        // console.log(hand)
        const currentHand = hands.find(handname => handname.name === hand[0])
        // console.log(currentHand);
        if (selectedHand) {
            chosenHandNum = selectedHand.num;
        }
        // console.log(selectedHand);
        // console.log(chosenHandNum);
        console.log(hand[1])
        console.log(card1);
        console.log((hand[1]>=card1))
        // console.log(suits.indexOf(hand[3]))
        if(hand[0]){
            console.log('check')
        if(selectedHand.num<currentHand.num){
            console.log('hand not high enoguh')
            return;
        } else if(selectedHand.num===currentHand.num){
            if(suits.indexOf(hand[3])>suits.indexOf(suit) ){
                console.log('higher suit needed')
                return;
            }
            if(suits.indexOf(hand[3])===suits.indexOf(suit) && selectedHand.name=='Flush'){
                console.log('higher suit needed')
                return;
            }
            if(allCards.indexOf(hand[1])>=allCards.indexOf(card1) && suits.indexOf(hand[3])===suits.indexOf(suit) && selectedHand.name!=='Flush'){
                console.log('select higher card')
                return;
            }
        }
            if(selectedHand.name ==='Two Pair' || selectedHand.name === 'Full House'){
                if(allCards.indexOf(card1)<=allCards.indexOf(card2)){
                    console.log('cards must not be the same or card 1 less than card 2')
                    return;
                }
            }
            if(selectedHand.name === 'Straight' || selectedHand.name ==='Straight Flush'|| selectedHand.name==='Royal Flush'){
                console.log(allCards.indexOf(card1)-allCards.indexOf(card2))
                if(allCards.indexOf(card1)-allCards.indexOf(card2)!==4){
                    console.log('cards must be 5 apart')
                    return;
                }
            }
        } else {
            if(hand[1]>=card1 && suits.indexOf(hand[3])===suits.indexOf(suit)){
                console.log('select higher card')
                return;
            }
            if(selectedHand.name ==='Two Pair' || selectedHand.name === 'Full House'){
                if(allCards.indexOf(card1)==allCards.indexOf(card2)){
                    console.log('cards must not be the same')
                    return;
                }
            }
            if(selectedHand.name === 'Straight' || selectedHand.name ==='Straight Flush'|| selectedHand.name==='Royal Flush'){
                console.log(allCards.indexOf(card1)-allCards.indexOf(card2))
                if(allCards.indexOf(card1)-allCards.indexOf(card2)!==4){
                    console.log('cards must be 5 apart')
                    return;
                }
            }
        }
        await addHand(code,selectedHand.name,card1,card2,suit)
        if(userTurn+1>=playerList.length){
          // console.log('reset')
          await updateTurn(0,code);
        } else {
          // console.log('+1')
          await updateTurn(userTurn+1,code);
        }
          await getTurn();
          const message = [code, 'next user',userTurn];
          sendMessage(JSON.stringify(message));
    };
    const handleInputChange = (event) => {
        // console.log(event.target.value)
        // const { name, value } = event.target;
        setSelected(event.target.value);
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

      

      const handleBS = async ()=>{
        console.log('BS')
        let res = await getDealt(code)
        let dealt = await res.json();
        // console.log(dealt)
        switch(hand[0]){
            case 'High Card':
                checkHigh(dealt)
            break;
            case 'Pair':
                checkMulti(dealt,'Pair')
            break;
            case 'Two Pair':
                checkMulti(dealt,'Two')
            break;
            case 'Three of a Kind':
                checkMulti(dealt,'Three')
            break;
            case 'Flush':
                checkFlush(dealt);    
            break;
            case 'Straight':
                checkStraight(dealt)
            break;
            case 'Full House':
                checkMulti(dealt,'Full')
            break;
            case 'Four of a Kind':
                checkMulti(dealt,'Four')
            break;
            case 'Straight Flush':
                checkStraightFlush(dealt)
            break;
            case 'Royal Flush':
                checkStraightFlush(dealt)
            break;
        }
      }

      const checkHigh = async (dealt) => {
        console.log(hand[1])
        for(let i=0;i<dealt.length;i++){
            if(dealt[i].length===3){
                if(dealt[i][0]===hand[1][0] && dealt[i][1]===hand[1][1] && dealt[i][2]===hand[3][0]){
                    console.log('pass')
                    await addtoCount('pass')

                    return
                }
            }else{
                if(dealt[i][0]===hand[1][0] && dealt[i][1]===hand[3][0]){
                    console.log('pass')
                    await addtoCount('pass')

                    return
                }
            }
      }
      console.log('fail')
      await addtoCount('fail')
    }
    const checkMulti = async (dealt,handCheck) => {
        let obj={};
        for(let i=0;i<dealt.length;i++){
            if(dealt[i].length===3){
                if(obj[dealt[i][1]]){
                    obj[dealt[i][1]]++;
                } else {
                    obj[dealt[i][1]]=1
                }
            } else{
                if(obj[dealt[i][0]]){
                    obj[dealt[i][0]]++;
                } else {
                    obj[dealt[i][0]]=1
                }
            }
        }
        if(handCheck==='Pair'){
            if(hand[1]===10){
                if(obj[hand[1][1]]>=2){
                    await addtoCount('pass')
                    console.log('pass')
                } else {
                    console.log('fail')
                    await addtoCount('fail')
                }
            } else{
                if(obj[hand[1][0]]>=2){
                console.log('pass')
                } else {
                    console.log('fail')
                    await addtoCount('fail')
                }
            }
        } else if(handCheck==='Two'){
            if(hand[1]===10){
                if(obj[hand[1][1]]>=2 && obj[hand[2][0]]>=2){
                    console.log('pass')
                    await addtoCount('pass')

                } else {
                    console.log('fail')
                    await ddtoCount('fail')
                }
            }else if(hand[2]===10){
                if(obj[hand[1][0]]>=2 && obj[hand[2][1]]>=2){
                    console.log('pass')
                    await addtoCount('pass')

                } else {
                    console.log('fail')
                    await addtoCount('fail')
                }
            }  
            else{
                if(obj[hand[1][0]]>=2 && obj[hand[2][0]]>=2){
                console.log('pass')
                await addtoCount('pass')

                } else {
                    console.log('fail')
                    await addtoCount('fail')
                }
            }
        } else if(handCheck==='Three'){
            if(hand[1]===10){
                if(obj[hand[1][1]]>=3){
                    console.log('pass')
                    await addtoCount('pass')

                } else {
                    console.log('fail')
                    await addtoCount('fail')
                }
            } else{
                if(obj[hand[1][0]]>=3){
                console.log('pass')
                await addtoCount('pass')

                } else {
                    console.log('fail')
                    await addtoCount('fail')
                }
            }
        } else if(handCheck==='Full'){
            if(hand[1]===10){
                if(obj[hand[1][1]]>=3 && obj[hand[2][0]]>=2){
                    console.log('pass')
                    await addtoCount('pass')

                } else {
                    console.log('fail')
                    await addtoCount('fail')
                }
            }else if(hand[2]===10){
                if(obj[hand[1][0]]>=3 && obj[hand[2][1]]>=2){
                    console.log('pass')
                    await addtoCount('pass')

                } else {
                    console.log('fail')
                    await addtoCount('fail')
                }
            } else{
                if(obj[hand[1][0]]>=3 && obj[hand[2][0]]>=2){
                console.log('pass')
                await addtoCount('pass')

                } else {
                    console.log('fail')
                    await addtoCount('fail')
                }
            }
        }else {
            if(hand[1]===10){
                if(obj[hand[1][1]]>=4){
                    console.log('pass')
                    await addtoCount('pass')

                } else {
                    console.log('fail')
                    await addtoCount('fail')
                }
            } else{
                if(obj[hand[1][0]]>=4){
                console.log('pass')
                await addtoCount('pass')

                } else {
                    console.log('fail')
                    await addtoCount('fail')
                }
            }
        }
    }
      const checkFlush = async (dealt) => {
        let obj={};
        for(let i=0;i<dealt.length;i++){
            if(dealt[i].length===3){
                if(obj[dealt[i][2]]){
                    obj[dealt[i][2]]++;
                } else {
                    obj[dealt[i][2]]=1
                }
            } else{
                if(obj[dealt[i][1]]){
                    obj[dealt[i][1]]++;
                } else {
                    obj[dealt[i][1]]=1
                }
            }
        }
        if(obj[hand[3][0]]>=5){
            console.log('pass')
            await addtoCount('pass')

        } else {
            console.log('fail')
            await addtoCount('fail')
        }
      }
      const checkStraight = async (dealt) => {
        let obj={};
        for(let i=0;i<dealt.length;i++){
            if(dealt[i].length===3){
                if(obj[dealt[i][1]]){
                    obj[dealt[i][1]]++;
                } else {
                    obj[dealt[i][1]]=1
                }
            } else{
                if(obj[dealt[i][0]]){
                    obj[dealt[i][0]]++;
                } else {
                    obj[dealt[i][0]]=1
                }
            }
        }
        for(let i=allCards.indexOf(hand[2])+2;i<=allCards.indexOf(hand[1])+2;i++){
            console.log(i)
            if(i===10){
                if(!obj[0]){
                    console.log('fail')
                    await addtoCount('fail')
                    return;
                }
            } else {
                if(!obj[allCards[i]]){
                    console.log('fail')
                    await addtoCount('fail')
                    return;
                }
            }
        }
        console.log("pass")
        await addtoCount('pass')

      }

      const checkStraightFlush = async (dealt) => {
        let obj={};
        for(let i=0;i<dealt.length;i++){
             obj[dealt[i]]=1
        }
        console.log(obj)
        for(let i=allCards.indexOf(hand[2]);i<=allCards.indexOf(hand[1]);i++){
            console.log(allCards[i]+hand[3][0])
            if(!obj[allCards[i]+hand[3][0]]){
                console.log('fail')
                await addtoCount('fail')
                return
            }
        }
        console.log('pass')
        await addtoCount('fail')

    }


    const addtoCount= async (ans) => {
        let res= await getIn(code);
        let playersIn = await res.json();
        let one=false;
        // let turn;
        if(ans==='pass'){
            let res= await addCount(playersIn[userTurn],maxCards);
            let resjson = await res.json();
            console.log(resjson)
            // turn=userTurn;
            if(resjson==='remove'){
                // console.log('test remover')
                let result=playersIn.filter(player => player !== playersIn[userTurn])
                console.log(result)
                if(result.length===1){
                    one=true;
                }
                await setPlayersIn(result,code)
            }
        } else {
            if(userTurn===0){
                console.log(playersIn[playersIn.length-1])
                let res= await addCount(playersIn[playersIn.length-1],maxCards);
                let resjson = await res.json();
                console.log(resjson)
                await updateTurn(playersIn[playersIn.length-1],code)
                if(resjson==='remove'){
                    // console.log('tes t remove ')
                    let result = playersIn.filter(player => player !== playersIn[playersIn.length-1])
                    console.log(result)
                    if(result.length===1){
                        one=true;
                    }
                    await setPlayersIn(result,code)
                }
            } else {
                let res= await addCount(playersIn[userTurn-1],maxCards);
                let resjson = await res.json();
                console.log(resjson)
                updateTurn(userTurn-1,code)
                if(resjson==='remove'){
                    // console.log('test remove')
                    let result = playersIn.filter(player => player !== playersIn[userTurn-1])
                    console.log(result)
                    if(result.length===1){
                        one=true;
                    }
                    await setPlayersIn(result,code)
                }
            }
        }

        res= await getIn(code);
        playersIn = await res.json();
        console.log(playersIn)
        setPlayerList(playersIn);
        let hands= await userCards()
        if(one){
            const message = [code, 'winner', playersIn];
            sendMessage(JSON.stringify(message));
        } else {
            const message = [code, 'players',playersIn,hands];
            sendMessage(JSON.stringify(message));
            resetCards();
        }
    }   

    const userCards= async() =>{
        let res= await getIn(code);
        let playersIn = await res.json();
        const cards=[];
        for(let i=0;i<playersIn.length;i++){
            let handRes= await getUser(playersIn[i]);
            let result= await handRes.json()
            cards.push([result.username, result.cards])
        }
        return cards;
    }

    const resetCards = async() =>{
        let res= await getIn(code);
        let playersIn = await res.json();
        await resetCardsDealt(code);
        for(let i=0;i<playersIn.length;i++){
            await resetCardsPlayer(playersIn[i]);
        }

        await dealCards();
        // const message = [code,'round over'];
        // sendMessage(JSON.stringify(message))
        await getHands();
        await getTurn();
         res= await getHand(code)
        let result = await res.json();
        setHand(result)
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };


    return (
        <>
        {winner ? (
            <p>{winner} wins</p>
        ) : (
        !started ? (
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
            <button onClick={openModal}>Open Modal</button>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <h2>Modal Content</h2>
                <p>This is the content of the modal.</p>
                <ul>
                    {allHands.map((hand)=>(
                        <li>{hand}</li>
                    ))}
                </ul>
                <button onClick={closeModal}>Close Modal</button>
            </Modal>
            {hand[0] ? <button type='submit' onClick={handleBS}>Call B.S.</button> : null}
            <>
            {playerList[userTurn]===cookies.sessionId ? (
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
            {(selected==='High Card') ? (
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
            {(selected==='Pair' || selected==='Three of a Kind'|| selected==='Four of a Kind') ? (
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
            {(selected === 'Two Pair' || selected === 'Full House' || selected ==='Straight') ? (
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
            {selected==='Flush' ?
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
            {selected ==='Straight Flush'|| selected==='Royal Flush' ?
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
            <p>{playerList[userTurn]} turn {userTurn}</p>
            )}
            </>
            </>
        ))
        }
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

        // const handleNextUser = async (event) => {

    //   if(userTurn+1>=playersIn.length){
    //     // console.log('reset')
    //     updateTurn(0,code);
    //   } else {
    //     // console.log('+1')
    //     updateTurn(userTurn+1,code);
    //   }
    //     await getTurn();
    //     const message = [code, 'next user',userTurn];
    //     sendMessage(JSON.stringify(message));
    // }