import React, { useEffect, useState } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';


import { getHolidayFree, getHolidays, getCountries, HOLIDAY_TYPE } from './Utils'
import { Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Tooltip, Typography } from '@mui/material';


function App()
{
  const [holidayTypes, setHolidayTypes] = useState([])
  const [supportedCountries, setSupportedCountries] = useState([])
  const [countries, setCountries] = useState([])
  const [countriesID, setCountriesID] = useState([])
  const [countriesName, setCountriesName] = useState([])

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
      setSupportedCountries(jsonCountries)
      return;
    }
    getCountries()
      .then(data =>
      {
        console.log('countries', data)
        localStorage.setItem('countries', JSON.stringify(data, null, 2))
        setSupportedCountries(data)
      })
      .catch(err =>
      {
        console.error(err)
      })
  }, [setSupportedCountries])

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

  const onCountriesChanged = (e) =>
  {
    const values = e.target.value
    let IDs = []
    let names = []

    values.forEach(data =>
    {
      const [ID, name] = data.split('@')
      IDs.push(ID)
      names.push(name)
    });

    console.log('onCountriesChanged', values, 'ID', IDs, 'name', names)
    setCountries(values)
    setCountriesID(IDs)
    setCountriesName(names)
  }

  const renderSelectedCountries = (selectedIDs) =>
  {
    return countriesName.join(', ')
  }

  const renderCountries = () =>
  {
    const LABEL = 'Supported countries'
    const ITEM_HEIGHT = 48
    const ITEM_PADDING_TOP = 8
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250,
        },
      },
    };

    return (
      <FormControl sx={{ m: 1, width: 500 }}>
        <InputLabel>{LABEL}</InputLabel>
        <Select
          multiple
          value={countries}
          onChange={onCountriesChanged}
          input={<OutlinedInput label={LABEL} />}
          renderValue={renderSelectedCountries}
          MenuProps={MenuProps}
        >
          {
            supportedCountries.map(data => (
              <MenuItem key={data.uuid} value={`${data['iso-3166']}@${data.country_name}`} >
                <Checkbox checked={countriesID.indexOf(data['iso-3166']) > -1} />
                <ListItemText primary={data.country_name} />
              </MenuItem>
            ))
          }
        </Select>
      </FormControl>
    )
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={{ bgcolor: '#cfe8fc', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography align={'center'} variant={'h4'} sx={{ padding: 1, fontFamily: 'Oleo Script' }} >Holidays Compare</Typography>
          {
            renderCountries()
          }
          {
            renderHolidayType()
          }
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default App;
