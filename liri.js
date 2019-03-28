require("dotenv").config();

const keys = require("./keys.js");
const axios = require("axios");
const moment = require("moment");
const Spotify = require("node-spotify-api");
const fs = require("fs");
const spotify = new Spotify(keys.spotify);

let programToRun = process.argv[2];
let action = process.argv[3];

if (programToRun === "concert-this") {
  concertThis(action);
} else if (programToRun === "spotify-this-song") {
  spotifySong(action);
} else if (programToRun === "movie-this") {
  movieThis(action);
} else if (programToRun === "do-what-it-says") {
  doWhatItSays();
} else {
  console.log("You didn't put in the correct program");
}

function concertThis(artist = "Ariana Grande") {
  axios
    .get(
      `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`
    )
    .then(function(response) {
      for (i = 0; i < response.data.length; i++) {
        console.log(response.data[i].venue.city);
        console.log(response.data[i].venue.name);
        console.log(moment(response.data[i].datetime).format("MM/DD/YYYY"));
        console.log("==============");
      }
    })
    .catch(function(err) {
      console.log("Error occurred: " + err);
    });
}

function spotifySong(song = "Break Up With Your Girlfriend, I'm Bored") {
  spotify.search({ type: "track", query: song }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    console.log(data.tracks.items[0].artists[0].name);
    console.log(data.tracks.items[0].name);
    console.log(data.tracks.items[0].external_urls.spotify);
    console.log(data.tracks.items[0].album.name);
    console.log("==============");
  });
}

function movieThis(movie = "Mean Girls") {
  axios
    .get(`http://www.omdbapi.com/?apikey=c065d082&t=${movie}`)
    //axios.get(query)
    .then(function(response) {
      console.log(response.data.Title);
      console.log(response.data.Year);
      console.log(response.data.Rated);
      console.log(response.data.Ratings[1].Value);
      console.log(response.data.Country);
      console.log(response.data.Plot);
      console.log(response.data.Actors);
      console.log("==============");
    })
    .catch(function(err) {
      console.log("Error occurred: " + err);
    });
}

function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }

    let dataArray = data.split(",");
    console.log(dataArray);
    if (dataArray[0] === "spotify-this-song") {
      let song = dataArray[1];
      spotifySong(song);
    }
    if (dataArray[2] === "movie-this") {
      let movie = dataArray[3];
      movieThis(movie);
    }
    if (dataArray[4] === "concert-this") {
      let concert = dataArray[5];
      concertThis(concert);
    }
  });
}

// bonus
// * In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.
// * Make sure you append each command you run to the `log.txt` file.
// * Do not overwrite your file each time you run a command.
