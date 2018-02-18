const liriApp = {

	// saves record arguments in log.txt
	logInputs: function(arg1, arg2) {

		let query;
		query = (arg2 ? arg2 : "no query");

		const fs = require('fs');
		  fs.appendFile("log", (arg1 + ", " + query + "; "), function(error) {
			if(error) throw error;
		});

	},

	// collects 20 tweets from my test account
	pullTweets: function(client) {

		// utilizes twitter node package to make request to twitter's api
		client.get('statuses/user_timeline', {screen_name: 
            'LiriTest0', count: '20'}, function(error, tweets, response) {
			if(error) throw JSON.stringify(error);
			tweets.forEach(function(obj) {
				console.log("Created at " + obj.created_at + ": " + obj.text)
			});
		});

	},

	// collects data from spotify
	songData: function(query, client) {

		// utilizes node-apotify-api node package to make call to spotify's api 
		client.search({
			type: 'track',
			query: query,
			limit: 1
		}, function(error, data) {
			if(error) throw JSON.stringify(error);
			console.log("Artist: " + data.tracks.items[0].artists[0].name);
			console.log("Song title: " + data.tracks.items[0].name);
			console.log("Preview link: " + data.tracks.items[0].preview_url);
			console.log("Album title: " + data.tracks.items[0].album.name);
		});

	},

	// collects data from OMDB
	movieInfo: function(query) {

		// uses node request package to submit a query
		const request = require('request'),
			name = query.split(' ').join('+');
		request('http://www.omdbapi.com/?apikey=trilogy&t=' + name, function(error, response, body) {
			const results = JSON.parse(body);
			console.log("Title: " + results.Title);
            console.log("Year: " + results.Year); 
            console.log("IMDB: " + results.Ratings[0].Value); 
            console.log("Rotten Tomatoes: " + results.Ratings[1].Value);
            console.log("Country of origin: " + results.Country);
            console.log("Language: " + results.Language); 
            console.log("Plot: " + results.Plot); 
            console.log("Actors: " + results.Actors); 
		});

	},

	// reads random.txt and followers command and search query
	randomText: function() {

		const that = this;

		// utilizes node fs package to pull from random.txt
		const fs = require('fs');
		fs.readFile('random.txt', 'utf8', function(error, data) {
			if(error) throw error;
			const dataArr = data.split(',');
			that.processCmd(dataArr[0], dataArr[1]);
		});

	},

	// awaits arguments as inputs and determines which function to execute
	processCmd: function(cmd, name) {

		const	Twitter = require('twitter'),
					Spotify = require('node-spotify-api'),
					keys = require('./keys.js');

		switch(cmd) {
			case "my-tweets":
				this.pullTweets(new Twitter(keys.twitter));
				break;
			case "spotify-this-song":
				if(!name) {
					this.songData('"The Sign"', new Spotify(keys.spotify));
				} else {
					this.songData(name, new Spotify(keys.spotify));
				}
				break;
			case "movie-this":
				if(!name) {
					this.movieInfo('Mr. Nobody');
				} else {
					this.movieInfo(name);
				}
				break;
			case "do-what-it-says":
				this.randomText();
				break;
			default:
				console.log("command unrecognized");
		}

	},

	// protects and initializes dotenv package configuration
	init: function() {

		require('dotenv').config();

		const arg1 = process.argv[2],
					arg2 = process.argv[3]; 

		this.logInputs(arg1, arg2);
		this.processCmd(arg1, arg2);

	}

};

liriApp.init();