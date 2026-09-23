//  fetch function backend ko data bhejne ke liye

const API = import.meta.env.VITE_API_URL;

 async function registerUser(userData) {
  const response = await fetch(`${API}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  //  response ko json me convert karka 
  const data = await response.json();
  return data;
}

async function loginUser(userData) {
  const res = await fetch(`${API}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });


}

export {
  registerUser
}