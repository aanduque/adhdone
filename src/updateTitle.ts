
function updateTabTitle(number) {
  // var originalTitle = document.title;
  // document.title = "(" + number + ") " + originalTitle;
  // document.getElementsByTagName("title")[0].innerHTML =
  //   "(" + number + ") " + originalTitle;

  document.getElementById("favicon")?.remove();
  document.getElementById("number-favicon")?.remove();
  document.getElementById("badge-favicon")?.remove();
  var link = document.createElement("link");
  link.type = "image/x-icon";
  link.rel = "shortcut icon";
  link.href = "favicon.ico";
  link.id = "number-favicon";
  document.getElementsByTagName("head")[0].appendChild(link);

  var canvas = document.createElement("canvas");
  var img = document.createElement("img");
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    ctx.fillStyle = "rgb(0, 128, 0)";
    ctx.fillRect(0, 0, 20, 20);
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(number, 10, 15);
    var link = document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.id = "badge-favicon";
    link.href = canvas.toDataURL();
    document.getElementsByTagName("head")[0].appendChild(link);
  };
  img.src = "favicon.ico";
}

setInterval(() => {
  if (data.value.currentSession) {
    const now = Date.now();
    const millisecondsLeft =
      data.value.currentSession.startedAt +
      data.value.settings.pomodoroLength * 60 * 1000 -
      now;
    secondsLeftInSeconds.value =
      millisecondsLeft >= 0
        ? Math.round(millisecondsLeft / 1000)
        : Math.round((now - data.value.currentSession.startedAt) / 1000);

    updateTabTitle(Math.round(secondsLeftInSeconds.value / 60));
  }
}, 1000);