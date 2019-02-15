import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../base';

class Inventory extends React.Component {
  constructor() {
    super();
    this.renderInventory = this.renderInventory.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.logout = this.logout.bind(this);

    this.state = {
      uid: null,
      owner: null,
    };
  }

  componentDidMount() {
    base.onAuth(user => {
      if (user) {
        this.authHandler(null, { user });
      }
    });
  }

  handleChange(e, key) {
    // take a copy of just that one fish and update it with the new data
    const fish = this.props.fishes[key];

    const updatedFish = {
      ...fish,
      [e.target.name]: e.target.value,
    };
    this.props.updateFish(key, updatedFish);
  }

  authenticate(provider) {
    console.log(`Trying to log in with ${provider}`);
    base.authWithOAuthPopup(provider, this.authHandler);
  }

  logout() {
    base.unauth(); // log out of providers
    this.setState({
      uid: null, // delete the uid of logged in person in state
    });
  }

  authHandler(err, authData) {
    console.log(authData);

    if (err) {
      console.error(err);
      return;
    }

    // grab the store info
    const storeRef = base.database().ref(this.props.storeId);

    // query the firebase once for the store data
    storeRef.once('value', snapshot => {
      // to get the data out of snapshot we use val() method
      const data = snapshot.val() || {};

      // claim it as our own if there is no owner already
      if (!data.owner) {
        storeRef.set({
          owner: authData.user.uid,
        });
      }

      // set the state locally in React
      this.setState({
        uid: authData.user.uid,
        owner: data.owner || authData.user.uid,
      });
    });
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="github" onClick={() => this.authenticate('github')}>
          Log In with Github
        </button>
        <button
          className="facebook"
          onClick={() => this.authenticate('facebook')}
        >
          Log In with Facebook
        </button>
        <button
          className="twitter"
          onClick={() => this.authenticate('twitter')}
        >
          Log In with Twitter
        </button>
      </nav>
    );
  }

  renderInventory(key) {
    const fish = this.props.fishes[key];
    return (
      <div className="fish-edit" key={key}>
        <input
          type="text"
          name="name"
          placeholder="Fish Name"
          defaultValue={fish.name}
          onChange={e => this.handleChange(e, key)}
        />
        <input
          type="text"
          name="price"
          placeholder="Fish Price"
          value={fish.price}
          onChange={e => this.handleChange(e, key)}
        />

        <select
          type="text"
          name="status"
          placeholder="Fish Status"
          value={fish.status}
          onChange={e => this.handleChange(e, key)}
        >
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>

        <textarea
          type="text"
          name="desc"
          placeholder="Fish Desc"
          value={fish.desc}
          onChange={e => this.handleChange(e, key)}
        />
        <input
          type="text"
          name="image"
          placeholder="Fish Image"
          value={fish.image}
          onChange={e => this.handleChange(e, key)}
        />
        {/* <button onClick={this.props.removeFish.bind(null, key)}>Remove Fish</button> or */}
        <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
      </div>
    );
  }

  render() {
    const logout = <button onClick={this.logout}>Log Out!</button>;

    // check if they are  notlogged in at all
    if (!this.state.uid) {
      return <div>{this.renderLogin()}</div>;
    }

    // check if they are the owner of the current store
    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry you aren't the owner of this store!!</p>
          {logout}
        </div>
      );
    }

    return (
      <div>
        <h2>Inventory</h2>
        {logout}
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm addFish={this.props.addFish} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    );
  }
}

Inventory.propTypes = {
  fishes: React.PropTypes.object.isRequired,
  addFish: React.PropTypes.func.isRequired,
  updateFish: React.PropTypes.func.isRequired,
  removeFish: React.PropTypes.func.isRequired,
  loadSamples: React.PropTypes.func.isRequired,
  storeId: React.PropTypes.string.isRequired,
};

export default Inventory;
