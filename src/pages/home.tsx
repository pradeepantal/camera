import { useEffect, useRef, useState } from "react";
import "../app/globals.css";
import styles from "./home.module.css";
import axios from 'axios';

function Home() {
  var videoRef = useRef(null);
  var canvasRef = useRef(null);
  var imageRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [photos, setPhotos] = useState("");
  const [showVideo, setShowVideo] = useState(true);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [carNumber, setCarNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    can.width = 200;
    can.height = 300;
    can.getContext("2d").drawImage(v, 0, 0, 200, 300);
    const imageDataUrl = can.toDataURL("image/jpeg"); 
    setShowVideo(false);
    setStream(null);
    await processImage(imageDataUrl); 
  }


  const processImage = async (imageDataUrl: string) => {
    try {
      setLoading(true);
      const base64Data = imageDataUrl.replace(/^data:image\/jpeg;base64,/, '');

      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      };

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Extract Extract the car number (license plate) clearly visible in this image. Only return the number as it appears on the plate.' },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Data}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 300,
        },
        { headers }
      );

      const extractedData = response.data.choices[0].message.content;
      setCarNumber(extractedData);

      console.log('Extracted Data:', extractedData);
      // parseAndSetFormData(extractedData); // Uncomment if you define this
    } catch (error) {
      console.error('Error processing image with OpenAI Vision:', error);
      setCarNumber('Failed to extract number, Please try Again!')
    } finally {
      setLoading(false);
    }
  };


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
      <div className={`${styles.container}`}>
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
          : null}
        <div>

          <canvas id="canvas" ref={canvasRef}></canvas>

          <div className={`${styles.buttonGroup}`}>
            <button className={`${styles.playButton} `} onClick={start}>
              Start Capture
            </button>
            <button className={`${styles.playButton} `} onClick={photo}>
              Capture Photo
            </button>
          </div>

          {loading ? (
            "Extracting..."
          ) : carNumber ? (
            <div className={`${styles.extractedText}`}>
              The car number is: {carNumber}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default Home;
