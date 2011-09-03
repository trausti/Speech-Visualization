var numErrors_ = 0;  // Test error counter.
/**
* Prints the name of the test function. 
* This should be included at the beginning of each test
*/
function TEST_TITLE() {
  var ownName = arguments.callee.caller.toString();
  // Trim off "function ".
  ownName = ownName.substr('function '.length);
  // Trim off everything after the function name.
  ownName = ownName.substr(0, ownName.indexOf('('));
  LOG('========================================');
  LOG('Running test:   ' + ownName);
  LOG('');
  numErrors_ = 0;
}
    
/**
* Prints the name of the test function. 
* This should be included at the beginning of each test
*/
function TEST_SUMMARY() {
  var ownName = arguments.callee.caller.toString();
  // Trim off "function ".
  ownName = ownName.substr('function '.length);
  // Trim off everything after the function name.
  ownName = ownName.substr(0, ownName.indexOf('('));
  if (0 == numErrors_) {
    LOG('');
    LOG(ownName + ' <font color="green">SUCCEEDED</font>');
  } else {
    LOG('');
    LOG(ownName + ' <font color="red">FAILED</font> with ' + numErrors_
        + ' errors.');
  }
  numErrors_ = 0;
}
    
/**
* Log to the div
*/
function LOG(stringToLog) {
  var pTag = document.createElement("p");
  pTag.setAttribute("align","left");
  pTag.innerHTML = stringToLog;
  var logDiv = document.getElementById('logOutput');
  logDiv.appendChild(pTag);
}
    
/**
* EXPECT_NEAR checks if floating point numbers are close to each
* other.
*/
function EXPECT_NEAR(x1, x2, tolerance, stringOnFail) {
  if (isNaN(x1) || isNaN(x2)) {
    LOG('EXPECT_NEAR FAILED');
    LOG('x1: ' + x1);
    LOG('x2: ' + x2);
    LOG(stringOnFail);
    numErrors_ += 1;
  } else {
    if (Math.abs(x2 - x1) > tolerance) {
      LOG('EXPECT_NEAR FAILED');
      LOG('x1: ' + x1);
      LOG('x2: ' + x2);
      LOG('Difference of ' + Math.abs(x2 - x1) + ' exceeds tolerance of '
          + tolerance);
      LOG(stringOnFail);
      numErrors_ += 1;
    }
  }
}

/**
* EXPECT_EQ checks if numbers are equal
*/
function EXPECT_EQ(x1, x2, stringOnFail) {
  if (isNaN(x1) || isNaN(x2) || x1 != x2) {
    LOG('EXPECT_EQ FAILED');
    LOG('x1: ' + x1);
    LOG('x2: ' + x2);
    LOG(stringOnFail);
    numErrors_ += 1;
  }
}
