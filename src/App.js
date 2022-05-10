import React, { useEffect, useState } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';


import { getHolidayFree, getHolidays, getCountries, HOLIDAY_TYPE } from './Utils'
import { Checkbox, FormControlLabel, FormGroup, Tooltip, Typography } from '@mui/material';


function App()
{
  const [holidayTypes, setHolidayTypes] = useState([])
  const [countries, setCountries] = useState([])

  useEffect(() =>
  {
    let holidayVN = localStorage.getItem('VN-national')
    if (holidayVN)
    {
      console.log('holidays from local storage', JSON.parse(holidayVN))
      return
    }
    // getHolidaysFree('VN', 2022)
    getHolidays('VN', 2022, ['national'])
      .then(holidays =>
      {
        console.log('holidays', holidays)
        localStorage.setItem('VN-national', JSON.stringify(holidays, null, 2))
      })
      .catch(err =>
      {
        console.error(err)
      })

  }, [])

  useEffect(() =>
  {
    let localData = localStorage.getItem('countries')
    if (localData)
    {
      let jsonCountries = JSON.parse(localData)
      console.log('countries from local storage', jsonCountries)
      setCountries(jsonCountries)
      return;
    }
    getCountries()
      .then(data =>
      {
        console.log('countries', data)
        localStorage.setItem('countries', JSON.stringify(data, null, 2))
        setCountries(data)
      })
      .catch(err =>
      {
        console.error(err)
      })
  }, [setCountries])

  const onHolidayTypeChanged = (e, checked) =>
  {
    // console.log('value', e.target.value, 'checked', checked)
    if (checked)
    {
      setHolidayTypes(oldValues => oldValues.concat(e.target.value))
    }
    else
    {
      setHolidayTypes(oldValues => oldValues.filter(value => value !== e.target.value))
    }
  }

  const renderHolidayType = () =>
  {
    return (
      <FormGroup row={true}>
        {
          Object.keys(HOLIDAY_TYPE).map(key => (
            <FormControlLabel
              key={key}
              control={<Checkbox checked={holidayTypes.includes(key)} />}
              onChange={onHolidayTypeChanged}
              label={
                <Tooltip title={HOLIDAY_TYPE[key]}>
                  <Typography>{key}</Typography>
                </Tooltip>
              }
            />
          ))
        }
      </FormGroup>
    )
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }}>
          <Typography align={'center'} variant={'h4'} sx={{ padding: 1, fontFamily: 'Oleo Script' }} >Holidays Compare</Typography>
          {
            renderHolidayType()
          }
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default App;
