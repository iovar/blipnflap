export class Audio {
    context = null;
    buffer = null;
    loaded = false;

    /**
     * filename: string
     * markers: { [key: string]: { start: number, end: number } }
     */
    constructor(filename, markers) {
        this.markers = markers;
        this.filename = filename;
    }

    init() {
        try {
            this.context = new AudioContext();
        }
        catch {
            console.error('Failed to initialize audio context');
        }
    }

    async load() {
        if (!this.context) {
            this.init();
        }

        if (this.buffer !== null || !this.context) {
            return;
        }

        const file = await fetch(this.filename);
        const raw = await file.arrayBuffer();
        await this.context.decodeAudioData(raw, (data) => this.buffer = data);
    }

    async play(sound) {
        if (!this.loaded) {
            this.loaded = true;
            await this.load();
        }

        const { start, end } = this.markers[sound] || { start: 0, end: 0 };
        const source = this.context.createBufferSource();
        source.buffer = this.buffer;
        source.connect(this.context.destination);
        source.start(0, start, end - start);
    }
};
