const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volume = document.getElementById("volume");

const handlePlay = (e) => {
  //if video is playing -> pause
  console.log(video);
  video.paused
    ? (() => {
        video.play();
        playBtn.textContent = "Stop";
      })()
    : (() => {
        video.pause();
        playBtn.textContent = "Play";
      })();
  // else -> play
};

const handleMute = () => {
  // if muted -> volume on
  video.muted ? (video.muted = false) : (video.muted = true);
  //if volume on -> mute
};

const handlePause = () => {};

playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMute);
volume.addEventListener("input", (e) => {
  console.log(e);
  console.log("Volume Changed!");
});

// create an event when video is paused
video.addEventListener("pause", handlePause);
