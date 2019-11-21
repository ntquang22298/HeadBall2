cc.Class({
    extends: cc.Component,

    onLoad () {
        cc.director.preloadScene("Home");
        this.node.on('touchend', function () {
            var websocketCtr = cc.find('Canvas/GameWorld').getComponent("WebsocketControl");
            if (websocketCtr) {
                websocketCtr.closeWS();
            }
            cc.director.resume();
            cc.director.loadScene('Home');
        })
    }
});
