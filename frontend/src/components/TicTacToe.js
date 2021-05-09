import { Component } from "react";
import Box from './Box';
import Header from './Header';
import { getCurrentAddressMetamask, createChallenge, acceptChallenge, getCurrentPlayer, getNoOfMoves, move, GameOver } from './Web3'
import Challenge from './Challenge'
import uniqueRandom from 'unique-random';

class TicTacToe extends Component {

    constructor(props) {
        super(props)
        this.state = {
            square: Array(9).fill(null),
            web3: null,
            account: '',
            isGameStarted: false,
            randomNumber: null,
            player: '',
            currentMove: 0,
            isGameOver: false,
            matchDraw:false
        }
    }




    async componentDidMount() {
        let account = await getCurrentAddressMetamask()
        this.setState({
            account
        }, async () => {

            window.ethereum.on('accountsChanged', (accounts) => {
                this.setState({
                    account: accounts[0]
                }, async () => {
                })
            })
        })
    }

    handleClick = async (i) => {
        let { square, currentMove, randomNumber } = this.state
        let result
        switch (i) {
            case 0: result = await move(0, 0, randomNumber)
                break;
            case 1: result = await move(1, 0, randomNumber)
                break;
            case 2: result = await move(2, 0, randomNumber)
                break;
            case 3: result = await move(0, 1, randomNumber)
                break;
            case 4: result = await move(1, 1, randomNumber)
                break;
            case 5: result = await move(2, 1, randomNumber)
                break;
            case 6: result = await move(0, 2, randomNumber)
                break;
            case 7: result = await move(1, 2, randomNumber)
                break;
            case 8: result = await move(2, 2, randomNumber)
                break;
        }

        console.log("result",result)
        if (result) {
            if (currentMove % 2 == 0) {
                square[i] = 'X'
            } else {
                square[i] = 'O'
            }
            this.setState({
                square: square
            }, async () => {
                let isGameOverStatus = await GameOver(randomNumber)
                console.log("isGameOverStatus",isGameOverStatus)
                if (isGameOverStatus) {
                    console.log("comimg")
                    this.setState({
                        isGameOver : true
                    })
                } else {
                    let currentPlayerAddress = await getCurrentPlayer(randomNumber)
                    let currentMove = await getNoOfMoves(randomNumber);
                    this.setState({
                        player: currentPlayerAddress,
                        currentMove
                    }, async () => {
                    })
                }
            })
        } else {
           this.setState({
               matchDraw: true
           })
        }
    }


    renderSquare(i) {
        return <Box value={this.state.square[i]} onClick={() => this.handleClick(i)} />;
    }



    createChallenge = async (amount) => {
        const random = uniqueRandom(1, 10000);
        let code = random()
        let success = await createChallenge(code, parseInt(amount))
        if (success) {
            this.setState({
                randomNumber: code
            })
        }
    }

    acceptChallenge = async (amount, code) => {
        try {
            let success = await acceptChallenge(code, parseInt(amount))
            if (success) {
                this.setState({
                    isGameStarted: true
                }, async () => {
                    let currentPlayerAddress = await getCurrentPlayer(code)
                    let currentMove = await getNoOfMoves(code);
                    this.setState({
                        player: currentPlayerAddress,
                        currentMove
                    })
                })
            }
        } catch (error) {
            alert("Please Select different account to accept the challenge")
        }

    }

    render() {
        const { account, isGameStarted, randomNumber, player, isGameOver, matchDraw } = this.state
        return (
            <>
                <Header address={account} /><br /><br />
                <div hidden={isGameStarted}>
                    <Challenge code={randomNumber} acceptChallenge={(amount, code) => this.acceptChallenge(amount, code)} createChallenge={(amount) => this.createChallenge(amount)} /><br /><br />
                </div>
                <div hidden={!isGameStarted || isGameOver}>
                    <p>Player {player}'s' Turn</p>
                    <div className="board-row">
                        {this.renderSquare(0)}
                        {this.renderSquare(1)}
                        {this.renderSquare(2)}
                    </div>
                    <div className="board-row">
                        {this.renderSquare(3)}
                        {this.renderSquare(4)}
                        {this.renderSquare(5)}
                    </div>
                    <div className="board-row">
                        {this.renderSquare(6)}
                        {this.renderSquare(7)}
                        {this.renderSquare(8)}
                    </div>
                </div>
                <h4 hidden={!isGameOver}>Player {player} won</h4>
                <h4 hidden={!matchDraw}>Match Drawn</h4>
            </>
        )
    }
}

export default TicTacToe;