import * as tf from "@tensorflow/tfjs";
import { renderBoxes } from "./renderBox";


const preprocess = (source, modelWidth, modelHeight) => {
  let xRatio, yRatio; // ratios for boxes

  const input = tf.tidy(() => {
    const img = tf.browser.fromPixels(source);

    // padding image to square => [n, m] to [n, n], n > m
    const [h, w] = img.shape.slice(0, 2); // get source width and height
    const maxSize = Math.max(w, h); // get max size
    const imgPadded = img.pad([
      [0, maxSize - h], // padding y [bottom only]
      [0, maxSize - w], // padding x [right only]
      [0, 0],
    ]);

    xRatio = maxSize / w; // update xRatio
    yRatio = maxSize / h; // update yRatio

    return tf.image
      .resizeBilinear(imgPadded, [modelWidth, modelHeight]) // resize frame
      .div(255.0) // normalize
      .expandDims(0); // add batch
  });

  return [input, xRatio, yRatio];
};


export const detectImage = async (
  imgSource,
  model,
  classThreshold,
  canvasRef
) => {
  const [modelWidth, modelHeight] = model.inputShape.slice(1, 3); // get model width and height

  tf.engine().startScope(); // start scoping tf engine
  const [input, xRatio, yRatio] = preprocess(
    imgSource,
    modelWidth,
    modelHeight
  );

  await model.net.executeAsync(input).then((res) => {
    const [boxes, scores, classes] = res.slice(0, 3);
    const boxes_data = boxes.dataSync();
    const scores_data = scores.dataSync();
    const classes_data = classes.dataSync();
    renderBoxes(
      canvasRef,
      classThreshold,
      boxes_data,
      scores_data,
      classes_data,
      [xRatio, yRatio]
    ); // render boxes
    tf.dispose(res); // clear memory
  });

  tf.engine().endScope(); // end of scoping
};

export const detectVideo = (
  vidSource,
  model,
  classThreshold,
  canvasRef,
  setcountnumber
) => {
  const [modelWidth, modelHeight] = model.inputShape.slice(1, 3); // get model width and height

  /**
   * Function to detect every frame from video
   */
  const detectFrame = async () => {
    if (vidSource.videoWidth === 0 && vidSource.srcObject === null) {
      const ctx = canvasRef.getContext("2d");
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clean canvas
      return; // handle if source is closed
    }

    tf.engine().startScope(); // start scoping tf engine
    const [input, xRatio, yRatio] = preprocess(
      vidSource,
      modelWidth,
      modelHeight
    );

    await model.net.executeAsync(input).then((res) => {
      const [boxes, scores, classes] = res.slice(0, 3);
      //console.log("this's box : ", boxes.length);
      const boxes_data = boxes.dataSync();
      //console.log("this's boxes_data : ", boxes_data);

      const scores_data = scores.dataSync();
      const classes_data = classes.dataSync();
      renderBoxes(
        canvasRef,
        classThreshold,
        boxes_data,
        scores_data,
        classes_data,
        [xRatio, yRatio],
        setcountnumber
      ); // render boxes
      tf.dispose(res); // clear memory
    });

    requestAnimationFrame(detectFrame); // get another frame
    tf.engine().endScope(); // end of scoping
  };

  detectFrame(); // initialize to detect every frame
};
