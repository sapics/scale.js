# scale.js
High-quality scale function for canvas and image element.
If scale factor < 1, then algorithm for downscale is used, other than that, bicubic algorithm is used.

## How to use
Please use dist/scale.min.js, because src/scale.js dose not work.

    <html><body>
      <canvas id="inputCanvas"></canvas>
      <img id="inputImage" src="..." />
      <canvas id="exportCanvas"></canvas>
      
      <script src="dist/scale.min.js" />
      <script>
      (function(){
        var inputCanvas = document.getElementById("inputCanvas");
        var inputImage = document.getElementById("inputImage");

        var newCanvas1 = scale(0.7,
                               inputCanvas);
        var newCanvas2 = scale({scaleX:1.7, scaleY:1.4},
                               inputImage,
                               document.getElementById("exportCanvas2"));
        var jpegImage  = scale({width:100, height:200},
                               inputCanvas,
                               'jpeg');
        var pngSrc     = scale(0.7,
                               inputCanvas,
                               'png-src');
      })();
      </script>
    </body></html>

## Licence
MIT Licence
