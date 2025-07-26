import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://51.20.31.212:3000',
    // baseURL: 'https://c0de-front-backend.onrender.com', 
    withCredentials: true, //browser will attach cookies when true
    headers:{
        'Content-Type': 'application/json'
    }
});

export default axiosClient;