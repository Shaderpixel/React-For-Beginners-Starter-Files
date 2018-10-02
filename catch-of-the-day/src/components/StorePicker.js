import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { getFunName } from '../helpers';

class StorePicker extends React.Component {
  static propTypes = {
    history: PropTypes.object,
  };

  myInput = React.createRef(); // for use with the ref attribute on the input

  goToStore = e => {
    // use class property  instead of using a function to bind context of this
    // 1. Stop the form from submitting
    e.preventDefault();
    // 2. Get the text from that input through the ref
    const storeName = this.myInput.current.value;
    // 3. Change the page to /store/whatever-they-entered, we want to activate push state to push the url somewhere else
    this.props.history.push(`/store/${storeName}`);
  };

  render() {
    return (
      <Fragment>
        {/*React.Fragment coming v16.2 alternative to wrapping a dummy div, optional in this case*/}
        <form className="store-selector" onSubmit={this.goToStore}>
          <h2>Please Enter a Store</h2>
          <input
            type="text"
            ref={this.myInput /* =React.createRef()*/}
            required
            aria-required
            placeholder="Store Name"
            defaultValue={getFunName()}
          />
          <button type="submit">Visit Store →</button>
        </form>
      </Fragment>
    );
  }
}

export default StorePicker;
