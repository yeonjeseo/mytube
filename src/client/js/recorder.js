import { async } from "regenerator-runtime";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const recordBtn = document.getElementById("recordBtn");
const video = document.getElementById("preview");

// global variables
let isRecording = false;
let stream;
let record;
let videoFile;

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  video.srcObject = stream;
  video.play();
};
init();

const handleDownload = async () => {
  // create FFmpeg instance
  const ffmpeg = createFFmpeg({
    corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
    log: true,
  });
  await ffmpeg.load();
  // videoFile is pointer to browser memory, but itself is a blob
  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));
  //ffmpeg cli command
  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");

  const mp4File = ffmpeg.FS("readFile", "output.mp4");
  // unsigned integer
  console.log(mp4File);
  console.log(mp4File.buffer);

  const mp4blob = new Blob([mp4File.buffer], { type: "video/mp4" });

  const mp4Url = URL.createObjectURL(mp4blob);

  const a = document.createElement("a");
  a.href = mp4Url;
  a.download = "MyRecording.mp4";
  document.body.appendChild(a);
  a.click();
};

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
    videoFile = URL.createObjectURL(e.data);
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
  handleDownload();
};

recordBtn.addEventListener("click", handleRecording);
