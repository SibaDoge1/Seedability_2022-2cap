var styleSheet = null;

function refreshFilter() {
  chrome.storage.sync.get(['colorBlind', 'filter'], function(result) {
    console.log('colorBlind is set to ' + result.colorBlind);
    let filterName = result.filter == "True" ? result.colorBlind : null
    console.log("filter = " + filterName)
    var styles = `body { filter: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3Cdefs%3E%3Cfilter id='protanopia'%3E%3CfeColorMatrix in='SourceGraphic' type='matrix' values='0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0'/%3E%3C/filter%3E%3Cfilter id='fixProtanopia'%3E%3CfeColorMatrix in='SourceGraphic' type='matrix' values='1.005, 0.0056, -0.016, 0, 0 0.667, 0.0062, 0.3527, 0, 0 0.344, 0.004, 0.6155, 0, 0 0, 0, 0, 1, 0'/%3E%3C/filter%3E%3Cfilter id='protanomaly'%3E%3CfeColorMatrix in='SourceGraphic' type='matrix' values='0.817, 0.183, 0, 0, 0 0.333, 0.667, 0, 0, 0 0, 0.125, 0.875, 0, 0 0, 0, 0, 1, 0'/%3E%3C/filter%3E%3Cfilter id='deuteranopia'%3E%3CfeColorMatrix in='SourceGraphic' type='matrix' values='0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0'/%3E%3C/filter%3E%3Cfilter id='fixDeuteranopia'%3E%3CfeColorMatrix in='SourceGraphic' type='matrix' values='0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0'/%3E%3C/filter%3E%3Cfilter id='deuteranomaly'%3E%3CfeColorMatrix in='SourceGraphic' type='matrix' values='0.8, 0.2, 0, 0, 0 0.258, 0.742, 0, 0, 0 0, 0.142, 0.858, 0, 0 0, 0, 0, 1, 0'/%3E%3C/filter%3E%3Cfilter id='tritanopia'%3E%3CfeColorMatrix in='SourceGraphic' type='matrix' values='0.95, 0.05, 0, 0, 0 0, 0.433, 0.567, 0, 0 0, 0.475, 0.525, 0, 0 0, 0, 0, 1, 0'/%3E%3C/filter%3E%3Cfilter id='tritanomaly'%3E%3CfeColorMatrix in='SourceGraphic' type='matrix' values='0.967, 0.033, 0, 0, 0 0, 0.733, 0.267, 0, 0 0, 0.183, 0.817, 0, 0 0, 0, 0, 1, 0'/%3E%3C/filter%3E%3Cfilter id='achromatopsia'%3E%3CfeColorMatrix in='SourceGraphic' type='matrix' values='0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0, 0, 0, 1, 0'/%3E%3C/filter%3E%3Cfilter id='achromatomaly'%3E%3CfeColorMatrix in='SourceGraphic' type='matrix' values='0.618, 0.320, 0.062, 0, 0 0.163, 0.775, 0.062, 0, 0 0.163, 0.320, 0.516, 0, 0 0, 0, 0, 1, 0'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E
    #` + filterName + `") !important }`;
    styleSheet.innerText = styles;
  });
}

window.addEventListener('DOMContentLoaded', function(e) {
  styleSheet = document.createElement("style");
  var styles = `body { filter: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3Cdefs%3E%3Cfilter id='protanopia'%3E%3CfeColorMatrix in='SourceGraphic' type='matrix' values='0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0'/%3E%3C/filter%3E%3Cfilter id='fixProtanopia'%3E%3CfeColorMatrix in='SourceGraphic' type='matrix' values='0.25, 0, 0.75, 0, 0 0.5, 0.5, 0, 0, 0 1, 0, 0, 0, 0 0, 0, 0, 1, 0'/%3E%3C/filter%3E%3Cfilter id='protanomaly'%3E%3CfeColorMatrix in='SourceGraphic' type='matrix' values='0.817, 0.183, 0, 0, 0 0.333, 0.667, 0, 0, 0 0, 0.125, 0.875, 0, 0 0, 0, 0, 1, 0'/%3E%3C/filter%3E%3Cfilter id='deuteranopia'%3E%3CfeColorMatrix in='SourceGraphic' type='matrix' values='0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0'/%3E%3C/filter%3E%3Cfilter id='fixDeuteranopia'%3E%3CfeColorMatrix in='SourceGraphic' type='matrix' values='0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0'/%3E%3C/filter%3E%3Cfilter id='deuteranomaly'%3E%3CfeColorMatrix in='SourceGraphic' type='matrix' values='0.8, 0.2, 0, 0, 0 0.258, 0.742, 0, 0, 0 0, 0.142, 0.858, 0, 0 0, 0, 0, 1, 0'/%3E%3C/filter%3E%3Cfilter id='tritanopia'%3E%3CfeColorMatrix in='SourceGraphic' type='matrix' values='0.95, 0.05, 0, 0, 0 0, 0.433, 0.567, 0, 0 0, 0.475, 0.525, 0, 0 0, 0, 0, 1, 0'/%3E%3C/filter%3E%3Cfilter id='tritanomaly'%3E%3CfeColorMatrix in='SourceGraphic' type='matrix' values='0.967, 0.033, 0, 0, 0 0, 0.733, 0.267, 0, 0 0, 0.183, 0.817, 0, 0 0, 0, 0, 1, 0'/%3E%3C/filter%3E%3Cfilter id='achromatopsia'%3E%3CfeColorMatrix in='SourceGraphic' type='matrix' values='0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0, 0, 0, 1, 0'/%3E%3C/filter%3E%3Cfilter id='achromatomaly'%3E%3CfeColorMatrix in='SourceGraphic' type='matrix' values='0.618, 0.320, 0.062, 0, 0 0.163, 0.775, 0.062, 0, 0 0.163, 0.320, 0.516, 0, 0 0, 0, 0, 1, 0'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E
  #") !important }`;
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
  refreshFilter();
});

