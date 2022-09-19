import React from 'react'
import moment from 'moment'

const WeatherCard = ({ city, date, temp, min, max }) => {
    return (
        <>

            <div className='card' >
                <h1>{city}</h1>
                <h1>{moment(date).format("dddd ha")}</h1>
                <h1>{temp}°C</h1>
                <p><b>Min</b> {min}°C - <b>Max</b> {max}°C</p>
            </div>

        </>
    )
}

export default WeatherCard