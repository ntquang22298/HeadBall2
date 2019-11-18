cc.Class({
    extends: cc.Component,

    properties: {
        accel: 0,
        maxMoveSpeed: 0,
        shoe: {
            default: null,
            type: cc.Node
        },
        btn_left:{
            default:null,
            type:cc.Node
        },
        btn_right:{
            default:null,
            type:cc.Node
        },
        btn_up:{
            default:null,
            type:cc.Node
        },
        btn_kick:{
            default:null,
            type:cc.Node
        }
       
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.accLeft = false;
        this.accRight = false;
        this.accUp = false;
        this.accKick = false;

        this.btn_left.on(cc.Node.EventType.TOUCH_START, function() {
            this.node.x -= 2;
        }, this);
        this.btn_right.on(cc.Node.EventType.TOUCH_START, function () {
            this.node.x += 2;
        },this);
        this.btn_up.on(cc.Node.EventType.TOUCH_START, function () {
            this.setJumpAction();
        },this);
        this.btn_kick.on(cc.Node.EventType.TOUCH_START, function () {
            this.actionKick();
        },this);
        
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onKeyDown (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                this.actionShoeRunLeft()
                this.accLeft = true;
                break;
            case cc.macro.KEY.right:
                this.actionShoeRunRight();
                this.accRight = true;
                break;
            case cc.macro.KEY.up:
                this.accUp = true;
                break;
            case cc.macro.KEY.d:
                this.accKick = true;
                break;
        }

        
    },

    onKeyUp (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                this.actionStand();
                this.accLeft = false;
                break;
            case cc.macro.KEY.right:
                this.actionStand();
                this.accRight = false;
                break;
            case cc.macro.KEY.up:
                this.accUp = false;
                break;
            case cc.macro.KEY.d:
                this.accKick = false;
                break;
        }
    },

    actionShoeRunRight(){
        if (this.shoe.angle === 42) {
            this.shoe.runAction(cc.rotateBy(0.19, 20));
        }
    },
    actionShoeRunLeft(){
        if (this.shoe.angle === 22) {
            this.shoe.runAction(cc.rotateBy(0.19, -30));
        }
        if (this.shoe.angle === 42) {
            this.shoe.runAction(cc.rotateBy(0.19, -10));
        }
    },
    actionStand(){
        if (this.shoe.angle === 22) {
            this.shoe.runAction(cc.rotateBy(0.19, -20));
        }
        if (this.shoe.angle === 52) {
            this.shoe.runAction(cc.rotateBy(0.19, 10));
        }
    },
    actionKick() {
        cc.tween( this.shoe)
        .to(0.05, { angle: -30 })
        .to(0.05, { angle: 30 })
        .start()
    },

    setJumpAction: function() {
        var jumpUp = cc.moveBy(0.19, cc.v2(0, 20)).easing(cc.easeCubicActionOut());
        var jumpDown = cc.moveBy(0.19, cc.v2(0, -20)).easing(cc.easeCubicActionIn());
        return this.node.runAction(cc.sequence(jumpUp, jumpDown));
    },


    
    update: function (dt) {
        
        if (this.accLeft) {
            this.node.x -= 2;
        } else if (this.accRight) {
            this.node.x += 2;
        } else if (this.accUp){
            this.setJumpAction();
        } else if (this.accKick) {
            this.actionKick();
        }
    },
});
