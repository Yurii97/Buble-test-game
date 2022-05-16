const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 400,
  dots: [1, 2, 3, 4, 5],
  scene: new GameScene(),
  rows: 2,
  cols: 5,
};

let game = new Phaser.Game(config);
