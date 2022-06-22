import Phaser from "phaser";
import ground from "./ground.png";
import dinoHurt from "./dino-hurt.png";
import dinoIdle from "./dino-idle.png";
import restart from "./restart.png";
import gameOver from "./game-over.png";
import cloud from "./cloud.png";
import dinoRun from "./dino-run.png";
import dinoDown from "./dino-down.png";
import enemyBird from "./enemy-bird.png";
import cactus1 from "./cactuses_small_1.png";
import cactus2 from "./cactuses_small_2.png";
import cactus3 from "./cactuses_small_2.png";
import cactus4 from "./cactuses_big_1.png";
import cactus5 from "./cactuses_big_2.png";
import cactus6 from "./cactuses_big_3.png";
import jump from "./jump.mp3";
import hit from "./hit.mp3";
import reach from "./reach.mp3";

class PlayScene extends Phaser.Scene {
  constructor() {
    super("PlayScene");
  }

  preload() {
    this.textures.addBase64("jump", jump);
    this.textures.addBase64("hit", hit);
    this.textures.addBase64("reach", reach);
  }

  addImageProcess(src) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  async create() {
    let nLoaded = 0;

    this.textures.addBase64("ground", ground);
    nLoaded++;

    this.textures.addBase64("dino-idle", dinoIdle);
    nLoaded++;

    this.textures.addBase64("dino-hurt", dinoHurt);
    nLoaded++;

    this.textures.addBase64("restart", restart);
    nLoaded++;

    this.textures.addBase64("game-over", gameOver);
    nLoaded++;

    this.textures.addBase64("cloud", cloud);
    nLoaded++;

    // const starImg = new Image();
    // starImg.onload = () => {
    //   this.textures.addSpriteSheet("star", starImg, {
    //     frameWidth: 9,
    //     frameHeight: 9,
    //   });
    //   nLoaded++;
    // };
    // starImg.src = star;

    // this.load.spritesheet("star", star, {
    //   frameWidth: 9,
    //   frameHeight: 9,
    // });

    // const moonImg = new Image();
    // moonImg.onload = () => {
    //   this.textures.addSpriteSheet("moon", moonImg, {
    //     frameWidth: 20,
    //     frameHeight: 40,
    //   });
    //   nLoaded++;
    // };
    // moonImg.src = moon;

    // this.load.spritesheet("moon", moon, {
    //   frameWidth: 20,
    //   frameHeight: 40,
    // });

    // const dinoImg = new Image();
    // dinoImg.onload = () => {
    //   console.log(1, dinoImg);

    // };
    // dinoImg.src = dinoRun;

    // console.log(dinoImg);

    this.textures.addSpriteSheet("dino", await this.addImageProcess(dinoRun), {
      frameWidth: 88,
      frameHeight: 94,
    });
    nLoaded++;

    // this.load.spritesheet("dino", dino, {
    //   frameWidth: 88,
    //   frameHeight: 94,
    // });

    // const dinoDownImg = new Image();
    // dinoDownImg.onload = () => {

    // };
    // dinoDownImg.src = dinoDown;

    this.textures.addSpriteSheet(
      "dino-down",
      await this.addImageProcess(dinoDown),
      {
        frameWidth: 118,
        frameHeight: 94,
      }
    );
    nLoaded++;

    // this.load.spritesheet("dino-down", dinoDown, {
    //   frameWidth: 118,
    //   frameHeight: 94,
    // });

    // const enemyBirdImg = new Image();
    // enemyBirdImg.onload = () => {

    // };
    // enemyBirdImg.src = enemyBird;

    this.textures.addSpriteSheet(
      "enemy-bird",
      await this.addImageProcess(enemyBird),
      {
        frameWidth: 92,
        frameHeight: 77,
      }
    );
    nLoaded++;

    // this.load.spritesheet("enemy-bird", enemyBird, {
    //   frameWidth: 92,
    //   frameHeight: 77,
    // });

    this.textures.addBase64("obstacle-1", cactus1);
    nLoaded++;

    this.textures.addBase64("obstacle-2", cactus2);
    nLoaded++;

    this.textures.addBase64("obstacle-3", cactus3);
    nLoaded++;

    this.textures.addBase64("obstacle-4", cactus4);
    nLoaded++;

    this.textures.addBase64("obstacle-5", cactus5);
    nLoaded++;

    this.textures.addBase64("obstacle-6", cactus6);
    nLoaded++;

    this.isGameRunning = false;
    this.gameSpeed = 10;
    this.respawnTime = 0;
    this.score = 0;

    const { height, width } = this.game.config;

    this.startTrigger = this.physics.add
      .sprite(0, 10)
      .setOrigin(0, 1)
      .setImmovable();
    this.textures.on("onload", () => {
      this.ground.setTexture("ground");
    });
    this.ground = this.add
      .tileSprite(0, height, 88, 26, "ground")
      .setOrigin(0, 1);

    this.textures.on("onload", () => {
      this.dino.setTexture("dino");
    });
    this.dino = this.physics.add
      .sprite(0, height, "dino-idle")
      .setOrigin(0, 1)
      .setBodySize(44, 92)
      .setDepth(1)
      .setCollideWorldBounds(true)
      .setGravityY(5000);

    this.scoreText = this.add
      .text(width, 0, "000000", {
        fill: "#535353",
        font: "900 40px Courier",
        resolution: 6,
      })
      .setOrigin(1, 0)
      .setAlpha(0);
    this.highScoreText = this.add
      .text(width, 0, "000000", {
        fill: "#535353",
        font: "900 40px Courier",
        resolution: 6,
      })
      .setOrigin(1, 0)
      .setAlpha(0);
    this.gameOverScreen = this.add
      .container(width / 2, height / 2 - 50)
      .setAlpha(0);
    this.textures.on("onload", () => {
      this.gameOverText.setTexture("game-over");
    });
    this.gameOverText = this.add.image(0, -50, "game-over");
    this.textures.on("onload", () => {
      this.restart.setTexture("restart");
    });
    this.restart = this.add.image(0, 30, "restart").setInteractive();
    this.textures.on("onload", () => {
      this.environment.children.iterate((child) => {
        child.setTexture("cloud");
      });
    });
    this.environment = this.physics.add.group();

    this.environment
      .addMultiple([
        this.add.image(width / 2, 170, "cloud"),
        this.add.image(width - 88, 80, "cloud"),
        this.add.image(width / 1.5, 100, "cloud"),
      ])
      .setDepth(-1);
    this.environment.setAlpha(0);

    this.gameOverScreen.add([this.gameOverText, this.restart]);
    this.obstacles = this.physics.add.group();

    this.initAnims();
    this.initColliders();
    this.initStartTrigger();
    this.handleInputs();
    this.handleScore();
  }

