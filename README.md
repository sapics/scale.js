# scale.js
High-quality scale function for canvas and image element.
If scale factor < 1, then algorithm for downscale is used, other than that, bicubic algorithm is used.

## How to use
Please use dist/scale.min.js, src/scale.js dose not work.

    <html><body>
      <canvas id="inputCanvas"></canvas>
      <img id="inputImage" src="..." />
      <canvas id="exportCanvas"></canvas>
      
      <script src="dist/scale.min.js" />
      <script>
      (function(){
        var inputCanvas = document.getElementById("inputCanvas");
        var inputImage = document.getElementById("inputImage");
        // scale function return CanvasElement
        var newCanvas1 = scale(inputCanvas,
                               0.7);
        var newCanvas2 = scale(inputImage,
                               {scaleX:1.7, scaleY:1.4},
                               document.getElementById("exportCanvas2"));
        var jpegImage  = scale(inputCanvas,
                               {width:100, height:200},
                               'jpeg');
        var pngSrc     = scale(inputCanvas,
                               0.7,
                               'png-src');
      })();
      </script>
    </body></html>

## Licence
MIT Licence
