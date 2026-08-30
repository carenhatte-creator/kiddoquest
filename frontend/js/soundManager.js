// ==========================================================
// KinderQuest - SHARED SOUND MANAGER
// ==========================================================
// I-link ito BAGO yung games-js/<game>.js sa bawat game HTML:
//
//   <script src="../../js/utils/soundManager.js"></script>
//   <script src="../games-js/color-match.js"></script>
//
// (i-adjust ang path kung saan mo ilalagay - sinunod lang
// dito yung parehong pattern ng "../../image/")
//
// Kumukuha ito ng settings mula sa Settings page
// (localStorage key: "kq_sound_settings"), kaya kapag
// na-off ng teacher/parent ang Sound Effects o Background
// Music, o binaba ang Volume, awtomatikong susunod ang
// lahat ng games - walang extra code na kailangan bukod
// sa pagtawag ng mga function sa ibaba.
// ==========================================================

(function () {

    const SETTINGS_KEY = "kq_sound_settings";

    const DEFAULT_SETTINGS = {
        sound: true,
        music: true,
        volume: 70
    };


    // ==========================================
    // READ SETTINGS (parehong function na
    // ginagamit ng settings.js)
    // ==========================================

    function readSettings() {

        try {

            const saved = JSON.parse(
                localStorage.getItem(SETTINGS_KEY)
            );

            return saved
                ? { ...DEFAULT_SETTINGS, ...saved }
                : { ...DEFAULT_SETTINGS };

        } catch (err) {

            return { ...DEFAULT_SETTINGS };

        }

    }


    // ==========================================
    // AUDIO CONTEXT (synthesized sounds -
    // walang external audio files)
    // ==========================================

    let ctx = null;

    function getContext() {

        if (!ctx) {

            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            ctx = new AudioCtx();

        }

        if (ctx.state === "suspended") {

            ctx.resume();

        }

        return ctx;

    }

    function tone(freq, startTime, duration, type, peak, volumeMultiplier) {

        const audioCtx = getContext();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);

        const peakVolume = peak * volumeMultiplier;

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(peakVolume, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);

    }


    // ==========================================
    // SFX: CLICK
    // ==========================================

    function playClick() {

        const settings = readSettings();

        if (!settings.sound) return;

        const volume = settings.volume / 100;
        const t = getContext().currentTime;

        tone(880, t, 0.09, "triangle", 0.22, volume);

    }


    // ==========================================
    // SFX: BUTTON (Back / Next / atbp.)
    // ==========================================

    function playButton() {

        const settings = readSettings();

        if (!settings.sound) return;

        const volume = settings.volume / 100;
        const t = getContext().currentTime;

        tone(392, t, 0.09, "sine", 0.2, volume);
        tone(523.25, t + 0.05, 0.12, "sine", 0.18, volume);

    }


    // ==========================================
    // SFX: CORRECT (tawagin kasabay ng
    // showStarReward())
    // ==========================================

    function playCorrect() {

        const settings = readSettings();

        if (!settings.sound) return;

        const volume = settings.volume / 100;
        const t = getContext().currentTime;

        const notes = [523.25, 659.25, 783.99]; // C5 E5 G5

        notes.forEach((freq, i) => {

            tone(freq, t + i * 0.1, 0.35, "triangle", 0.25, volume);

        });

        tone(1046.5, t + 0.32, 0.4, "triangle", 0.22, volume); // C6 sparkle

    }


    // ==========================================
    // SFX: WRONG
    // ==========================================

    function playWrong() {

        const settings = readSettings();

        if (!settings.sound) return;

        const volume = settings.volume / 100;
        const t = getContext().currentTime;

        tone(349.23, t, 0.18, "sine", 0.16, volume);      // F4
        tone(311.13, t + 0.15, 0.28, "sine", 0.16, volume); // Eb4

    }


    // ==========================================
    // BACKGROUND MUSIC (pentatonic loop)
    // ==========================================

    const melody = [
        523.25, 587.33, 659.25, 587.33,
        523.25, 440.00, 523.25, 659.25,
        698.46, 659.25, 587.33, 523.25,
        440.00, 523.25, 587.33, 440.00
    ];

    let musicTimer = null;
    let musicNoteIndex = 0;
    const noteDuration = 0.4;

    function scheduleNextNote() {

        const settings = readSettings();

        // Kung na-off ang music habang tumutugtog,
        // itigil na dito.
        if (!settings.music) {

            musicTimer = null;
            return;

        }

        const volume = settings.volume / 100;
        const t = getContext().currentTime;

        tone(
            melody[musicNoteIndex % melody.length],
            t,
            noteDuration * 0.85,
            "triangle",
            0.09,
            volume
        );

        musicNoteIndex++;

        musicTimer = setTimeout(scheduleNextNote, noteDuration * 1000);

    }

    function startBackgroundMusic() {

        const settings = readSettings();

        if (!settings.music) return;

        if (musicTimer) return; // tumutugtog na

        musicNoteIndex = 0;
        scheduleNextNote();

    }

    function stopBackgroundMusic() {

        clearTimeout(musicTimer);
        musicTimer = null;

    }


    // ==========================================
    // Kung binago ng teacher ang Sound/Music
    // settings sa ibang tab (Settings page),
    // isali rito para agad sumunod ang laro.
    // ==========================================

    window.addEventListener("storage", (e) => {

        if (e.key !== SETTINGS_KEY) return;

        const settings = readSettings();

        if (!settings.music && musicTimer) {

            stopBackgroundMusic();

        } else if (settings.music && !musicTimer) {

            startBackgroundMusic();

        }

    });


    // ==========================================
    // EXPOSE GLOBALLY (para magamit ng bawat
    // game js gaya ng showStarReward())
    // ==========================================

    window.soundManager = {

        playClick,
        playButton,
        playCorrect,
        playWrong,
        startBackgroundMusic,
        stopBackgroundMusic

    };


    // ==========================================
    // FLAT GLOBAL ALIASES
    // (para gumana ang lumang code na
    // gumagamit ng window.playButton() atbp.
    // direkta, hindi lang window.soundManager.x())
    // ==========================================

    window.playClick = playClick;
    window.playButton = playButton;
    window.playCorrect = playCorrect;
    window.playWrong = playWrong;
    window.startBackgroundMusic = startBackgroundMusic;
    window.stopBackgroundMusic = stopBackgroundMusic;

})();