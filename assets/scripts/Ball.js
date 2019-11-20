cc.Class({
  extends: cc.Component,

  properties: {
    jumpHeight: 0,
    jumpDuration: 0,
    maxMoveSpeed: 0,
    accel: 0
  },

  // LIFE-CYCLE CALLBACKS:
  setJumpAction: function() {
    var jumpUp = cc
      .moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight))
      .easing(cc.easeCubicActionOut());
    var jumpDown = cc
      .moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight))
      .easing(cc.easeCubicActionIn());
    return cc.repeatForever(cc.sequence(jumpUp, jumpDown));
  },
  onLoad: function() {
    rigidbody.applyForceToCenter (force);
    // initialize jump action
    // this.jumpAction = this.setJumpAction();
    // this.node.runAction(this.jumpAction);
  },

  start() {}

  // update (dt) {},
});
