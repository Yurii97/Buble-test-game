class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }
  preload() {
    // console.log("payload");
    // console.log(this);
    this.load.image("bg", "assets/images/Доброго вечора.jpeg");
    this.load.image("el", "assets/images/el.png");
    this.load.image("el1", "assets/images/el1.png");
    this.load.image("el2", "assets/images/el2.png");
    this.load.image("el3", "assets/images/el3.png");
    this.load.image("el4", "assets/images/el4.png");
    this.load.image("el5", "assets/images/el5.png");
  }
  onTimerTick() {
    this.timeOutText.setText("Time: " + this.timeOut);

    if (this.timeOut <= 0) {
      this.time.paused = true;
      this.restart();
    } else {
      --this.timeOut;
    }
  }
  createTimer() {
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: this.onTimerTick,
      callbackScope: this,
    });
  }
  createScore() {
    // console.log(this);
    this.time.addEvent({
      loop: true,
      callback: () => {
        var pointer = this.input.activePointer;
        // console.log(pointer);
        this.scoreText.setText(`Score: ` + this.score);
        // this.textInfo.setText([
        //   "x: " + pointer.worldX,
        //   "y: " + pointer.worldY,
        //   "isDown: " + pointer.isDown,
        //   "rightButtonDown: " + pointer.rightButtonDown(),
        //   "dot:" + pointer.value,
        // ]);
      },
    });
  }
  create() {
    // console.log("create");
    this.timeOut = config.rows * config.cols * 2;
    this.score = 0;
    // this.createBackground();
    this.createText(); // створює тексти
    this.createDots(); // створює точки
    this.start();
    this.createTimer(); // запускає таймер
    this.createScore(); // запускає лічильник
  }

  createText() {
    this.scoreText = this.add.text(10, 10, `Score: `, {
      font: "28px Arial",
    });
    this.timeOutText = this.add.text(10, 40, "", { font: "26px Arial" });
    this.textInfo = this.add.text(150, 10, "", { fill: "#00ff00" });
  }

  createBackground() {
    this.add.sprite(0.5, 0.5, "bg").setOrigin(0.3, 0.3);
  }
  start() {
    this.timeOut = config.rows * config.cols * 2;
    this.score = 0;
    this.openDot = null;
    this.openDotCount = 0;
    this.initDots(); // ініціалізує крапки
    this.showDots(); // виводить крапки на екран
    console.log(this.timer);
    // this.timerGame.paused = false;
    this.time.paused = false;
  }
  restart() {
    let count = 0;
    const onDotMovieComplete = () => {
      ++count;
      if (count >= this.dots.length) {
        this.start();
      }
    };
    // this.timer.paused = false;
    this.dots.forEach((dot) => {
      dot.move({
        x: this.sys.game.config.width + dot.width,
        y: this.sys.game.config.height + dot.height,
        delay: dot.position.delay,
        callback: onDotMovieComplete,
      });
    });
  }
  initDots() {
    const positions = this.getPosition();

    this.dots.forEach((dot) => {
      dot.init(positions.pop());
    });
  }
  showDots() {
    this.dots.forEach((dot) => {
      dot.depth = dot.position.delay; //рад відображення z індекс
      dot.move({
        x: dot.position.x,
        y: dot.position.y,
        delay: dot.position.delay,
      });
    });
  }
  createDots() {
    this.dots = [];
    // const positions = this.getPosition();
    // for (let position of positions) {
    //   this.dots.push(new Dot(this, position));
    //   this.add.sprite(position.x, position.y, "el").setOrigin(0, 0);

    // for (let position of positions) {
    //   const value = Phaser.Math.Between(1, 5);
    //   //   console.log(value);
    //   this.dots.push(new Dot(this, value, position));
    // }

    // Phaser.Utils.Array.Shuffle(positions);
    for (let value of config.dots) {
      for (
        let i = 0;
        i < (config.rows * config.cols) / config.dots.length;
        i++
      ) {
        this.dots.push(new Dot(this, value));
      }
    }

    this.input.on("gameobjectdown", this.onClick, this);
    // this.input.on("pointerdown", this.onClick, this);

    // console.log(this.dots);
  }
  getPosition() {
    const positions = [];
    const cardTexture = this.textures.get("el").getSourceImage();
    const cardWidth = cardTexture.width;
    const cardHeigth = cardTexture.height;
    const offsetX =
      (this.sys.game.config.width - cardWidth * config.cols) / 2 +
      cardWidth / 2;
    const offsetY =
      (this.sys.game.config.height - cardHeigth * config.rows) / 2 +
      cardHeigth / 2;
    let id = 1;
    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        positions.push({
          delay: ++id * 100,
          x: offsetX + col * cardWidth,
          y: offsetY + row * cardHeigth,
        });
      }
    }
    return Phaser.Utils.Array.Shuffle(positions);
  }
  onClick(pointer, dot) {
    // console.log(dot.value);
    if (dot.opened) {
      return false;
    }
    if (this.openDot) {
      if (this.openDot.value === dot.value) {
        this.openDot = null;
        ++this.openDotCount;
        ++this.score;
      } else {
        this.openDot.close();
        this.openDot = dot;
      }
    } else {
      this.openDot = dot;
    }
    dot.open();
    if (this.openDotCount === this.dots.length / 2) {
      this.restart();
    }
  }
}
