let array = [];
let steps = 0;
let startTime = null;
let timerInterval = null;
let cancelRequested = false;
let soundEnabled = true;
let barCount = 40;
let delay = 50;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let lastToneTime = 0;

function resumeAudio() {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

function playTone(value, duration = 50) {
  if (!soundEnabled || cancelRequested) return;

  const now = Date.now();
  if (now - lastToneTime < 30) return;
  lastToneTime = now;

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.value = 300 + value * 0.5;

  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration / 1000);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration / 1000);
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById("sound-toggle");
  btn.textContent = soundEnabled ? "🔊 Sound: On" : "🔇 Sound: Off";
}

function updateStepCounter() {
  document.getElementById("step-counter").textContent = `Steps: ${steps}`;
}

function updateBarCount(value) {
  barCount = parseInt(value);
  document.getElementById("barCountValue").textContent = value;
  shuffleArray();
}

function updateSpeed(value) {
  delay = parseInt(value);
  document.getElementById("speedValue").textContent = value;
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const seconds = ((Date.now() - startTime) / 1000).toFixed(1);
    document.getElementById("timer").textContent = `Time: ${seconds}s`;
  }, 100);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function cancelSort() {
  cancelRequested = true;
  stopTimer();
  steps = 0;
  updateStepCounter();
  document.getElementById("timer").textContent = "Time: 0.0s";
  enableButtons();

  // Wait briefly to ensure current sort exits before shuffle
  setTimeout(() => {
    if (cancelRequested) {
      shuffleArray();
    }
  }, delay + 10);
}

function disableButtons() {
  document.querySelectorAll("button").forEach(btn => {
    const id = btn.id;
    // Only disable sort/shuffle buttons — leave "stop" and "sound" active
    if (!["stopBtn", "sound-toggle"].includes(id)) {
      btn.disabled = true;
    }
  });
}

function enableButtons() {
  document.querySelectorAll("button").forEach(btn => btn.disabled = false);
}

function resetBarColors() {
  const bars = document.getElementsByClassName("bar");
  for (let bar of bars) {
    bar.style.backgroundColor = "teal";
  }
}

function generateBars() {
  const container = document.getElementById("bar-container");
  container.innerHTML = "";
  array.forEach(height => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${height}px`;
    container.appendChild(bar);
  });
}

function shuffleArray() {
  array = Array.from({ length: barCount }, () => Math.floor(Math.random() * 300) + 50);
  steps = 0;
  updateStepCounter();
  document.getElementById("timer").textContent = "Time: 0.0s";
  cancelRequested = false;
  generateBars();
}

function showCompletePopup() {
  const popup = document.getElementById("complete-popup");
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 3000);
}

async function celebrate() {
  const bars = document.getElementsByClassName("bar");
  for (let i = 0; i < bars.length; i++) {
    if (cancelRequested) return;
    bars[i].style.backgroundColor = "limegreen";
    playTone(array[i], 30);
    await new Promise(resolve => setTimeout(resolve, 15));
  }
  showCompletePopup();
  enableButtons();
}

async function bubbleSort() {
  cancelRequested = false;
  steps = 0;
  updateStepCounter();
  startTimer();
  disableButtons();
  resetBarColors();

  const bars = document.getElementsByClassName("bar");

  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      if (cancelRequested) return stopTimer();

      bars[j].style.backgroundColor = "red";
      bars[j + 1].style.backgroundColor = "red";
      await new Promise(resolve => setTimeout(resolve, delay));

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        steps++;
        updateStepCounter();
        generateBars();
        playTone(array[j]);
      }

      bars[j].style.backgroundColor = "teal";
      bars[j + 1].style.backgroundColor = "teal";
    }
  }

  stopTimer();
  if (!cancelRequested) await celebrate();
}

async function insertionSort() {
  cancelRequested = false;
  steps = 0;
  updateStepCounter();
  startTimer();
  disableButtons();
  resetBarColors();

  const bars = document.getElementsByClassName("bar");

  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    bars[i].style.backgroundColor = "red";
    await new Promise(resolve => setTimeout(resolve, delay));

    while (j >= 0 && array[j] > key) {
      if (cancelRequested) return stopTimer();

      array[j + 1] = array[j];
      steps++;
      updateStepCounter();
      j = j - 1;
      generateBars();
      await new Promise(resolve => setTimeout(resolve, delay));
      for (let k = 0; k <= i; k++) bars[k].style.backgroundColor = "teal";
    }

    array[j + 1] = key;
    steps++;
    updateStepCounter();
    generateBars();
    playTone(array[j + 1]);
  }

  stopTimer();
  if (!cancelRequested) await celebrate();
}

async function quickSortWrapper() {
  cancelRequested = false;
  steps = 0;
  updateStepCounter();
  startTimer();
  disableButtons();
  resetBarColors();

  await quickSort(0, array.length - 1);

  stopTimer();
  generateBars();
  if (!cancelRequested) await celebrate();
}

async function quickSort(start, end) {
  if (start >= end || cancelRequested) return;

  const index = await partition(start, end);
  await quickSort(start, index - 1);
  await quickSort(index + 1, end);
}

async function partition(start, end) {
  const bars = document.getElementsByClassName("bar");
  let pivot = array[end];
  let pivotIndex = start;

  for (let i = start; i < end; i++) {
    if (cancelRequested) return;

    bars[i].style.backgroundColor = "red";
    bars[end].style.backgroundColor = "purple";
    await new Promise(resolve => setTimeout(resolve, delay));

    if (array[i] < pivot) {
      [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
      steps++;
      updateStepCounter();
      pivotIndex++;
      generateBars();
      playTone(array[pivotIndex]);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    bars[i].style.backgroundColor = "teal";
  }

  [array[pivotIndex], array[end]] = [array[end], array[pivotIndex]];
  steps++;
  updateStepCounter();
  generateBars();
  playTone(array[pivotIndex]);
  await new Promise(resolve => setTimeout(resolve, delay));
  bars[end].style.backgroundColor = "teal";

  return pivotIndex;
}

shuffleArray();



document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("barCountSlider").addEventListener("input", (e) => {
    barCount = parseInt(e.target.value);
    document.getElementById("barCountValue").textContent = e.target.value;
    shuffleArray();
  });

  document.getElementById("speedSlider").addEventListener("input", (e) => {
    delay = parseInt(e.target.value);
    document.getElementById("speedValue").textContent = e.target.value;
  });

  document.getElementById("runBtn").addEventListener("click", () => {
    const selected = document.getElementById("algorithmSelect").value;
    if (selected === "bubble") bubbleSort();
    else if (selected === "insertion") insertionSort();
    else if (selected === "selection") selectionSort();
    else if (selected === "merge") mergeSortWrapper();
    else if (selected === "quick") quickSortWrapper();
    else if (selected === "heap") heapSort();
    else alert("Selected algorithm not implemented.");
  });

  shuffleArray(); // Initial bars
});