  initColliders() {
    this.physics.add.collider(
      this.dino,
      this.obstacles,
      () => {
        this.highScoreText.x = this.scoreText.x - this.scoreText.width - 20;

        const highScore = this.highScoreText.text.substr(
          this.highScoreText.text.length - 6
        );
        const newScore =
          Number(this.scoreText.text) > Number(highScore)
            ? this.scoreText.text
            : highScore;

        this.highScoreText.setText("High " + newScore);
        this.highScoreText.setAlpha(1);

        this.physics.pause();
        this.isGameRunning = false;
        this.anims.pauseAll();
        this.dino.setTexture("dino-hurt");
        this.respawnTime = 0;
        this.gameSpeed = 10;
        this.gameOverScreen.setAlpha(1);
        this.score = 0;
        this.textures.on("onload", () => {
          this.sound
            .add("hit", {
              volume: 1,
            })
            .play();
        });
      },
      null,
      this
    );
  }

  initStartTrigger() {
    const { height, width } = this.game.config;
    this.physics.add.overlap(
      this.startTrigger,
      this.dino,
      () => {
        if (this.startTrigger.y === 10) {
          this.startTrigger.body.reset(0, height);
          return;
        }
        this.startTrigger.disableBody(true, true);

        const startEvent = this.time.addEvent({
          delay: 1000 / 60,
          loop: true,
          callbackScope: this,
          callback: () => {
            this.dino.setVelocityX(0);
            this.dino.play("dino-run", 1);

            if (this.ground.width < width) {
              this.ground.width += 17 * 2;
            }
            if (this.ground.width >= width) {
              this.ground.width = width;
              this.isGameRunning = true;
              this.dino.setVelocity(0);
              this.scoreText.setAlpha(1);
              this.environment.setAlpha(1);
              startEvent.remove();
            }
          },
        });
      },
      null,
      this
    );
  }

