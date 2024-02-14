export const getAllMatchups = () => {
  return fetch('/api/matchup', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const createMatchup = (matchupData) => {
  return fetch('/api/matchup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(matchupData),
  });
};

export const getMatchup = (matchupId) => {
  return fetch(`/api/matchup/${matchupId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const createVote = (voteData) => {
  return fetch(`/api/matchup/${voteData}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(voteData),
  });
};

export const getAllUser = () => {
  // console.log(code)
  return fetch(`/api/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getUser = (username) => {
  // console.log(code)
  return fetch(`/api/user/${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getDealt = (code) => {
  // console.log(code)
  return fetch(`/api/room/dealt/${code}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const addCard = (username, card) => {
  // console.log(card)
  return fetch(`/api/user/card/${username}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: `{"card" : "${card}"}`,
  })
}

export const addCount = (username) => {
  console.log('add count')
  return fetch(`/api/user/count/${username}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const addDealt = (room, card) => {
  // console.log("dealt")
  // console.log(card)
  return fetch(`/api/room/dealt/${room}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: `{"cards_dealt" : "${card}"}`,
  })
}

export const addHand = (room, hand, card1, card2, suit) => {
  // console.log("hand")
    const data = [hand, card1, card2, suit]
  return fetch(`/api/room/hand/${room}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

export const getHand = (code) => {
  // console.log(code)
  return fetch(`/api/room/hand/${code}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const createUser = (username) => {
  console.log(username)
  console.log(JSON.stringify(username))
  return fetch(`/api/user`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: `{"username" : "${username}"}`,
  })
}

export const createRoom = (code) => {
  // console.log(username)
  // console.log(JSON.stringify(username))
  return fetch(`/api/room`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: `{"room" : "${code}"}`,
  })
}

export const addUser = (username,code) => {
  return fetch(`/api/room/add/${code}`,{
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: `{"username" : "${username}"}`,
  })
}

  export const AnotherUser = (username,code) => {
    return fetch(`/api/room/another/${code}`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: `{"username" : "${username}"}`,
    })
}

export const getRoomUser = (code) => {
  // console.log(code)
  return fetch(`/api/room/user/${code}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

  export const getUserTurn = (code) => {
    console.log('turn')
    return fetch(`/api/room/turn/${code}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
};

export const updateTurn = (turn,code) => {
  console.log(turn);
  return fetch(`/api/room/turn/${code}`,{
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: `{"userTurn" : ${turn}}`,
  })
}