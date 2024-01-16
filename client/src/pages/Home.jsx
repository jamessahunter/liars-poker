import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllMatchups } from '../utils/api';
import UserHand from './UserHand';

// Uncomment import statements below after building queries and mutations
// import { useQuery } from '@apollo/client';
// import { QUERY_MATCHUPS } from '../utils/queries';

const Home = () => {
  const [matchupList, setMatchupList] = useState([]);

  useEffect(() => {
    const getMatchupList = async () => {
      try {
        const res = await getAllMatchups();
        if (!res.ok) {
          throw new Error('No list of matchups');
        }
        const matchupList = await res.json();
        setMatchupList(matchupList);
      } catch (err) {
        console.error(err);
      }
    };
    getMatchupList();
  }, []);

  return (
    <div className="card bg-white card-rounded w-50">
      <UserHand></UserHand>
    </div>
  );
};

export default Home;
