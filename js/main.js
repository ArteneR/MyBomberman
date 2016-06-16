var game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.CANVAS, "game");

game.state.add("BootState", BootState);
game.state.add("PreloadState", PreloadState);
game.state.add("MainMenuState", MainMenuState);
game.state.add("InGameState", InGameState);
game.state.add("OptionsState", OptionsState);
game.state.add("QuitState", QuitState);

game.state.start("BootState");
