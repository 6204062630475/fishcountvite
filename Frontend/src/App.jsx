import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import CustomizedProgressBars from "./components/HomePage/loader";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import ButtonHandler from "./components/HomePage/btn-handler";
import { detectImage, detectVideo } from "./utils/detect";
import "./style/App.css";
import Navbar from "./components/Navbar";
import History from "./components/HistoryPage/History";
import { Webcam } from "./utils/webcam";

const App = () => {
  //part1
  const webcam = new Webcam();
  const [streaming, setStreaming] = useState(null); // streaming state
  const [countnumber, setcountnumber] = useState(0);
  const [page, setPage] = useState("home");
  //part2
  const [loading, setLoading] = useState({ loading: true, progress: 0 }); // loading state
  const [model, setModel] = useState({
    net: null,
    inputShape: [1, 0, 0, 3],
  }); // init model & input shape

  // references
  const imageRef = useRef(null);
  const cameraRef = useRef(null);
  const canvasRef = useRef(null);

  // model configs
  const modelName = "fishtrainIV0.89_web_model";
  const classThreshold = 0.7;

  //handleปุ่มบน Navbar
  const getHistory = () => {
    setPage("history");
    if (streaming === "camera") {
      webcam.close(cameraRef.current);
      setStreaming(null);
    }
  };
  const getHome = () => {
    setPage("home");
    setStreaming(null);
  };

  useEffect(() => {
    tf.ready().then(async () => {
      const yolov5 = await tf.loadGraphModel(
        `${window.location.href}/${modelName}/model.json`,
        {
          onProgress: (fractions) => {
            setLoading({ loading: true, progress: fractions }); // set loading fractions
          },
        }
      ); // load model

      // warming up model
      const dummyInput = tf.ones(yolov5.inputs[0].shape);
      const warmupResult = await yolov5.executeAsync(dummyInput);
      tf.dispose(warmupResult); // cleanup memory
      tf.dispose(dummyInput); // cleanup memory

      setLoading({ loading: false, progress: 1 });
      setModel({
        net: yolov5,
        inputShape: yolov5.inputs[0].shape,
      }); // set model & input shape
      console.log("OpenApp");
    });
  }, []);

  return (
    <div className="App">
      <Navbar ButtonHome={getHome} ButtonHistory={getHistory} />
      
      {loading.loading && (
        <CustomizedProgressBars
          progress={Math.round(loading.progress * 100)}
          open={loading.loading}
        />
      )}

      {/* หน้าแรก */}
      {page === "home" && (
        <div className="header">
          <h1>Counting Fish Application</h1>
          <p>
            <code className="code">{modelName}</code>
          </p>
          <div className="content">
            {/* <img
            src="#"
            ref={imageRef}
            onLoad={() => detectImage(imageRef.current, model, classThreshold, canvasRef.current)}
          /> */}
            <video
              autoPlay
              muted
              ref={cameraRef}
              onPlay={() =>
                detectVideo(
                  cameraRef.current,
                  model,
                  classThreshold,
                  canvasRef.current,
                  setcountnumber
                )
              }
            />

            <canvas
              width={model.inputShape[1]}
              height={model.inputShape[2]}
              ref={canvasRef}
            />
          </div>
          <ButtonHandler
            imageRef={imageRef}
            cameraRef={cameraRef}
            countnumber={countnumber}
            webcam={webcam}
            streaming={streaming}
            setStreaming={setStreaming}
          />
        </div>
      )}
      {/* หน้าประวัติการนับ */}
      {page === "history" && (
        <div className="History">
          <History />
        </div>
      )}
    </div>
  );
};

export default App;
