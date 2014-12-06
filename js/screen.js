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
    this._moving = true;
  };

  _screen.prototype.clear = function() {
    this.context.fillStyle = this.config.bg;
    this.context.fillRect(0,0,
        this.config.width,this.config.height);
  };

  _screen.prototype.drawPlayer = function(position,speed) {
    this.context.fillStyle = this.config.fg;
    this.context.save();
    this.context.translate(
        (position.x+this.config.offset.x+this.config.blockSize/2),
        (position.y+this.config.offset.y+this.config.blockSize/2));
    this.context.rotate(-speed/3);
    this.context.translate(
        -(position.x+this.config.offset.x+this.config.blockSize/2),
        -(position.y+this.config.offset.y+this.config.blockSize/2));
    this.context.fillRect(position.x+this.config.offset.x,
        position.y+this.config.offset.y,
        this.config.blockSize, this.config.blockSize);
    this.context.fillStyle = this.config.bg;
    this.context.fillRect(position.x+this.config.offset.x+this.config.blockSize*0.6,
        position.y+this.config.offset.y+this.config.blockSize*0.2,
        this.config.blockSize*0.2, this.config.blockSize*0.2);
    this.context.fillStyle = this.config.fg;
    this.context.fillRect(position.x+this.config.offset.x+this.config.blockSize*0.65,
        position.y+this.config.offset.y+this.config.blockSize*0.25,
        this.config.blockSize*0.1, this.config.blockSize*0.1);
    this.context.fillStyle = this.config.bg;
    this.context.fillRect(position.x+this.config.offset.x+this.config.blockSize*0.3,
        position.y+this.config.offset.y+this.config.blockSize*0.8,
        this.config.blockSize*0.7, this.config.blockSize*0.1);
    this.context.restore();
  };

  _screen.prototype.drawObstacles = function(level) {
    var offset = 0;

    this.config.fillStyle = this.config.fg;
    for(var i=0;i<level.length;i++) {
      this.context.fillRect(offset + level[i].left,
                    0,
                    this.config.obstacleWidth,
                    level[i].top);

      this.context.fillRect(offset + level[i].left,
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
    this.context.fillRect(0,y+height*0.05, width, height*0.95);
    for(var i =0; i<numlines*2; i++) {
      this.context.fillRect(offset, y, line, height*0.05);
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
