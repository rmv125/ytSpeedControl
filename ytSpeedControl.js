// ==UserScript==
// @name        ytSpeedControl
// @namespace   https://github.com/rmv125
// @include     https://www.youtube.com/watch?*
// @version     1
// @grant       none
// ==/UserScript==

const CHANGE_STEP = 0.05;
const LS_KEY = 'userscriptYtSpeedControl'

class SpeedController {
  constructor(video) {
    this.speed = this._getSpeed();
    this.video = video;
    this._setSpeed(this.speed);
  }
  
  speedUp() {
    this._setSpeed(this.speed + CHANGE_STEP);
  }
  
  slowDown() {
    if(this.speed <= CHANGE_STEP) return;
    this._setSpeed(this.speed - CHANGE_STEP);
  }
  
  resetSpeed() {
    this._setSpeed(1);
  }
  
  _getSpeed() {
    const val = localStorage.getItem(LS_KEY);
    return val ? +val : 1;
  }
  
  _setSpeed(speed) {
    this.speed = speed;
    this.video.playbackRate = speed;
    localStorage.setItem(LS_KEY, speed);
  }
}

// simple case
function init() {
  const speedController = new SpeedController(document.querySelector('video'));
  const { button, indicator } = injectButton();
  button.addEventListener('wheel', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if(e.deltaY < 0) {
      speedController.speedUp();
    } else {
      speedController.slowDown();
    }
    indicator.innerHTML = speedController.speed.toFixed(2);
  });
  
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    speedController.resetSpeed();
    indicator.innerHTML = speedController.speed.toFixed(2);
  });
  
  indicator.innerHTML = speedController.speed.toFixed(2);
}

function injectButton() {
  const icon = '<svg version="1.1" fill="#fff" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="36px" viewBox="0 0 48 48" height="25px"><path clip-rule="evenodd" d="M44.9,32.971c0,0.011,0.006,0.019,0.006,0.029c0,0.005-0.003,0.01-0.003,0.016  c0.001,0.005,0.003,0.01,0.003,0.016c0,0.552-0.447,1-1,1C43.921,34.031,35,34,35,34c-0.553,0-1-0.448-1-1c0-0.553,0.447-1,1-1  h7.946C42.965,31.666,43,31.338,43,31c0-10.493-8.507-19-19-19S5,20.507,5,31c0,0.338,0.035,0.666,0.053,1H13c0.553,0,1,0.447,1,1  c0,0.552-0.447,1-1,1c0,0-8.92,0.031-8.906,0.031c-0.553,0-1-0.448-1-1c0-0.006,0.002-0.011,0.003-0.016  c0-0.006-0.003-0.011-0.003-0.016c0-0.011,0.006-0.019,0.006-0.028C3.039,32.321,3,31.665,3,31c0-11.599,9.402-21,21-21  s21,9.401,21,21C45,31.665,44.961,32.321,44.9,32.971z M17.523,21.128c0.393-0.216,0.865-0.144,1.189,0.133l-0.05-0.083  c8.774,6.42,10.577,9.373,10.61,9.428c1.433,2.357,0.581,5.371-1.899,6.731s-5.653,0.553-7.085-1.804  c-0.035-0.053-1.824-3.014-3.291-13.442l0.051,0.082C16.959,21.769,17.131,21.343,17.523,21.128z M22.086,34.549  c0.555,0.911,1.589,1.478,2.699,1.478c0.542,0,1.079-0.137,1.552-0.397c0.72-0.395,1.235-1.031,1.45-1.794  c0.216-0.764,0.105-1.56-0.303-2.232c-0.017-0.025-1.572-2.386-8.062-7.348C20.703,32.071,22.075,34.529,22.086,34.549z" fill-rule="evenodd"/></svg>'
  const button = document.createElement('button');
  const indicator = document.createElement('div');
  button.className = 'ytp-button speed-button';
  indicator.className = 'speed-indicator';
  button.innerHTML = icon;
  button.appendChild(indicator);
  document.querySelector('.ytp-left-controls').insertBefore(button, document.querySelector('.ytp-next-button'));
  return { button, indicator };
}

init();

////////////////////////////////// styles /////////////////////////////////////////////

const styles = `
  .speed-button {
    vertical-align: top;
    position: relative;
    height: 36px;
    width: 36px;
    padding-top: 3px;
  }
  .speed-indicator {
    position: absolute;
    bottom: 3px;
    line-height: 1;
    width: 100%;
    text-align: center;
    font-size: 9px;
  }
`;
const style_node = document.createElement('style');
style_node.appendChild(document.createTextNode(styles));
document.head.appendChild(style_node);
