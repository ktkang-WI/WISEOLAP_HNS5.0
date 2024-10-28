class MinHeap {
  constructor(size) {
    this.heap = [];
    this.size = size;
  }

  insert(value) {
    if (this.heap.length < this.size) {
      this.heap.push(value);
      this.heap.sort((a, b) => b - a);
    } else if (value > this.heap[this.heap.length - 1]) {
      this.heap[this.heap.length - 1] = value;
      this.heap.sort((a, b) => b - a);
    }
  }

  getValues() {
    return this.heap.slice().sort((a, b) => a - b);
  }
}

class MaxHeap {
  constructor(size) {
    this.heap = [];
    this.size = size;
  }

  insert(value) {
    if (this.heap.length < this.size) {
      this.heap.push(value);
      this.heap.sort((a, b) => a - b);
    } else if (value < this.heap[this.heap.length - 1]) {
      this.heap[this.heap.length - 1] = value;
      this.heap.sort((a, b) => a - b);
    }
  }

  getValues() {
    return this.heap.slice().sort((a, b) => b - a);
  }
}

export const findTopAndBottom = (data, target, topN, bottomN) => {
  const topHeap = new MinHeap(topN || 0);
  const bottomHeap = new MaxHeap(bottomN || 0);

  data.forEach((row) => {
    topHeap.insert(row[target]);
    bottomHeap.insert(row[target]);
  });

  return {
    topValues: topHeap.getValues(),
    bottomValues: bottomHeap.getValues()
  };
};