  initAnims() {
    this.anims.create({
      key: "dino-run",
      frames: this.anims.generateFrameNumbers("dino", {
        start: 2,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    console.log(this.anims);
    this.anims.create({
      key: "dino-down-anim",
      frames: this.anims.generateFrameNumbers("dino-down", {
        start: 0,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "enemy-fly",
      frames: this.anims.generateFrameNumbers("enemy-bird", {
        start: 0,
        end: 1,
      }),
      frameRate: 6,
      repeat: -1,
    });
  }

  handleScore() {
    this.time.addEvent({
      delay: 1000 / 10,
      loop: true,
      callbackScope: this,
      callback: () => {
        if (!this.isGameRunning) {
          return;
        }
        this.score++;
        this.gameSpeed += 0.02;

        if (this.score % 100 === 0) {
          this.textures.on("onload", () => {
            this.sound
              .add("reach", {
                volume: 1,
              })
              .play();
          });
          this.tweens.add({
            targets: this.scoreText,
            duration: 100,
            repeat: 3,
            alpha: 0,
            yoyo: true,
          });
        }

        const score = Array.from(String(this.score), Number);
        for (let i = 0; i < 6 - String(this.score).length; i++) {
          score.unshift(0);
        }

        this.scoreText.setText(score.join(""));
      },
    });
  }

  handleInputs() {
    this.restart.on("pointerdown", () => {
      this.dino.setVelocityY(0);
      this.dino.body.height = 92;
      this.dino.body.offset.y = 0;
      this.physics.resume();
      this.obstacles.clear(true, true);
      this.isGameRunning = true;
      this.gameOverScreen.setAlpha(0);
      this.anims.resumeAll();
    });

    this.input.keyboard.on("keydown_SPACE", () => {
      if (!this.dino.body.onFloor() || this.dino.body.velocity.x > 0) {
        return;
      }
      this.dino.body.height = 94;
      this.dino.body.offset.y = 0;

      this.textures.on("onload", () => {
        this.sound
          .add("jump", {
            volume: 1,
          })
          .play();
      });
      this.dino.setVelocityY(-1600);
      this.dino.setTexture("dino", 0);
    });
    this.input.keyboard.on("keydown_UP", () => {
      if (!this.dino.body.onFloor() || this.dino.body.velocity.x > 0) {
        return;
      }
      this.dino.body.height = 94;
      this.dino.body.offset.y = 0;
      this.textures.on("onload", () => {
        this.sound
          .add("jump", {
            volume: 1,
          })
          .play();
      });

      this.dino.setVelocityY(-1600);
      this.dino.setTexture("dino", 0);
    });
    this.input.keyboard.on("keydown_DOWN", () => {
      if (!this.dino.body.onFloor() || !this.isGameRunning) {
        return;
      }
      this.dino.body.height = 58;
      this.dino.body.offset.y = 34;
    });
    this.input.keyboard.on("keyup_DOWN", () => {
      if (!this.dino.body.onFloor()) {
        return;
      }
      this.dino.body.height = 92;
      this.dino.body.offset.y = 0;
    });
  }

  placeObstacle() {
    const { width, height } = this.game.config;
    const obstacleNumber = Math.floor(Math.random() * 7) + 1;
    const distance = Phaser.Math.Between(600, 900);
    let obstacle;

    if (obstacleNumber > 6) {
      const enemyHeight = [20, 50];
      obstacle = this.obstacles
        .create(
          width + distance,
          height - enemyHeight[Math.floor(Math.random() * 2)],
          "enemy-bird"
        )
        .setOrigin(0, 1);
        obstacle.play("enemy-fly", 1);
      obstacle.body.height = obstacle.body.height / 1.5;
    } else {
      obstacle = this.obstacles
        .create(width + distance, height, `obstacle-${obstacleNumber}`)
        .setOrigin(0, 1);
      obstacle.body.offset.y = +10;
    }

    obstacle.setOrigin(0, 1).setImmovable();
  }

  update(time, delta) {
    if (!this.isGameRunning) {
      return;
    }
    this.ground.tilePositionX += this.gameSpeed;
    Phaser.Actions.IncX(this.obstacles.getChildren(), -this.gameSpeed);
    Phaser.Actions.IncX(this.environment.getChildren(), -0.5);
    this.respawnTime += delta * this.gameSpeed * 0.08;
    if (this.respawnTime > 1500) {
      this.placeObstacle();
      this.respawnTime = 0;
    }
    this.obstacles.getChildren().forEach((obstacle) => {
      if (obstacle.getBounds().right < 0) {
        obstacle.destroy();
      }
    });
    this.environment.getChildren().forEach((env) => {
      if (env.getBounds().right < 0) {
        env.x = this.game.config.width + 30;
      }
    });
    if (this.dino.body.deltaAbsY() > 0) {
      this.dino.anims.stop();
      this.dino.setTexture("dino");
    } else {
      this.dino.body.height <= 58
        ? this.dino.play("dino-down-anim", true)
        : this.dino.play("dino-run", true);
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 340,
  pixelArt: true,
  transparent: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: PlayScene,
};

new Phaser.Game(config);
