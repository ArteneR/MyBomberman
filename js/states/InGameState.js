var InGameState = function(game) {};


InGameState.prototype = {
        map_tiles: [],
        breakable_walls: [],
        map_tile_sprites: [],
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
                this.game.load.image("breakable_tile", "assets/brick-wall-1.png");
//                this.game.load.spritesheet("character_spritesheet", "assets/character-spritesheet.png", 77, 100);
//                this.game.load.spritesheet("character_spritesheet", "assets/character-spritesheet-test.png", 77, 100);
                this.game.load.spritesheet("character_spritesheet", "assets/character-spritesheet-square-test.png", 100, 100);

                this.tile_codes[GRASS_TILE] = "grass_tile";
                this.tile_codes[WALL_TILE] = "wall_tile";
                this.tile_codes[BREAKABLE_TILE] = "breakable_tile";

                this.cursors = this.game.input.keyboard.createCursorKeys();

        },
        create: function() {
                this.loadData();
        },
        // Generate the map of breakable walls (this will be combined with the map)
        generate_breakable_walls: function() {
                var total_walls = 11*15;
                for (var i = 0; i < total_walls; i++) {
                        if (Math.random() > 0.3) {
                                this.breakable_walls.push(BREAKABLE_TILE);
                        }
                        else {
                                this.breakable_walls.push(NO_TILE);
                        }
                }
                this.test_print_map();
                this.clear_map_corners();
        },
        // Clear the tiles where a player will spawn
        clear_map_corners: function() {
                var current_tile = 0;
                for (var y = 0; y < 11; ++y) {
                        for (var x = 0; x < 15; ++x) {
                                if (x == 1 || x == 2) {
                                        if (y == 1 || y == 2 || y == 11 - 2 || y == 11 - 3) {
                                                this.breakable_walls[current_tile] = NO_TILE;
                                        }
                                }
                                else if (x == 15 - 2 || x == 15 - 3) {
                                        if (y == 1 || y == 2 || y == 11 - 2 || y == 11 - 3) {
                                                this.breakable_walls[current_tile] = NO_TILE;
                                        }
                                }
                                current_tile++;
                        }
                }
                this.test_print_map();
        },
        test_print_map: function() {
                var line = "";
                var current_tile = 0;
                console.log("TEST printing the map: ");
                for (var y = 0; y < 11; ++y) {
                        for (var x = 0; x < 15; ++x) {
                              line += this.breakable_walls[current_tile] + (this.breakable_walls[current_tile] < 10 ? "  " : " ");
                              current_tile++;
                        }
                        console.log(line);
                        line = "";
                }
        },
        // Add the breakable walls onto the generated map by applying masks depending on tile types
        add_breakable_walls: function() {
                var current_tile = 0;
                for (var y = 0; y < 11; ++y) {
                        for (var x = 0; x < 15; ++x) {
                                if (this.map_tiles[current_tile] != WALL_TILE) {
                                        if (this.breakable_walls[current_tile] == BREAKABLE_TILE) {
                                                this.map_tiles[current_tile] = BREAKABLE_TILE;
                                        }
                                }
                                current_tile++;
                        }
                }


                // TEST
                var line = "";
                var current_tile = 0;
                console.log("TEST printing the complete final map: ");
                for (var y = 0; y < 11; ++y) {
                        for (var x = 0; x < 15; ++x) {
                              line += this.map_tiles[current_tile] + (this.map_tiles[current_tile] < 10 ? "  " : " ");
                              current_tile++;
                        }
                        console.log(line);
                        line = "";
                }

        },
        loadData: function() {
                var that = this;
                $.getJSON("levels/level1.json", function(json_data) {
                        that.loadLevel(json_data);
                }).done(function() {
                        that.drawMap();
                        that.loadCharacter();
                });
        },
        loadLevel: function(json_data) {
                var image_index = 0;
                this.generate_breakable_walls();
                this.test_print_map();
                for (var y = 0; y < 11; ++y) {
                        for (var x = 0; x < 15; ++x) {
                                var tile_code = json_data.map[image_index];
                                this.map_tiles.push(tile_code);
                                image_index++;
                        }
                }
                this.add_breakable_walls();
        },
        drawMap: function() {
                var current_tile = 0;

                for (var y = HEADER_HEIGHT; y < SCREEN_HEIGHT; y += TILE_HEIGHT) {
                        for (var x = 0; x < SCREEN_WIDTH; x += TILE_WIDTH) {
                                var map_tile_code = this.map_tiles[current_tile];
                                var map_tile_type = this.tile_codes[map_tile_code];
                                var map_tile_sprite = this.game.add.sprite(x, y, map_tile_type);
                                this.map_tile_sprites.push(map_tile_sprite);
                                current_tile++;
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


                // The frame the player defaults to when it stops moving
                if (this.sprite_character == null || this.sprite_character == undefined) {
                        return ;
                }

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


/*************** Make PLAYER moves *****************************************************************/

//                        console.log("Player X: " + this.sprite_character.x);
//                        console.log("Player Y: " + this.sprite_character.y);

                        // PLAYER moves LEFT
                        if (this.cursors.left.isDown) {
                                // Try to move to the LEFT (if no wall)
//                                var tile_on_left = Math.round(this.sprite_character.x / 100)-1 + 15*(Math.round((this.sprite_character.y  - HEADER_HEIGHT + 100) / 100)-1);

                                // With character speed 1
                                if (this.sprite_character.x % 100 == 0) {
                                        var tile_on_left = (this.sprite_character.x / 100) - 1 + 15*(Math.round((this.sprite_character.y  - HEADER_HEIGHT + 100) / 100)-1);
                                }



                                if (this.map_tiles[tile_on_left] == undefined || this.map_tiles[tile_on_left] == GRASS_TILE) {
                                        this.sprite_character.x -= CHARACTER_SPEED;
                                }
                                console.log("Tile on LEFT type: " + this.map_tiles[tile_on_left]);
                                console.log("Tile on LEFT: " + tile_on_left);


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
                                // Try to move to the RIGHT (if no wall)
//                                var tile_on_right = Math.round(this.sprite_character.x / 100)+1 + 15*(Math.round((this.sprite_character.y  - HEADER_HEIGHT + 100) / 100)-1);

                                // With character speed 1
                                if (this.sprite_character.x % 100 == 0) {
                                    var tile_on_right = (this.sprite_character.x / 100)+1 + 15*(Math.round((this.sprite_character.y  - HEADER_HEIGHT + 100) / 100)-1);
                                }



                                if (this.map_tiles[tile_on_right] == undefined || this.map_tiles[tile_on_right] == GRASS_TILE) {
                                        this.sprite_character.x += CHARACTER_SPEED;
                                }
                                console.log("Tile on RIGHT type: " + this.map_tiles[tile_on_right]);
                                console.log("Tile on RIGHT: " + tile_on_right);


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
                        // PLAYER moves UP  (remove els to be able to move diagonally)
                        if (this.cursors.up.isDown) {
        //                else if (this.cursors.up.isDown) {

                                // Try to move UP (if no wall)
//                                var tile_on_up = Math.round(this.sprite_character.x / 100) + 15*(Math.round((this.sprite_character.y  - HEADER_HEIGHT + 100) / 100) - 2) ;


                                // With character speed 1
                                if ((this.sprite_character.y + 50) % 100 == 0) {
                                        console.log("this.sprite_character.x : " + this.sprite_character.x);
                                        console.log("this.sprite_character.y : " + this.sprite_character.y);
                                        var tile_on_up = Math.round(this.sprite_character.x / 100) + 15*(((this.sprite_character.y  - HEADER_HEIGHT + 100) / 100) - 2) ;
                                }


                                if (this.map_tiles[tile_on_up] == undefined || this.map_tiles[tile_on_up] == GRASS_TILE) {
                                        this.sprite_character.y -= CHARACTER_SPEED;
                                }
                                console.log("Tile on UP type: " + this.map_tiles[tile_on_up]);
                                console.log("Tile on UP: " + tile_on_up);


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

                                // Try to move DOWN (if no wall)
//                                var tile_on_down = Math.round(this.sprite_character.x / 100) + 15*Math.round((this.sprite_character.y  - HEADER_HEIGHT + 100) / 100);


                                // With character speed 1
                                if ((this.sprite_character.y + 50) % 100 == 0) {
                                        var tile_on_down = Math.round(this.sprite_character.x / 100) + 15*((this.sprite_character.y  - HEADER_HEIGHT + 100) / 100);
                                }


                                if (this.map_tiles[tile_on_down] == undefined || this.map_tiles[tile_on_down] == GRASS_TILE) {
                                        this.sprite_character.y += CHARACTER_SPEED;
                                }
                                console.log("Tile on DOWN type: " + this.map_tiles[tile_on_down]);
                                console.log("Tile on DOWN: " + tile_on_down);


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

/*************** END of PLAYER moves *****************************************************************/

        }
}
