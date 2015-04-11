# scale.js
High-quality scale function for canvas and image element.
If scale factor < 1, then algorithm for downscale is used, other than that, bicubic algorithm is used.

## How to use
Please use dist/scale.min.js, src/scale.js dose not work.

    <html>
      <head>
      </head>
      <body>
        <canvas id="srcCanvas1"></canvas>
        <img id="srcImage2" src="..." />
        <img id="srcImage3" src="..." />
        <script src="dist/scale.min.js" />
        <script>
          var newCanvas1 = scale(document.getElementById("srcCanvas1"), 0.7, true);
          var newCanvas2 = scale(document.getElementById("srcImage2"), {scaleX:1.7, scaleY:1.4}, true);
          var newCanvas2 = scale(document.getElementById("srcImage3"), {width:100, height:200}, true);
        </script>
      </body>
    </html>
