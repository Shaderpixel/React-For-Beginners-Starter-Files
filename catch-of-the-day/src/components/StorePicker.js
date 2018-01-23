import React from 'react';
import { getFunName } from '../helpers'; //ES6 named import

class StorePicker extends React.Component {
  // one way to get the value of this into custom component methods
  // constructor() {
  //   super();
  //   this.goToStore = this.goToStore.bind(this);
  // }

  goToStore(e) {
    e.preventDefault(); // prevent form from reloading
    // first grab text from input box
    const storeID = this.storeInput.value;
    // second we're going to transition from / to /store/:storeid
    this.context.router.transitionTo(`/store/${storeID}`);
  }

  render() {
    return ( // return multiple lines of html
      <form className="store-selector" onSubmit={(event) => this.goToStore(event)}>
        {/* JSX comment syntax */}
        <h2>Please Enter A Store</h2>
        <input type="text" required placeholder="Store Name" defaultValue={getFunName()} ref={(input) => {this.storeInput = input;}}
          />
        <button type="submit">Visit Store →</button>
      </form>
    );
  }
}

// make router available to component through context
StorePicker.contextTypes = {
  router: React.PropTypes.object
};

export default StorePicker;
