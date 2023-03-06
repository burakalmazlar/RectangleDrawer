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

        top = yDiff < 0 ? firstTop - yDiffLen : firstTop;
        top = top < 0 ? 0 : top;
        rectangle.style.top = top + "px";

        left = xDiff < 0 ? firstLeft - xDiffLen : firstLeft;
        left = left < 0 ? 0 : left;
        rectangle.style.left = left + "px";

        width = left + xDiffLen > size ? size - 2 - left : xDiffLen;
        width = x < 0 ? firstLeft : width;
        rectangle.style.width = width + "px";

        height = top + yDiffLen > size ? size - 2 - top : yDiffLen;
        height = y < 0 ? firstTop : height;
        rectangle.style.height = height + "px";

        text.innerHTML = xDiffLen + " x " + yDiffLen;
        alignTextPosition();
      }
    }

    var onRectMouseDown = function (event) {
      picked = true;
      pickedTop = event.y;
      pickedLeft = event.x;
    };

    var onAreaMouseDown = function (event) {
      if (!drawing && !picked) {
        clearRect();
        gapX = event.x - event.offsetX;
        gapY = event.y - event.offsetY;
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

    var onMouseMove = function (event) {
      if (drawing) {
        draw(event.x - gapX, event.y - gapY);
      }
      if (picked) {
        move(event.x, event.y);
      }
    };
    var onMouseUp = function (event) {
      drawing = false;
      picked = false;
      if (newTop && newLeft) {
        top = newTop;
        left = newLeft;
      }
    }

    div.addEventListener("mousedown", onAreaMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
  }
};