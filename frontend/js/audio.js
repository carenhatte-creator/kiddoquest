// ===================================
// KinderQuest — Shared Audio System
// Web Audio API lang, walang audio files
// na kailangan. Sinusunod nito ang Sound
// at Music toggle mula sa Settings page
// (localStorage: kq_sound_settings).
// ===================================

const KQAudio = (function(){

    let audioCtx = null;

    function getContext(){

        if(!audioCtx){

            audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        }

        // Kailangan i-resume kung na-suspend
        // (madalas mangyari bago pa unang click)

        if(audioCtx.state === "suspended"){

            audioCtx.resume();

        }

        return audioCtx;

    }

    function getSettings(){

        try{

            return JSON.parse(

                localStorage.getItem("kq_sound_settings")

            ) || { sound: true, music: true, volume: 70 };

        }catch(err){

            return { sound: true, music: true, volume: 70 };

        }

    }


    // ===================================
    // PLAY A SINGLE TONE
    // ===================================

    function playTone(frequency, duration, type, startTime, volumeMultiplier){

        const settings = getSettings();

        if(!settings.sound) return;

        try{

            const ctx = getContext();

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = type || "sine";
            osc.frequency.value = frequency;

            const vol =
            (settings.volume / 100) * 0.3 * (volumeMultiplier || 1);

            const when = ctx.currentTime + (startTime || 0);

            gain.gain.setValueAtTime(vol, when);

            gain.gain.exponentialRampToValueAtTime(

                0.001,
                when + duration

            );

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(when);
            osc.stop(when + duration);

        }catch(err){

            console.log("Audio error:", err);

        }

    }


    // ===================================
    // SOUND EFFECTS
    // ===================================

    function playCorrect(){

        playTone(523.25, 0.15, "sine", 0);
        playTone(659.25, 0.15, "sine", 0.12);
        playTone(783.99, 0.25, "sine", 0.24);

    }

    function playWrong(){

        playTone(220, 0.25, "sawtooth", 0, 0.5);
        playTone(160, 0.3, "sawtooth", 0.15, 0.5);

    }

    function playClick(){

        playTone(600, 0.06, "square", 0, 0.35);

    }

    function playFinish(){

        playTone(523.25, 0.15, "sine", 0);
        playTone(659.25, 0.15, "sine", 0.15);
        playTone(783.99, 0.15, "sine", 0.30);
        playTone(1046.5, 0.35, "sine", 0.45);

    }


    // ===================================
    // BACKGROUND MUSIC (simpleng paulit-ulit
    // na melody, tumitigil kapag naka-OFF
    // ang Music toggle)
    // ===================================

    let musicInterval = null;
    let musicPlaying = false;
    let noteIndex = 0;

    const musicNotes = [523.25, 587.33, 659.25, 783.99, 659.25, 587.33];

    function startMusic(){

        const settings = getSettings();

        if(!settings.music) return;

        if(musicPlaying) return;

        musicPlaying = true;
        noteIndex = 0;

        musicInterval = setInterval(() => {

            const current = getSettings();

            if(!current.music){

                stopMusic();

                return;

            }

            playTone(

                musicNotes[noteIndex % musicNotes.length],
                0.35,
                "sine",
                0,
                0.12

            );

            noteIndex++;

        }, 450);

    }

    function stopMusic(){

        musicPlaying = false;

        if(musicInterval){

            clearInterval(musicInterval);
            musicInterval = null;

        }

    }


    return {

        playCorrect,
        playWrong,
        playClick,
        playFinish,
        startMusic,
        stopMusic

    };

})();

window.KQAudio = KQAudio;