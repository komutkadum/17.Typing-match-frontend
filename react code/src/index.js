import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './w3.css';
import {io} from 'socket.io-client'

export const socketContext = React.createContext(null)

const devServer = "http://localhost:5000/";
const prodServer = "https://typingmatch.herokuapp.com/"
const prodServerVercel = "https://16-typing-match-backend-e5s9ko2ns-komutkadum.vercel.app/";

const socket = io(prodServer,{autoConnect:false});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <socketContext.Provider value={socket}>
    <React.StrictMode>
      <App/>
    </React.StrictMode>
  </socketContext.Provider>
);

