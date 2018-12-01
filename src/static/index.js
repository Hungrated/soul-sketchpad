$(document).ready(function () {

  const canvas = $('.J_canvas')[0];
  const canvas2 = $('.J_canvas_2')[0];
  const ctx = canvas.getContext('2d');
  const ctx2 = canvas2.getContext('2d');

  /**
   * 撤销一步操作
   */
  function undo () {

  }

  /**
   * 重做一步操作
   */
  function redo () {

  }

  /**
   * 清空画布
   */
  function clearPaint () {
    clearSecondaryPaint();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * 清空第二画布
   */
  function clearSecondaryPaint () {
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  }

  /**
   * 清空状态
   */
  function clearState () {
    canvas.onmousedown = null;
    canvas.onmousemove = null;
    canvas.onmouseup = null;
    canvas.onmouseout = null;
    canvas2.onmousedown = null;
    canvas2.onmousemove = null;
    canvas2.onmouseup = null;
    canvas2.onmouseout = null;
  }

  /**
   * 保存图片
   */
  function saveImage () {
    let saveImg = canvas.toDataURL('image/png');
    console.log(saveImg);
    // document.getElementById('res').innerHTML = '<img src="' + saveImage + '">';
  }

  /**
   * 自由画笔
   */
  function pencil () {
    clearState();
    let last = null;
    canvas2.onmousedown = function () {
      canvas2.onmousemove = function (e) {
        e = e || window.event;
        if (last != null) {
          ctx.beginPath();
          ctx.moveTo(last[0], last[1]);
          ctx.lineTo(e.offsetX, e.offsetY);
          ctx.stroke();
          ctx.closePath();
        }
        last = [e.offsetX, e.offsetY];
      };
    };
    canvas2.onmouseup = function () {
      canvas2.onmousemove = null;
      last = null;
    };
    canvas2.onmouseout = function () {
      canvas2.onmousemove = null;
      last = null;
    };
  }

  /**
   * 橡皮擦
   */
  function eraser () {
    clearState();

  }

  /**
   * 画直线
   */
  function line () {
    clearState();
    let start = null;
    canvas2.onmousedown = function (e) {
      e = e || window.event;
      start = [e.offsetX, e.offsetY];
      canvas2.onmousemove = function (e) {
        e = e || window.event;
        if (start != null) {
          clearSecondaryPaint(); // 实时刷新预览
          ctx2.beginPath();
          ctx2.moveTo(start[0], start[1]);
          ctx2.lineTo(e.offsetX, e.offsetY);
          ctx2.stroke();
          ctx2.closePath();
        }
      };
    };
    canvas2.onmouseup = function (e) {
      e = e || window.event;
      ctx.beginPath();
      ctx.moveTo(start[0], start[1]);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      ctx.closePath();
      clearSecondaryPaint();
      canvas2.onmousemove = null;
      start = null;
    };
    canvas2.onmouseout = function () {
      canvas2.onmousemove = null;
      start = null;
    };
  }

  /**
   * 画圆
   */
  function circle (fill = false) {
    clearState();
    let start = null;
    canvas2.onmousedown = function (e) {
      e = e || window.event;
      start = [e.offsetX, e.offsetY];
      canvas2.onmousemove = function (e) {
        e = e || window.event;
        if (start != null) {
          clearSecondaryPaint(); // 实时刷新预览
          ctx2.beginPath();
          ctx2.arc(start[0], start[1], Math.sqrt(
            Math.pow((e.offsetX - start[0]), 2) +
            Math.pow((e.offsetY - start[1]), 2)), 0, 360, false);
          if (fill) {
            ctx2.fill();
          }
          ctx2.stroke();
          ctx2.closePath();
        }
      };
    };
    canvas2.onmouseup = function (e) {
      e = e || window.event;
      ctx.beginPath();
      ctx.arc(start[0], start[1], Math.sqrt(
        Math.pow((e.offsetX - start[0]), 2) +
        Math.pow((e.offsetY - start[1]), 2)), 0, 360, false);
      if (fill) {
        ctx.fill();
      }
      ctx.stroke();
      ctx.closePath();
      clearSecondaryPaint();
      canvas2.onmousemove = null;
      start = null;
    };
    canvas2.onmouseout = function () {
      canvas2.onmousemove = null;
      start = null;
    };
  }

  /**
   * 画矩形
   */
  function rectangle (fill = false) {
    clearState();
    let start = null;
    canvas2.onmousedown = function (e) {
      e = e || window.event;
      start = [e.offsetX, e.offsetY];
      canvas2.onmousemove = function (e) {
        e = e || window.event;
        if (start != null) {
          clearSecondaryPaint(); // 实时刷新预览
          ctx2.beginPath();
          if (fill) {
            ctx2.fillRect(start[0], start[1], e.offsetX - start[0],
              e.offsetY - start[1]);
          } else {
            ctx2.strokeRect(start[0], start[1], e.offsetX - start[0],
              e.offsetY - start[1]);
          }
          ctx2.closePath();
        }
      };
    };
    canvas2.onmouseup = function (e) {
      e = e || window.event;
      ctx.beginPath();
      if (fill) {
        ctx.fillRect(start[0], start[1], e.offsetX - start[0],
          e.offsetY - start[1]);
      } else {
        ctx.strokeRect(start[0], start[1], e.offsetX - start[0],
          e.offsetY - start[1]);
      }
      ctx.closePath();
      clearSecondaryPaint();
      canvas2.onmousemove = null;
      start = null;
    };
    canvas2.onmouseout = function () {
      canvas2.onmousemove = null;
      start = null;
    };
  }

  /**
   * 插入文字
   */
  function insertText () {
    clearState();

  }

  /**
   * 插入图片
   */
  function insertImage () {

  }

  /**
   * 绘制插入的图片
   *
   * @param data 图片文件
   */
  function drawImg (data) {
    if (data == null) {
      return;
    }
    let reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onload = function () {
      let img = new Image();
      img.src = reader.result;
      img.onload = function () {
        let aspectRatio = img.width / img.height;
        img.width = canvas.width;
        img.height = img.width * aspectRatio;
        ctx.drawImage(img, 0, 0);
      };
    };
  }

  /**
   * 添加监听事件
   */
  $('.J_tools')
    .on('click', '.J_pencil', function () {
      pencil();
    })
    .on('click', '.J_line', function () {
      line();
    })
    .on('click', '.J_circle', function () {
      circle(false);
    })
    .on('click', '.J_rect', function () {
      rectangle(false);
    })
    .on('click', '.J_clear', function () {
      clearPaint();
    })
    .on('click', '.J_save', function () {
      saveImage();
    });
  $('.J_file').on('change', function (e) {
    drawImg(e.target.files[0]);
  });
});
