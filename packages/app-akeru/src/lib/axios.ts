// instantiate an axios instance 
import axios from 'axios';

/**
 * This is a temporary implementation for our swr fetchers until we have a solid auth system.
 * The api token can be found within your local redis store. 
 */
export const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? "http://localhost:8080" : "https://akeru-server.onrender.com",
  timeout: 10000, 
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`
  }
})