function random_int(b: number) {
  return Math.floor(Math.random() * (b + 1));
}

function shuffle(array: number[]) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

export function random_matrix(no_rows: number, no_cols: number, no_obs: number) {
  let arr = [];
  for (let i = 0; i < no_rows * no_cols; i++) {
    arr.push(i < no_obs ? 1 : 0);
  }

  shuffle(arr);

  let startPosition = { x: 0, y: 0 };
  let rand_pos = random_int(no_rows * no_cols - no_obs - 1);

  let matrix = [];
  let count = 0;
  for (let i = 0; i < no_rows; i++) {
    let row = [];
    for (let j = 0; j < no_cols; j++) {
      let item = arr[i * no_cols + j];
      row.push(item);
      if (item === 0) {
        if (count === rand_pos)
          startPosition = { x: j, y: i };
        count++;
      }
    }
    matrix.push(row);
  }
  return {
    matrix: matrix,
    startPosition: startPosition
  }
}