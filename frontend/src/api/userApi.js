//  fetch function backend ko data bhejne ke liye
export async function registerUser(userData) {
  const response = await fetch('http://localhost:3000/users', {
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