document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  let candles = [];
  let audioContext, analyser, microphone;

  function updateCandleCount() {
    const active = candles.filter(c => !c.classList.contains("out")).length;
    candleCountDisplay.textContent = active;
  }

  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
    updateCandleCount();
  }

  cake.addEventListener("click", e => {
    const rect = cake.getBoundingClientRect();
    addCandle(e.clientX - rect.left, e.clientY - rect.top);
  });

  function isBlowing() {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    dataArray.forEach(val => sum += val);
    return sum / dataArray.length > 40;
  }

  function blowOutCandles() {
    if (isBlowing()) {
      candles.forEach(c => { if (!c.classList.contains("out") && Math.random() > 0.5) c.classList.add("out"); });
      updateCandleCount();
    }
  }

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 256;
      setInterval(blowOutCandles, 200);
    }).catch(err => console.log("Mic access denied: " + err));
  }

  // 🎂 Thêm 21 nến đều (3 hàng x 7 cột)
  const rows = 3, cols = 7, candleSpacingX = 250 / (cols + 1), candleSpacingY = 40, startY = 20;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      addCandle(candleSpacingX * (c + 1) - 6, startY + r * candleSpacingY);
    }
  }
  candleCountDisplay.textContent = 21;

  // 🎉 Thông điệp sinh nhật dưới bánh
  const message = document.createElement("h2");
  message.textContent = "Chúc mừng sinh nhật tình yêu 21 tuổi";
  message.style.textAlign = "center";
  message.style.color = "deeppink";
  message.style.marginTop = "30px";
  message.style.fontFamily = "cursive";
  message.style.fontSize = "28px";
  message.style.textShadow = "2px 2px 5px deeppink";
  cake.after(message);
});
