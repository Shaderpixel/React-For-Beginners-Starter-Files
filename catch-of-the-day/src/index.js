//* ~**************** //
//* Dependencies
//* ~**************** //
import React from "react";
import { render } from 'react-dom'; //grab only render method
import { BrowserRouter, Match, Miss } from 'react-router';

//* ~**************** //
//* Styles
//* ~**************** //
import './css/style.css';

//* ~**************** //
//* Components
//* ~**************** //
import App from './components/App';
import StorePicker from './components/StorePicker';
import NotFound from './components/NotFound';


//* ~**************** //
//* Routing
//* ~**************** //
// grab repo name from github.io url
const repo = `${window.location.pathname.split('/')[1]}`;


const Root = () => {
  return (
    <BrowserRouter basename= {repo}>
      <div>
        {/* Show storepicker component only on homepage*/}
        <Match exactly pattern="/" component={StorePicker} />
        <Match exactly pattern="/store/:storeID" component={App} />
        <Miss component={NotFound} />
      </div>
    </BrowserRouter>
  );
};

render(<Root/>, document.getElementById('main'));
