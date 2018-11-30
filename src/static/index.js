$(document).ready(function () {

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  /**
   *
   */

  /**
   * 撤销一步操作
   */
  function undo() {

  }

  /**
   * 重做一步操作
   */
  function redo() {

  }

  /**
   * 重新绘图
   */
  function clear () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // canvas.onmousedown=null;
    // canvas.onmousemove=null;
    // canvas.onmouseup=null;
    // canvas.onmouseout=null;
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

  function pencil() {

  }

  /**
   * 橡皮擦
   */
  function eraser() {

  }

  /**
   * 画直线
   */
  function line() {

  }

  /**
   * 画圆
   */
  function circle() {

  }

  /**
   * 画矩形
   */
  function rectangle() {

  }

  /**
   * 插入文字
   */
  function insertText() {

  }

  /**
   * 插入图片
   */
  function insertImage() {

  }

  // 鼠标按下
  let last = null;
  canvas.onmousedown = function () {
    // 在鼠标按下后触发鼠标移动事件
    canvas.onmousemove = move;
  };

  // 鼠标抬起取消鼠标移动的事件
  canvas.onmouseup = function () {
    canvas.onmousemove = null;
    last = null;
  };

  // 鼠标移出画布时 移动事件也要取消
  canvas.onmouseout = function () {
    canvas.onmousemove = null;
    last = null;
  };

  // 鼠标移动函数
  function move (e) {
    if (last != null) {
      ctx.beginPath();
      ctx.moveTo(last[0], last[1]);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    }
    last = [e.offsetX, e.offsetY];
  }

  // 当文件域内容发生改变时触发函数
  // file.onchange = function (e) {
  //   drawImg(e.target.files[0]);
  // };

  // 绘制图片
  function drawImg (data) {
    if(data == null) {
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

  // 保存图片

  /**
   * 添加监听事件
   */
  $('.J_tools')
    .on('click', '.J_clear', function () {
      clear();
    })
    .on('click', '.J_save', function () {
      saveImage();
    });
  $('.J_file').on('change', function (e) {
    drawImg(e.target.files[0]);
  })
});
