import React, { useState , useEffect } from "react";
import axios from "./axios";
import './Row.css';
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url="https://image.tmdb.org/t/p/original/";

function Row(props){
    const [movies, setMovies]=useState([]);
      const [trailerUrl, setTrailerUrl]= useState("");


    useEffect(() =>{
        //if [], run once 
        async function fetchData(){
            const request = await axios.get(props.fetchURL);
            setMovies(request.data.results);
            console.table(request.data.results);
            return request;

        }
        fetchData();
    }, [props.fetchURL]);

    const opts = {
        height: '390',
        width: '640',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
        },
      };

    const handleClick =(movie) => {
        if(trailerUrl){
            setTrailerUrl("");
        }else {
            movieTrailer(null ,{ tmdbId: movie.id })
            .then((url)=>{
              console.log("url is "+url);
              const urlParams=new URLSearchParams(new URL(url).search);
              console.log("urlParamsn"+urlParams);
              setTrailerUrl(urlParams.get("v"));
            })
            .catch((error)=> console.log(error));
}

    };


    return (
        <div className="row">
        <h2>{props.title}</h2>

        <div className="row_posters">
            {movies.map((movie) => (
                <img 
                key={movie.id}
                onClick={ () => handleClick(movie)}
                className={`row_poster ${props.isLargeRow && "row_posterlarge"}`}
                src={`${base_url}${props.isLargeRow ?movie.poster_path : movie.backdrop_path}`} alt={movie.name} />
            ))}
        </div>
        {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
        

        </div>
    );
}

export default Row;