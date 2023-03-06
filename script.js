(function () {
  function addRectangler(element) {
    var div = document.createElement("div");
    div.className = "area";
    element.appendChild(div);

    var gapX, gapY;
    var firstX, firstY;
    var rect = undefined;
    var text = undefined;

    function draw(_x, _y) {
      console.log(_x + "x" + _y);

      var ydiff = _y - firstY;
      var xdiff = _x - firstX;
      var diff_x = Math.abs(xdiff);
      var diff_y = Math.abs(ydiff);

      if (rect != undefined) {
        var top = ydiff < 0 ? firstY - diff_y : firstY;
        var left = xdiff < 0 ? firstX - diff_x : firstX;

        top = top < 0 ? 0 : top;
        rect.style.top = top + "px";

        left = left < 0 ? 0 : left;
        rect.style.left = left + "px";

        var width = left + diff_x > 500 ? 498 - left : diff_x;
        width = _x < 0 ? firstX : width;
        rect.style.width = width + "px";

        var height = top + diff_y > 500 ? 498 - top : diff_y;
        height = _y < 0 ? firstY : height;
        rect.style.height = height + "px";

        text.innerHTML = diff_x + " x " + diff_y;
        text.style.top = rect.style.top;
        text.style.left = rect.style.left;
      }
    }

    function clearRect() {
      if (rect != undefined) {
        div.removeChild(rect);
        div.removeChild(text);
        rect = undefined;
        text = undefined;
      }
    }

    function createRect() {
      if (rect == undefined) {
        rect = document.createElement("div");
        rect.className = "rect";

        text = document.createElement("div");
        text.className = "info";
        text.style.visibility = "visible";
        div.appendChild(text);
        div.appendChild(rect);
        draw(firstX, firstY);
      }
    }

    var onMouseMove = function onMouseMove(event) {
      draw(event.x - gapX, event.y - gapY);
    };

    function onMouseDown(event) {
      clearRect();
      gapX = event.x - event.offsetX;
      gapY = event.y - event.offsetY;
      firstX = event.x - gapX;
      firstY = event.y - gapY;
      createRect();
      document.addEventListener("mousemove", onMouseMove);
    }

    function onMouseUp(event) {
      document.removeEventListener("mousemove", onMouseMove);
    }

    div.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
  }

  function init(event) {
    addRectangler(document.body);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
