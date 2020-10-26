let sketchpad;

const sketchpadStrokes = [];
const onLoad = async () => {
  loadSketchpad();
};

const loadSketchpad = () => {
  const canvas = document.querySelector('#sketchpad');
  sketchpad = new Atrament(canvas);
  sketchpad.recordStrokes = true;
  sketchpad.adaptiveStroke = false;
  sketchpad.addEventListener('strokerecorded', ({stroke}) => {
    sketchpadStrokes.push(stroke);
  });

  const colors = [
    '#FFFFFF',
    '#000000',
    '#FF0000',
    '#770000',
    '#00FF00',
    '#007700',
    '#0000FF',
    '#000077',
    '#FFFF00',
    '#00FFFF',
    '#FF00FF',
    '#777700',
    '#007777',
    '#770077',
  ];
  const colorInputsElt = document.querySelector('#color_inputs');
  const buttonSize = 35;
  const buttonColorPatchSize = buttonSize-15;

  let html = '<label class="align_top">Active Color:</label>';
  html += `<button class="color_display" style="width:${buttonSize}px;height:${buttonSize}px;" disabled>`;
  html += `<div id="color_display" style="width:${buttonColorPatchSize}px;height:${buttonColorPatchSize}px;"></div>`;
  html += '</button>';
  html += '<p>';
  // html += `<div style="width:${buttonSize}px;height:${buttonSize}px;display:inline-block"></div>`;
  colors.forEach((color, colorIx) => {
    html += `<button class="color_input" style="width:${buttonSize}px;height:${buttonSize}px;" onclick="return setSketchpadColor('${color}')">`;
    html += `<div style="background-color:${color};width:${buttonColorPatchSize}px;height:${buttonColorPatchSize}px;">`;
    html += `</div>`;
    html += `</button>`;
  });
  colorInputsElt.innerHTML = html;

  setSketchpadColor('#000000');
};

const clearSketchpad = () => {
  sketchpad.clear();
  sketchpadStrokes.length = 0;
};

const playStrokes = (strokes) => {
  // console.log('playStrokes', strokes);
  strokes.forEach((stroke) => {
    // set drawing options
    sketchpad.mode = stroke.mode;
    sketchpad.weight = stroke.weight;
    sketchpad.smoothing = stroke.smoothing;
    sketchpad.color = stroke.color;
    sketchpad.adaptiveStroke = stroke.adaptiveStroke;

    // don't want to modify original data
    const points = stroke.points.slice();

    const firstPoint = points.shift();
    // beginStroke moves the "pen" to the given position and starts the path
    sketchpad.beginStroke(firstPoint.x, firstPoint.y);

    let prevPoint = firstPoint;
    while (points.length > 0) {
      const point = points.shift();

      // the `draw` method accepts the current real coordinates
      // (i. e. actual cursor position), and the previous processed (filtered)
      // position. It returns an object with the current processed position.
      const {x, y} = sketchpad.draw(point.x, point.y, prevPoint.x, prevPoint.y);

      // the processed position is the one where the line is actually drawn to
      // so we have to store it and pass it to `draw` in the next step
      prevPoint = {x, y};
    }

    // endStroke closes the path
    sketchpad.endStroke(prevPoint.x, prevPoint.y);
  });
};

const undoSketchpad = () => {
  const resetColor = sketchpad.color;
  const resetWeight = sketchpad.weight;
  const replayStrokes = [...sketchpadStrokes];
  sketchpad.clear();
  sketchpadStrokes.length = 0;
  // console.log('replayStrokes.length pre', replayStrokes.length);
  replayStrokes.pop();
  replayStrokes.pop();
  // console.log('replayStrokes.length post', replayStrokes.length);
  playStrokes(replayStrokes);
  sketchpad.color = resetColor;
  sketchpad.weight = resetWeight;
};

const setSketchpadColor = (color) => {
  const colorDisplayElt = document.querySelector('#color_display');
  colorDisplayElt.style.backgroundColor = color;
  sketchpad.color = color;

  return false;
};

const showDrawing = (drawingData) => {
  displayErrorMessage(drawingData.messageType, drawingData.message);
  stories.length = 0;
  const storyElt = document.querySelector('#story');
  let html = '';
  html += `<div id="story${drawingData.story.hash}"></div>`;
  story.innerHTML = html;
  addStory(drawingData);
  // console.log('/drawing.json data', drawingData.story.hash, drawingData.defaultDescriptionIx);
  clearSketchpad();
  if (drawingData.drawing) {
    playStrokes(drawingData.drawing.drawing);
  }
};

