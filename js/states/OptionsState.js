var OptionsState = function(game) {};


OptionsState.prototype = {
        buttonBack: null,
        buttons: {},

        preload: function() {
                console.log("Loading OptionsState...");
                // Load background

                this.buttonBack = this.game.add.button(0, 100, "button_back", this.clickedBack, this);
                this.buttons['button_back'] = {
                        "normal" : "button_back",
                        "highlighted" : "button_back_highlight"
                };
                this.buttonBack.anchor.setTo(0.0, 0.0);
                this.buttonBack.events.onInputDown.add(this.downButton, this);
                this.buttonBack.events.onInputUp.add(this.upButton, this);

        },
        clickedBack: function() {
                console.log("clicked Back");
                this.game.state.start("MainMenuState");
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
