import React from 'react';
import ReactDOM from 'react-dom/client';
import Chat from './chat.jsx';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Chat />
  </React.StrictMode>
);