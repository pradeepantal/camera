import { useEffect, useRef, useState } from "react";
import "../app/globals.css";
import styles from "./home.module.css";

function Home() {
  var videoRef = useRef(null);
  var canvasRef = useRef(null);
  var imageRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [photos, setPhotos] = useState("");
  const [showVideo, setShowVideo] = useState(true);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    startCamera();
  }, []);

  async function startCamera() {
    let selected = await getDevices();
    const videoConstraints = {
      deviceId: {
        exact: selected,
      },
      width: 200,
      height: 300,
    };
    let c = {
      video: videoConstraints,
      audio: false,
    };
    navigator.mediaDevices.getUserMedia(c).then((s) => {
      let video = videoRef.current;
      setStream(s);
    });
  }

  async function start() {
    let video = videoRef.current;
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
      //});
    });
  }

  const stop = () => {
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    setStream(null);
  };

  async function photo() {
    let can = canvasRef.current;
    let v = videoRef.current;
    can.width = 300;
    can.height = 200;
    can.getContext("2d").drawImage(v, 0, 0, 200, 300);
    const imageDataUrl = can.toDataURL("image/jpeg");
   // setPhotos(imageDataUrl);
    setStream(null);
    setShowVideo(false)

  }

  async function getDevices() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log("enumerated devices not supported");
      return false;
    }
    await navigator.mediaDevices.getUserMedia({ video: true });
    let allDevices = await navigator.mediaDevices.enumerateDevices();
    const videoInputDevices = allDevices.filter(
      (device) => device.kind === "videoinput"
    );
    return videoInputDevices[0].deviceId;
  }

  return (
    <>
      <div className="grid  items-center justify-items-center min-h-screen ">
        {showVideo ? 
        <div className={`${styles.video} `}>
          <video
            width="400"
            height="300"
            ref={videoRef}
            playsInline
            autoPlay
          ></video>
        </div>
       : null }
        <div>
         
        <div>
        <canvas id="canvas" ref={canvasRef}></canvas>
        </div>
    
        <div className="grid grid-cols-2 gap-2">
            <button className={`${styles.playButton} `} onClick={start}>
              Start
            </button>
            <button className={`${styles.playButton} `} onClick={photo}>
              Photo
            </button>
        </div>
        
        </div>
      </div>
    </>
  );
}

export default Home;
