// MFCC computation.
//
// Quick hack based on Matlab code by Dan Ellis.

function log10(x) {
  return Math.log(x) / Math.LN10;
}

function hz2mel(f) {
  // HTK version
  return 2595.0 * log10(1 + f / 700.0);
}

function mel2hz(m) {
  return 700 * (Math.pow(10, m / 2595) - 1);
}
var sr = 8000;
var nfilts = 40; // 23?
var width = 1.0;
var minfrq = 0;
var maxfrq = sr / 2;
var nfft = 256;
var ncep = 13;
// Center freqs of each FFT bin
fftfrqs = new Array();
for (i = 0; i < nfft; i++) {
  fftfrqs[i] = i / nfft * sr;
}
// 'Center freqs' of mel bands - uniformly spaced between limits
minmel = hz2mel(minfrq);
maxmel = hz2mel(maxfrq);
binfrqs = new Array();
for (i = 0; i <= nfilts + 1; i++) {
  binfrqs[i] = mel2hz(minmel + i / (nfilts + 1) * (maxmel - minmel));
}

function fft2mel(power_spectrum) {
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
  var dct = new Array();
  for (i = 0; i < ncep; i++) {
    var total = 0;
    for (j = 0; j < nfilts; j++) {
      // cos((i-1)*    [1:2:(2*nrow-1)]/(2*nrow)      *pi) * sqrt(2/nrow);
      total += filterbank[j] * Math.cos(i * (1 + 2 * j) / (2 * nfilts) * Math.PI) * Math.sqrt(2.0 / nfilts) / Math.sqrt(2.0);
    }
    dct[i] = total;
  }
  return dct;
}