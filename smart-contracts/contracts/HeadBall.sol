pragma solidity ^0.5.0;

contract HeadBall {
    mapping (address => bool) public isPlaying;

    uint public betValue = 10 finney;
    address public owner;

    constructor () public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, 'only contract owner can peform this');
        _;
    }

    function play()
        external
        payable
    {
        require(msg.value >= betValue, "must bet 1 value");
        if (msg.value > betValue) msg.sender.transfer(msg.value - betValue);
        isPlaying[msg.sender] = true;
    }

    function endGame(uint result) // 0 draw 1 win 2 lose
        external
    {
        require(isPlaying[msg.sender], "player must be in game");
        if (result == 0) {
            require(address(this).balance >= betValue, "insufficient balance");
            msg.sender.transfer(betValue);
        } else if (result == 1) {
            require(address(this).balance >= 2*betValue, "insufficient balance");
            msg.sender.transfer(2 * betValue);
        }
        isPlaying[msg.sender] = false;
    }

    function withdrawal(uint amount)
        public
        onlyOwner
    {
        require(amount < address(this).balance, 'amount must be less than contract balance');
        selfdestruct(msg.sender);
    }

    function destroy()
        public
        onlyOwner
    {
        selfdestruct(msg.sender);
    }

    function () external payable {}
}
