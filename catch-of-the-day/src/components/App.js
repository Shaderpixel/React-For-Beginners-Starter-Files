import React from 'react';
import Header from './Header'; // we are already in components folder
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import base from '../base';

class App extends React.Component {
  constructor() {
    super();

    this.addFish = this.addFish.bind(this); // bind it to the component itself so that it can be referred to with this keyword
    this.updateFish = this.updateFish.bind(this);
    this.removeFish = this.removeFish.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    this.removeFromOrder = this.removeFromOrder.bind(this);

    // initial state
    this.state = {
      fishes: {},
      order: {},
    };
  }

  // runs before the app component is rendered
  componentWillMount() {
    // load fish state from firebase
    this.ref = base.syncState(`${this.props.params.storeID}/fishes`, {
      context: this,
      state: 'fishes',
    });

    // check if there is any order in localstorage
    const localStorageRef = localStorage.getItem(
      `order-${this.props.params.storeID}`,
    );

    // if there is a order localstorage
    if (localStorageRef) {
      // update our app component's order state
      this.setState({
        order: JSON.parse(localStorageRef),
      });
    }
  }

  // when app component is no longer used, turn off connection to firebase
  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(
      `order-${this.props.params.storeID}`,
      JSON.stringify(nextState.order),
    );
  }

  // to be used in AddFishForm.js
  addFish(fish) {
    // update our state by first takeing a copy of the state
    const fishes = { ...this.state.fishes };

    // add in our new fish
    const timestamp = Date.now();
    fishes[`fish-${timestamp}`] = fish;

    // set state
    // this.setState({ fishes: fishes });
    this.setState({ fishes });
  }

  // update fish when existing fish is edited through inventory component
  updateFish(key, updatedFish) {
    const fishes = { ...this.state.fishes };
    fishes[key] = updatedFish;
    this.setState({ fishes });
  }

  removeFish(key) {
    const fishes = { ...this.state.fishes };
    fishes[key] = null;
    this.setState({ fishes });
  }

  loadSamples() {
    this.setState({
      fishes: sampleFishes,
    });
  }

  addToOrder(key) {
    // take a copy of our state
    const order = { ...this.state.order };

    // update or add the new orders
    order[key] = order[key] + 1 || 1;

    // update our state with the new changes
    this.setState({ order });
  }

  removeFromOrder(key) {
    const order = { ...this.state.order };

    delete order[key];

    this.setState({ order });
  }

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(key => (
              <Fish
                key={key}
                index={key}
                details={this.state.fishes[key]}
                addToOrder={this.addToOrder}
              />
            ))}
          </ul>
        </div>
        <Order
          fishes={this.state.fishes}
          order={this.state.order}
          params={this.props.params}
          removeFromOrder={this.removeFromOrder}
        />
        <Inventory
          fishes={this.state.fishes}
          addFish={this.addFish}
          updateFish={this.updateFish}
          removeFish={this.removeFish}
          loadSamples={this.loadSamples}
          storeId={this.props.params.storeID}
        />
      </div>
    );
  }
}

App.propTypes = {
  params: React.PropTypes.object.isRequired,
};

export default App;
