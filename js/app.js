import { Audio } from './audio.js';
import { Config } from './config.js';
import { Screen } from './screen.js';
import { Game } from './game.js';

class App {
    keys = [
        13, // enter
        32, // space
        38, // arrow up
    ];

    constructor() {
        this.config = new Config();
        this.screen = new Screen(this.config);
        this.audio = new Audio(this.config.audio.filename, this.config.audio.markers);
        this.game = new Game(this.screen, this.audio, this.config);

        this.setupEventListeners();
        this.screen.clear();
        this.audio.play('die');
    };

    setupEventListeners() {
        addEventListener('keydown', (e) => {
            const v = e.which || e.keycode;
            if (v && this.keys.includes(v)) {
                this.handleEvent();
            }
        });

        addEventListener('touchstart', (e) => {
            this.handleEvent();
        });
    };

    handleEvent() {
        if (this.game.state === 0) {
            this.game.start();
            this.audio.play('move');
        }
        else if (this.game.state === 1){
            this.game.jump();
            this.audio.play('move');
        }
    };
}

window.addEventListener('load', function() {
    new App();
}, false);
