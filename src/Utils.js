import axios from 'axios';

// Fixed: Request failed with status code 429
export const DELAY_DEFAULT = 1000
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

///////////////////////////////////////////////////////////////////////////////
//
// https://app.abstractapi.com/api/holidays/documentation
//
///////////////////////////////////////////////////////////////////////////////

// In Free API, year/month/day must be include in the query
export const getHolidayFree = (country, year, month, day) =>
{
    // console.log('getHolidays', country, year, month, day)
    const url = `${process.env.REACT_APP_API_URL}?api_key=${process.env.REACT_APP_API_KEY}&country=${country}&year=${year}&month=${month}&day=${day}`
    return axios.get(url)
}

// cheat version to get all holidays in year
export const getHolidaysFree = async (country, year) =>
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

///////////////////////////////////////////////////////////////////////////////
// 
// https://calendarific.com/api-documentation
//
///////////////////////////////////////////////////////////////////////////////

export const getHoliday = (country, year, type = ['national', 'local', 'religious', 'observance']) =>
{
    // console.log('getHoliday', country, year)
    const url = `${process.env.REACT_APP_API_URL}/holidays?api_key=${process.env.REACT_APP_API_KEY}&country=${country}&year=${year}&type=${type}`
    return axios.get(url)
}

export const getHolidays = (country, year, type = ['national', 'local', 'religious', 'observance']) => 
{
    return getHoliday(country, year, type)
        .then(response =>
        {
            console.log('getHolidays response', response)
            return response.data.response.holidays
        })
}