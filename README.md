# scale.js
High-quality scale function for canvas and image element.
If scale factor < 1, then algorithm for downscale is used, other than that, bicubic algorithm is used.

## How to use
Please use dist/scale.min.js, src/scale.js dose not work.

    <html><body>
      <canvas id="canvas1"></canvas>
      <img id="image2" src="..." />
      <img id="image3" src="..." />
      <script src="dist/scale.min.js" />
      <script>
      (function(){
        // scale function return CanvasElement
        var newCanvas1 = scale(document.getElementById("canvas1"), 0.7, true);
        var newCanvas2 = scale(document.getElementById("image2"), {scaleX:1.7,scaleY:1.4}, true);
        var newCanvas3 = scale(document.getElementById("image3"), {width:100,height:200}, true);
      })();
      </script>
    </body></html>
