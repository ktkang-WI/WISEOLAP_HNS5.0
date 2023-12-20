// NumberFormatUtility.js

const NumberFormatUtility = {
  unitNum: {
    O: 1,
    K: 1000,
    M: 1000000,
    B: 1000000000
  },

  formatNumber: function(
      _value,
      _type,
      _unit,
      _precision,
      _useDigitSeparator,
      _prefix,
      _suffix,
      _suffixEnabled,
      _precisionType
  ) {
    let value = 0;
    let type = 'Number';
    let unit;
    let precision = 0;
    let useDigitSeparator = '';
    let prefix = '';
    let suffix = {
      O: '',
      K: 'K',
      M: 'M',
      B: 'B'
    };
    let precisionType = '반올림';
    let currency = '₩';
    const _currency = 'KRW';

    if (typeof _value !== 'undefined') {
      value = _value;
    }

    if (
      typeof _type !== 'undefined' &&
      ['Auto', 'General', 'Number', 'Currency',
        'Scientific', 'Percent'].indexOf(_type) !== -1
    ) {
      type = _type;
    }

    if (typeof _unit !== 'undefined') {
      switch (_unit.toUpperCase()) {
        case 'T':
          unit = 'K';
          break;
        case 'L':
          unit = 'K';
          break;
        case 'F':
          unit = 'O';
          break;
        case 'AUTO':
          unit = 'A';
          break;
        case 'ONES':
          unit = 'O';
          break;
        case 'THOUSANDS':
          unit = 'K';
          break;
        case 'MILLIONS':
          unit = 'M';
          break;
        case 'BILLIONS':
          unit = 'B';
          break;
        default:
          unit = _unit.toUpperCase();
          break;
      }
    }

    if (typeof _precision !== 'undefined') {
      precision = _precision;
    }

    if (typeof _precisionType !== 'undefined') {
      precisionType = _precisionType;
    }

    if (typeof _useDigitSeparator !== 'undefined') {
      useDigitSeparator = _useDigitSeparator ? ',' : '';
    } else if (typeof _useDigitSeparator === 'undefined') {
      useDigitSeparator = ',';
    }

    if (typeof _prefix !== 'undefined') {
      prefix = _prefix;
    }

    if (_suffixEnabled && typeof _suffix !== 'undefined') {
      suffix = _suffix;
    }

    if (typeof _currency !== 'undefined') {
      switch (_currency) {
        case 'KRW':
          currency = '₩';
          break;
        case 'USD':
          currency = '$';
          break;
        default:
          currency = '$';
          break;
      }
    }

    if (type === 'Auto') {
      unit = 'A';
      suffix = {
        O: '',
        K: 'K',
        M: 'M',
        B: 'B'
      };
      currency = '₩';
    }

    // Number formatter
    const formatNumber = (num, options) => {
      return new Intl.NumberFormat('en-US', options).format(num);
    };

    const fn = {
      Auto: function(_v, _u, _p, _po, _s, _r, _f, _c) {
        const numText = formatNumber(_v / NumberFormatUtility.unitNum[_u], {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).toString();
        const numDecimal = numText.split('.');
        if (numDecimal.length === 2 && numDecimal[1] === '00') {
          return _c + numDecimal[0] + ' ' + _f;
        }
        return _c + numText + ' ' + _f;
      },
      General: function(_v, _u, _p, _po, _s, _r, _f, _c) {
        return _v.toString();
      },
      Number: function(_v, _u, _p, _po, _s, _r, _f, _c) {
        console.log(
            'Options inside Number:',
            'v:', _v, 'u:', _u, 'p:', _p, 'po:', _po, 's:', _s,
            'r:', _r, 'f:', _f, 'c:', _c);
        return (
          _r +
          formatNumber(_v / NumberFormatUtility.unitNum[_u], {
            minimumFractionDigits: _p,
            maximumFractionDigits: _p,
            useGrouping: _useDigitSeparator
          }).toString() +
          ' ' +
          _f
        );
      },
      Currency: function(_v, _u, _p, _po, _s, _r, _f, _c) {
        return (
          _r +
          _c +
          formatNumber(_v / NumberFormatUtility.unitNum[_u], {
            minimumFractionDigits: _p,
            maximumFractionDigits: _p,
            useGrouping: _useDigitSeparator
          }).toString() +
          ' ' +
          _f
        );
      },
      Scientific: function(_v, _u, _p, _po, _s, _r, _f, _c) {
        return _r + _v.toExponential(_p).toUpperCase();
      },
      Percent: function(_v, _u, _p, _po, _s, _r, _f, _c) {
        return (
          _r +
          formatNumber(_v * 100, {
            minimumFractionDigits: _p,
            maximumFractionDigits: _p,
            useGrouping: _useDigitSeparator
          }).toString() +
          '%'
        );
      }
    };

    if (typeof _unit === 'undefined' || unit === 'A') {
      const valueText = value.toString().replace('-', '').split('.')[0];
      if (valueText.length >= 10) {
        unit = 'B';
      } else if (valueText.length < 10 && valueText.length >= 7) {
        unit = 'M';
      } else if (valueText.length < 7 && valueText.length >= 4) {
        unit = 'K';
      } else {
        unit = 'O';
      }

      if (_unit === undefined) {
        unit = 'O';
      }
    }
    return fn[type](value, unit, precision, precisionType,
        useDigitSeparator, prefix, suffix[unit], currency);
  }
};

export default NumberFormatUtility;

