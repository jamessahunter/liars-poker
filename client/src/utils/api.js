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
  return fetch('/api/user', {
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
