import { DynamicConfig, StaticConfig } from './config.js';

export class Screen {
    moving = true;
    negative = false;
    palette = {
        fg: StaticConfig.colors.FG_COLOR,
        bg: StaticConfig.colors.BG_COLOR,
        player: StaticConfig.colors.PLAYER_COLOR,
    };

    constructor() {
        this.init();
        this.adjustSize();
    };

    setNegative(value) {
        this.negative = value === true ? true : false;
    }

    getPalette() {
        return this.negative ? {
            ...this.palette,
            fg: this.palette.bg,
            bg: this.palette.fg,
        }: this.palette;
    }

    adjustSize() {
        this.canvas.height = DynamicConfig.getSize().height;
        this.canvas.width = DynamicConfig.getSize().width;
    };

    init() {
        this.canvas = document.getElementById(StaticConfig.CANVAS_ID);
        this.scoreBoard = document.getElementById(StaticConfig.SCORE_BOARD_ID);
        this.scoreBoardHigh = this.scoreBoard
            .querySelector(StaticConfig.HIGH_SCORE);
        this.scoreBoardCurrent = this.scoreBoard
            .querySelector(StaticConfig.CURRENT_SCORE);
        this.context = this.canvas.getContext('2d');
        this.offset = 0;
        this.mouth = 0;
        this.mouthDirection = true;

        this.moving = true;
    };

    clear() {
        const { bg } = this.getPalette();
        this.context.fillStyle = bg;
        this.context.fillRect(0,0,
            DynamicConfig.getSize().width,DynamicConfig.getSize().height);
    };

    drawPlayer(position,speed) {
        const { player } = this.getPalette();
        const { x, y } = DynamicConfig.getOffset();
        const soarWidth = DynamicConfig.getSoarWidth();

        this.context.fillStyle = player
        this.context.save();
        this.context.translate(
            (position.x + x + soarWidth/2),
            (position.y + y + soarWidth/2));
        this.context.rotate(-speed/3);
        this.context.translate(
            -(position.x + x + soarWidth/2),
            -(position.y + y + soarWidth/2));
        this.context.beginPath();
        this.context.arc(position.x + x + soarWidth/2,
            position.y+y + soarWidth/2,
            soarWidth/2, (0.25-this.mouth) * Math.PI,
            (1.25 -this.mouth) * Math.PI,false);
        this.context.closePath ();
        this.context.fill();
        this.context.beginPath();
        this.context.arc(position.x + x + soarWidth/2,
            position.y + y + soarWidth/2,
            soarWidth/2,
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
        const { fg } = this.getPalette();
        let offset = 0;

        this.context.fillStyle = "#fff";
        this.context.lineWidth = DynamicConfig.getSoarWidth()/16;
        this.context.strokeStyle = fg;
        for (let i=0;i<level.length;i++) {
            this.context.strokeRect(offset + level[i].left,
                0,
                DynamicConfig.getObstacleWidth(),
                level[i].top);
            if ( DynamicConfig.getOffset().x < offset + level[i].left + DynamicConfig.getObstacleWidth()) {
                this.context.beginPath();
                this.context.arc(offset + level[i].left + DynamicConfig.getObstacleWidth(),
                    level[i].top + level[i].pass/2,
                    DynamicConfig.getSoarWidth()/8, 0, 2 * Math.PI, false);
                this.context.closePath ();
                this.context.fill();
            }

            this.context.strokeRect(offset + level[i].left,
                level[i].top + level[i].pass,
                DynamicConfig.getObstacleWidth(),
                level[i].bottom - DynamicConfig.getSoarWidth()/16);
            offset += level[i].left + DynamicConfig.getObstacleWidth();
        }
    };

    drawGround() {
        const size = DynamicConfig.getSize();
        const y = size.height - DynamicConfig.getGroundHeight() - DynamicConfig.getSoarWidth()/4;
        const height = DynamicConfig.getGroundHeight() + DynamicConfig.getSoarWidth()/4;
        const width = size.width;
        const repeat = size.width;
        const numlines = 10;
        const line = repeat/(numlines*2) ;
        const { fg, bg } = this.getPalette();

        let offset = this.offset;

        this.context.fillStyle = fg;
        this.context.strokeStyle = fg;
        this.context.strokeRect(-this.context.lineWidth*2,y+height*0.05, width+this.context.lineWidth*4, height*0.95);
        for (let i =0; i<numlines*2; i++) {
            this.context.strokeRect(offset, y, line, height*0.05);
            offset += 2*line;
        }
        if (this.offset <= -line * 8) {
            this.offset+= line*8;
        }
        if (this.moving) {
            this.offset-= DynamicConfig.getSoarWidth()/8;
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
