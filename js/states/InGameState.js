var InGameState = function(game) {};


InGameState.prototype = {
        map_tiles: [],
        tile_codes: {},
        cursors: null,
        sprite_character: null,
        character_current_frame: 0,
        next_sprite_change_time: 0,
        current_direction: null,

        preload: function() {
                console.log("Loading InGameState...");
                var spriteInGameBackground = this.game.add.sprite(0, 0, "in_game_background");
                spriteInGameBackground.anchor.setTo(0.0, 0.0);

                keyPause = game.input.keyboard.addKey(Phaser.Keyboard.P);
                keyPause.onDown.add(this.pressedPause, this);

                this.game.load.image("grass_tile", "assets/grass.png");
                this.game.load.image("wall_tile", "assets/wall.png");
                this.game.load.spritesheet("character_spritesheet", "assets/character-spritesheet.png", 77, 100);

                this.tile_codes[GRASS_TILE] = "grass_tile";
                this.tile_codes[WALL_TILE] = "wall_tile";

                this.cursors = this.game.input.keyboard.createCursorKeys();

        },
        create: function() {
            this.loadData();
        },
        loadData: function() {
                var that = this;
                $.getJSON("levels/level1.json", function(json_data) {
                        that.loadLevel(json_data);
                }).done(function() {
                        that.loadCharacter();
                });
        },
        loadLevel: function(json_data) {
                var image_index = 0;
                for (var y = HEADER_HEIGHT; y < SCREEN_HEIGHT; y += TILE_HEIGHT) {
                        for (var x = 0; x < SCREEN_WIDTH; x += TILE_WIDTH) {
                                var tile_code = json_data.map[image_index];
                                var tile_type = this.tile_codes[tile_code];
                                var map_tile = this.game.add.sprite(x, y, tile_type);
                                this.map_tiles.push(map_tile);
                                image_index++;
                        }
                }
        },
        loadCharacter: function() {
                this.sprite_character = this.game.add.sprite(100, 450, "character_spritesheet");
                this.sprite_character.anchor.setTo(0.0, 0.0);
                this.sprite_character.frame = this.character_current_frame;
                this.sprite_character.z = 0;
                this.sprite_character.scale.setTo(CHARACTER_SCALE, CHARACTER_SCALE);
        },
        pressedPause: function() {
                console.log("pressed Pause");
                this.game.state.start("MainMenuState");
        },
        update: function() {
                var curr_time = new Date().getTime();

                if (this.sprite_character != null) {
                        if (curr_time > this.next_sprite_change_time) {
                                switch(this.current_direction) {
                                    case "LEFT":
                                            this.sprite_character.frame = 8;
                                            break;

                                    case "RIGHT":
                                            this.sprite_character.frame = 5;
                                            break;

                                    case "UP":
                                            this.sprite_character.frame = 13;
                                            break;

                                    case "DOWN":
                                            this.sprite_character.frame = 1;
                                            break;
                                }
                        }
                }

                // PLAYER moves LEFT
                if (this.cursors.left.isDown) {
                    this.sprite_character.x -= CHARACTER_SPEED;

                    if (curr_time > this.next_sprite_change_time) {
                                this.current_direction = "LEFT";

                                if (this.character_current_frame < 8 || this.character_current_frame > 11) {
                                        // start moving left
                                        this.character_current_frame = 8;
                                }
                                else {
                                        // continue moving left
                                        this.character_current_frame = 2*4 + ((this.character_current_frame + 1) % 4);
                                }
                                this.sprite_character.frame = this.character_current_frame;
                                this.next_sprite_change_time = new Date().getTime() + SPRITE_CHANGE_DELAY;
                                console.log("Next time: ");
                                console.log(this.next_sprite_change_time);
                        }
                }
                // PLAYER moves RIGHT
                else if (this.cursors.right.isDown) {
                    this.sprite_character.x += CHARACTER_SPEED;

                    if (curr_time > this.next_sprite_change_time) {
                                this.current_direction = "RIGHT";

                                if (this.character_current_frame < 4 || this.character_current_frame > 7) {
                                        // start moving right
                                        this.character_current_frame = 4;
                                }
                                else {
                                        // continue moving right
                                        this.character_current_frame = 1*4 + ((this.character_current_frame + 1) % 4);
                                }
                                this.sprite_character.frame = this.character_current_frame;
                                this.next_sprite_change_time = new Date().getTime() + SPRITE_CHANGE_DELAY;
                                console.log("Next time: ");
                                console.log(this.next_sprite_change_time);
                        }
                }
                // PLAYER moves UP
                else if (this.cursors.up.isDown) {
                    this.sprite_character.y -= CHARACTER_SPEED;

                    if (curr_time > this.next_sprite_change_time) {
                                this.current_direction = "UP";

                                if (this.character_current_frame < 12) {
                                        // start moving up
                                        this.character_current_frame = 12;
                                }
                                else {
                                        // continue moving up
                                        this.character_current_frame = 3*4 + ((this.character_current_frame + 1) % 4);
                                }
                                this.sprite_character.frame = this.character_current_frame;
                                this.next_sprite_change_time = new Date().getTime() + SPRITE_CHANGE_DELAY;
                                console.log("Next time: ");
                                console.log(this.next_sprite_change_time);
                        }
                }
                // PLAYER moves DOWN
                else if (this.cursors.down.isDown) {
                        this.sprite_character.y += CHARACTER_SPEED;

                        if (curr_time > this.next_sprite_change_time) {
                                this.current_direction = "DOWN";

                                if (this.character_current_frame > 3) {
                                        // start moving down
                                        this.character_current_frame = 0;
                                }
                                else {
                                        // continue moving down
                                        this.character_current_frame = 0*4 + ((this.character_current_frame + 1) % 4);
                                }
                                this.sprite_character.frame = this.character_current_frame;
                                this.next_sprite_change_time = new Date().getTime() + SPRITE_CHANGE_DELAY;
                                console.log("Next time: ");
                                console.log(this.next_sprite_change_time);
                        }
                }
        }



};
