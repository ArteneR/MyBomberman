var MainMenuState = function(game) {};

MainMenuState.prototype = {
    buttonStartGame: null,
    buttonOptions: null,
    buttonQuit: null,
    buttons: {},

    preload: function() {
            console.log("Loading MainMenuState...");
            var spriteMainMenuBackground = this.game.add.sprite(SCREEN_WIDTH/2, SCREEN_HEIGHT/2, "main_menu_background");
            spriteMainMenuBackground.anchor.setTo(0.5, 0.5);

            this.buttonStartGame = this.game.add.button(750, 930, "button_start_game", this.clickedStartGame, this);
            this.buttons['button_start_game'] = {
                    "normal" : "button_start_game",
                    "highlighted" : "button_start_game_highlight"
            };
            this.buttonStartGame.anchor.setTo(0.5, 0.0);
            this.buttonStartGame.events.onInputDown.add(this.downButton, this);
            this.buttonStartGame.events.onInputUp.add(this.upButton, this);


            this.buttonOptions = this.game.add.button(750, 1050, "button_options", this.clickedOptions, this);
            this.buttons['button_options'] = {
                    "normal" : "button_options",
                    "highlighted" : "button_options_highlight"
            };
            this.buttonOptions.anchor.setTo(0.5, 0.0);
            this.buttonOptions.events.onInputDown.add(this.downButton, this);
            this.buttonOptions.events.onInputUp.add(this.upButton, this);


            this.buttonQuit = this.game.add.button(750, 1170, "button_quit", this.clickedQuit, this);
            this.buttons['button_quit'] = {
                    "normal" : "button_quit",
                    "highlighted" : "button_quit_highlight"
            };
            this.buttonQuit.anchor.setTo(0.5, 0.0);
            this.buttonQuit.events.onInputDown.add(this.downButton, this);
            this.buttonQuit.events.onInputUp.add(this.upButton, this);

    },
    clickedStartGame: function() {
            console.log("clicked Start Game");
            this.game.state.start("InGameState");
    },
    clickedOptions: function() {
            console.log("clicked Options");
            this.game.state.start("OptionsState");
    },
    clickedQuit: function() {
            console.log("clicked Quit");
            this.game.state.start("QuitState");
    },
    downButton: function(event) {
            console.log("Down button " + event.key);
            var highlighted_texture = this.buttons[event.key].highlighted;
            event.loadTexture(highlighted_texture);
    },
    upButton: function(event) {
            console.log("Up button " + event.key);
            var keyWithout_highlight = event.key.substring(0, event.key.length-10)
            var normal_texture = this.buttons[keyWithout_highlight].normal;
            event.loadTexture(normal_texture);
    }


};
