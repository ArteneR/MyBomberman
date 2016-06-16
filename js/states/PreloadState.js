var PreloadState = function(game) {};

PreloadState.prototype = {
    preload: function() {
        console.log("Loading PreloadState...");
        var spriteLoadingBar = this.add.sprite(SCREEN_WIDTH/2, SCREEN_HEIGHT/2, "loading_bar");
        spriteLoadingBar.anchor.setTo(0.5, 0.5);
        this.load.setPreloadSprite(spriteLoadingBar);

        this.game.load.image("main_menu_background", "assets/main-menu.png");
        this.game.load.image("button_start_game", "assets/button-start-game.png");
        this.game.load.image("button_start_game_highlight", "assets/button-start-game-highlight.png");
        this.game.load.image("button_options", "assets/button-options.png");
        this.game.load.image("button_options_highlight", "assets/button-options-highlight.png");
        this.game.load.image("button_quit", "assets/button-quit.png");
        this.game.load.image("button_quit_highlight", "assets/button-quit-highlight.png");
        this.game.load.image("button_back", "assets/button-back.png");
        this.game.load.image("button_back_highlight", "assets/button-back-highlight.png");
        this.game.load.image("in_game_background", "assets/in-game-background.png");
    },
    create: function() {
        // go to next state
        this.game.state.start("MainMenuState");
    }
};
