import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App()
{
  useEffect(() =>
  {
    getHolidaysFree('VN', 2022)
      .then(holidays =>
      {
        console.log('holidays', holidays)
      })
      .catch(err =>
      {
        console.error(err)
      })

  }, [])

  // Fixed: Request failed with status code 429
  const DELAY_DEFAULT = 1000
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

  // cheat version to get all holidays in year
  const getHolidaysFree = async (country, year) =>
  {
    var holidays = []

    var date = new Date()
    for (let month = 1; month < 12; month++)
    {
      date.setFullYear(year, month, 0)
      let days = date.getDate()
      // console.log(`total days ${year}-${month}: ${days}`)
      let day = 1
      while (day < days)
      {
        try
        {
          let response = await getHolidayFree(country, year, month, day)
          holidays = holidays.concat(response.data)
          await delay(DELAY_DEFAULT)

          day++
        }
        catch (err)
        {
          console.error(`getHolidayFree error ${err.message}`)
        }
      }
    }

    return holidays
  }

  // https://app.abstractapi.com/api/holidays/documentation
  // In Free API, year/month/day must be include in the query
  const getHolidayFree = (country, year, month, day) =>
  {
    // console.log('getHolidays', country, year, month, day)
    const url = `${process.env.REACT_APP_API_URL}?api_key=${process.env.REACT_APP_API_KEY}&country=${country}&year=${year}&month=${month}&day=${day}`
    return axios.get(url)
  }

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
