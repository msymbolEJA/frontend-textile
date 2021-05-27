import React, { useEffect, useRef } from "react";
import { FONTS } from "../../helper/Constants";

const FontPreview = ({ id, font, text }) => {
  const canvasRef = useRef();
  const fontStyle =
    FONTS[process.env.REACT_APP_STORE_NAME_ORJ][font.replace(" ", "")];

  useEffect(() => {
    const canvas = canvasRef.current;
    //canvas.style.border = "2px solid black";

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.font = `14px Arial`;
    ctx.fillText(font, canvas.width / 2, 30);

    ctx.beginPath();
    for (let i = 0; i < canvas.width; i += 10) {
      const y = i / 100 === parseInt(i / 100) ? 0 : 10;
      ctx.moveTo(i + 15, y);
      ctx.lineTo(i + 15, 15);
      const x = i / 100 === parseInt(i / 100) ? 0 : 10;
      ctx.moveTo(x, i + 15);
      ctx.lineTo(15, i + 15);
    }
    ctx.strokeStyle = "black";
    ctx.stroke();

    let timer1 = setTimeout(() => {
      ctx.font = `80px "${fontStyle}"`;
      ctx.strokeStyle = "black";
      ctx.strokeText(text, canvas.width / 2, canvas.height / 2 + 45);
      ctx.fillStyle = "white";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 45);

      const data = canvas.toDataURL();

      // inject the image data into a link, creating a downloadable file
      const link = document.getElementById(`link${id}`);
      link.setAttribute(
        "href",
        "data:application/octet-stream;charset=utf-16le;" + data
      );
      link.setAttribute("download", "image.png");
    }, 2500);
    return () => {
      clearTimeout(timer1);
    };
  }, [font, fontStyle, id, text]);

  return (
    <>
      <a href="/#" id={`link${id}`}>
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          style={{ width: "100%" }}
        ></canvas>
        <p style={{ fontFamily: fontStyle, margin: 0 }}>Download</p>
      </a>
    </>
  );
};

export default FontPreview;
