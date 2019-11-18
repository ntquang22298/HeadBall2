cc.Class({
    extends: cc.Component,
    onLoad () {
        cc.director.preloadScene("PlayGame");

        this.node.on('touchend', function () {
            cc.director.loadScene('PlayGame');
        })
    }
});
