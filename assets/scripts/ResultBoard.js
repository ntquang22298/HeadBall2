cc.Class({
  extends: cc.Component,

  properties: {
    scoreA: cc.Label,
    scoreB: cc.Label

  },

  // LIFE-CYCLE CALLBACKS:
  onLoad() {
    this.updateScore(0,0);
  },

  updateScore(scoreA, scoreB) {
    this.scoreA.string = "" + scoreA;
    this.scoreB.string = "" + scoreB;
  }
});
