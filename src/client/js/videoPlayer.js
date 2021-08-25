const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volume = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

// global variables
video.volume = 0.5;
let tempVolume = 0;

// define handler
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
  if (video.muted) {
    video.muted = false;
    volume.value = tempVolume;
  } else {
    //save current range value
    tempVolume = volume.value;
    volume.value = "0";
    video.muted = true;
  }

  muteBtn.textContent = video.muted ? "Unmute" : "Mute";
};

const handleVolume = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted && value !== 0) {
    video.muted = false;
    muteBtn.textContent = "Mute";
  }
  tempVolume = value;
  video.volume = value;
};

//display total duration

// define event listener
playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMute);
volume.addEventListener("input", handleVolume);
