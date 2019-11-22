import { PlayerData, KEY_INGAME } from "./GameDefine";
cc.Class({
  extends: cc.Component,

  properties: {
    accel: 0,
    maxMoveSpeed: 0,
    jumpHigh: 0,
    speed: 0
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.accLeft = false;
    this.accRight = false;

    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

    this.originPosX = this.node.x;
    this.originPosY = this.node.y;
  },

  start() {
    cc.log("PlayerControl start");
    this.playerData = new PlayerData();
    this.playerData.x = this.node.x;
    this.websocketCtr = cc
      .find("Canvas/GameWorld")
      .getComponent("WebsocketControl");
  },

  onKeyDown(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.a:
        // var animState = this.node.getComponent(cc.Animation).getAnimationState('moveFoward');
        // if (!animState.isPlaying)
        this.node.getComponent(cc.Animation).playAdditive("moveFoward");
        this.accLeft = true;
        break;
      case cc.macro.KEY.d:
        // var animState = this.node.getComponent(cc.Animation).getAnimationState('moveBack');
        // if (!animState.isPlaying)
        this.node.getComponent(cc.Animation).playAdditive("moveBack");
        this.accRight = true;
        break;
      case cc.macro.KEY.w:
        var animState = this.node
          .getComponent(cc.Animation)
          .getAnimationState("jump");
        if (!animState.isPlaying)
          this.node.getComponent(cc.Animation).playAdditive("jump");
        break;
      case cc.macro.KEY.space:
        var animState = this.node
          .getComponent(cc.Animation)
          .getAnimationState("kick");
        if (!animState.isPlaying)
          this.node.getComponent(cc.Animation).playAdditive("kick");
        break;
    }
  },

  onKeyUp(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.a:
        this.accLeft = false;
        // this.node.getComponent(cc.Animation).playAdditive('idle');
        break;
      case cc.macro.KEY.d:
        this.accRight = false;
        // this.node.getComponent(cc.Animation).playAdditive('idle');
        break;
      case cc.macro.KEY.w:
        var animState = this.node
          .getComponent(cc.Animation)
          .getAnimationState("jump");
        if (!animState.isPlaying)
          // this.node.getComponent(cc.Animation).playAdditive('idle');
          break;
      case cc.macro.KEY.space:
        var animState = this.node
          .getComponent(cc.Animation)
          .getAnimationState("kick");
        if (!animState.isPlaying)
          // this.node.getComponent(cc.Animation).playAdditive('idle');
          break;
    }
  },

  actionKick() {
    this.node.runAction(
      cc.sequence(cc.rotateBy(0.19, 30), cc.rotateBy(0.19, -30))
    );
  },

  setJumpAction: function() {
    var jumpUp = cc
      .moveBy(0.19, cc.v2(0, this.jumpHigh))
      .easing(cc.easeCubicActionOut());
    var jumpDown = cc
      .moveBy(0.19, cc.v2(0, -this.jumpHigh))
      .easing(cc.easeCubicActionIn());
    return this.node.runAction(cc.sequence(jumpUp, jumpDown));
  },

  getInfo(type) {
    this.playerData.x = this.node.x;
    this.playerData.y = this.node.y;
    if (this.websocketCtr != null) {
      this.playerData.id = this.websocketCtr.playerDataMe.id;
    }

    this.playerData.type = type;
    return JSON.stringify(this.playerData);
  },
  resetState() {
    this.node.x = this.originPosX;
    this.node.y = this.originPosY;
    this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
    this.getComponent(cc.RigidBody).linearDamping = 0;
    this.getComponent(cc.RigidBody).angularDamping = 0;
    this.getComponent(cc.RigidBody).angularVelocity = 0;
  },

  update: function(dt) {
    if (this.accLeft) {
      this.node.x -= 10;
    } else if (this.accRight) {
      this.node.x += 10;
    }
    if (this.websocketCtr != null) {
      this.websocketCtr.sendData(this.getInfo(KEY_INGAME));
    }
  }
});
