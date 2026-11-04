// Every number here comes from Rathore, Gupta, Sharma & Singh, Renewable Energy 247 (2025)
// 123021. Table / section references are given next to each block.

export const DOI = 'https://doi.org/10.1016/j.renene.2025.123021'

export const MODELS = [
  { key: 'rf', label: 'Random forest' },
  { key: 'lstm', label: 'LSTM' },
  { key: 'am', label: 'AM-LSTM' },
  { key: 'nam', label: 'N-AM-LSTM' },
  { key: 'ours', label: 'N-FFT-AM-LSTM (ours)' },
]

// Table 1
export const SITES = [
  { name: 'Jodhpur', state: 'Rajasthan', lat: '26.23° N', lon: '73.02° E', climate: 'Hot and dry' },
  { name: 'Kamuthi', state: 'Tamil Nadu', lat: '9.34° N', lon: '78.39° E', climate: 'Warm and humid' },
  { name: 'Chikkoppa', state: 'Karnataka', lat: '15.82° N', lon: '74.9° E', climate: 'Warm and humid' },
  { name: 'Charanka', state: 'Gujarat', lat: '23.88° N', lon: '71.17° E', climate: 'Hot and dry' },
]

// Table 5: test set, RMSE in W/m², nRMSE in %.
export const OVERALL = {
  Jodhpur: {
    rmse: { rf: 92.34, lstm: 88.6, am: 91.22, nam: 69.22, ours: 67.52 },
    nrmse: { rf: 9.22, lstm: 8.83, am: 8.85, nam: 6.91, ours: 6.74 },
    r: { rf: 0.9417, lstm: 0.9472, am: 0.9464, nam: 0.9712, ours: 0.9708 },
  },
  Kamuthi: {
    rmse: { rf: 125.26, lstm: 120.5, am: 121.26, nam: 71.5, ours: 51.89 },
    nrmse: { rf: 12.04, lstm: 11.58, am: 11.65, nam: 6.87, ours: 4.98 },
    r: { rf: 0.8973, lstm: 0.9054, am: 0.9051, nam: 0.9678, ours: 0.9833 },
  },
  Chikkoppa: {
    rmse: { rf: 111.2, lstm: 104.87, am: 107.47, nam: 87.36, ours: 70.12 },
    nrmse: { rf: 10.96, lstm: 10.34, am: 10.59, nam: 8.61, ours: 7.37 },
    r: { rf: 0.915, lstm: 0.9244, am: 0.9229, nam: 0.9502, ours: 0.9648 },
  },
  Charanka: {
    rmse: { rf: 94.67, lstm: 91.79, am: 88.49, nam: 63.87, ours: 62.38 },
    nrmse: { rf: 9.49, lstm: 9.21, am: 8.88, nam: 6.38, ours: 6.26 },
    r: { rf: 0.9472, lstm: 0.9439, am: 0.9458, nam: 0.9751, ours: 0.9695 },
  },
}

// Table 7: seasonal test-set RMSE (W/m²). IMD seasons.
export const SEASONS = [
  { key: 'summer', label: 'Summer', months: 'Mar – May' },
  { key: 'monsoon', label: 'Monsoon', months: 'Jun – Sep' },
  { key: 'autumn', label: 'Autumn', months: 'Oct – Nov' },
  { key: 'winter', label: 'Winter', months: 'Dec – Feb' },
]

