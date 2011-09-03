/**
 * Mel frequency cepstrum coefficient (MFCC) computation.
 * 
 * Based on Matlab code by Dan Ellis
 * 
 * Authors: Trausti Kristjansson, Matthew Lloyd.
 */

/**
 * Class for computing MFCC given the power spectrum.
 */
function MFCC() {
  this.sr = 8000;  // Sample rate.
  this.nfilts = 40;  // Number of Mel filterbanks. Why not 23?
  this.width = 1.0;  //
  this.minfrq = 0;  // Minumum frequency.
  this.maxfrq = this.sr / 2;  // Maximum frequency.
  this.nfft = 256;  // Length of fft.
  this.ncep = 13;  // Number of cepstral coefficients.
  
  // Center freqs of each FFT bin.
  this.fftfrqs = new Array();
  for (i = 0; i < this.nfft; i++) {
    this.fftfrqs[i] = i / this.nfft * this.sr;
  }
  
  // 'Center freqs' of Mel bands - uniformly spaced between limits.
  var minmel = this.hz2mel(this.minfrq);
  var maxmel = this.hz2mel(this.maxfrq);
  this.binfrqs = new Array();
  for (i = 0; i <= this.nfilts + 1; i++) {
    this.binfrqs[i] = this.mel2hz(minmel + i / (this.nfilts + 1) * (maxmel - minmel));
  }
}

/**
 * Log10.
 */
MFCC.prototype.log10 = function(x) {
  return Math.log(x) / Math.LN10;
}

function TEST_log10() {
  TEST_TITLE();
  mfcc = new MFCC();
  EXPECT_NEAR(0.0, mfcc.log10(1.0), "Expected log10(1) to be 0.");
  EXPECT_NEAR(1.0, mfcc.log10(10.0), "Expected log10(10) to be 1.");
  EXPECT_NEAR(2.0, mfcc.log10(100.0), "Expected log10(100) to be 2.");
  TEST_SUMMARY();
}

/**
 * Hertz to Mel frequency function.
 */
MFCC.prototype.hz2mel = function(f) {
  // HTK version
  return 2595.0 * this.log10(1 + f / 700.0);
}

function TEST_hz2mel() {
  TEST_TITLE();
  mfcc = new MFCC();
  EXPECT_NEAR(3000, mfcc.hz2mel(3000), "Exepcted the ?? hz to map to ?? on Mel scale");
  TEST_SUMMARY();
}


/**
 * Mel to Hertz function.
 */
MFCC.prototype.mel2hz = function(m) {
  return 700 * (Math.pow(10, m / 2595) - 1);
}

function TEST_mel2hz() {
  TEST_TITLE();
  mfcc = new MFCC();
  for (f = 100; f < 8000; f += 1000)
  EXPECT_NEAR(f, mfcc.mel2hz(mfcc.hz2mel(f)), "Expected f = mel2hz(hz2mel(f))");
  TEST_SUMMARY();
}

/**
 * Convert fft to Mel.
 */ 
MFCC.prototype.fft2mel = function(power_spectrum) {
  var filterbank = new Array();
  for (i = 0; i < nfilts; i++) {
    var total = 0;
    fs_low = binfrqs[i];
    fs_mid = binfrqs[i + 1];
    fs_high = binfrqs[i + 2];
    for (j = 0; j < nfft / 2 + 1; j++) {
      if (fftfrqs[j] < fs_low || fftfrqs[j] > fs_high) continue;
      loslope = (fftfrqs[j] - fs_low) / (fs_mid - fs_low);
      hislope = (fs_high - fftfrqs[j]) / (fs_high - fs_mid);
      total += power_spectrum[j] * Math.max(0, Math.min(loslope, hislope));
    }
    filterbank[i] = log10(total);
  }
}

function TEST_fft2mel() {
  TEST_TITLE();
  
  
  TEST_SUMMARY();
}

/**
 * Take Discrete Cosine transform of Mel filter values.
 */
MFCC.prototype.mel2dct = function(filterbank) {
  var dct = new Array();
  for (i = 0; i < this.ncep; i++) {
    var total = 0;
    for (j = 0; j < this.nfilts; j++) {
      total += filterbank[j] * Math.cos(i * (1 + 2 * j) 
          / (2 * this.nfilts) * Math.PI) * Math.sqrt(2.0 / this.nfilts) / Math.sqrt(2.0);
    }
    dct[i] = total;
  }
  return dct;
}

function TEST_mel2dct() {
  TEST_TITLE();
  
  
  TEST_SUMMARY();
}

/**
 * Run all tests
 */
function runAllTests() {
  TEST_log10();
  TEST_hz2mel();
  TEST_mel2hz();
  TEST_fft2mel();
  TEST_mel2dct(); 
}
