cc.Class({
  extends: cc.Component,

  properties: {
    scoreA: cc.Label,
    scoreB: cc.Label,
    result: cc.Label,
    confirmTxt: cc.Label

  },

  // LIFE-CYCLE CALLBACKS:
  onLoad() {
    this.updateScore(0,0);
  },

  updateScore(scoreA, scoreB) {
    this.scoreA.string = "" + scoreA;
    this.scoreB.string = "" + scoreB;
  },

  updateResult(result){
    switch(result){
      case 1: 
        this.result.string = "You win!";
        this.confirmTxt.string = "Confirm to claim 0.2 ETH"
        break;
      case 2: 
        this.result.string = "Draw!";
        this.confirmTxt.string = "Confirm to get 0.1 ETH"
        break;
      case 3: 
        this.result.string = "You lose!";
        break;

    }

  }
});
