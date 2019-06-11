const moveButtons = [
  'up', 'left', 'down', 'right'
];

const moveColors = ['1', '2', '3', '4',
  '5'
];

const moves = [];
moveButtons.forEach((button) => {
  moveColors.forEach((color) => {
    const move = button + color;
    moves.push(move);
  });
});

const solverLoad = () => {
  document.getElementById('solve').addEventListener('click', () => {
    const solutionTa = document.getElementById('solution');

    // alert('solve');
    const moves = solutionTa.value.split(new RegExp('\\s+'));
    // alert(`moves ${moves}`);
    // console.log('moves', moves);

    moves.forEach((move) => {
      if (move != '') {
        const elt = document.getElementById(move);
        // console.log('move, elt', move, elt);
        if (elt) {
          const oldState = JSON.stringify(state);
          elt.click();
          const newState = JSON.stringify(state);
          const stateChanged = oldState != newState;
          console.log('move', move, 'stateChanged', stateChanged);
        }
      }
    });

  }, false)
  const saveInvalidState = false;

  const validPaths = [];
  validPaths.push([]);

  const visitedStates = new Set();

  let intervalId;

  // console.log('moves.length', moves.length);

  const clickReset = () => {
    const elt = document.getElementById('reset');
    elt.click();
  }

  const appendToPath = (validPath, newMove) => {
    const newPath = [];
    validPath.forEach((move) => {
      newPath.push(move);
    });
    newPath.push(newMove);
    return newPath;
  }

  const solveNextStep = () => {
    let foundFinish = false;
    const nextValidPaths = [];
    const invalidPathStatus = {};
    const validPathStatus = {};

    validPaths.forEach((validPath) => {
      moves.forEach((move) => {
        clickReset();

        validPath.forEach((prevMove) => {
          const elt = document.getElementById(prevMove);
          // console.log('move, elt', move, elt);
          if (elt) {
            elt.click();
          }
        });

        const oldState = JSON.stringify(state);
        const elt = document.getElementById(move);
        elt.click();
        const newState = JSON.stringify(state);

        let status;
        let invalidPath = true;
        if (finished()) {
          status = 'finished';
          foundFinish = true;
          invalidPath = false;
        } else if (visitedStates.has(newState)) {
          status = 'loopBack';
        } else {
          const stateChanged = oldState != newState;
          if (stateChanged) {
            status = 'stateChanged';
            invalidPath = false;
          } else {
            status = 'blocked';
          }
        }
        if (invalidPath) {
          if (saveInvalidState) {
            const newPath = appendToPath(validPath, move);
            invalidPathStatus[newPath] = status;
          }
        } else {
          const newPath = appendToPath(validPath, move);
          if (saveInvalidState) {
            validPathStatus[newPath] = status + oldState + ' ' + newState;
          } else {
            validPathStatus[newPath] = status;
          }
          nextValidPaths.push(newPath);
          visitedStates.add(newState);
        }
      });
    });
    validPaths.length = 0;
    nextValidPaths.forEach((path) => {
      validPaths.push(path);
    });
    if (foundFinish) {
      clearInterval(intervalId);
    }
    const solutionTa = document.getElementById('solution');
    solutionTa.value = 'found finish:' + foundFinish + '\n';
    solutionTa.value += 'valid paths:' + validPaths.length + '\n';

    validPaths.forEach((validPath) => {
      solutionTa.value += validPath.length;
      solutionTa.value += ' ';
      solutionTa.value += validPath;
      const status = validPathStatus[validPath];
      solutionTa.value += ' ';
      solutionTa.value += status;
      solutionTa.value += '\n';
    });
    Object.keys(invalidPathStatus).forEach((invalidPath) => {
      const status = invalidPathStatus[invalidPath];
      solutionTa.value += status;
      solutionTa.value += ' ';
      solutionTa.value += invalidPath;
      solutionTa.value += '\n';
    });
  }

  document.getElementById('solve-random').addEventListener('click', () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    intervalId = setInterval(solveNextStep, 1000);
  }, false)

  document.getElementById('stop-solve-random').addEventListener('click', () => {
    clearInterval(intervalId);
  }, false)

}
