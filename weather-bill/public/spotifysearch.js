/*
enables the API that is needed for playbacks of own choice through SpotifyWebApi

*/
var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: '4fe776fa7daa45788b81c6aab8b16d9b',
  clientSecret: 'cf74db6a033f4ce19912bf1b94fb35c3',
  redirectUri: 'https://weather-and-billboard.now.sh/'
});

spotifyApi.setAccessToken('BQDaEG4EmN40S5S2ubENuUpg2CWEgEH6Fh_hbNzSQgjHrcrCjTgJP89FNyHAqrqQBF6zuGP-zH2xne7K6hmmJrTGpnCcGof0eUG38yzBuADgW9LeVLmx99iykNND89yyti92K1SiZjXFfhlzRVAXP_mi06RrNm8');

// Do search using the access token
spotifyApi.searchTracks('artist:Eminem').then(
  function(data) {
    console.log(data.body);
  },
  function(err) {
    console.log('Something went wrong!', err);
  }
);