export const SEASONAL_RMSE = {
  summer: {
    Jodhpur: { rf: 63.31, lstm: 61.45, am: 64.48, nam: 62.73, ours: 54.84 },
    Kamuthi: { rf: 107.34, lstm: 101.59, am: 101.2, nam: 63.3, ours: 46.88 },
    Chikkoppa: { rf: 98.14, lstm: 95.05, am: 97.98, nam: 77.44, ours: 63.98 },
    Charanka: { rf: 52.73, lstm: 51.49, am: 60.18, nam: 46.8, ours: 49.4 },
  },
  monsoon: {
    Jodhpur: { rf: 136.49, lstm: 129.33, am: 129.04, nam: 107.39, ours: 90.29 },
    Kamuthi: { rf: 125.45, lstm: 122.29, am: 124.1, nam: 77.57, ours: 55.7 },
    Chikkoppa: { rf: 142.48, lstm: 133.31, am: 135.42, nam: 99.87, ours: 88.86 },
    Charanka: { rf: 146.79, lstm: 134.78, am: 135.7, nam: 91.88, ours: 90.29 },
  },
  autumn: {
    Jodhpur: { rf: 46.12, lstm: 49.65, am: 59.81, nam: 51.95, ours: 41.01 },
    Kamuthi: { rf: 147.32, lstm: 142.62, am: 142.08, nam: 81.37, ours: 58.76 },
    Chikkoppa: { rf: 111.86, lstm: 105.5, am: 107.97, nam: 85.16, ours: 68.44 },
    Charanka: { rf: 54.41, lstm: 54.45, am: 59.12, nam: 38.83, ours: 38.12 },
  },
  winter: {
    Jodhpur: { rf: 61.49, lstm: 60.16, am: 67.03, nam: 54.21, ours: 47.39 },
    Kamuthi: { rf: 125.72, lstm: 119.49, am: 120.84, nam: 63.19, ours: 46.09 },
    Chikkoppa: { rf: 65.48, lstm: 61, am: 65.21, nam: 59.83, ours: 43.27 },
    Charanka: { rf: 46.87, lstm: 49, am: 55.9, nam: 32.69, ours: 44.79 },
  },
}

// Section 4.3: mean training time across the four sites, seconds.
export const TRAIN_TIME_S = { rf: 23.2, lstm: 234, am: 253, nam: 2128, ours: 876 }

// Table 6: hourly day-ahead GHI forecasting in earlier work.
export const LITERATURE = [
  { ref: 'Qing & Niu', where: 'Santiago, Cape Verde', algo: 'LSTM', rmse: 76.24 },
  { ref: 'Kaur et al.', where: 'Folsom, California', algo: 'NAM reforecast', rmse: 82.14 },
  { ref: 'Gupta & Singh', where: 'Jodhpur, Chennai, Shimla', algo: 'NA-MEMD-LSTM', rmse: 59.77, min: true },
  { ref: 'This work', where: 'Jodhpur, Kamuthi, Chikkoppa, Charanka', algo: 'N-FFT-AM-LSTM', rmse: 51.89, min: true, ours: true },
]

// Table 2 (Kamuthi, dominant frequency of each IMF) grouped as in Table 3.
export const GROUPS = [
  { name: 'HIGH 1', range: 'f > 0.2', imfs: [['IMF 1', '0.27']] },
  { name: 'HIGH 2', range: '0.1 – 0.2', imfs: [['IMF 2', '0.18']] },
  { name: 'HIGH 3', range: '0.01 – 0.1', imfs: [['IMF 3', '0.09'], ['IMF 4', '0.03'], ['IMF 5', '0.02'], ['IMF 6', '0.01']] },
  { name: 'MEDIUM', range: '0.001 – 0.01', imfs: [['IMF 7', '0.006'], ['IMF 8', '0.003'], ['IMF 9', '0.002'], ['IMF 10', '0.001']] },
  { name: 'LOW', range: '0 – 0.0005', imfs: [['IMF 11', '0.0005'], ['IMF 12', '0.0002'], ['IMF 13', '0.0001'], ['IMF 14', '0.00005'], ['Residual', '0']] },
]

export const FIGURES = [
  { src: '/images/research/fft-lstm-methodology.webp', caption: 'Proposed methodology for day-ahead forecasting (Fig. 7)' },
  { src: '/images/research/fft-lstm-architecture.webp', caption: 'AM-LSTM network used for each signal (Fig. 13)' },
  { src: '/images/research/fft-lstm-monsoon-jodhpur.webp', caption: 'Monsoon days at Jodhpur: actual vs forecast GHI and RMSE by model (Fig. 16a)' },
]
