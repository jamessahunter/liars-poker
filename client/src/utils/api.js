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
  console.log(username)
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

export const addCount = (username,maxCards) => {
  console.log('add count')
  return fetch(`/api/user/count/${username}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body:`{"maxCards" : "${maxCards}" }`
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

export const resetCardsDealt = (room, card) => {
  // console.log("dealt")
  // console.log(card)
  return fetch(`/api/room/reset/${room}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const resetCardsPlayer = (username) => {
  return fetch(`/api/user/resetCards/${username}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
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

export const setPlayersIn = (playersIn,code) => {
  // console.log("players")
    const data = playersIn;
    // console.log(data)
  return fetch(`/api/room/playersIn/${code}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

export const getIn = (code) => {
  // console.log("get players in")
    // console.log(code)
  return fetch(`/api/room/getIn/${code}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const setRoomStarted = (code) => {
  return fetch(`/api/room/started/${code}`,{
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    // body: `{"started" : true}`,
  })
}

export const getRoomStarted = (code) => {
  return fetch(`/api/room/started/${code}`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const deleteUser = (username) => {
  return fetch(`/api/user/delete/${username}`,{
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: `{"username" : "${username}"}`,
  })
}