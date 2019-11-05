const timeRanges = [
  {
    name: 'Last hour',
    takeRightCount: 12,
    takeEvery: 1,
  },
  {
    name: 'Last 6 hours',
    takeRightCount: 72,
    takeEvery: 2,
  },
  {
    name: 'Last 12 hours',
    takeRightCount: 144,
    takeEvery: 4,
  },
  {
    name: 'Last day',
    takeRightCount: 288,
    takeEvery: 4,
  },
  {
    name: 'Last week',
    takeRightCount: 2016,
    takeEvery: 32,
  },
];

export default timeRanges;
