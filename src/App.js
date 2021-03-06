import React, { useEffect, useState } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { ThemeProvider, createTheme } from '@mui/material';

import { getHolidays, getCountries, HOLIDAY_TYPE } from './Utils'
import { Backdrop, Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormGroup, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField, Tooltip, Typography } from '@mui/material';
import HolidaysTable from './HolidaysTable';

const ELEMENT_WIDTH = 600

const theme = createTheme({
  typography: {
    fontFamily: 'Oleo Script',
    // button: {
    //   fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    // },
    body1: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    }
  }
})

function App()
{
  const [holidayTypes, setHolidayTypes] = useState([])
  const [supportedCountries, setSupportedCountries] = useState([])
  const [countries, setCountries] = useState([])
  const [countriesID, setCountriesID] = useState([])
  const [countriesName, setCountriesName] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [year, setYear] = useState(new Date().getFullYear())
  const [holidayData, setHolidayData] = useState([])

  const getHolidayForCountry = (country, year, types) =>
  {
    let itemName = `${country}-${year}-${types.join('-')}`

    let holidayItem = localStorage.getItem(itemName)
    if (holidayItem)
    {
      let holidayData = JSON.parse(holidayItem)
      console.log(`holidays of ${itemName} from local storage`, holidayData)
      return Promise.resolve(holidayData)
    }

    return getHolidays(country, year, types)
      .then(holidays =>
      {
        console.log(`holidays of ${itemName}`, holidays)
        localStorage.setItem(itemName, JSON.stringify(holidays, null, 2))
        return holidays
      })
      .catch(err =>
      {
        console.error(`holidays of ${itemName} error`, err)
      })
  }

  useEffect(() =>
  {
    let localData = localStorage.getItem('countries')
    if (localData)
    {
      let jsonCountries = JSON.parse(localData)
      console.log('countries from local storage', jsonCountries)
      setSupportedCountries(jsonCountries)
      setLoading(false)
      return;
    }
    getCountries()
      .then(data =>
      {
        console.log('countries', data)
        localStorage.setItem('countries', JSON.stringify(data, null, 2))
        setSupportedCountries(data)
        setLoading(false)
      })
      .catch(err =>
      {
        console.error(err)
      })
  }, [setSupportedCountries, setLoading])

  const onHolidayTypeChanged = (e, checked) =>
  {
    console.log('value', e.target.value, 'checked', checked)
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
      <FormGroup row={true} sx={{ width: ELEMENT_WIDTH, justifyContent: 'space-between' }}>
        {
          Object.keys(HOLIDAY_TYPE).map((key, index) => (
            <FormControlLabel
              key={key}
              value={key}
              control={<Checkbox checked={holidayTypes.includes(key)} />}
              onChange={onHolidayTypeChanged}
              label={
                <Tooltip title={HOLIDAY_TYPE[key]} placement={'top'} arrow>
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
    setHolidayData([])
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
          width: ELEMENT_WIDTH,
        },
      },
    };

    return (
      <FormControl sx={{ m: 1, width: ELEMENT_WIDTH }}>
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

  const onInputYearChanged = (e) =>
  {
    // console.log('onInputYearChanged', e.target.value)
    let value = e.target.value
    setYear(parseInt(value))
  }

  const renderInputYear = () =>
  {
    return (
      <TextField variant='outlined'
        value={year}
        type={'number'}
        onChange={onInputYearChanged}
        label={'Year'}
        sx={{ m: 1, width: ELEMENT_WIDTH }}
        InputProps={{
          inputProps: {
            min: 1900
          }
        }}
      />
    )
  }

  const onCompareClicked = (e) =>
  {
    console.log('onCompareClicked', countriesID.join(', '), 'types', holidayTypes.join(', '))
    setLoading(true)

    let promises = countriesID.map(ID =>
    {
      return getHolidayForCountry(ID, year, holidayTypes)
    })

    Promise.all(promises)
      .then(allData =>
      {
        // console.log('allData', allData)
        setHolidayData(allData)
      })
      .catch(err =>
      {
        console.err('allData error', err)
      })
      .finally(() =>
      {
        setLoading(false)
      })
  }

  const renderButtonTooltip = () =>
  {
    if (countriesID.length === 0)
    {
      return 'Please select at least 1 country'
    }

    if (holidayTypes.length === 0)
    {
      return 'Please select at least 1 holiday type'
    }

    return ''
  }

  const disabledButton = countriesID.length === 0 || holidayTypes.length === 0
  const tooltipButton = renderButtonTooltip()

  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Container maxWidth={false} disableGutters={true}>
          <Box sx={{ bgcolor: '#cfe8fc', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography align={'center'} variant={'h4'} sx={{ padding: 1 }} >Holidays Compare</Typography>
            {
              renderCountries()
            }
            {
              renderHolidayType()
            }
            {
              renderInputYear()
            }
            <Tooltip title={tooltipButton} placement={'bottom'} arrow >
              <span>
                <Button
                  variant='contained'
                  onClick={onCompareClicked}
                  disabled={disabledButton}
                  sx={{ width: ELEMENT_WIDTH }}
                >
                  Compare
                </Button>
              </span>
            </Tooltip>
            <HolidaysTable year={year} data={holidayData} countries={countriesName} countriesID={countriesID} />
          </Box>
          <Backdrop
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
          >
            <CircularProgress color='secondary' />
          </Backdrop>
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
