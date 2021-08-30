import { async } from "regenerator-runtime";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const recordBtn = document.getElementById("recordBtn");
const video = document.getElementById("preview");

// global variables
let isRecording = false;
let stream;
let record;
let videoFile;

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "tthumbnail.jpg",
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      width: 1024,
      height: 576,
    },
  });
  video.srcObject = stream;
  video.play();
};
init();

const downloadFiles = (fileName, fileUrl) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};
const handleDownload = async () => {
  // create FFmpeg instance
  const ffmpeg = createFFmpeg({
    corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
    log: true,
  });
  await ffmpeg.load();
  // videoFile is pointer to browser memory, but itself is a blob
  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
  //ffmpeg cli command
  await ffmpeg.run("-i", files.input, "-r", "60", files.output);
  // capture thumbnail
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  );

  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image:jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFiles("Myrecording.mp4", mp4Url);
  downloadFiles("Thumbnail.jpg", thumbUrl);

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);
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
