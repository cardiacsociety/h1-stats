$(document).ready(function() {
  
  loaderImages();
  
  report({
    api: 'https://api.mappcpd.com/v1/r/modulesbydate', 
    target: 'modulesbydate', 
    title: 'Modules By Date',
    dataLabel: '# modules'
  }, "bar");
  
  report({
    api: 'https://api.mappcpd.com/v1/r/pointsbyrecorddate', 
    target: 'pointsbyrecorddate', 
    title: 'Points by Record Date',
    dataLabel: '# points'
  }, "bar");
  
  report({
    api: 'https://api.mappcpd.com/v1/r/pointsbyactivitydate', 
    target: 'pointsbyactivitydate', 
    title: 'Points by Activity Date',
    dataLabel: '# points'
  }, "bar");
  
  reportLinks({
    api: 'https://csanz.io/popular.json?no=cache', 
    target: 'resourcesbyclicks', 
    title: 'Popular Resources',
    dataLabel: 'count'
  }, "pie")
  
  
});

function report(r, type) {

  $.getJSON(r.api, function(res) {
    r.labels = Object.keys(res.data);
    r.values = Object.values(res.data);
    r.count = r.values.length;
    doChart(r, type);
  });
}

function reportLinks(r, type) {
  
  $.getJSON(r.api, function(res) {
    
    var data = [];
    
    for (var i = 0; i < res.length; i++) {
      data[res[i].title] = res[i].clicks;
    }
      
    r.labels = Object.keys(data);
    r.values = Object.values(data);
    r.count = r.values.length;
    doPieChart(r, type);
  });
}

function doChart(r, chartType) {

  // Set colours according to goodness!
  var bgColours = [];
  var borderColours = [];

  var bgOpacity = 0.4;
  var borderOpacity = 1;

  // Percentile colours
  var clrs = [];
  // Black < 10%
  clrs.push('0, 0, 0');
  // Grey < 20%
  clrs.push('102, 102, 102');
  // purple < 30%
  clrs.push('129, 0, 127');
  // dk blue < 40%
  clrs.push('0, 51, 102');
  // lt blue < 50%
  clrs.push('173, 216, 230');
  // lt green < 60%
  clrs.push('144, 238, 144');
  // dk green < 70%
  clrs.push('1, 50, 32');
  // yellow < 80%
  clrs.push('254, 254, 0');
  // orange < 90%
  clrs.push('255, 165, 0');
  // red < 100%
  clrs.push('238, 0, 0');
  
  var min = 0;
  var max = Math.max(...r.values);
  var percentileIncrement = max / 10;
  //console.log('Percentile Increment is ' + percentileIncrement);

  for (var i = 0; i < r.count; i++) {
    // in which percentile does the current value live?
    var msg = "value " + r.values[i] + ", max value " + max;
    var percentile = Math.ceil(r.values[i] / percentileIncrement);
    if (percentile < 1) {
      percentile = 1;
    }
    msg += " =  percentile value of " + percentile;
    --percentile; // array key
    msg += " which is clr array key = " + percentile + " with value " + clrs[percentile];
    
    bgColours[i] = 'rgba(' + clrs[percentile] + ', ' + bgOpacity + ')';
    borderColours[i] = 'rgba(' + clrs[percentile] + ', ' + bgOpacity + ')';
    
    //console.log(msg);
  }

  var ctx = document.getElementById(r.target);
  var myChart = new Chart(ctx, {
    type: chartType,
    data: {
      labels: r.labels,
      datasets: [{
        label: r.dataLabel,
        data: r.values,
        backgroundColor: bgColours,
        borderColor: borderColours,
        borderWidth: 1
      }]
    },
    options: {
      title: {
        display: false,
        text: r.title
      },
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

function doPieChart(r, chartType) {

  // Set colours for each data point, from lowest to highest value
  var bgColours = [];
  var borderColours = [];

  var bgOpacity = 0.4;
  var borderOpacity = 1;

  // Colours
  var clrs = [];
  // Black < 10%
  clrs.push('0, 0, 0');
  // Grey < 20%
  clrs.push('102, 102, 102');
  // purple < 30%
  clrs.push('129, 0, 127');
  // dk blue < 40%
  clrs.push('0, 51, 102');
  // lt blue < 50%
  clrs.push('173, 216, 230');
  // lt green < 60%
  clrs.push('144, 238, 144');
  // dk green < 70%
  clrs.push('1, 50, 32');
  // yellow < 80%
  clrs.push('254, 254, 0');
  // orange < 90%
  clrs.push('255, 165, 0');
  // red < 100%
  clrs.push('238, 0, 0');
  
  clrs.reverse()
  
  // here we will just leave the clrs in order from lowest to highest
  // so just need to make sure data is in the same order
  
  for (var i = 0; i < r.count; i++) {
    bgColours[i] = 'rgba(' + clrs[i] + ', ' + bgOpacity + ')';
    borderColours[i] = 'rgba(' + clrs[i] + ', ' + bgOpacity + ')';
  }

  var ctx = document.getElementById(r.target);
  var myChart = new Chart(ctx, {
    type: chartType,
    data: {
      labels: r.labels,
      datasets: [{
        label: r.dataLabel,
        data: r.values,
        backgroundColor: bgColours,
        borderColor: borderColours,
        borderWidth: 1
      }]
    },
    options: {
      title: {
        display: false,
        text: r.title
      },
      legend: {
        display: true,
        position: 'bottom'
      }
    }
  });
}

function loaderImages() {
      var canvas = document.getElementById('resourcesbyclicks');
      var context = canvas.getContext('2d');
      var imageObj = new Image();

      imageObj.onload = function() {
        context.drawImage(imageObj, 400, 400);
      };
      imageObj.src = 'https://res.cloudinary.com/mesa/image/upload/v1485142454/csanz/default.svg'
}
