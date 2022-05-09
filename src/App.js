import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

import { getHolidayFree, getHolidays } from './Utils'

function App()
{
  useEffect(() =>
  {
    // getHolidaysFree('VN', 2022)
    getHolidays('VN', 2022, ['national'])
      .then(holidays =>
      {
        console.log('holidays', holidays)
      })
      .catch(err =>
      {
        console.error(err)
      })

  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
