import { BallData,KEY_BALL,KEY_CONNECTED } from './GameDefine';
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
    this.ballData = null;
    this.websocketCtr = null;
    this.originPosX = this.node.x;
    this.originPosY = this.node.y;
  },

  start() {
    this.ballData = new BallData();
    this.websocketCtr = cc.find('Canvas/GameWorld').getComponent("WebsocketControl");
  },

  getInfo(type) {
    this.ballData.x = this.node.x;
    this.ballData.y = this.node.y;
    this.ballData.angle = this.node.angle;
    if(this.websocketCtr != null) {
      this.ballData.playerId = this.websocketCtr.playerDataMe.id;
    }
    this.ballData.type = type;
    return JSON.stringify(this.ballData);
  },
  resetState() {
    this.node.x = this.originPosX;
    this.node.y = this.originPosY;
    this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
    this.getComponent(cc.RigidBody).linearDamping = 0;
    this.getComponent(cc.RigidBody).angularDamping = 0;
    this.getComponent(cc.RigidBody).angularVelocity =0;
  },

  update (dt) {
    if(this.websocketCtr != null) {
      this.websocketCtr.sendData(this.getInfo(KEY_BALL));
    }
  },
});
