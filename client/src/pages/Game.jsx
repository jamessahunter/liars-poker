import { useState, useEffect, React } from 'react';
import { useCookies } from 'react-cookie';
import { getRoomUser, getUser, addCard, getUserTurn, updateTurn, addDealt, getDealt, addHand, getHand,
addCount, resetCardsDealt, resetCardsPlayer, setPlayersIn, getIn, setRoomStarted, deleteUser } from '../utils/api';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const Game = () =>{

    const hands = [{name:'None',num:0},{name:'High Card',num:1}, {name:'Pair',num:2}, {name:'Two Pair',num:3}, {name:'Three of a Kind',num:4},
    {name:'Flush',num:5}, {name:'Straight',num:6}, {name:'Full House',num:7}, {name:'Four of a Kind',num:8},
    {name:'Straight Flush',num:9}, {name:'Royal Flush',num:10}];
    const allCards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const suits = ['Clubs', 'Daimonds', 'Hearts', 'Spades'];
    const [hand, setHand] = useState('None');
    const [selected, setSelected] = useState('None');
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
    const [passorFail, setPassorFail] = useState();
    const [handCalled, setHandCalled] = useState();
    const [message, setMessage] = useState('');
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
    const [requestSent, setRequestSent]= useState(false);
    //deletes user from db once the user leaves
    window.addEventListener('beforeunload', async function(event) {
        funcDelete()
        });

    const funcDelete = async () =>{
        if(!requestSent){
            let res=await getUser(cookies.sessionId)
            if(res.ok){

                await deleteUser(cookies.sessionId)
            setRequestSent(true)
            }
        }
        return;
    }

    useEffect (() =>{
        getPlayers()
        },[players])
    useEffect(() => {
        getHands();
    }, [userTurn]);
    useEffect(()=>{
    },[started])
    useEffect(()=>{

      getHands();
    },[])
    //gets whose turn it is
    const getTurn = async () =>{
      try{
        let resTurn=await getUserTurn(code);
        let turn  = await resTurn.json();
        setUserTurn(turn);
      } catch(err){
          console.error(err)
      }
    }
    //gets all the players
    const getPlayers = async () =>{
        try{
            let res=await getRoomUser(code);
            let players = await res.json();
      if(players.length>6){
        setMaxCards(4);
      }else{
        setMaxCards(5);
      }
      setPlayers(players)
        } catch(err){
            console.error(err)
        }

    }

    //starts the game
    const handleButtonClick = async (event) => {
        event.preventDefault();
        setStarted(true)
        setRoomStarted(code);
        await setPlayersIn(players,code)
        await dealCards();
        const message = [code, 'started'];
        sendMessage(JSON.stringify(message));
    }


    const [socket, setSocket] = useState(null);
    //deals the cards
    const dealCards= async() => {
        let res= await getIn(code);
        let playersIn = await res.json();

        setPlayerList(playersIn)
        for(let i=0;i<playersIn.length;i++){
            let res = await getUser(playersIn[i])
            let user = await res.json()
            if(user.stillIn){
              setUserCount(user.card_count)
                for(let i=0;i<user.card_count;i++){
                    let randomNumber = Math.floor(Math.random() * 52);
                    let res = await getDealt(code)
                    let dealt = await res.json();
                    for(let i=0;i<dealt.length;i++){
                      cards[dealt]=0;
                    }
                    while(cards[cardsArr[randomNumber]]!==1){
                        randomNumber = Math.floor(Math.random() * 52);
                    }
                    addCard(user.username, cardsArr[randomNumber])
                    addDealt(code,cardsArr[randomNumber])
                    cards[cardsArr[randomNumber]]=0;
                }
            }

        }
    }

//uses websockets to connect all users
  useEffect(async() => {
    const ws = new WebSocket('wss://liars-poker.onrender.com/');
    // const ws = new WebSocket('ws://localhost:3001/') // Replace 'example.com/socket' with your server's WebSocket endpoint

    ws.onmessage = async (event) => {
      const message = event.data;
      const parse=JSON.parse(message);
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
            } else if(parse[1]==='next user'){
              await getTurn();
              getHand(code)
              let res= await getHand(code)
              let result = await res.json();
              setHand(result)
              setSelected('None')
            } else if(parse[1]==='players'){
                setPlayersIn(parse[2])
                setPassorFail(parse[4])
                setAllHands(parse[3])
                setHandCalled(parse[5])
                getHands();
                await getTurn();
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
    if (socket) {
      socket.send(message);
    }
  };

  //checks that the hand played is a valid hand
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        let card1=event.target.card1.value
        let card2=event.target.card2.value
        let suit=event.target.suit.value
        let chosenHand=event.target.hand.value;
        let chosenHandNum = null;
          // Find the object in the hands array that matches the selected hand
        const selectedHand = hands.find(hand => hand.name === chosenHand);
        const currentHand = hands.find(handname => handname.name === hand[0])
        if (selectedHand) {
            chosenHandNum = selectedHand.num;
        }
        if(hand[0]){
        if(selectedHand.num<currentHand.num){
            setMessage('Must select a higher hand')
            return;
        } else if(selectedHand.num===currentHand.num){
            if(suits.indexOf(hand[3])>suits.indexOf(suit) ){
                setMessage('Must select a higher suit')
                return;
            }
            if(suits.indexOf(hand[3])===suits.indexOf(suit) && selectedHand.name=='Flush'){
                setMessage('Must select a higher suit')
                return;
            }
            if(allCards.indexOf(hand[1])>=allCards.indexOf(card1) && suits.indexOf(hand[3])===suits.indexOf(suit) && selectedHand.name!=='Flush'){
                setMessage('Must select a higher card')
                return;
            }
        }
            if(selectedHand.name ==='Two Pair' || selectedHand.name === 'Full House'){
                if(allCards.indexOf(card1)<=allCards.indexOf(card2)){
                    setMessage('Cards cannot be the same or tp card is less than bottom card')
                    return;
                }
            }
            if(selectedHand.name === 'Straight' || selectedHand.name ==='Straight Flush'|| selectedHand.name==='Royal Flush'){
                if(allCards.indexOf(card1)-allCards.indexOf(card2)!==4){
                    setMessage('Cards must be 5 apart')
                    return;
                }
            }
        } else {
            if(hand[1]>=card1 && suits.indexOf(hand[3])===suits.indexOf(suit)){
                setMessage('Must select a higher card')
                return;
            }
            if(selectedHand.name ==='Two Pair' || selectedHand.name === 'Full House'){
                if(allCards.indexOf(card1)==allCards.indexOf(card2)){
                    setMessage('Cards cannot be the same')
                    return;
                }
            }
            if(selectedHand.name === 'Straight' || selectedHand.name ==='Straight Flush'|| selectedHand.name==='Royal Flush'){
                if(allCards.indexOf(card1)-allCards.indexOf(card2)!==4){
                    setMessage('Cards must be 5 apart')
                    return;
                }
            }
        }
        await addHand(code,selectedHand.name,card1,card2,suit)
        if(userTurn+1>=playerList.length){
          await updateTurn(0,code);
        } else {
          await updateTurn(userTurn+1,code);
        }
          await getTurn();
          const message = [code, 'next user',userTurn];
          sendMessage(JSON.stringify(message));
    };

    const handleInputChange = (event) => {
        setSelected(event.target.value);
      };
      //gets the hand
      const getHands = async()=>{
        let handRes= await getUser(cookies.sessionId);
        let result= await handRes.json()
        setUserHand(result.cards);
      }
      //checks if the hand played exists
      const handleBS = async ()=>{
        let res = await getDealt(code)
        let dealt = await res.json();
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
        for(let i=0;i<dealt.length;i++){
            if(dealt[i].length===3){
                if(dealt[i][0]===hand[1][0] && dealt[i][1]===hand[1][1] && dealt[i][2]===hand[3][0]){
                    await addtoCount('pass')
                    return
                }
            }else{
                if(dealt[i][0]===hand[1][0] && dealt[i][1]===hand[3][0]){
                    await addtoCount('pass')
                    return
                }
            }
      }
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
                } else {
                    await addtoCount('fail')
                }
            } else{
                if(obj[hand[1][0]]>=2){
                } else {
                    await addtoCount('fail')
                }
            }
        } else if(handCheck==='Two'){
            if(hand[1]===10){
                if(obj[hand[1][1]]>=2 && obj[hand[2][0]]>=2){
                    await addtoCount('pass')

                } else {
                    await addtoCount('fail')
                }
            }else if(hand[2]===10){
                if(obj[hand[1][0]]>=2 && obj[hand[2][1]]>=2){
                    await addtoCount('pass')

                } else {
                    await addtoCount('fail')
                }
            }  
            else{
                if(obj[hand[1][0]]>=2 && obj[hand[2][0]]>=2){
                await addtoCount('pass')

                } else {
                    await addtoCount('fail')
                }
            }
        } else if(handCheck==='Three'){
            if(hand[1]===10){
                if(obj[hand[1][1]]>=3){
                    await addtoCount('pass')

                } else {
                    await addtoCount('fail')
                }
            } else{
                if(obj[hand[1][0]]>=3){
                await addtoCount('pass')

                } else {
                    await addtoCount('fail')
                }
            }
        } else if(handCheck==='Full'){
            if(hand[1]===10){
                if(obj[hand[1][1]]>=3 && obj[hand[2][0]]>=2){
                    await addtoCount('pass')

                } else {
                    await addtoCount('fail')
                }
            }else if(hand[2]===10){
                if(obj[hand[1][0]]>=3 && obj[hand[2][1]]>=2){
                    await addtoCount('pass')

                } else {
                    await addtoCount('fail')
                }
            } else{
                if(obj[hand[1][0]]>=3 && obj[hand[2][0]]>=2){
                await addtoCount('pass')

                } else {
                    await addtoCount('fail')
                }
            }
        }else {
            if(hand[1]===10){
                if(obj[hand[1][1]]>=4){
                    await addtoCount('pass')

                } else {
                    await addtoCount('fail')
                }
            } else{
                if(obj[hand[1][0]]>=4){
                await addtoCount('pass')

                } else {
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
            await addtoCount('pass')

        } else {
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
            if(i===10){
                if(!obj[0]){
                    await addtoCount('fail')
                    return;
                }
            } else {
                if(!obj[allCards[i]]){
                    await addtoCount('fail')
                    return;
                }
            }
        }
        await addtoCount('pass')

      }

      const checkStraightFlush = async (dealt) => {
        let obj={};
        for(let i=0;i<dealt.length;i++){
             obj[dealt[i]]=1
        }
        for(let i=allCards.indexOf(hand[2]);i<=allCards.indexOf(hand[1]);i++){
            if(!obj[allCards[i]+hand[3][0]]){
                await addtoCount('fail')
                return
            }
        }
        await addtoCount('fail')

    }

    //adds to player count
    const addtoCount= async (ans) => {
        let res= await getIn(code);
        let playersIn = await res.json();
        let one=false;
        if(ans==='pass'){
            let res= await addCount(playersIn[userTurn],maxCards);
            let resjson = await res.json();
            if(resjson==='remove'){
                let result=playersIn.filter(player => player !== playersIn[userTurn])
                if(result.length===1){
                    one=true;
                }
                await setPlayersIn(result,code)
            }
        } else {
            if(userTurn===0){
                let res= await addCount(playersIn[playersIn.length-1],maxCards);
                let resjson = await res.json();
                await updateTurn(playersIn[playersIn.length-1],code)
                if(resjson==='remove'){
                    let result = playersIn.filter(player => player !== playersIn[playersIn.length-1])
                    if(result.length===1){
                        one=true;
                    }
                    await setPlayersIn(result,code)
                }
            } else {
                let res= await addCount(playersIn[userTurn-1],maxCards);
                let resjson = await res.json();
                updateTurn(userTurn-1,code)
                if(resjson==='remove'){
                    let result = playersIn.filter(player => player !== playersIn[userTurn-1])
                    if(result.length===1){
                        one=true;
                    }
                    await setPlayersIn(result,code)
                }
            }
        }

        res= await getIn(code);
        playersIn = await res.json();
        setPlayerList(playersIn);
        let hands= await userCards()
        if(one){
            const message = [code, 'winner', playersIn];
            sendMessage(JSON.stringify(message));
        } else {
            const message = [code, 'players',playersIn,hands,ans,hand];
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
        await getHands();
        await getTurn();
         res= await getHand(code)
        let result = await res.json();
        setHand(result)
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rulesModal, setRulesModal] = useState(false)
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openRules = () => {
        setRulesModal(true);
    };

    const closeRules = () => {
        setRulesModal(false);
    };
    return (
        <Container className="justify-content-center align-items-center rounded bg-white mb-3">
          <Row className='justify-content-center align-items-center'>
        <Col xs={6}>
        <h1>Liar's Poker</h1>
        </Col>
        <Col xs={6} className='d-flex justify-content-end'>
            <Button onClick={openRules}>How to Play</Button>
        </Col>
      </Row>
          <Modal show={rulesModal} onHide={closeRules} scrollable={true}>
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
                <Button onClick={closeRules}>Close</Button>
                </Modal.Footer>
            </Modal>
            <Container className="justify-content-center align-items-center rounded mb-3" >
        {winner ? (
            <h1>{winner} wins</h1>
        ) : (
        !started ? (
            <Container className="justify-content-center align-items-center bg-white text-center">
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
            <Button type='submit' className="mb-3" onClick={handleButtonClick}>Start Game</Button>

            </Container>
        ) : (
            <>
            <Row className='d-flex justify-content-center'>
            <Col className='d-flex justify-content-center'>
            <p>Current Hand is {hand[0]} {hand[1]} {hand[2]} {hand[3]} </p>
            </Col>
            </Row>
            <Row>
                <Col className='d-flex justify-content-center'>
            <ul>
            <p>Your Cards are:</p>
            {userHand.map((card) => (
              <li>{card}</li>
            ))}
            </ul>
            </Col>
            </Row>
                <Row className='d-flex justify-content-center'>
                    <Col className='d-flex justify-content-center' xs={3}>
            {/* <Button onClick={handleClickCard} >Get Cards</Button> */}
            <Button onClick={openModal}>See Previous Rounds Cards</Button>
                </Col>
            </Row>
            <Modal show={isModalOpen} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Previous Round</Modal.Title>
                </Modal.Header>
                <Modal.Body>                
                <h2>{passorFail}</h2>
                <h3>{handCalled}</h3>
                <ul>
                    {allHands.map((hand)=>(
                        <li>{hand}</li>
                    ))}
                </ul>
                </Modal.Body>
                <Modal.Footer>
                <Button onClick={closeModal}>Close</Button>
                </Modal.Footer>
            </Modal>
            
            <div className="mb-3">
            {playerList[userTurn]===cookies.sessionId ? (
              <>
              <Row className='d-flex justify-content-center'>
                <Col className='d-flex justify-content-center'>
            <h2>Your Turn</h2>
            </Col>
            </Row>
            {hand[0] ? <Button type='submit' onClick={handleBS}>Call B.S.</Button> : null}
            <div className="card-body m-5">
            <Form onSubmit={handleFormSubmit} className="mb-3">
            <label>Possible Hands: </label>
            <Form.Select name="hand" onChange={handleInputChange} className="mb-3">
                {hands.map((hand) => {
                return (
                    <option key={hand._id} value={hand.name}>
                    {hand.name}
                    </option>
                );
                })}
            </Form.Select>
            {(selected==='High Card') ? (
                <>
                <label>Top Card, Three of a Kind</label>
                <Form.Select name="card1" >
                    {allCards.map((card) => {
                        return (
                            <option key={card._id} value={card}>
                                {card}
                            </option>
                        );
                    })}
                </Form.Select>
                <label>Bottom Card, Pair</label>
                <Form.Select name="card2" value={undefined} disabled>
                </Form.Select>
                <label>Suit </label>
                <Form.Select name="suit" >
                    {suits.map((suit) => {
                        return (
                            <option key={suit._id} value={suit}>
                                    {suit}
                            </option>
                        );
                    })}
                </Form.Select>
                <Button type='submit'>Submit</Button>
                </>
            ) : undefined}
            {(selected==='Pair' || selected==='Three of a Kind'|| selected==='Four of a Kind') ? (
                <>
                <label>Top Card, Three of a Kind</label>
                <Form.Select name="card1" >
                    {allCards.map((card) => {
                        return (
                            <option key={card._id} value={card}>
                                {card}
                            </option>
                        );
                    })}
                </Form.Select>
                <label>Bottom Card, Pair</label>
                <Form.Select name="card2" value={undefined} disabled>
                </Form.Select>
                <label>Suit </label>
                <Form.Select name="suit" value={undefined} disabled>
                </Form.Select>
                <Button type='submit'>Submit</Button>
                </>
            ) : undefined}
            {(selected === 'Two Pair' || selected === 'Full House' || selected ==='Straight') ? (
                <>
                <label>Top Card, Three of a Kind</label>
                <Form.Select name="card1" >
                    {allCards.map((card) => {
                        return (
                            <option key={card._id} value={card}>
                                {card}
                            </option>
                        );
                    })}
                </Form.Select>
                <label>Bottom Card, Pair </label>
                <Form.Select name="card2" >
                    {allCards.map((card) => {
                        return (
                            <option key={card._id} value={card}>
                                {card}
                            </option>
                    );
                })}
                </Form.Select>
                <label>Suit </label>
                <Form.Select name="suit" value={undefined} disabled>
                </Form.Select>
                <Button type='submit'>Submit</Button>
                </>
            ): undefined}
            {selected==='Flush' ?
            <>
            <label>Top Card, Three of a Kind </label>
             <Form.Select name="card1" value={undefined} disabled>
            </Form.Select>
            <label>Bottom Card, Pair </label>
            <Form.Select name="card2" value={undefined} disabled>
                </Form.Select>
            <label>Suit </label>
            <Form.Select name="suit" >
            {suits.map((suit) => {
                return (
                    <option key={suit._id} value={suit}>
                    {suit}
                    </option>
                );
                })}
            </Form.Select>
            <Button type='submit'>Submit</Button>
            </>
            : undefined}
            {selected ==='Straight Flush'|| selected==='Royal Flush' ?
            <>
            <label>Top Card </label>
            <Form.Select name="card1" >
                {allCards.map((card) => {
                    return (
                        <option key={card._id} value={card}>
                            {card}
                        </option>
                    );
                })}
            </Form.Select>
            <label>Bottom Card </label>
            <Form.Select name="card2" >
                {allCards.map((card) => {
                    return (
                        <option key={card._id} value={card}>
                            {card}
                        </option>
                );
            })}
            </Form.Select>
            <label>Suit </label>
            <Form.Select name="suit" >
            {suits.map((suit) => {
                return (
                    <option key={suit._id} value={suit}>
                    {suit}
                    </option>
                );
                })}
            </Form.Select>
            <Row className='d-flex justify-content-center'>
                    <Col className='d-flex justify-content-center' xs={3}>
            <Button type='submit' className="mb-3" >Submit</Button>
            </Col>
            </Row>
            </>
        : undefined}
            </Form>
            <h2 style={{ color: 'red' }}>{message}</h2>
        </div>
        </>
            ) : (
                <Row className='d-flex justify-content-center'>
                    <Col className='d-flex justify-content-center'>
            <h2>{playerList[userTurn]} Turn</h2>
            </Col>
            </Row>
            )}
            </div>
            </>
        ))
        }
        </Container>
        </Container>
        
    )

        
 }

export default Game;