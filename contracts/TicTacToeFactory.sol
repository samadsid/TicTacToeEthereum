
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./CloneFactory.sol";
import "./TicTacToe.sol";

contract TicTacToeFactory is CloneFactory  {
    
    address payable owner;
    
    mapping(uint => address) private contractMapping;

    uint[] public codes;

    
    constructor() {
        owner = payable(msg.sender);
    }
    
    
    function createChallenge(address _ticTacToeContractAddress, uint _code) external payable  {
        require(msg.value > 0);
        address ticTacToeContractAddress = createClone(_ticTacToeContractAddress);
        TicTacToe(ticTacToeContractAddress).createChallenge{value: msg.value}(msg.sender);
        contractMapping[_code] = ticTacToeContractAddress;
        codes.push(_code);
    }
    
    function acceptChallenge(uint _code) external payable {
        require(msg.value > 0);
        address  ticTacToeContractAddress = contractMapping[_code];
        TicTacToe(ticTacToeContractAddress).acceptChanllenge{value: msg.value}(msg.sender);
    }
    
    // function transferFunds(uint _code) external {
    //     require(msg.sender == owner);
    //     address  ticTacToeContractAddress = contractMapping[_code];
    //     TicTacToe(ticTacToeContractAddress).transferFunds();
    // }
    
    function move(uint8 _x, uint8 _y, uint _code) external {
        address  ticTacToeContractAddress = contractMapping[_code];
        TicTacToe(ticTacToeContractAddress).move(_x, _y, msg.sender);
    }
    
    function isGameOver(uint _code) external view returns (bool) {
        address  ticTacToeContractAddress = contractMapping[_code];
        return TicTacToe(ticTacToeContractAddress).isGameOver();
    }
    
    function getBalance() view external returns (uint) {
        return address(this).balance;
    }
    
    function recoverFunds() external {
        require(msg.sender == owner);
        require(address(this).balance > 0 ether);
        owner.transfer(address(this).balance);
    }

    function getCurrentPlayer(uint _code) external view returns (address) {
        address  ticTacToeContractAddress = contractMapping[_code];
        return TicTacToe(ticTacToeContractAddress).checkCurrentPlayer();
    }

    function getNoOfMoves(uint _code) external view returns (uint8) {
        address  ticTacToeContractAddress = contractMapping[_code];
        return TicTacToe(ticTacToeContractAddress).getNoOfMoves();
    }

     function getStakedAmount(uint _code) external view returns (uint) {
        address  ticTacToeContractAddress = contractMapping[_code];
        return TicTacToe(ticTacToeContractAddress).getContractBalance();
    }

  
    
    
    receive() external payable {}
    
    
}