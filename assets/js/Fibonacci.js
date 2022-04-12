function smallestCommons(arr) {
    const getAllMultiples = (number) => {
      let allMultiplesArray = [];
      for (let i = 1; i < number; i++) {
        if (number % i === 0) {
          allMultiplesArray.push(i);
        }
      }
      return allMultiplesArray;
    }
    let minValue = arr[0];
    let maxValue = arr[1];
    if (arr[0] > arr[1]) {
      minValue = arr[1];
      maxValue = arr[0];
    }
    let maxMultiple = 1;
    for (let i = minValue; i <= maxValue; i++) {
      maxMultiple = maxMultiple*i;
    }
    let possiblesMultiples = getAllMultiples(maxMultiple);
    console.log(maxMultiple);
    console.log(possiblesMultiples);
    let minMultiple = maxMultiple;
    for (let j = possiblesMultiples.length-1; j >= 0; j--) {
      let multiple = possiblesMultiples[j];
      let counter = 0;
      console.log("======")
      for (let i = minValue; i <= maxValue; i++) {
        if (multiple % i === 0) {
          counter = counter + 1;
          console.log(i);
        }
      }
      console.log("======")
      if (counter === (maxValue-minValue)+1) {
        minMultiple = multiple;
      }
    }
    return minMultiple;
  }

console.log(smallestCommons([18,23]));