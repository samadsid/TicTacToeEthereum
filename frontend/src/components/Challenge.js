import React, { Component } from 'react'
import { getStakedAmount } from "./Web3"


class Challenge extends Component {
    constructor(props) {
        super(props)

        this.state = {
            amount: null,
            code: null,
            stakedAmount: undefined
        }
    }

    amountHandler = (e) => {
        this.setState({
            amount: e.target.value
        })
    }

    codeHandler = (e) => {
        this.setState({
            code: e.target.value
        })
    }

    createChallenge = () => {
        const { amount } = this.state
        console.log(amount)
        if (amount != null) {
            this.props.createChallenge(amount)
        } else {
            alert("Amount should not be empty")
        }
    }

    acceptChallenge = () => {
        const { stakedAmount, code } = this.state
        if (stakedAmount != null) {
            this.props.acceptChallenge(stakedAmount, code)
        } else {
            alert("Amount should not be empty")
        }
    }

    getStakedAmount = async () => {
        const { code } = this.state
        let stakedAmount = await getStakedAmount(code)
        this.setState({
            stakedAmount : stakedAmount / 1000000000000000000
        })
    }


    render() {
        const { code } = this.props
        const { stakedAmount } = this.state
        return (
            <div>
                <h2>Create Challenge</h2>
                <label>Enter the amount you want to stake for this game</label>
                <input type="number" min="1" placeholder="Amount" onChange={(e) => this.amountHandler(e)} />
                <button onClick={this.createChallenge}>Create</button>
                {code ?
                    <p>Please share this code with player 2 <b> {code}</b></p>
                    : ''
                }
                <br /><br />
                <p>Don't Forget to change the ethereum address for player 2 to accept the challenge</p><br /><br />
                <h2>Accept Challenge</h2>
                <label>Enter the code to know the staked amount</label>
                <input type="number" placeholder="Code" onChange={(e) => this.codeHandler(e)} /><br />
                <button onClick={this.getStakedAmount}>Get Amount</button><br /><br />
                <input type="number" readOnly placeholder="Amount" value={stakedAmount} onChange={(e) => this.amountHandler(e)} /><br /><br />
                <button disabled={stakedAmount == null} onClick={this.acceptChallenge}>Accept</button>
            </div>
        )
    }
}

export default Challenge
