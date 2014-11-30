var Config = (function() {
  var _config = function() {
    this.calibrate();
  };

  _config.prototype.CONST = {
    CANVAS_ID : 'screen',
    JUMP_SPEED : 1.2,
    GRAVITY: 7.63,
    MAX_RATIO: 0.66667,
    BLOCKS_PER_SCREEN_HEIGHT: 20,
    BLOCKS_PER_PASS_HEIGHT: 4,
    BLOCKS_PER_PASS_WIDTH: 1.8,
    BLOCKS_PER_OBSTACLES: [1, 3, 5, 7, 9 ,11],
    BLOCKS_PER_OBSTACE_DISTANCE: 3.6,
    BLOCKS_PER_GROUND: 4,
    BLOCKS_PER_SOAR_WIDTH: 1,
    BLOCKS_PER_OFFSET: {X: 2.5, Y: 8}
  };

  _config.prototype.calibrate = function() {
    this._canvasSize();
    this._blockSize();
    this._groundHeight();
    this._passSize();
    this._soarWidth();
    this._obstacleSize();
    this._obstacleDistance();
    this._maxObstaclesVisible();
    this._offset();
    this.colors();
  };

  _config.prototype._canvasSize = function() {
    this.height = document.body.clientHeight;
    this.width = document.body.clientWidth > this._maxWidth() ?
      this._maxWidth() : document.body.clientWidth;
  };

  _config.prototype._maxWidth = function() {
    return this.height*this.CONST.MAX_RATIO;
  };

  _config.prototype._blockSize = function() {
    this.blockSize =
      this.height/this.CONST.BLOCKS_PER_SCREEN_HEIGHT | 0;
  };

  _config.prototype._groundHeight = function() {
    this.groundHeight = this.blockSize * this.CONST.BLOCKS_PER_GROUND;
  };

  _config.prototype._passSize = function() {
    this.passHeight =
      this.blockSize * this.CONST.BLOCKS_PER_PASS_HEIGHT;
    this.passWidth =
      this.blockSize * this.CONST.BLOCKS_PER_PASS_WIDTH | 0;
  };

  _config.prototype._soarWidth = function() {
    this.soarWidth =
      this.blockSize * this.CONST.BLOCKS_PER_SOAR_WIDTH;
  };

  _config.prototype._obstacleSize = function() {
    var blockSize = this.blockSize;

    this.obstacleWidth = this.passWidth;
    this.obstacleHeight = this.CONST.BLOCKS_PER_OBSTACLES.map(
      function(blocks_per_obstacle) {
        return blocks_per_obstacle * blockSize;
      });
  };

  _config.prototype._obstacleDistance = function() {
    this.obstacleDistance =
      this.blockSize * this.CONST.BLOCKS_PER_OBSTACE_DISTANCE;
  };

  _config.prototype._maxObstaclesVisible = function() {
    var repeatWidth = this.obstacleWidth + this.obstacleDistance;
    this.maxObstacles = Math.ceil(this.width / repeatWidth) + 1;
  };

  _config.prototype._offset = function() {
    this.offset = {
      x: this.blockSize * this.CONST.BLOCKS_PER_OFFSET.X | 0,
      y: this.blockSize * this.CONST.BLOCKS_PER_OFFSET.Y
    };
  };

  _config.prototype.colors = function(bg, fg) {
    this.bg = bg? bg : "#000000";
    this.fg = fg? fg : "#ffffff";
  };

  return _config;
})();
