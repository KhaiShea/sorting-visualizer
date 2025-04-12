let array = [];
let steps = 0;
let startTime = null;
let timerInterval = null;
let cancelRequested = false;

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
      }

      bars[j].style.backgroundColor = "teal";
      bars[j + 1].style.backgroundColor = "teal";
    }
  }

  stopTimer();
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
    for (let k = 0; k <= i; k++) bars[k].style.backgroundColor = "teal";
  }

  stopTimer();
}

async function quickSortWrapper() {
  cancelRequested = false;
  steps = 0;
  updateStepCounter();
  startTimer();
  await quickSort(0, array.length - 1);
  stopTimer();
  generateBars();
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
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    bars[i].style.backgroundColor = "teal";
  }

  [array[pivotIndex], array[end]] = [array[end], array[pivotIndex]];
  steps++;
  updateStepCounter();
  generateBars();
  await new Promise(resolve => setTimeout(resolve, 50));
  bars[end].style.backgroundColor = "teal";

  return pivotIndex;
}

shuffleArray();
