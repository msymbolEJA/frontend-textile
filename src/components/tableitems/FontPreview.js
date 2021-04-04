import React, { useEffect, useRef } from "react";
import { FONTS } from "../../helper/Constants";

const FontPreview = ({ font, text }) => {
  const canvasRef = useRef();
  useEffect(() => {
    var canvas = canvasRef.current;
    //canvas.style.border = "2px solid black";

    var ctx = canvas.getContext("2d");
    console.log("canvas", canvas);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.font = `14px Arial`;
    ctx.fillText(font, canvas.width / 2, 30);

    const fontStyle =
      FONTS[process.env.REACT_APP_STORE_NAME_ORJ][font.replace(" ", "")];
    ctx.font = `${
      fontStyle.includes("Harlow Solid") ? "italic" : ""
    } 80px "${fontStyle}"`;

    ctx.strokeStyle = "black";
    ctx.strokeText(text, canvas.width / 2, canvas.height / 2 + 45);
    ctx.fillStyle = "white";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 45);

    ctx.beginPath();
    for (var i = 0; i < canvas.width; i += 10) {
      var y = i / 100 === parseInt(i / 100) ? 0 : 10;
      ctx.moveTo(i + 15, y);
      ctx.lineTo(i + 15, 15);
      var x = i / 100 === parseInt(i / 100) ? 0 : 10;
      ctx.moveTo(x, i + 15);
      ctx.lineTo(15, i + 15);
    }
    ctx.strokeStyle = "black";
    ctx.stroke();

    /*     const oneCm = getDPI() / 2.54;
    canvas.width = 8.56 * oneCm;
    canvas.height = 8.56 * oneCm;
    canvas.style.width = `${8.56 * oneCm}px`;
    canvas.style.height = `${8.56 * oneCm}px`; */

    var data = canvas.toDataURL(); // extract the image data

    // inject the image data into a link, creating a downloadable file
    var link = document.getElementById("link");
    link.setAttribute(
      "href",
      "data:application/octet-stream;charset=utf-16le;" + data
    );
    link.setAttribute("download", "image.png");

    /////////////////////////////////////////////
  }, []);

  return (
    <div>
      <a href="#" id="link">
        <canvas ref={canvasRef} width={400} style={{ width: "100%" }}></canvas>
      </a>
    </div>
  );
};

export default FontPreview;
