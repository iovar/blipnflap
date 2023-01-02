// TODO split and rename screen to graphics, and
// responsibility
//      Graphics: draw all items that are to be drawn on the canvas
//      Sprites: draw items that are image based on image sequences
//      Text: draw text
//      Drawable: initialize canvas drawing
export class Screen {
    moving = true;

    constructor(config) {
        this.config = config;
        this.init();
        this.adjustSize();
    };

    adjustSize() {
        this.canvas.height = this.config.height;
        this.canvas.width = this.config.width;
    };

    init() {
        this.canvas = document.getElementById(this.config.CONST.CANVAS_ID);
        this.scoreBoard = document.getElementById('score-board');
        this.scoreBoardHigh = this.scoreBoard
            .querySelector('.high .score');
        this.scoreBoardCurrent = this.scoreBoard
            .querySelector('.current .score');
        this.context = this.canvas.getContext('2d');
        this.offset = 0;
        this.mouth = 0;
        this.mouthDirection = true;

        this.moving = true;
    };

    clear() {
        this.context.fillStyle = this.config.bg;
        this.context.fillRect(0,0,
            this.config.width,this.config.height);
    };

    drawPlayer(position,speed) {
        this.context.fillStyle = this.config.pl;
        this.context.save();
        this.context.translate(
            (position.x+this.config.offset.x+this.config.blockSize/2),
            (position.y+this.config.offset.y+this.config.blockSize/2));
        this.context.rotate(-speed/3);
        this.context.translate(
            -(position.x+this.config.offset.x+this.config.blockSize/2),
            -(position.y+this.config.offset.y+this.config.blockSize/2));
        this.context.beginPath();
        this.context.arc(position.x + this.config.offset.x +this.config.blockSize/2,
            position.y+this.config.offset.y +this.config.blockSize/2,
            this.config.blockSize/2, (0.25-this.mouth) * Math.PI,
            (1.25 -this.mouth) * Math.PI,false);
        this.context.closePath ();
        this.context.fill();
        this.context.beginPath();
        this.context.arc(position.x + this.config.offset.x +this.config.blockSize/2,
            position.y+this.config.offset.y +this.config.blockSize/2,
            this.config.blockSize/2,
            (0.75 +this.mouth) * Math.PI, (1.75+this.mouth) * Math.PI,false);

        this.context.closePath ();
        this.context.fill();
        this.context.restore();
        if (this.moving) {
            if (this.mouth >=0.24 || this.mouth <0) {
                this.mouthDirection = ! this.mouthDirection;
            }
            this.mouth += (this.mouthDirection) ? 0.04 :  -0.04;
        }
    };

    drawObstacles(level) {
        let offset = 0;

        this.context.fillStyle = "#fff";
        this.context.lineWidth = this.config.blockSize/16;
        this.context.strokeStyle = this.config.fg;
        for (let i=0;i<level.length;i++) {
            this.context.strokeRect(offset + level[i].left,
                0,
                this.config.obstacleWidth,
                level[i].top);
            if ( this.config.offset.x < offset + level[i].left + this.config.obstacleWidth) {
                this.context.beginPath();
                this.context.arc(offset + level[i].left + this.config.obstacleWidth,
                    level[i].top + level[i].pass/2,
                    this.config.blockSize/8, 0, 2 * Math.PI, false);
                this.context.closePath ();
                this.context.fill();
            }

            this.context.strokeRect(offset + level[i].left,
                level[i].top + level[i].pass,
                this.config.obstacleWidth,
                level[i].bottom - this.config.blockSize/16);
            offset += level[i].left + this.config.obstacleWidth;
        }
    };

    drawGround() {
        const y = this.config.height - this.config.groundHeight - this.config.blockSize/4;
        const height = this.config.groundHeight + this.config.blockSize/4;
        const width = this.config.width;
        const repeat = this.config.width;
        const numlines = 10;
        const line = repeat/(numlines*2) ;

        let offset = this.offset;

        this.context.fillStyle = this.config.fg;
        this.context.strokeStyle = this.config.fg;
        this.context.strokeRect(-this.context.lineWidth*2,y+height*0.05, width+this.context.lineWidth*4, height*0.95);
        for (let i =0; i<numlines*2; i++) {
            this.context.strokeRect(offset, y, line, height*0.05);
            offset += 2*line;
        }
        if (this.offset <= -line * 8) {
            this.offset+= line*8;
        }
        if (this.moving) {
            this.offset-= this.config.blockSize/8;
        }
    };

    draw(position, speed, level) {
        this.clear();
        this.drawGround();
        this.drawObstacles(level);
        this.drawPlayer(position,speed);
    };

    pauseGround() {
        this.moving = false;
    };

    resumeGround() {
        this.moving = true;
        this.mouth = 0;
        this.mouthDirection = true;
    };

    setScore(high, score) {
        const scoreBoard = high ? this.scoreBoardHigh : this.scoreBoardCurrent;
        scoreBoard.innerHTML = score;
    };

    showHighScore(show) {
        this.scoreBoard.classList.toggle('show-high',show);
    };
}
