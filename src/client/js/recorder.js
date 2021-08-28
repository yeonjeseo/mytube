import { async } from "regenerator-runtime";

const recordBtn = document.getElementById("recordBtn");
const video = document.getElementById("preview");

// global variables
let isRecording = false;
let stream;
let record;
const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audoi: false,
    video: true,
  });
  video.srcObject = stream;
  video.play();
};
init();

const handleRecording = (event) => {
  if (!isRecording) {
    startRecording(event);
    isRecording = true;
  } else {
    stopRecording(event);
    isRecording = false;
  }
};

const startRecording = (event) => {
  record = new MediaRecorder(stream);

  record.ondataavailable = (e) => {
    console.log(e.data);
    const videoFile = URL.createObjectURL(e.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  record.start();
  event.target.textContent = "Stop Recording";
};

const stopRecording = (event) => {
  record.stop();
  event.target.textContent = "Start Recording";
};

recordBtn.addEventListener("click", handleRecording);
