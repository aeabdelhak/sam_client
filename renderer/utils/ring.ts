class audioNotif {
     static muted: boolean = false;
    static isPlaying: boolean = false;
    private static audio = new Audio("/Notification.mp3")
    static play() {
        audioNotif.isPlaying = true;
        audioNotif.audio.loop = true;
        audioNotif.audio.play();
    }
    static stop() {
        audioNotif.isPlaying = false;
        audioNotif.audio.pause()
        audioNotif.audio.currentTime = 0;
    }
    static unmute() {
        audioNotif.audio.muted=false
        audioNotif.muted = false
    }
    static mute() {
        audioNotif.audio.muted=true
        audioNotif.muted = true

    }


}

export default audioNotif