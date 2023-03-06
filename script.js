(function () {
  function init(event) {
    RectangleDrawer.addRectangler(document.body, 700);
  }

  document.addEventListener("DOMContentLoaded", init);
})();

var RectangleDrawer = {
  addRectangler: (element, size) => {
    var div = document.createElement("div");
    div.className = "area";
    div.style.height = size + "px";
    div.style.width = size + "px";
    element.appendChild(div);

    var gapX, gapY; // to use event.x and event.y
    var firstY, firstX; // initial drawing point
    var pickedY, pickedX; // picked point
    var rectangle = undefined; // rectangle to be drawn
    var text = undefined; // info text at top left of rectangle
    var picked = false; // rectangle picked for moving
    var drawing = false; // started rectangle draw
    var top, left; // reactangle current position
    var width, height; // rectangle current size
    var newTop, newLeft; // position while moving
    var resizing = 0;
    const sensitivity = 10;

    function createRect() {
      if (!rectangle) {
        rectangle = document.createElement("div");
        rectangle.className = "rect";
        div.appendChild(rectangle);

        text = document.createElement("div");
        text.className = "info";
        div.appendChild(text);

        console.log("--> Create Rect <--");
        draw(firstX, firstY);

        rectangle.addEventListener("mousedown", onRectMouseDown);
      }
    }

    function clearRect() {
      if (rectangle) {
        div.removeChild(rectangle);
        div.removeChild(text);
        rectangle = text = newTop = newLeft = undefined;
      }
    }

    var firstHeight, firstWidth;
    function draw(x, y) {
      if (rectangle) {
        var xDiff = x - firstX;
        var yDiff = y - firstY;

        var xDiffLen = Math.abs(xDiff);
        var yDiffLen = Math.abs(yDiff);

        console.log({ xDiff, yDiff, resizing });

        if (resizing > 0) {
          switch (resizing) {
            case 1:
              if (yDiff < firstHeight) {
                top = y;
                height = firstHeight - yDiff;
              } else {
                top = firstY + firstHeight;
                height = yDiff - firstHeight;
              }

              if (xDiff < firstWidth) {
                left = x;
                width = firstWidth - xDiff;
              } else {
                left = firstX + firstWidth;
                width = xDiff - firstWidth;
              }

              break;
            case 2:
              break;
            case 3:
              break;
            case 4:
              break;
            case 5:
              if (yDiff < 0 && yDiffLen > firstHeight) {
                top = y;
                height = yDiffLen - firstHeight;
              } else {
                height = firstHeight + yDiff;
              }

              if (xDiff < 0 && xDiffLen > firstWidth) {
                left = x;
                width = xDiffLen - firstWidth;
              } else {
                width = firstWidth + xDiff;
              }
              break;
            case 6:
              break;
            case 7:
              break;
            case 8:
              break;

            default:
              break;
          }
        } else {
          top = yDiff > 0 ? firstY : y;
          left = xDiff > 0 ? firstX : x;

          height = yDiffLen;
          width = xDiffLen;
        }

        top = top < 0 ? 0 : top;
        rectangle.style.top = top + "px";

        height = y < 0 ? firstY : height;
        height = top + height > size ? size - 2 - top : height;
        rectangle.style.height = height + "px";

        left = left < 0 ? 0 : left;
        rectangle.style.left = left + "px";

        width = x < 0 ? firstX : width;
        width = left + width > size ? size - 2 - left : width;
        rectangle.style.width = width + "px";

        text.innerHTML = height + " x " + width;
        alignTextPosition();
      }
    }

    var onRectMouseDown = function (event) {
      var x = event.x;
      var y = event.y;
      resizing = getResizing(x, y);

      if (resizing == 0) {
        picked = true;
        pickedY = y;
        pickedX = x;
      } else {
        drawing = true;
      }
    };

    var onAreaMouseDown = function (event) {
      const x = event.x;
      const y = event.y;

      if (!gapX && !gapY) {
        gapX = x - event.offsetX;
        gapY = y - event.offsetY;
        console.log({ gapX, gapY });
      }

      firstX = x - gapX;
      firstY = y - gapY;
      console.log({ firstX, firstY });

      if (!drawing && !picked && resizing == 0) {
        clearRect();
        createRect();
        drawing = true;
      }
    };

    function move(x, y) {
      newTop = top + y - pickedY;
      newLeft = left + x - pickedX;

      if (newTop > -1 && newTop + height < size) {
        rectangle.style.top = newTop + "px";
      }

      if (newLeft > -1 && newLeft + width < size) {
        rectangle.style.left = newLeft + "px";
      }
      alignTextPosition();
    }

    function alignTextPosition() {
      text.style.top = rectangle.style.top;
      text.style.left = rectangle.style.left;
    }

    var onDocumentMouseMove = function (event) {
      var x = event.x;
      var y = event.y;
      if (drawing) {
        draw(x - gapX, y - gapY);
      }
      if (picked) {
        move(x, y);
      }
      if (rectangle) {
        var r = getResizing(x, y);
        clearResizeCursor();
        if (r > 0) {
          rectangle.classList.add("resize" + r);
        }
      }
    };

    var onDocumentMouseUp = function (event) {
      if (picked) {
        top = newTop;
        left = newLeft;
        firstY = top;
        firstX = left;
      }
      if (drawing) {
        firstY = top;
        firstX = left;
        firstHeight = height;
        firstWidth = width;
      }
      drawing = false;
      picked = false;
      resizing = 0;
    };

    function clearResizeCursor() {
      for (let index = 1; index <= 8; index++) {
        rectangle.classList.remove("resize" + index);
      }
    }

    function getResizing(x, y) {
      var _resizing = 0;

      var _top = gapY + top;
      var _left = gapX + left;
      var _bottom = _top + height;
      var _right = _left + width;

      const nearTop = y < _top + sensitivity;
      const nearRight = x > _right - sensitivity;
      const nearBottom = y > _bottom - sensitivity;
      const nearLeft = x < _left + sensitivity;

      if (nearTop) _resizing = 2;
      if (nearRight) _resizing = 4;
      if (nearBottom) _resizing = 6;
      if (nearLeft) _resizing = 8;

      if (nearTop && nearLeft) _resizing = 1;
      if (nearTop && nearRight) _resizing = 3;
      if (nearBottom && nearRight) _resizing = 5;
      if (nearBottom && nearLeft) _resizing = 7;

      return _resizing;
    }

    div.addEventListener("mousedown", onAreaMouseDown);
    document.addEventListener("mouseup", onDocumentMouseUp);
    document.addEventListener("mousemove", onDocumentMouseMove);
  },
};
