// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;



contract TicTacToe {
    
    //Address of two players
    address payable  player1;
    address payable  player2;
    
    //Board
    enum squareState{ empty, X, O}
    squareState[3][3] board;
    
    //counter
    uint8 no_of_moves;
    
    address payable  owner;
    
    mapping(address => uint) internal balances;
    
    bool isGameInProgress = false;
    
    
    function createChallenge(address _player1) external payable {
        require(_player1 != address(0),"Invalid Address");
        require(!isGameInProgress);
        owner = payable(msg.sender);
        player1 = payable(_player1);
        balances[_player1] = msg.value;
        isGameInProgress = true;
    }
    
    function acceptChanllenge(address _player2) external payable {
        require(_player2 != address(0),"Invalid Adress");
        require(_player2 != player1,"Adress should not be same");
        require(balances[player1] == msg.value,"Staked Amount is different");
        require(isGameInProgress);
        player2 = payable(_player2);
    }
    
    
    // To perform a move
    function move(uint8 _x, uint8 _y, address _player) external {
        require(owner == msg.sender);
        require(_player == player1 || _player == player2,"You are not allowed to perform move");
        if(isGameOver()) {
            transferFunds();
        } else {
        require(_player == checkCurrentPlayer(),"You are now allowd to perform move");
        require(isCorrectBounds(_x, _y),"Invalid Move");
        require(board[_x][_y] == squareState.empty,"Square is already occupied");
        board[_x][_y] = getCurrentPlayerShape();
        no_of_moves += 1;
        }
        if(isGameOver()) transferFunds();
        
    }
    
    // To check if the game is over
    function isGameOver() view public returns (bool) {
        return(getBoxState() != squareState.empty || no_of_moves > 8 );
    }
    
    // To check the current player my move counter
    function checkCurrentPlayer() view public  returns (address) {
        if(no_of_moves % 2 == 0){
            return player2;
        } else {
            return player1;
        }
        
    }
    
    function getCurrentPlayerShape() view internal returns (squareState) {
          if(no_of_moves % 2 == 0){
            return squareState.X;
        } else {
            return squareState.O;
        }
    }
    
    function transferFunds() internal {
        address payable  winner = getWinner();
        require(winner != address(0),"Match Drawn");
        isGameInProgress = false;
        if(winner == address(0)){
            selfdestruct(owner);
        } else {
            selfdestruct(winner);
        }
       
    }
    
    function getWinner() internal view returns (address payable) {
        squareState boxState = getBoxState();
        if(boxState ==  squareState.X) {
            return player2;
        } else if(boxState == squareState.O) {
            return player1;
        }
        return payable(address(0));
    }
    
    // To get the state of the box
    function getBoxState() internal view returns (squareState) {
        //for coloumn match
          for(uint8 i=0; i< 3; i++) {
            if(board[i][0] != squareState.empty && board[i][0] == board[i][1] && board[i][0] == board[i][2]) {
                return board[i][0];
            }
          }
        // for row match
         for(uint8 j=0; j< 3; j++) {
            if(board[0][j] != squareState.empty && board[0][j] == board[1][j] && board[0][j] == board[2][j]) {
                return board[0][j];
            }
        }
        
        //for diagonal match
         if(board[0][0] != squareState.empty && board[0][0] == board[1][1] && board[0][0] == board[2][2]) {
            return board[0][0];
         }
         
         if(board[2][0] != squareState.empty && board[2][0] == board[1][1] && board[2][0] == board[0][2]) {
            return board[2][0];
         }
         
         return squareState.empty;
        
    }
    
    // To check if the input params are in the bounds
    function isCorrectBounds(uint8 _x, uint8 _y) internal pure returns (bool) {
        return (_x >= 0 && _x < 3 && _y >= 0 && _y < 3);
    }

    function getNoOfMoves() external view returns (uint8) {
        return no_of_moves;
    }


    function getContractBalance() external view returns (uint) {
        return address(this).balance;
    }
    
}