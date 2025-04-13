import camera from '../app/components/camera';




import { useEffect, useRef, useState } from "react";
import "../app/globals.css";
import styles from "./home.module.css";
import Stream from "stream";

interface Media {
  stream: null;
  videoRef: null;
}
function Home() {
  var videoRef = useRef(null);
  var canvasRef = useRef(null);
  var imageRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [photos, setPhotos] = useState("");

  useEffect(() => {
    camera.startCamera();
    //camera.takeSnapshot();

  }, []);

 

  return (
    <>
      <div className="grid  items-center justify-items-center min-h-screen ">
        <div className={`${styles.video} `}>
          <video
           id="video"
            width="300"
            height="300"
            ref={videoRef}
            playsInline
            autoPlay
          ></video>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-2">
            {/* <button className={`${styles.playButton} `} onClick={start}>
              Start
            </button>
            <button className={`${styles.playButton} `} onClick={photo}>
              Stop
            </button> */}

          </div>
          <canvas id="canvas" ref={canvasRef}></canvas>
          
          <img
            src={photos}
            id="photo"
            ref={imageRef}
            alt="Captured photo will appear here"
          ></img>
        </div>
      </div>
    </>
  );
}

export default Home;
