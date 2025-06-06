import axios from "axios";
let sessionID ;
try{
//  localStorage.removeItem('token');
 sessionID = (JSON.parse(localStorage?.getItem('token')))?.session;
}catch{
  sessionID = null;
}
console.log(`${process.env.NEXT_PUBLIC_BASE_URL}`);

const axiosInstance = axios.create({
  baseURL: "https://nexusmart-g9c5.onrender.com",
  headers: {
    'Content-Type': 'application/json',
    "sessionID": sessionID
  }
});

export default axiosInstance;