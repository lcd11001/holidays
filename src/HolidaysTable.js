import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function createData(name, calories, fat, carbs, protein)
{
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const HolidaysTable = ({ data, countries, countriesID, year }) =>
{
    const [nomalizeData, setNomalizeData] = useState([])
    let minDate = new Date(year, 0, 1);

    const hasFinished = (currentDataIndex, data) =>
    {
        return currentDataIndex.reduce((prevResult, index, row) =>
        {
            if (prevResult === false)
            {
                return false
            }
            if (Array.isArray(data[row]) && index < data[row].length)
            {
                return false
            }
            return true
        }, true)
    }

    useEffect(() =>
    {
        let allData = countries.map((country, index) =>
        {
            if (countriesID.length === countries.length)
            {
                return [countriesID[index], country]
            }
            return [country]
        })

        let currentDataIndex = new Array(countries.length).fill(0)

        while (!hasFinished(currentDataIndex, data))
        {
            let maxDate = new Date(year, 12, 0)

            currentDataIndex.forEach((index, row) =>
            {
                let nextIndex = index

                if (index < data[row].length)
                {
                    let currentData = data[row][index]

                    if (currentData.date.datetime.year === minDate.getFullYear()
                        && currentData.date.datetime.month === minDate.getMonth() + 1
                        && currentData.date.datetime.day === minDate.getDate())
                    {
                        // valid cell
                        allData[row].push({
                            date: currentData.date.iso,
                            description: currentData.description,
                            name: currentData.name
                        })

                        // update next index
                        nextIndex = index + 1
                    }
                    else
                    {
                        // empty cell
                        allData[row].push(null)
                    }
                }
                else
                {
                    // empty cell
                    allData[row].push(null)
                }

                if (nextIndex < data[row].length)
                {
                    // checking next date for new compare
                    let nextData = data[row][nextIndex]
                    let nextDate = new Date(nextData.date.datetime.year, nextData.date.datetime.month - 1, nextData.date.datetime.day)
                    // if (nextDate.getTime() < maxDate.getTime())
                    if (nextDate < maxDate)
                    {
                        maxDate = nextDate
                    }
                }

                // set new value for next loop
                currentDataIndex[row] = nextIndex
            })

            minDate = maxDate
        }

        console.log('normalize Data', allData)

        setNomalizeData(allData)
    }, [data, countries, countriesID])

    return (
        <TableContainer component={Paper} sx={{ margin: 1 }}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Dessert (100g serving)</StyledTableCell>
                        <StyledTableCell align="right">Calories</StyledTableCell>
                        <StyledTableCell align="right">Fat&nbsp;(g)</StyledTableCell>
                        <StyledTableCell align="right">Carbs&nbsp;(g)</StyledTableCell>
                        <StyledTableCell align="right">Protein&nbsp;(g)</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <StyledTableRow key={row.name}>
                            <StyledTableCell component="th" scope="row">
                                {row.name}
                            </StyledTableCell>
                            <StyledTableCell align="right">{row.calories}</StyledTableCell>
                            <StyledTableCell align="right">{row.fat}</StyledTableCell>
                            <StyledTableCell align="right">{row.carbs}</StyledTableCell>
                            <StyledTableCell align="right">{row.protein}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

HolidaysTable.propTypes = {
    data: PropTypes.array.isRequired,
    countries: PropTypes.arrayOf(PropTypes.string).isRequired,
    countriesID: PropTypes.arrayOf(PropTypes.string),
    year: PropTypes.number.isRequired
}

HolidaysTable.defaultProps = {
    data: [],
    countries: [],
    countriesID: [],
    year: 1900
}

export default HolidaysTable