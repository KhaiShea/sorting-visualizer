let array = [];
let steps = 0;
let startTime = null;
let timerInterval = null;
let cancelRequested = false;
let soundEnabled = true;
let barCount = 40;
let delay = 50;
let rainbowMode = false; // Track rainbow mode state
let staticColors = []; // Store static colors for the shuffled array

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let lastToneTime = 0;

function resumeAudio() {
  if (audioCtx.state === "suspended") audioCtx.resume();
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

function toggleRainbowMode() {
  rainbowMode = !rainbowMode;
  const btn = document.getElementById("rainbow-toggle");
  btn.textContent = rainbowMode ? "🌈 Rainbow: On" : "🌈 Rainbow: Off";
  shuffleArray(); // Re-shuffle to apply static colors
}

function assignStaticColors() {
  staticColors = generateSoftGradientColors(array.length); // Use pastel gradient for shuffled array
}

function applyStaticColors() {
  const bars = document.getElementsByClassName("bar");
  for (let i = 0; i < bars.length; i++) {
    bars[i].style.backgroundColor = staticColors[i];
  }
}

function applySoftGradient() {
  // Reuse staticColors for the completed array to ensure consistency
  applyStaticColors();
}

function generateSoftGradientColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = (i / count) * 360;
    colors.push(`hsl(${hue}, 70%, 70%)`); // Softer gradient with lower saturation and higher lightness
  }
  return colors;
}

function generateRainbowColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = (i / count) * 360;
    colors.push(`hsl(${hue}, 100%, 50%)`);
  }
  return colors;
}

function shuffleArrayColors(colors) {
  return colors
    .map(color => ({ color, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ color }) => color);
}

function isSorted(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) return false;
  }
  return true;
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
  setTimeout(() => {
    if (cancelRequested) shuffleArray();
  }, delay + 10);
}

function disableButtons() {
  document.querySelectorAll("button").forEach(btn => {
    const id = btn.id;
    if (!["stopBtn", "sound-toggle", "rainbow-toggle"].includes(id)) btn.disabled = true;
  });
}

function enableButtons() {
  document.querySelectorAll("button").forEach(btn => btn.disabled = false);
}

function resetBarColors() {
  const bars = document.getElementsByClassName("bar");
  for (let bar of bars) bar.style.backgroundColor = "teal";
}

