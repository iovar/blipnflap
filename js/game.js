import { DynamicConfig, StaticConfig } from './config.js';

export class Game {
    constructor(screen, audio) {
        this.screen = screen;
        this.audio = audio;
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
        if (this.level[0].left < - DynamicConfig.getObstacleWidth()) {
            this.level.shift();
            this.level.push(this.getObstacle());
        }
        this.level[0].left -= DynamicConfig.getSoarWidth()/8;
    };

    check() {
        return (this.checkBottom() ||
            this.checkObstacle());
    };

    checkBottom() {
        const maxY =  DynamicConfig.getSize().height - DynamicConfig.getGroundHeight() -
            DynamicConfig.getOffset().y - DynamicConfig.getSoarWidth();
        if (this.position.y >= maxY ) {
            this.position.y = maxY;
            return true;
        }
    };

    checkObstacle() {
        const boundary = DynamicConfig.getCollisionBoundary();
        const obx1 = this.level[0].left;
        const obx2 = obx1 + DynamicConfig.getObstacleWidth();
        const obminy = this.level[0].top;
        const obmaxy = obminy + this.level[0].pass;
        const px1 = DynamicConfig.getOffset().x;
        const px2 = px1 + DynamicConfig.getSoarWidth();
        const pminy = DynamicConfig.getOffset().y + this.position.y;
        const pmaxy = pminy + DynamicConfig.getSoarWidth();

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
                const { FG_COLOR: fg, BG_COLOR: bg } = StaticConfig.colors;

                this.audio.play('die');
                this.screen.pauseGround();
                this.screen.setNegative(true);
                this.saveHighScore();
                this.state = 2;
                this.screen.setScore(true,this.highScore);
                setTimeout(() => {
                    this.screen.setNegative(false);
                },50);
                setTimeout(() => {
                    this.screen.resumeGround();
                    this.screen.setScore(false,0);
                    this.screen.showHighScore(true);
                    this.reset();
                },3000);
            }
        } else if (this.state === 2) {
            if (this.position.y + DynamicConfig.getOffset().y < DynamicConfig.getSize().height - DynamicConfig.getGroundHeight() - DynamicConfig.getSoarWidth()) {
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
        for (let i = 0; i<DynamicConfig.getMaxObstacles(); i++) {
            this.level.push(this.getObstacle());
        }
        this.level[0].left += DynamicConfig.getSize().width*1;
    };

    getObstacle() {
        const num = StaticConfig.relative.OBSTACLE_HEIGHTS.length;
        const sel =  Math.floor(Math.random() * num);
        const obstacle = {
            top: DynamicConfig.getObstacleHeight(sel),
            pass: DynamicConfig.getPassHeight(),
            bottom: DynamicConfig.getObstacleHeight(num - sel - 1),
            left: DynamicConfig.getObstacleDistance(),
            done: false
        };
        return obstacle;
    };

    move() {
        const dt = (Date.now() - this.timestamp)/1000;
        this.position.y-=this.speed*(DynamicConfig.getSize().height/150);
        if (this.speed >= -2*StaticConfig.JUMP_SPEED) {
            this.speed -= 1/2 * (StaticConfig.GRAVITY * Math.pow(dt,2));
        }
    };

    soar() {
        const pos = Math.sin(this.ymod/10)*(DynamicConfig.getSoarWidth()/2);
        this.position.y = pos;
        this.ymod++;
    };

    jump() {
        this.speed = StaticConfig.JUMP_SPEED;
        this.timestamp = Date.now();
    };

    loadHighScore() {
        const val = localStorage.getItem('blipnflap-highscore');

        this.highScore = (val) ? parseInt(val) : 0;
    };

    saveHighScore() {
        if (this.score > this.highScore) {

            this.highScore = this.score;
            localStorage.setItem('blipnflap-highscore', this.highScore);
        }
    };

    checkPoint() {
        if ( this.level[0] && !this.level[0].done &&
            (DynamicConfig.getOffset().x >
                this.level[0].left + DynamicConfig.getObstacleWidth())) {
            this.level[0].done = true;
            this.score++;
            this.audio.play('point');
            this.screen.setScore(false, this.score);
        }
    };
}
