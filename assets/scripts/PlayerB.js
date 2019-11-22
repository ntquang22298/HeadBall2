cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    this.originPosX = this.node.x;
    this.originPosY = this.node.y;
  },

  resetState() {
    this.node.x = this.originPosX;
    this.node.y = this.originPosY;
    this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
    this.getComponent(cc.RigidBody).linearDamping = 0;
    this.getComponent(cc.RigidBody).angularDamping = 0;
    this.getComponent(cc.RigidBody).angularVelocity = 0;
  }
});
