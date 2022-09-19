import React from "react";
import { useState } from "react";
import axios from 'axios'
import WeatherCard from "./WeatherCard";

const Home = () => {
    const [cityNAme, setCityName] = useState("");
    const [data, setData] = useState([]);

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            let response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityNAme}&appid=0f663e6b5664314a835e99eca048aece&units=metric`)
            console.log(response, "response");
            setData(response.data.list)


        } catch (error) {
            console.log("error in api call:", error);
        }





    };

    return (
        <>
            <form onSubmit={submitHandler}>
                <h1 className="heading">WeaTher App </h1>
                <span><b>City Name : </b> </span>
                <input
                    type="text"
                    required
                    placeholder="Enter City name"
                    onChange={(e) => {
                        setCityName(e.target.value);
                    }}
                />

                <button type="submit">Get Weather</button>
            </form>

            <div className="box">

                {
                    data.map((eactForcast, index) => (
                        <WeatherCard
                            city={cityNAme}
                            key={index}
                            date={eactForcast.dt_txt}
                            temp={eactForcast.main.temp}
                            min={eactForcast.main.temp_min}
                            max={eactForcast.main.temp_max}

                        />
                    ))


                }




            </div>






        </>
    );
};

export default Home;