// Modify generateBars to apply static colors if rainbow mode is enabled
function generateBars() {
  const container = document.getElementById("bar-container");
  container.innerHTML = "";
  array.forEach(height => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${height}px`;
    container.appendChild(bar);
  });
  if (rainbowMode) applyStaticColors();
}

// Modify shuffleArray to assign pastel colors
function shuffleArray() {
  array = Array.from({ length: barCount }, () => Math.floor(Math.random() * 300) + 50);
  steps = 0;
  updateStepCounter();
  document.getElementById("timer").textContent = "Time: 0.0s";
  cancelRequested = false;
  assignStaticColors(); // Assign pastel colors during shuffle
  generateBars();
}

function showCompletePopup() {
  const popup = document.getElementById("complete-popup");
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 3000);
}

function playCelebrationSound() {
  if (!soundEnabled) return;
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // High-pitched tone
  gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1); // Fade out
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 1); // Play for 1 second
}

// Modify celebrate to apply the soft gradient after sorting
async function celebrate() {
  const bars = document.getElementsByClassName("bar");

  // Step 1: Turn all bars to the default color (teal)
  for (let i = 0; i < bars.length; i++) {
    bars[i].style.backgroundColor = "teal";
  }

  // Step 2: Wait briefly before starting the rainbow reveal
  await new Promise(resolve => setTimeout(resolve, 500));

  // Step 3: Traverse the array and play tones for each bar
  for (let i = 0; i < bars.length; i++) {
    if (cancelRequested) return; // Stop if sorting is canceled
    playTone(array[i], 50); // Play tone for the current bar
    bars[i].style.backgroundColor = rainbowMode
      ? generateSoftGradientColors(array.length)[i] // Apply rainbow gradient if enabled
      : "limegreen"; // Default color for sorted bars
    await new Promise(resolve => setTimeout(resolve, 15)); // Delay for smooth traversal
  }

  // Step 4: Show the "Sorting Complete" popup
  showCompletePopup();
  enableButtons();
}

// Bubble Sort
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

// Insertion Sort
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

// Selection Sort
async function selectionSort() {
  cancelRequested = false;
  steps = 0;
  updateStepCounter();
  startTimer();
  disableButtons();
  resetBarColors();
  const bars = document.getElementsByClassName("bar");
  for (let i = 0; i < array.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      if (cancelRequested) return stopTimer();
      bars[j].style.backgroundColor = "red";
      bars[minIndex].style.backgroundColor = "blue";
      await new Promise(resolve => setTimeout(resolve, delay));
      if (array[j] < array[minIndex]) {
        bars[minIndex].style.backgroundColor = "teal";
        minIndex = j;
      } else {
        bars[j].style.backgroundColor = "teal";
      }
    }
    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      steps++;
      updateStepCounter();
      generateBars();
      playTone(array[i]);
      await new Promise(resolve => setTimeout(resolve, delay));
      bars[minIndex].style.backgroundColor = "teal";
    }
    bars[i].style.backgroundColor = "teal";
  }
  stopTimer();
  if (!cancelRequested) await celebrate();
}

// Merge Sort
async function mergeSortWrapper() {
  cancelRequested = false;
  steps = 0;
  updateStepCounter();
  startTimer();
  disableButtons();
  resetBarColors();
  await mergeSort(0, array.length - 1);
  stopTimer();
  generateBars();
  if (!cancelRequested) await celebrate();
}

async function mergeSort(left, right) {
  if (left >= right || cancelRequested) return;
  const mid = Math.floor((left + right) / 2);
  await mergeSort(left, mid);
  await mergeSort(mid + 1, right);
  await merge(left, mid, right);
}

async function merge(left, mid, right) {
  const leftArr = array.slice(left, mid + 1);
  const rightArr = array.slice(mid + 1, right + 1);
  let i = 0, j = 0, k = left;
  while (i < leftArr.length && j < rightArr.length) {
    if (cancelRequested) return;
    array[k++] = leftArr[i] <= rightArr[j] ? leftArr[i++] : rightArr[j++];
    steps++;
    updateStepCounter();
    generateBars();
    playTone(array[k - 1]);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  while (i < leftArr.length) {
    array[k++] = leftArr[i++];
    steps++;
    updateStepCounter();
    generateBars();
    playTone(array[k - 1]);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  while (j < rightArr.length) {
    array[k++] = rightArr[j++];
    steps++;
    updateStepCounter();
    generateBars();
    playTone(array[k - 1]);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

// Quick Sort
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

async function quickSort(low, high) {
  if (low < high && !cancelRequested) {
    const pivotIndex = await partition(low, high);
    await quickSort(low, pivotIndex - 1);
    await quickSort(pivotIndex + 1, high);
  }
}

async function partition(low, high) {
  const pivot = array[high];
  const bars = document.getElementsByClassName("bar");
  let i = low - 1;
  bars[high].style.backgroundColor = "yellow";
  for (let j = low; j < high; j++) {
    if (cancelRequested) return;
    bars[j].style.backgroundColor = "red";
    await new Promise(resolve => setTimeout(resolve, delay));
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      steps++;
      updateStepCounter();
      generateBars();
      playTone(array[i]);
    }
    bars[j].style.backgroundColor = "teal";
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  steps++;
  updateStepCounter();
  generateBars();
  playTone(array[i + 1]);
  bars[high].style.backgroundColor = "teal";
  return i + 1;
}

// Heap Sort
async function heapSortWrapper() {
  cancelRequested = false;
  steps = 0;
  updateStepCounter();
  startTimer();
  disableButtons();
  resetBarColors();
  await heapSort();
  stopTimer();
  generateBars();
  if (!cancelRequested) await celebrate();
}

async function heapSort() {
  const n = array.length;
  const bars = document.getElementsByClassName("bar");

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(n, i);
  }

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    if (cancelRequested) return;
    [array[0], array[i]] = [array[i], array[0]];
    steps++;
    updateStepCounter();
    generateBars();
    playTone(array[i]);
    bars[i].style.backgroundColor = "limegreen";
    await new Promise(resolve => setTimeout(resolve, delay));
    await heapify(i, 0);
  }
  bars[0].style.backgroundColor = "limegreen";
}

async function heapify(n, i) {
  const bars = document.getElementsByClassName("bar");
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && array[left] > array[largest]) {
    largest = left;
  }

  if (right < n && array[right] > array[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [array[i], array[largest]] = [array[largest], array[i]];
    steps++;
    updateStepCounter();
    generateBars();
    playTone(array[i]);
    bars[i].style.backgroundColor = "red";
    bars[largest].style.backgroundColor = "red";
    await new Promise(resolve => setTimeout(resolve, delay));
    bars[i].style.backgroundColor = "teal";
    bars[largest].style.backgroundColor = "teal";
    await heapify(n, largest);
  }
}

// Counting Sort
async function countingSortWrapper() {
  cancelRequested = false;
  steps = 0;
  updateStepCounter();
  startTimer();
  disableButtons();
  resetBarColors();
  await countingSort();
  stopTimer();
  generateBars();
  if (!cancelRequested) await celebrate();
}

async function countingSort() {
  const max = Math.max(...array);
  const count = new Array(max + 1).fill(0);
  const output = new Array(array.length);
  const bars = document.getElementsByClassName("bar");

  for (let i = 0; i < array.length; i++) {
    count[array[i]]++;
    steps++;
    updateStepCounter();
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }

  for (let i = array.length - 1; i >= 0; i--) {
    output[count[array[i]] - 1] = array[i];
    count[array[i]]--;
    steps++;
    updateStepCounter();
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  for (let i = 0; i < array.length; i++) {
    array[i] = output[i];
    generateBars();
    playTone(array[i]);
    bars[i].style.backgroundColor = "limegreen";
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

// Radix Sort
async function radixSortWrapper() {
  cancelRequested = false;
  steps = 0;
  updateStepCounter();
  startTimer();
  disableButtons();
  resetBarColors();
  await radixSort();
  stopTimer();
  generateBars();
  if (!cancelRequested) await celebrate();
}

async function radixSort() {
  const max = Math.max(...array);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    await countingSortByDigit(exp);
  }
}

async function countingSortByDigit(exp) {
  const output = new Array(array.length).fill(0);
  const count = new Array(10).fill(0);
  const bars = document.getElementsByClassName("bar");

  for (let i = 0; i < array.length; i++) {
    const digit = Math.floor(array[i] / exp) % 10;
    count[digit]++;
    steps++;
    updateStepCounter();
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }

  for (let i = array.length - 1; i >= 0; i--) {
    const digit = Math.floor(array[i] / exp) % 10;
    output[count[digit] - 1] = array[i];
    count[digit]--;
    steps++;
    updateStepCounter();
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  for (let i = 0; i < array.length; i++) {
    array[i] = output[i];
    generateBars();
    playTone(array[i]);
    bars[i].style.backgroundColor = "limegreen";
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

// Bucket Sort
async function bucketSortWrapper() {
  cancelRequested = false;
  steps = 0;
  updateStepCounter();
  startTimer();
  disableButtons();
  resetBarColors();
  await bucketSort();
  stopTimer();
  generateBars();
  if (!cancelRequested) await celebrate();
}

async function bucketSort() {
  const max = Math.max(...array);
  if (max === 0) return; // Handle edge case where all elements are 0

  const buckets = Array.from({ length: 10 }, () => []);
  const bars = document.getElementsByClassName("bar");

  for (let i = 0; i < array.length; i++) {
    const index = Math.floor((array[i] / max) * (buckets.length - 1)); // Ensure index is within bounds
    buckets[index].push(array[i]);
    steps++;
    updateStepCounter();
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  for (let i = 0; i < buckets.length; i++) {
    buckets[i].sort((a, b) => a - b);
  }

  let idx = 0;
  for (let i = 0; i < buckets.length; i++) {
    for (let j = 0; j < buckets[i].length; j++) {
      array[idx++] = buckets[i][j];
      generateBars();
      playTone(array[idx - 1]);
      bars[idx - 1].style.backgroundColor = "limegreen";
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Shell Sort
async function shellSortWrapper() {
  cancelRequested = false;
  steps = 0;
  updateStepCounter();
  startTimer();
  disableButtons();
  resetBarColors();
  await shellSort();
  stopTimer();
  generateBars();
  if (!cancelRequested) await celebrate();
}

async function shellSort() {
  const bars = document.getElementsByClassName("bar");
  for (let gap = Math.floor(array.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < array.length; i++) {
      const temp = array[i];
      let j;
      for (j = i; j >= gap && array[j - gap] > temp; j -= gap) {
        array[j] = array[j - gap];
        steps++;
        updateStepCounter();
        generateBars();
        playTone(array[j]);
        bars[j].style.backgroundColor = "red";
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      array[j] = temp;
      generateBars();
      playTone(array[j]);
      bars[j].style.backgroundColor = "limegreen";
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Bogo Sort
async function bogoSortWrapper() {
  cancelRequested = false;
  steps = 0;
  updateStepCounter();
  startTimer();
  disableButtons();
  resetBarColors();
  await bogoSort();
  stopTimer();
  generateBars();
  if (!cancelRequested) await celebrate();
}

async function bogoSort() {
  const bars = document.getElementsByClassName("bar");
  while (!isSorted(array)) {
    if (cancelRequested) return;
    array = shuffleArrayColors(array); // Shuffle the array
    steps++;
    updateStepCounter();
    generateBars();
    for (let i = 0; i < bars.length; i++) {
      bars[i].style.backgroundColor = "teal";
    }
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

// Cocktail Shaker Sort
async function cocktailShakerSortWrapper() {
  cancelRequested = false;
  steps = 0;
  updateStepCounter();
  startTimer();
  disableButtons();
  resetBarColors();
  await cocktailShakerSort();
  stopTimer();
  generateBars();
  if (!cancelRequested) await celebrate();
}

async function cocktailShakerSort() {
  let start = 0, end = array.length - 1;
  const bars = document.getElementsByClassName("bar");
  while (start < end) {
    for (let i = start; i < end; i++) {
      if (cancelRequested) return;
      bars[i].style.backgroundColor = "red";
      bars[i + 1].style.backgroundColor = "red";
      await new Promise(resolve => setTimeout(resolve, delay));
      if (array[i] > array[i + 1]) {
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        steps++;
        updateStepCounter();
        generateBars();
        playTone(array[i]);
      }
      bars[i].style.backgroundColor = "teal";
      bars[i + 1].style.backgroundColor = "teal";
    }
    end--;
    for (let i = end; i > start; i--) {
      if (cancelRequested) return;
      bars[i].style.backgroundColor = "red";
      bars[i - 1].style.backgroundColor = "red";
      await new Promise(resolve => setTimeout(resolve, delay));
      if (array[i] < array[i - 1]) {
        [array[i], array[i - 1]] = [array[i - 1], array[i]];
        steps++;
        updateStepCounter();
        generateBars();
        playTone(array[i]);
      }
      bars[i].style.backgroundColor = "teal";
      bars[i - 1].style.backgroundColor = "teal";
    }
    start++;
  }
}

// Comb Sort
async function combSortWrapper() {
  cancelRequested = false;
  steps = 0;
  updateStepCounter();
  startTimer();
  disableButtons();
  resetBarColors();
  await combSort();
  stopTimer();
  generateBars();
  if (!cancelRequested) await celebrate();
}

async function combSort() {
  let gap = array.length;
  const shrink = 1.3;
  const bars = document.getElementsByClassName("bar");
  let sorted = false;

  while (!sorted) {
    gap = Math.floor(gap / shrink);
    if (gap <= 1) {
      gap = 1;
      sorted = true;
    }
    for (let i = 0; i + gap < array.length; i++) {
      if (cancelRequested) return;
      bars[i].style.backgroundColor = "red";
      bars[i + gap].style.backgroundColor = "red";
      await new Promise(resolve => setTimeout(resolve, delay));
      if (array[i] > array[i + gap]) {
        [array[i], array[i + gap]] = [array[i + gap], array[i]];
        steps++;
        updateStepCounter();
        generateBars();
        playTone(array[i]);
        sorted = false;
      }
      bars[i].style.backgroundColor = "teal";
      bars[i + gap].style.backgroundColor = "teal";
    }
  }
}

// Update complexities object
const complexities = {
  bubble: { name: "Bubble Sort", time: "O(n²)", space: "O(1)" },
  insertion: { name: "Insertion Sort", time: "O(n²)", space: "O(1)" },
  selection: { name: "Selection Sort", time: "O(n²)", space: "O(1)" },
  merge: { name: "Merge Sort", time: "O(n log n)", space: "O(n)" },
  quick: { name: "Quick Sort", time: "O(n log n)", space: "O(log n)" },
  heap: { name: "Heap Sort", time: "O(n log n)", space: "O(1)" },
  counting: { name: "Counting Sort", time: "O(n + k)", space: "O(k)" },
  radix: { name: "Radix Sort", time: "O(nk)", space: "O(n + k)" },
  bucket: { name: "Bucket Sort", time: "O(n + k)", space: "O(n + k)" },
  shell: { name: "Shell Sort", time: "O(n log² n)", space: "O(1)" },
  bogo: { name: "Bogo Sort", time: "O((n+1)!)", space: "O(1)" },
  cocktail: { name: "Cocktail Shaker Sort", time: "O(n²)", space: "O(1)" },
  comb: { name: "Comb Sort", time: "O(n²)", space: "O(1)" },
};

function updateComplexityTable(algorithm) {
  const algoName = document.getElementById("algo-name");
  const timeComplexity = document.getElementById("time-complexity");
  const spaceComplexity = document.getElementById("space-complexity");

  const complexity = complexities[algorithm];
  if (complexity) {
    algoName.textContent = complexity.name;
    timeComplexity.textContent = complexity.time;
    spaceComplexity.textContent = complexity.space;
  }
}

function updateSliderForAlgorithm(algorithm) {
  const slider = document.getElementById("barCountSlider");
  const barCountValue = document.getElementById("barCountValue");
  const popup = document.getElementById("slider-popup");

  let maxItems = 150; // Default max items
  if (["counting", "radix", "bucket"].includes(algorithm)) {
    maxItems = 100; // Example: These algorithms work better with fewer items
  }

  if (slider.max != maxItems) {
    slider.max = maxItems;
    if (barCount > maxItems) {
      barCount = maxItems;
      slider.value = maxItems;
      barCountValue.textContent = maxItems;
      shuffleArray();
    }
    popup.classList.add("show");
    setTimeout(() => popup.classList.remove("show"), 3000);
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("barCountSlider").addEventListener("input", (e) => {
    updateBarCount(e.target.value);
  });
  document.getElementById("speedSlider").addEventListener("input", (e) => {
    updateSpeed(e.target.value);
  });
  document.getElementById("runBtn").addEventListener("click", () => {
    const selected = document.getElementById("algorithmSelect").value;
    resumeAudio();
    if (selected === "bubble") bubbleSort();
    else if (selected === "insertion") insertionSort();
    else if (selected === "selection") selectionSort();
    else if (selected === "merge") mergeSortWrapper();
    else if (selected === "quick") quickSortWrapper();
    else if (selected === "heap") heapSortWrapper();
    else if (selected === "counting") countingSortWrapper();
    else if (selected === "radix") radixSortWrapper();
    else if (selected === "bucket") bucketSortWrapper();
    else if (selected === "shell") shellSortWrapper();
    else if (selected === "bogo") bogoSortWrapper();
    else if (selected === "cocktail") cocktailShakerSortWrapper(); // Add Cocktail Shaker Sort
    else if (selected === "comb") combSortWrapper(); // Add Comb Sort
  });
  document.getElementById("shuffleBtn").addEventListener("click", shuffleArray);
  document.getElementById("stopBtn").addEventListener("click", cancelSort);
  document.getElementById("sound-toggle").addEventListener("click", toggleSound);
  document.getElementById("rainbow-toggle").addEventListener("click", toggleRainbowMode); // Ensure this line is present
  document.getElementById("algorithmSelect").addEventListener("change", (e) => {
    const selectedAlgorithm = e.target.value;
    updateSliderForAlgorithm(selectedAlgorithm);
    updateComplexityTable(selectedAlgorithm);
  });
  shuffleArray();
});
