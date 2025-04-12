let array = [];
let steps = 0;
let startTime = null;
let timerInterval = null;
let cancelRequested = false;
let soundEnabled = true;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let lastToneTime = 0;

function playTone(value, duration = 50) {
  if (!soundEnabled || cancelRequested) return;

  const now = Date.now();
  if (now - lastToneTime < 30) return;
  lastToneTime = now;

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = 'triangle'; // soft blip
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
  array = Array.from({ length: 40 }, () => Math.floor(Math.random() * 300) + 50);
  steps = 0;
  updateStepCounter();
  document.getElementById("timer").textContent = "Time: 0.0s";
  cancelRequested = false;
  generateBars();
}

// 🎉 Final animation + sound after sort completes
async function celebrate() {
  const bars = document.getElementsByClassName("bar");
  for (let i = 0; i < bars.length; i++) {
    if (cancelRequested) return;
    bars[i].style.backgroundColor = "limegreen";
    playTone(array[i], 30);
    await new Promise(resolve => setTimeout(resolve, 15));
  }
}

async function bubbleSort() {
  cancelRequested = false;
  steps = 0;
  updateStepCounter();
  startTimer();

  const bars = document.getElementsByClassName("bar");

  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      if (cancelRequested) return stopTimer();

      bars[j].style.backgroundColor = "red";
      bars[j + 1].style.backgroundColor = "red";
      await new Promise(resolve => setTimeout(resolve, 50));

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

  const bars = document.getElementsByClassName("bar");

  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    bars[i].style.backgroundColor = "red";
    await new Promise(resolve => setTimeout(resolve, 50));

    while (j >= 0 && array[j] > key) {
      if (cancelRequested) return stopTimer();

      array[j + 1] = array[j];
      steps++;
      updateStepCounter();
      j = j - 1;
      generateBars();
      await new Promise(resolve => setTimeout(resolve, 50));
      for (let k = 0; k <= i; k++) bars[k].style.backgroundColor = "teal";
    }

    array[j + 1] = key;
    steps++;
    updateStepCounter();
    generateBars();
    playTone(array[j + 1]);
    for (let k = 0; k <= i; k++) bars[k].style.backgroundColor = "teal";
  }

  stopTimer();
  if (!cancelRequested) await celebrate();
}

async function quickSortWrapper() {
  cancelRequested = false;
  steps = 0;
  updateStepCounter();
  startTimer();
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
    await new Promise(resolve => setTimeout(resolve, 50));

    if (array[i] < pivot) {
      [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
      steps++;
      updateStepCounter();
      pivotIndex++;
      generateBars();
      playTone(array[pivotIndex]);
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    bars[i].style.backgroundColor = "teal";
  }

  [array[pivotIndex], array[end]] = [array[end], array[pivotIndex]];
  steps++;
  updateStepCounter();
  generateBars();
  playTone(array[pivotIndex]);
  await new Promise(resolve => setTimeout(resolve, 50));
  bars[end].style.backgroundColor = "teal";

  return pivotIndex;
}

shuffleArray();
