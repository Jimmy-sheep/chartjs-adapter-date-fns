import {de} from 'date-fns/locale';

describe('date-fns adapter', function() {

  it('should accept using default locale and timezone', function() {
    const chart = acquireChart({
      type: 'line',
      data: {
        datasets: [{
          data: [{
            x: 0,
            y: 100
          }]
        }]
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'second',
            },
            ticks: {
              source: 'data'
            }
          }
        }
      }
    });

    expect(chart.scales.x.ticks[0].label).toEqual('12:00:00 AM');
  });

  it('should accept locale from chart configuration', function() {
    const chart = acquireChart({
      type: 'line',
      data: {
        datasets: [{
          data: [{
            x: 0,
            y: 100
          }]
        }]
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'second',
            },
            adapters: {
              date: {
                locale: de,
              }
            },
            ticks: {
              source: 'data'
            }
          }
        }
      }
    });

    expect(chart.scales.x.ticks[0].label).toEqual('00:00:00');
  });

  it('should accept timezone from chart configuration', function() {
    const chart = acquireChart({
      type: 'line',
      data: {
        datasets: [{
          data: [{
            x: 0,
            y: 100
          }]
        }]
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'second',
            },
            adapters: {
              date: {
                timezone: 'Europe/Berlin',
              }
            },
            ticks: {
              source: 'data'
            }
          }
        }
      }
    });

    expect(chart.scales.x.ticks[0].label).toEqual('1:00:00 AM');
  });

  it('should accept timezone and locale configuration', function() {
    const chart = acquireChart({
      type: 'line',
      data: {
        datasets: [{
          data: [{
            x: 0,
            y: 100,
          }]
        }]
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'second',
            },
            adapters: {
              date: {
                timezone: 'Europe/Berlin',
                locale: de,
              }
            },
            ticks: {
              source: 'data',
            }
          }
        }
      }
    });

    expect(chart.scales.x.ticks[0].label).toEqual('01:00:00');
  });
});
