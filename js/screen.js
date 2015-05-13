var Screen = (function() {
  var _screen = function(config) {
    this.config = config;
    this._init();
    this._adjustSize();
  };

  _screen.prototype._adjustSize = function() {
    this.canvas.height = this.config.height;
    this.canvas.width = this.config.width;
  };

  _screen.prototype._init = function() {
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

    this._moving = true;
  };

  _screen.prototype.clear = function() {
    this.context.fillStyle = this.config.bg;
    this.context.fillRect(0,0,
        this.config.width,this.config.height);
  };

  _screen.prototype.drawPlayer = function(position,speed) {
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
    if(this._moving) {
      if(this.mouth >=0.24 || this.mouth <0) {
        this.mouthDirection = ! this.mouthDirection;
      }
      this.mouth += (this.mouthDirection) ? 0.04 :  -0.04;
    }
  };

  _screen.prototype.drawObstacles = function(level) {
    var offset = 0;

    this.context.fillStyle = "#fff";
    this.context.lineWidth = this.config.blockSize/16;
    this.context.strokeStyle = this.config.fg;
    for(var i=0;i<level.length;i++) {
      this.context.strokeRect(offset + level[i].left,
                    0,
                    this.config.obstacleWidth,
                    level[i].top);
      if( this.config.offset.x < offset + level[i].left + this.config.obstacleWidth) {
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
                    level[i].bottom);
      offset += level[i].left + this.config.obstacleWidth;
    }
  };

  _screen.prototype.drawGround = function() {
    var y = this.config.height - this.config.groundHeight -
            this.config.blockSize/4,
        height = this.config.groundHeight + this.config.blockSize/4,
        width = this.config.width,
        repeat = this.config.width,
        numlines = 10,
        line = repeat/(numlines*2) ,
        offset = this.offset;

    this.context.fillStyle = this.config.fg;
    this.context.strokeStyle = this.config.fg;
    this.context.strokeRect(-this.context.lineWidth*2,y+height*0.05, width+this.context.lineWidth*4, height*0.95);
    for(var i =0; i<numlines*2; i++) {
      this.context.strokeRect(offset, y, line, height*0.05);
      offset += 2*line;
    }
    if(this.offset <= -line * 8) {
      this.offset+= line*8;
    }
    if(this._moving) {
      this.offset-= this.config.blockSize/8;
    }
  };

  _screen.prototype.draw = function(position, speed, level) {
    this.clear();
    this.drawGround();
    this.drawObstacles(level);
    this.drawPlayer(position,speed);
  };

  _screen.prototype.pauseGround = function() {
    this._moving = false;
  };

  _screen.prototype.resumeGround = function() {
    this._moving = true;
    this.mouth = 0;
    this.mouthDirection = true;
  };

  _screen.prototype.setScore = function(high, score) {
    if(high) {
      this.scoreBoardHigh.innerHTML = score;
    }
    else {
      this.scoreBoardCurrent.innerHTML = score;
    }
  };

  _screen.prototype.showHighScore = function(show) {
    this.scoreBoard.classList.toggle('show-high',show);
  };

  return _screen;
})();
