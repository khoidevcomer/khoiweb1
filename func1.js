 // Cleaned-up audio play logic.
// Behavior: when user clicks the Scream button it will play the sound.
// Additional clicks while the sound is playing are ignored until playback finishes.
document.addEventListener('DOMContentLoaded', function () {
    // Use the existing <audio id="myAudio"> element in the page when present.
    const audioElem = document.getElementById('myAudio') || new Audio();
    const playBtn = document.getElementById('playScrem');

    // Guard: if there's no button, nothing to wire.
    if (!playBtn) return;

    let isPlaying = false;

    function lockPlayback() {
        isPlaying = true;
        playBtn.disabled = true;
    }

    function unlockPlayback() {
        isPlaying = false;
        playBtn.disabled = false;
    }

    function playSound(src) {
        if (isPlaying) return; // ignore extra clicks while playing
        lockPlayback();

        // If the page has an <audio> element, overwrite its src so we reuse the element.
        try {
            if (audioElem.tagName && audioElem.tagName.toLowerCase() === 'audio') {
                // set new source and load it
                audioElem.pause();
                audioElem.src = src;
                audioElem.load();
            } else {
                // fallback to Audio object
                audioElem.src = src;
            }
        } catch (e) {
            // if anything odd happens, still attempt to play via a new Audio
            console.warn('Error setting audio src on element, falling back to new Audio()', e);
            const fallback = new Audio(src);
            fallback.play().catch(err => { console.warn('Playback failed', err); unlockPlayback(); });
            fallback.addEventListener('ended', unlockPlayback);
            return;
        }

        audioElem.currentTime = 0;
        const playPromise = audioElem.play();
        if (playPromise && typeof playPromise.then === 'function') {
            playPromise.catch(err => {
                // play() can be rejected by browser autoplay/policy — unlock the button so user can try again
                console.warn('Audio playback failed:', err);
                unlockPlayback();
            });
        }
    }

    // Wire the button to play scream.mp3 (relative to project root)
    playBtn.addEventListener('click', function (e) {
        e.preventDefault();
        playSound('scream.mp3');
    });

    // When audio ends, allow the button to be used again.
    if (audioElem && audioElem.addEventListener) {
        audioElem.addEventListener('ended', unlockPlayback);
        // also handle pause (user/other code paused it) — treat as unlocked
        audioElem.addEventListener('pause', function () {
            // if paused but not ended, we still unlock so user can restart
            if (!audioElem.ended) unlockPlayback();
        });
    }
});
