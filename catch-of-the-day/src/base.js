import Rebase from 're-base';

//create a connection to firebase
const base = Rebase.createClass({
  apiKey: 'AIzaSyByXpvqnxlgO7AKG2r1dunSniRdathq-9A',
  authDomain: 'catch-of-the-day-shaderpixel.firebaseapp.com',
  databaseURL: 'https://catch-of-the-day-shaderpixel.firebaseio.com',
});

export default base;
//anywhere you want to use the firebase connection just import base