chrome.runtime.onMessage.addListener(msgObj => {
  if (msgObj.type == "filter" ||msgObj.type == "colorBlind") {
    refreshFilter();
  }
});

  // var styleSheet = document.createElement("style")
  // var svg = document.createElement("svg")
  // svg.setAttribute('height', "0")
  // svg.setAttribute('xmlns', "http://www.w3.org/2000/svg")
  // svg.innerHTML = `
  // <filter id="protanopia">
  // <feColorMatrix
  //   in="SourceGraphic"
  //   type="matrix"
  //   values="0.567, 0.433, 0,     0, 0
  //           0.558, 0.442, 0,     0, 0
  //           0,     0.242, 0.758, 0, 0
  //           0,     0,     0,     1, 0"/>
  // </filter>
  // <filter id="protanomaly">
  // <feColorMatrix
  //   in="SourceGraphic"
  //   type="matrix"
  //   values="0.817, 0.183, 0,     0, 0
  //           0.333, 0.667, 0,     0, 0
  //           0,     0.125, 0.875, 0, 0
  //           0,     0,     0,     1, 0"/>
  // </filter>
  // <filter id="deuteranopia">
  // <feColorMatrix
  //   in="SourceGraphic"
  //   type="matrix"
  //   values="0.625, 0.375, 0,   0, 0
  //           0.7,   0.3,   0,   0, 0
  //           0,     0.3,   0.7, 0, 0
  //           0,     0,     0,   1, 0"/>
  // </filter>
  // <filter id="deuteranomaly">
  // <feColorMatrix
  //   in="SourceGraphic"
  //   type="matrix"
  //   values="0.8,   0.2,   0,     0, 0
  //           0.258, 0.742, 0,     0, 0
  //           0,     0.142, 0.858, 0, 0
  //           0,     0,     0,     1, 0"/>
  // </filter>
  // <filter id="tritanopia">
  // <feColorMatrix
  //   in="SourceGraphic"
  //   type="matrix"
  //   values="0.95, 0.05,  0,     0, 0
  //           0,    0.433, 0.567, 0, 0
  //           0,    0.475, 0.525, 0, 0
  //           0,    0,     0,     1, 0"/>
  // </filter>
  // <filter id="tritanomaly">
  // <feColorMatrix
  //   in="SourceGraphic"
  //   type="matrix"
  //   values="0.967, 0.033, 0,     0, 0
  //           0,     0.733, 0.267, 0, 0
  //           0,     0.183, 0.817, 0, 0
  //           0,     0,     0,     1, 0"/>
  // </filter>
  // <filter id="achromatopsia">
  // <feColorMatrix
  //   in="SourceGraphic"
  //   type="matrix"
  //   values="0.299, 0.587, 0.114, 0, 0
  //           0.299, 0.587, 0.114, 0, 0
  //           0.299, 0.587, 0.114, 0, 0
  //           0,     0,     0,     1, 0"/>
  // </filter>
  // <filter id="achromatomaly">
  // <feColorMatrix
  //   in="SourceGraphic"
  //   type="matrix"
  //   values="0.618, 0.320, 0.062, 0, 0
  //           0.163, 0.775, 0.062, 0, 0
  //           0.163, 0.320, 0.516, 0, 0
  //           0,     0,     0,     1, 0"/>
  // </filter>`
  // styleSheet.innerText = styles
  // document.head.appendChild(svg)
  // document.head.appendChild(styleSheet)