const getDrawing = () => {
  // console.log('STARTED getDrawing', recaptchaToken);
  const xmlhttp = new XMLHttpRequest();
  const actionAndParms = {};
  actionAndParms.recaptchaToken = recaptchaToken;
  if (stories.length > 0) {
    const storyData = stories[0];
    actionAndParms.action = 'submit_drawing';
    const drawing = JSON.stringify(sketchpadStrokes);
    // console.log('drawing', drawing);
    actionAndParms.drawing = btoa(drawing);
    actionAndParms.drawing_hash = storyData.story.hash;
    actionAndParms.story_ix = storyData.defaultDescriptionIx;
  }
  const url = `drawing.json`;

  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // console.log('SUCCESS getDrawing', this.responseText.length);
      const drawingData = JSON.parse(this.responseText);
      showDrawing(drawingData);
    }
  };
  xmlhttp.open('POST', url, true);
  xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xmlhttp.send(JSON.stringify(actionAndParms));
};

const convertToSvg = () => {
  const line = (pointA, pointB) => {
    const lengthX = pointB.x - pointA.x;
    const lengthY = pointB.y - pointA.y;
    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX),
    };
  };
  const controlPoint = (current, previous, next, reverse, smoothing) => {
  // When 'current' is the first or last point of the array
  // 'previous' or 'next' don't exist.
  // Replace with 'current'
    const p = previous || current;
    const n = next || current;
    // Properties of the opposed-line
    const o = line(p, n);
    // If is end-control-point, add PI to the angle to go backward
    const angle = o.angle + (reverse ? Math.PI : 0);
    const length = o.length * smoothing;
    // The control point position is relative to the current point
    const x = current.x + Math.cos(angle) * length;
    const y = current.y + Math.sin(angle) * length;
    return [x, y];
  };
  const bezierCommand = (point, i, a, smoothing) => {
  // start control point
    const [cpsX, cpsY] = controlPoint(a[i - 1], a[i - 2], point, false, smoothing);
    // end control point
    const [cpeX, cpeY] = controlPoint(point, a[i - 1], a[i + 1], true, smoothing);
    return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point.x},${point.y} `;
  };
  // console.log('convertToSvg', 'sketchpadStrokes.length', sketchpadStrokes.length);
  submissionType.sketchpad = [];
  for (let ix = 0; ix < sketchpadStrokes.length; ix++) {
    const spData = sketchpadStrokes[ix];
    const dedupPoints = [];
    for (let pointIx = 0; pointIx < spData.points.length; pointIx++) {
      const point = spData.points[pointIx];
      if (pointIx == 0) {
        dedupPoints.push(point);
      } else {
        const prevPoint = dedupPoints[dedupPoints.length-1];
        // console.log('dedupPoints', 'dedupPoints.length', dedupPoints.length);
        // console.log('dedupPoints', 'point', point);
        // console.log('dedupPoints', 'prevPoint', prevPoint);
        if ((prevPoint.x != point.x) || (prevPoint.y != point.y)) {
          dedupPoints.push(point);
        }
      }
    }
    if (dedupPoints.length > 1) {
      console.log('spData', ix, spData);
      console.log('dedupPoints', ix, dedupPoints);
      const lineData = {};
      lineData.fill = 'none';
      lineData.stroke = spData.color;
      lineData['stroke-width'] = spData.weight+1;
      lineData['stroke-linecap'] = 'round';
      lineData.d = '';
      for (let pointIx = 0; pointIx < dedupPoints.length; pointIx++) {
        const point = dedupPoints[pointIx];
        if (pointIx == 0) {
          lineData.d += `M ${point.x} ${point.y} `;
          if (spData.points.length == 1) {
            lineData.d += `L ${point.x} ${point.y} `;
          }
        } else {
          // lineData.d += `L ${point.x} ${point.y} `;
          lineData.d += bezierCommand(point, pointIx, dedupPoints, spData.smoothing);
        }
      }

      submissionType.sketchpad.push(lineData);
    }
  }
  loadReferenceDrawing();
};
