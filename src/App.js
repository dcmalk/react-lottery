import React, { Component } from 'react';
import web3 from './web3';
import lottery from './lottery';
import './App.css';

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: '',
    lastWinner: '',
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call(); // use default MetaMask account
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const lastWinner = await lottery.methods.lastWinner().call();

    this.setState({ manager, players, balance, lastWinner });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether'),
    });

    this.setState({ message: "You're now entered!" });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: 'Picking a winner...' });

    await lottery.methods.pickWinner().send({ from: accounts[0] });
    const winner = await lottery.methods.lastWinner().call();

    this.setState({ message: 'Winner chosen! ' + winner + ' has won the lottery!' });
  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}
          <br />
          There are currently {this.state.players.length} players competing to win{' '}
          {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>
        <br />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter: </label>
            <input
              type="number"
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>
        <hr />
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
export default App;
