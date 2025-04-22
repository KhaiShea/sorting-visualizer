# Sorting Algorithm Visualizer

A web-based tool to visualize various sorting algorithms in action. This project allows users to shuffle an array, select a sorting algorithm, and watch the sorting process step by step with visual and audio feedback.

## Live Demo

Try it out here: [Sorting Visualizer](https://khaishea.github.io/sorting-visualizer/)

---

## Features

- **Sorting Algorithms**: Visualize the following algorithms:
  - Bubble Sort
  - Insertion Sort
  - Selection Sort
  - Merge Sort
  - Quick Sort
  - Heap Sort
  - Counting Sort
  - Radix Sort
  - Bucket Sort
  - Shell Sort
  - Cocktail Shaker Sort
  - Comb Sort
  - Bogo Sort
- **Customizable Settings**:
  - Adjust the number of items in the array.
  - Control the sorting speed.
  - Enable or disable sound effects.
  - Toggle Rainbow Mode for colorful visualizations.
- **Dark and Light Themes**: Switch between dark and light modes.

---

## How to Use

1. **Visit the Live Demo**: Open the [Sorting Visualizer](https://khaishea.github.io/sorting-visualizer/) in your browser.
2. **Choose a Sorting Algorithm**: Use the dropdown menu to select an algorithm.
3. **Customize Settings**:
   - Adjust the number of items using the slider.
   - Set the sorting speed using the latency slider.
4. **Shuffle the Array**: Click the "🔀 Shuffle" button to randomize the array.
5. **Run the Algorithm**: Click the "▶️ Run" button to start the sorting process.
6. **Toggle Features**:
   - Use the "🌈 Rainbow" button to enable or disable colorful visualizations.
   - Use the "🔊 Sound" button to enable or disable sound effects.
   - Use the "🌓 Toggle Theme" button to switch between dark and light modes.
7. **Stop the Sorting**: Click the "⏹️ Stop" button to cancel the sorting process.

---

## Sorting Algorithms Explained

### 1. **Bubble Sort**
- **Time Complexity**: O(n²)
- **Space Complexity**: O(1)
- Repeatedly compares adjacent elements and swaps them if they are in the wrong order.

### 2. **Insertion Sort**
- **Time Complexity**: O(n²)
- **Space Complexity**: O(1)
- Builds the sorted array one element at a time by inserting elements into their correct position.

### 3. **Selection Sort**
- **Time Complexity**: O(n²)
- **Space Complexity**: O(1)
- Selects the smallest element from the unsorted part and swaps it with the first unsorted element.

### 4. **Merge Sort**
- **Time Complexity**: O(n log n)
- **Space Complexity**: O(n)
- Divides the array into halves, sorts each half, and merges them back together.

### 5. **Quick Sort**
- **Time Complexity**: O(n log n)
- **Space Complexity**: O(log n)
- Selects a pivot element and partitions the array into elements less than and greater than the pivot, then recursively sorts the partitions.

### 6. **Heap Sort**
- **Time Complexity**: O(n log n)
- **Space Complexity**: O(1)
- Builds a max heap and repeatedly extracts the largest element to sort the array.

### 7. **Counting Sort**
- **Time Complexity**: O(n + k)
- **Space Complexity**: O(k)
- Counts the occurrences of each element and uses this information to place elements in sorted order.

### 8. **Radix Sort**
- **Time Complexity**: O(nk)
- **Space Complexity**: O(n + k)
- Sorts numbers digit by digit, starting from the least significant digit.

### 9. **Bucket Sort**
- **Time Complexity**: O(n + k)
- **Space Complexity**: O(n + k)
- Distributes elements into buckets, sorts each bucket, and concatenates them.

### 10. **Shell Sort**
- **Time Complexity**: O(n log² n)
- **Space Complexity**: O(1)
- Sorts elements at specific intervals, reducing the interval with each pass.

### 11. **Cocktail Shaker Sort**
- **Time Complexity**: O(n²)
- **Space Complexity**: O(1)
- A variation of Bubble Sort that sorts in both directions.

### 12. **Comb Sort**
- **Time Complexity**: O(n²)
- **Space Complexity**: O(1)
- Improves Bubble Sort by using a gap to compare elements.

### 13. **Bogo Sort**
- **Time Complexity**: O((n+1)!)
- **Space Complexity**: O(1)
- Randomly shuffles the array until it is sorted.

---

## Development

### Prerequisites
- A modern web browser (e.g., Chrome, Edge, Firefox).
- A text editor (e.g., VS Code) for local development.

### Running Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/khaishea/sorting-visualizer.git
   ```
2. Navigate to the project directory:
   ```bash
   cd sorting-visualizer
   ```
3. Open `index.html` in your browser.

---

## License

This project is licensed under the **GNU Affero General Public License (AGPL)**.  
You are free to use, modify, and distribute this project, provided that any modifications or derivative works are also licensed under the AGPL.  
For more details, see the [LICENSE](LICENSE) file.

---

## Acknowledgments

- Inspired by various sorting algorithm visualizers.
- Built with ❤️ by [khaishea](https://github.com/khaishea).