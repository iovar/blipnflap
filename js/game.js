export class Game {
    constructor(screen, audio, config) {
        this.screen = screen;
        this.audio = audio;
        this.config = config;
        this.loadHighScore();
        this.reset();
        this.startLoop();
    };

    startLoop() {
        this.timer = setInterval(() => {
            requestAnimationFrame(() => this.loop());
        }, 33);
    };

    reset() {
        this.state = 0; //0 not started, 1 playing, 2 dead
        this.ymod = 0;
        this.position = {x:0,y:0};
        this.objectOffset = 100;
        this.speed = 0;
        this.score = 0;
        this.timestamp = Date.now();
        this.level = [];
        this.screen.setScore(false,0);
        this.screen.setScore(true,this.highScore);
    };

    advance() {
        if (this.level[0].left < - this.config.obstacleWidth) {
            this.level.shift();
            this.level.push(this.getObstacle());
        }
        this.level[0].left -= this.config.blockSize/8;
    };

    check() {
        return (this.checkBottom() ||
            this.checkObstacle());
    };

    checkBottom() {
        const maxY =  this.config.height - this.config.groundHeight -
            this.config.offset.y - this.config.blockSize;
        if (this.position.y >= maxY ) {
            this.position.y = maxY;
            return true;
        }
    };

    checkObstacle() {
        const boundary = this.config.collisionBoundary;
        const obx1 = this.level[0].left;
        const obx2 = obx1 + this.config.obstacleWidth;
        const obminy = this.level[0].top;
        const obmaxy = obminy + this.level[0].pass;
        const px1 = this.config.offset.x;
        const px2 = px1 + this.config.blockSize;
        const pminy = this.config.offset.y + this.position.y;
        const pmaxy = pminy + this.config.blockSize;

        if ( (px2 - obx1 > boundary  && obx2 > px2) ||
            (px1 > obx1 && obx2 - px1 > boundary) ) {
            if (obminy - pminy > boundary|| pmaxy - obmaxy > boundary) {
                return true;
            }
        }
        return false;
    };

    loop() {
        this.screen.draw(this.position, this.speed, this.level);

        if (this.state === 1) {
            this.move();
            this.advance();
            this.checkPoint();
            if (this.check()) {
                const self = this,
                    fg = this.config.fg,
                    bg = this.config.bg;

                this.audio.play('die');
                this.screen.pauseGround();
                this.config.colors(fg,bg);
                this.saveHighScore();
                this.state = 2;
                this.screen.setScore(true,this.highScore);
                setTimeout(function() {
                    self.config.colors(bg,fg);
                },50);
                setTimeout(function() {
                    self.screen.resumeGround();
                    self.screen.setScore(false,0);
                    self.screen.showHighScore(true);
                    self.reset();
                },3000);
            }
        } else if (this.state === 2) {
            if (this.position.y + this.config.offset.y<this.config.height - this.config.groundHeight - this.config.blockSize) {
                this.move();
            }
        } else if (this.state === 0) {
            this.soar();
        }
    };

    start() {
        this.reset();
        this.state = 1;
        this.screen.showHighScore(false);
        this.speed = 2;
        this.generateLevel();
    };

    generateLevel() {
        this.level = [];
        for (let i = 0; i<this.config.maxObstacles; i++) {
            this.level.push(this.getObstacle());
        }
        this.level[0].left += this.config.width*1;
    };

    getObstacle() {
        const num = this.config.obstacleHeight.length;
        const sel =  Math.floor(Math.random() * num);
        const obstacle = {
            top: this.config.obstacleHeight[sel],
            pass: this.config.passHeight,
            bottom: this.config.obstacleHeight[num - sel - 1],
            left: this.config.obstacleDistance,
            done: false
        };
        return obstacle;
    };

    move() {
        const dt = (Date.now() - this.timestamp)/1000;
        this.position.y-=this.speed*(this.config.height/150);
        if (this.speed >= -2*this.config.CONST.JUMP_SPEED) {
            this.speed -= 1/2 * (this.config.CONST.GRAVITY * Math.pow(dt,2));
        }
    };

    soar() {
        const pos = Math.sin(this.ymod/10)*(this.config.soarWidth/2);
        this.position.y = pos;
        this.ymod++;
    };

    jump() {
        this.speed = this.config.CONST.JUMP_SPEED;
        this.timestamp = Date.now();
    };

    loadHighScore() {
        const val = localStorage.getItem('blockyflap-highscore');

        this.highScore = (val) ? parseInt(val) : 0;
    };

    saveHighScore() {
        if (this.score > this.highScore) {

            this.highScore = this.score;
            localStorage.setItem('blockyflap-highscore', this.highScore);
        }
    };

    checkPoint() {
        if ( this.level[0] && !this.level[0].done &&
            (this.config.offset.x >
                this.level[0].left + this.config.obstacleWidth)) {
            this.level[0].done = true;
            this.score++;
            this.audio.play('point');
            this.screen.setScore(false, this.score);
        }
    };
}
