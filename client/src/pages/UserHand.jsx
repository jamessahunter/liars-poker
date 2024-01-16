import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const UserHand = () => {
    const [cards, setCards] = useState();
    const hands = ['None','High Card', 'Pair', 'Two Pair', 'Three of a Kind',
        'Flush', 'Straight', 'Full House', 'Four of a Kind',
        'Straight Flush', 'Royal Flush'];
    const allCards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const suits = ['Clubs', 'Daimonds', 'Hearts', 'Spades'];
    const [hand, setHand] = useState('None');
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        
    };
    const handleInputChange = (event) => {
        console.log(event.target.value)
        const { name, value } = event.target;
        setHand(event.target.value);
        console.log(hand)
      };
    return (
        <div className="card-body m-5">
            <form onSubmit={handleFormSubmit}>
            <label>Possible Hands: </label>
            <select name="hand" onChange={handleInputChange}>
                {hands.map((hand) => {
                return (
                    <option key={hand._id} value={hand}>
                    {hand}
                    </option>
                );
                })}
            </select>
            {(hand==='High Card') ? (
                <>
                <select name="cards" >
                    {allCards.map((card) => {
                        return (
                            <option key={card._id} value={card}>
                                {card}
                            </option>
                        );
                    })}
                </select>
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
                                <select name="cards" >
                    {allCards.map((card) => {
                        return (
                            <option key={card._id} value={card}>
                                {card}
                            </option>
                        );
                    })}
                </select>
                <button type='submit'>Submit</button>
                </>
            ) : null}
            {(hand === 'Two Pair' || hand === 'Full House' || hand ==='Straight') ? (
                <>
                <label>Top Card, Three of a Kind</label>
                <select name="cards" >
                    {allCards.map((card) => {
                        return (
                            <option key={card._id} value={card}>
                                {card}
                            </option>
                        );
                    })}
                </select>
                <label>Bottom Card, Pair </label>
                <select name="cards" >
                    {allCards.map((card) => {
                        return (
                            <option key={card._id} value={card}>
                                {card}
                            </option>
                    );
                })}
                </select>
                <button type='submit'>Submit</button>
                </>
            ): null}
            {hand==='Flush' ?
            <>
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
            <select name="cards" >
                {allCards.map((card) => {
                    return (
                        <option key={card._id} value={card}>
                            {card}
                        </option>
                    );
                })}
            </select>
            <label>Bottom Card </label>
            <select name="cards" >
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
    )
}

export default UserHand;