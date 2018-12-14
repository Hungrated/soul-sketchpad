$(document).ready(function () {

  const canvas = $('.J_canvas')[0];
  const canvas2 = $('.J_canvas_2')[0];
  const ctx = canvas.getContext('2d');
  const ctx2 = canvas2.getContext('2d');

  const MAX_STACK_SIZE = 50;
  let history;
  let step;

  /**
   * 进行绘图操作
   */
  function fDraw () {
    step++;
    if (step < history.length) {
      history.length = step; // 截断数组
    }
    history.push(canvas.toDataURL());
    if (history.length > MAX_STACK_SIZE) {
      history = history.slice(1);
      step--;
    }
  }

  /**
   * 撤销一步操作
   */
  function fUndo () {
    if (step > 0) {
      step--;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let canvasPic = new Image();
      canvasPic.src = history[step];
      canvasPic.addEventListener('load', () => {
        ctx.drawImage(canvasPic, 0, 0);
      });
    } else {
      alert('已为最早状态');
    }
  }

  /**
   * 重做一步操作
   */
  function fRedo () {
    if (step < history.length - 1) {
      step++;
      let canvasPic = new Image();
      canvasPic.src = history[step];
      canvasPic.addEventListener('load', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(canvasPic, 0, 0);
      });
    } else {
      alert('画板已为最新');
    }
  }

  /**
   * 获取最新画布
   */
  function getLatestHistory() {
    return history[step];
  }

  /**
   * 清空画布
   */
  function clearPaint () {
    clearSecondaryPaint();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fDraw();
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
    const saveLink = $('.J_save_link')[0];
    const event = document.createEvent('MouseEvents');
    saveLink.href = canvas.toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    saveLink.download = `webpainter_${new Date().getTime()}.png`;
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false,
      false, false, false, 0, null);
    saveLink.dispatchEvent(event);
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
      fDraw();
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
    let eraseFlag = false;
    canvas2.onmousedown = function () {
      eraseFlag = true;
    };
    canvas2.onmousemove = function (e) {
      e = e || window.event;
      ctx.beginPath();
      clearSecondaryPaint();
      ctx2.strokeRect(e.offsetX - 8, e.offsetY - 8, 16, 16);
      ctx2.closePath();
      if (eraseFlag) {
        ctx.clearRect(e.offsetX - 8, e.offsetY - 8, 16, 16);
      }
    };
    canvas2.onmouseup = function () {
      eraseFlag = false;
      fDraw();
    };
    canvas2.onmouseout = function () {
      clearSecondaryPaint();
      eraseFlag = false;
    };
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
      fDraw();
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
      fDraw();
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
      fDraw();
    };
    canvas2.onmouseout = function () {
      canvas2.onmousemove = null;
      start = null;
    };
  }

  /**
   * 翻转图象
   */
  function flip (horizontal = true) {
    const canvasPicTemp = getLatestHistory();
    let canvasPicObj = new Image();
    canvasPicObj.src = canvasPicTemp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(horizontal) {
      ctx.drawImage(canvasPicObj, canvas.width, 0, -canvas.width, canvas.height);
      // ctx.translate(canvas.width, 0);
    } else {
      ctx.drawImage(canvasPicObj, 0, canvas.height, canvas.width, -canvas.height);
      // ctx.translate(0, canvas.height);
    }
    fDraw();
  }

  /**
   * 插入文字
   */
  function insertText () {
    clearState();
    let moveFlag = false;
    let text = null;
    canvas2.onmousemove = function (e) {
      e = e || window.event;
      if (text) {
        clearSecondaryPaint();
        ctx2.fillText(text, e.offsetX, e.offsetY);
      }
    };
    canvas2.onmouseup = function (e) {
      e = e || window.event;
      if (!moveFlag && !text) {
        moveFlag = true;
        text = window.prompt('请输入文字', '');
      } else {
        ctx.fillText(text, e.offsetX, e.offsetY);
        clearSecondaryPaint();
        moveFlag = false;
        text = null;
      }
      fDraw();
    };
    canvas2.onmouseout = function () {
      clearSecondaryPaint();
      moveFlag = false;
    };
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
        ctx.drawImage(img, 0, 0, canvas.width, canvas.width / aspectRatio);
      };
    };
    fDraw();
  }

  /**
   * 添加监听事件
   */
  function listen () {
    $('.J_tools')
      .on('click', '.J_undo', function () {
        fUndo();
      })
      .on('click', '.J_redo', function () {
        fRedo();
      })
      .on('click', '.J_pencil', function () {
        pencil();
      })
      .on('click', '.J_eraser', function () {
        eraser();
      })
      .on('click', '.J_line', function () {
        line();
      })
      .on('click', '.J_circle', function () {
        circle();
      })
      .on('click', '.J_circle_fill', function () {
        circle(true);
      })
      .on('click', '.J_rect', function () {
        rectangle();
      })
      .on('click', '.J_rect_fill', function () {
        rectangle(true);
      })
      .on('click', '.J_hori_flip', function () {
        console.log('hori flip');
        flip(true);
      })
      .on('click', '.J_vert_flip', function () {
        console.log('vert flip');
        flip(false);
      })
      .on('click', '.J_text', function () {
        insertText();
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
  }

  /**
   * 初始化画板
   */
  function init () {
    listen();
    pencil();
    history = [];
    step = -1;
    fDraw();
  }

  init();
});

