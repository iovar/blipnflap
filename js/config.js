// TODO diferentiate to static config and environment
// Static: all independant + percentages
// Absolute: environment specific pixel numbers

export const StaticConfig = {
    CANVAS_ID : 'screen',
    SCORE_BOARD_ID: 'score-board',
    HIGH_SCORE: '.high .score',
    CURRENT_SCORE: '.current .score',
    JUMP_SPEED : 1.3,
    GRAVITY: 4.0,

    colors: {
        BG_COLOR: '#000000',
        FG_COLOR: '#013AE3',
        PLAYER_COLOR: '#FFFA23',
    },

    audio: {
        filename: 'audio/sounds.mp3',
        markers: {
          die: { start: 0, end: 0.3 },
          move: { start: 2, end: 2.3 },
          point: { start: 4, end: 4.3 },
        },
    },

    relative: {
        // all following numbers are % of screen height
        PASS_HEIGHT: 0.25,
        GROUND_HEIGHT: 0.15,
        BUMP_HEIGHT: 0.06,

        PASS_WIDTH: 0.075,
        OBSTACLE_WIDTH: 0.075,
        OBSTACLE_HEIGHTS: [ 0.15, 0.2, 0.25, 0.35, 0.4, 0.45 ],
        OBSTACLE_DISTANCE: 0.18,
        SOAR_WIDTH: 0.05,
        OFFSET: { x: 0.125 , y: 0.4 },
        COLLISION_BOUNDARY: 0.005,
    }
};

const withDocument = (fn) => () => {
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;

    return fn(width, height);
}

export const DynamicConfig = {
    getSize: withDocument((width, height) => ({ width, height })),
    getPassHeight: withDocument((_, height) => StaticConfig.relative.PASS_HEIGHT * height),
    getGroundHeight: withDocument((_, height) => StaticConfig.relative.GROUND_HEIGHT * height),
    getBumpHeight: withDocument((_, height) => StaticConfig.relative.BUMP_HEIGHT * height),
    getPassWidth: withDocument((_, height) => StaticConfig.relative.PASS_WIDTH * height),
    getObstacleHeight: (index) => withDocument((_, height) => StaticConfig.relative.OBSTACLE_HEIGHTS[index] * height)(),
    getObstacleWidth: withDocument((_, height) => StaticConfig.relative.OBSTACLE_WIDTH * height),
    getObstacleDistance: withDocument((_, height) => StaticConfig.relative.OBSTACLE_DISTANCE * height),
    getSoarWidth: withDocument((_, height) => StaticConfig.relative.SOAR_WIDTH * height),
    getOffset: withDocument((_, height) => ({ x: StaticConfig.relative.OFFSET.x * height, y: StaticConfig.relative.OFFSET.y * height })),
    getCollisionBoundary: withDocument((_, height) => StaticConfig.relative.COLLISION_BOUNDARY * height),
    getMaxObstacles: withDocument((_, height) => {
        const repeatWidth = DynamicConfig.getObstacleWidth() + DynamicConfig.getObstacleDistance();
        return Math.ceil(DynamicConfig.getSize().width / repeatWidth) + 1;
    }),
};
