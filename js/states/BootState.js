var BootState = function(game) {
    console.log("Starting the game...");
};


BootState.prototype = {
    preload: function() {
        this.game.load.image("loading_bar", "assets/loading-bar.png");
    },
    create: function() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;

        // go to next state
        this.game.state.start("PreloadState");
    }
}
