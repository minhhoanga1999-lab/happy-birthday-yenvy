document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  let candles = [];
  let audioContext;
  let analyser;
  let microphone;

  function updateCandleCount() {
    const activeCandles = candles.filter(c => !c.classList.contains("out")).length;
    candleCountDisplay.textContent = activeCandles;
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

  cake.addEventListener("click", function (event) {
    const rect = cake.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
    addCandle(left, top);
  });

  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
    return sum / bufferLength > 40;
  }

  function blowOutCandles() {
    if (isBlowing()) {
      candles.forEach(c => {
        if (!c.classList.contains("out") && Math.random() > 0.5) c.classList.add("out");
      });
      updateCandleCount();
    }
  }

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        setInterval(blowOutCandles, 200);
      }).catch(err => console.log("Unable to access microphone: " + err));
  } else console.log("getUserMedia not supported!");

  // 🎂 Thêm 21 nến ngay khi load trang
  for (let i = 0; i < 21; i++) {
    const left = 20 + (i % 7) * 30;  // 7 nến mỗi hàng
    const top = 20 + Math.floor(i / 7) * 40; // 3 hàng
    addCandle(left, top);
  }

  // 🎉 Thêm thông điệp sinh nhật
  const message = document.createElement("h2");
  message.textContent = "Chúc mừng sinh nhật tình yêu 21 tuổi";
  message.style.textAlign = "center";
  message.style.color = "deeppink";
  message.style.marginTop = "20px";
  message.style.fontFamily = "cursive";
  message.style.fontSize = "28px";
  document.body.insertBefore(message, cake);

  // Hiển thị số nến mặc định 21
  candleCountDisplay.textContent = 21;
});
