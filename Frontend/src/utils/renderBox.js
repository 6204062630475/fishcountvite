import { useState } from "react";
import labels from "./labels.json";
import { EuclideanDistTracker } from "./tracker";

let tracker = new EuclideanDistTracker();

let a = 0;

export const renderBoxes = (
  canvasRef,
  classThreshold,
  boxes_data,
  scores_data,
  classes_data,
  ratios,
  setcountnumber
) => {
  const ctx = canvasRef.getContext("2d");
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clean canvas

  // font configs
  const font = `${Math.max(
    Math.round(Math.max(ctx.canvas.width, ctx.canvas.height) / 40),
    14
  )}px Arial`;
  ctx.font = font;
  ctx.textBaseline = "top";
  let detectionspush = []; //
  for (let i = 0; i < scores_data.length; ++i) {
    // filter based on class threshold
    if (scores_data[i] > classThreshold) {
      a = i + 1;

      const classlabel = labels[classes_data[i]];
      // const score = (scores_data[i] * 100).toFixed(1);

      let [x1, y1, x2, y2] = boxes_data.slice(i * 4, (i + 1) * 4);
      x1 *= canvasRef.width * ratios[0];
      x2 *= canvasRef.width * ratios[0];
      y1 *= canvasRef.height * ratios[1];
      y2 *= canvasRef.height * ratios[1];
      const width = x2 - x1;
      const height = y2 - y1;

      let cx = parseInt((x1 + x1 + width) / 2);
      let cy = parseInt((y1 + y1 + height) / 2);

      // Set styling
      ctx.strokeStyle = "red";
      ctx.font = "18px Arial";
      // Draw rectangles and text
      ctx.beginPath();
      ctx.fillStyle = "red";
      //ctx.fillText(classlabel, x1, y1-20);
      ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.rect(x1, y1, width, height);
      ctx.stroke();
      detectionspush.push([x1, y1, width, height]);
    }
  }
  //console.log("fish :", a);
  setcountnumber(a);

  //object tracking
  const boxes_ids = tracker.update(detectionspush);
  for (let box_id of boxes_ids) {
    let [x1, y1, width, height, id] = box_id;
    ctx.fillStyle = "yellow";
    ctx.fillText(id, x1 + 15, y1 - 20);
    //console.log(id)
  }
};
