$(document).ready(function () {

  // 获取 canvas 对象
  let canvas = document.getElementById('canvas');
  // 获取绘图环境
  let ctx = canvas.getContext('2d');

  let last = null;

  let file = document.getElementById('file');

  // 文件对象
  let fileData = null;

  // 鼠标按下
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
  file.onchange = function (e) {
    fileData = e.target.files[0];
    // 	实例化文件读取对象
    drawImg(fileData);
  };

  function redraw () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

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
  function saveImage () {
    let saveImg = canvas.toDataURL('image/png');
    // document.getElementById('res').innerHTML = '<img src="' + saveImage + '">';
  }

  // add listener
  $('.J_tools')
    .on('click', '.J_redraw', function () {
      redraw();
    })
    .on('click', '.J_save', function () {
      saveImage();
    });
});
