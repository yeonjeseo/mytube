const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volume = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const timeline = document.getElementById("timeline");
const fullscreenBtn = document.getElementById("fullscreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

// global variables
video.volume = 0.5;
let tempVolume = 0;
let timeOutId = null;
let mouseMoveId = null;

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

const timeFormatter = (seconds) => {
  return new Date(seconds * 1000).toISOString().slice(11, 19);
};

//display total duration
const handleLoadedMetadata = () => {
  totalDuration = Math.floor(video.duration);
  duration.textContent = timeFormatter(totalDuration);
  timeline.max = totalDuration.toString();
  console.log(timeline.max);
};

const handleTimeUpdate = () => {
  //current time change
  currentTime.textContent = timeFormatter(Math.floor(video.currentTime));
  //change input range
  timeline.value = video.currentTime;
};

// handle timeline
const handleTimeline = (event) => {
  video.currentTime = event.target.value;
};

const handleFullScreen = () => {
  if (!document.fullscreenElement) {
    videoContainer.requestFullscreen();
    fullscreenBtn.innerText = "Exit Full Screen";
  } else {
    document.exitFullscreen();
    fullscreenBtn.innerText = "Enter Full Screen";
  }
};

const handleMouseMove = () => {
  // if (mouseMoveId || timeOutId) {
  //   clearTimeout(mouseMoveId);
  //   clearTimeout(timeOutId);
  //   mouseMoveId = null;
  //   timeOutId = null;
  // }

  if (mouseMoveId) {
    clearTimeout(mouseMoveId);
    mouseMoveId = null;
  }
  if (timeOutId) {
    clearTimeout(timeOutId);
    timeOutId = null;
  }

  videoControls.classList.add("showControls");

  mouseMoveId = setTimeout(() => {
    console.log("mouse stopped!");
    videoControls.classList.remove("showControls");
  }, 2000);
};

const handleMouseLeave = () => {
  timeOutId = setTimeout(() => {
    videoControls.classList.remove("showControls");
  }, 2000);
};
// define event listener
playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMute);
volume.addEventListener("input", handleVolume);
timeline.addEventListener("input", handleTimeline);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
fullscreenBtn.addEventListener("click", handleFullScreen);
