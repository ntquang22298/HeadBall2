cc.Class({
    extends: cc.Component,

    properties: {
        accel: 0,
        maxMoveSpeed: 0,
        jumpHigh: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.accLeft = false;
        this.accRight = false;
        this.accUp = false;
        this.accKick = false;

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onKeyDown (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                this.actionnodeRunLeft()
                this.accLeft = true;
                break;
            case cc.macro.KEY.right:
                this.actionnodeRunRight();
                this.accRight = true;
                break;
            case cc.macro.KEY.up:
                this.setJumpAction();
                break;
            case cc.macro.KEY.shift:
                this.accKick();
                break;
        }

        
    },

    onKeyUp (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                // this.actionStand();
                this.accLeft = false;
                break;
            case cc.macro.KEY.right:
                // this.actionStand();
                this.accRight = false;
                break;
            case cc.macro.KEY.up:
                this.accUp = false;
                break;
            case cc.macro.KEY.shift:
                this.accKick = false;
                // this.actionStand();
                break;
        }
    },

    actionnodeRunRight(){
        if (this.node.angle === 0) {
            this.node.runAction(cc.rotateBy(0.19, 20));
        }
    },
    actionnodeRunLeft(){
        if (this.node.angle === -20) {
            this.node.runAction(cc.rotateBy(0.19, -20));
        }
        if (this.node.angle === 0) {
            this.node.runAction(cc.rotateBy(0.19, -10));
        }
    },
    // actionStand(){
    //     if (this.node.angle === -20) {
    //         this.node.runAction(cc.rotateBy(0.19, -20));
    //     }
    //     if (this.node.angle === 10) {
    //         this.node.runAction(cc.rotateBy(0.19, 10));
    //     }
    //     if (this.node.angle === 30) {
    //         this.node.runAction(cc.rotateBy(0.19, 30));
    //     }
    // },
    actionKick() {
        cc.tween( this.node)
        .to(0.05, { angle: -30 })
        .to(0.05, { angle: 30 })
        .to(0.05, { angle: -20 })
        .start()
    },

    setJumpAction: function() {
        var jumpUp = cc.moveBy(0.19, cc.v2(0, this.jumpHigh)).easing(cc.easeCubicActionOut());
        var jumpDown = cc.moveBy(0.19, cc.v2(0, -this.jumpHigh)).easing(cc.easeCubicActionIn());
        return this.node.runAction(cc.sequence(jumpUp, jumpDown));
    },


    
    update: function (dt) {
        
        if (this.accLeft) {
            this.node.x -= 5;
        } else if (this.accRight) {
            this.node.x += 5;
        }
    },
});
