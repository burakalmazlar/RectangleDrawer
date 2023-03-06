(function () {
  function init(event) {
    RectangleDrawer.addRectangler(document.body, 300);
    RectangleDrawer.addRectangler(document.body, 300);
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
    var firstTop, firstLeft; // initial drawing point
    var pickedTop, pickedLeft; // picked point
    var rectangle = undefined; // rectangle to be drawn
    var text = undefined; // info text at top left of rectangle
    var picked = false; // rectangle picked for moving
    var drawing = false; // started rectangle draw
    var top, left; // reactangle current position
    var width, height; // rectangle current size
    var newTop, newLeft; // position while moving
    var resizing = 0;

    function createRect() {
      if (!rectangle) {
        rectangle = document.createElement("div");
        rectangle.className = "rect";
        div.appendChild(rectangle);

        text = document.createElement("div");
        text.className = "info";
        div.appendChild(text);

        draw(firstLeft, firstTop);

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

    function draw(x, y) {
      if (rectangle) {
        var yDiff = y - firstTop;
        var xDiff = x - firstLeft;
        var xDiffLen = Math.abs(xDiff);
        var yDiffLen = Math.abs(yDiff);

        if (resizing != 2) { // if not vertical scaling
          top = yDiff < 0 ? firstTop - yDiffLen : firstTop;
          top = top < 0 ? 0 : top;
          rectangle.style.top = top + "px";

          height = top + yDiffLen > size ? size - 2 - top : yDiffLen;
          height = y < 0 ? firstTop : height;
          rectangle.style.height = height + "px";
        }

        if (resizing != 3) { // if not horizontal scaling
          left = xDiff < 0 ? firstLeft - xDiffLen : firstLeft;
          left = left < 0 ? 0 : left;
          rectangle.style.left = left + "px";

          width = left + xDiffLen > size ? size - 2 - left : xDiffLen;
          width = x < 0 ? firstLeft : width;
          rectangle.style.width = width + "px";
        }

        text.innerHTML = xDiffLen + " x " + yDiffLen;
        alignTextPosition();
      }
    }

    var onRectMouseDown = function (event) {
      var x = event.x;
      var y = event.y;
      resizing = getResizing(x, y);

      if (resizing == 0) {
        picked = true;
        pickedTop = y;
        pickedLeft = x;
      } else {
        drawing = true;
      }

    };

    function getResizing(x, y) {
      var _resizing = 0;
      var _top = gapY + top;
      var _left = gapX + left;
      var bottom = _top + height;
      var right = _left + width;
      if ((x + 8 > right && y > _top)) {
        _resizing = 2; // horizontal
      }
      if ((y + 8 > bottom && x > _left)) {
        _resizing = 3; // vertical
      }
      if (y + 8 > bottom && x + 8 > right) {
        _resizing = 1; // both
      }
      return _resizing;
    }

    var onAreaMouseDown = function (event) {
      if (!drawing && !picked && resizing == 0) {
        clearRect();
        gapX = event.x - event.offsetX;
        gapY = event.y - event.offsetY;
        console.log("gapY=" + gapY + " gapX=" + gapX)
        firstLeft = event.x - gapX;
        firstTop = event.y - gapY;
        createRect();
        drawing = true;
      }
    }

    function move(x, y) {
      newTop = top + y - pickedTop;
      if (newTop > -1 && newTop + height < size) {
        rectangle.style.top = newTop + "px";
      }
      newLeft = left + x - pickedLeft;
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

    function clearResizeCursor() {
      rectangle.classList.remove("resize1");
      rectangle.classList.remove("resize2");
      rectangle.classList.remove("resize3");
    }

    var onDocumentMouseUp = function (event) {
      if (picked) {
        top = newTop;
        left = newLeft;
        firstTop = top;
        firstLeft = left;
      }
      if (drawing) {
        firstTop = top;
        firstLeft = left;
      }
      drawing = false;
      picked = false;
      resizing = 0;
    }

    div.addEventListener("mousedown", onAreaMouseDown);
    document.addEventListener("mouseup", onDocumentMouseUp);
    document.addEventListener("mousemove", onDocumentMouseMove);
  }
};