// NumberFormatUtility.js

const NumberFormatUtility = {
  formatNumber: function (
    _value,
    _type,
    _unit,
    _precision,
    _separator,
    _prefix,
    _suffix,
    _suffixEnabled,
    _precisionType
  ) {
    var value = 0,
      type = 'Number',
      unit,
      precision = 0,
      separator = '',
      prefix = '',
      suffix = {
        O: '',
        K: 'K',
        M: 'M',
        B: 'B',
      },
      precisionType = '반올림',
      currency = '₩',
      _currency = 'KRW';

    if (typeof _value !== 'undefined') {
      value = _value;
    } 
    // else {
    //   return userJsonObject.showNullValue ? userJsonObject.nullValueString : '';
    // }

    if (
      typeof _type !== 'undefined' &&
      ['Auto', 'General', 'Number', 'Currency', 'Scientific', 'Percent'].indexOf(_type) !== -1
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

    if (typeof _separator !== 'undefined') {
      separator = _separator ? ',' : '';
    } else if (typeof _separator === 'undefined') {
      separator = ',';
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
        B: 'B',
      };
      currency = '₩';
    }

    // number formatter
    var fn = {
      unitNum: {
        O: 1,
        K: 1000,
        M: 1000000,
        B: 1000000000,
      },
      Auto: function (_v, _u, _p, _po, _s, _r, _f, _c) {
        var numText = $.number(_v / this.unitNum[_u], 2, '.', ',').toString();
        var numDecimal = numText.split('.');
        if (numDecimal.length === 2 && numDecimal[1] === '00') {
          return _c + numDecimal[0] + ' ' + _f;
        }
        return _c + numText + ' ' + _f;
      },
      General: function (_v, _u, _p, _po, _s, _r, _f, _c) {
        return _v.toString();
      },
      Number: function (_v, _u, _p, _po, _s, _r, _f, _c) {
        return _r + $.number(_v / this.unitNum[_u], _p, _po, '.', _s).toString() + ' ' + _f;
      },
      Currency: function (_v, _u, _p, _po, _s, _r, _f, _c) {
        return _r + _c + $.number(_v / this.unitNum[_u], _p, _po, '.', _s).toString() + ' ' + _f;
      },
      Scientific: function (_v, _u, _p, _po, _s, _r, _f, _c) {
        return _r + _v.toExponential(_p).toUpperCase();
      },
      Percent: function (_v, _u, _p, _po, _s, _r, _f, _c) {
        return _r + $.number(_v * 100, _p, _po, '.', _s).toString() + '%';
      },
    };

    // auto unit
    if (typeof _unit === 'undefined' || unit === 'A') {
      // 20210708 AJKIM 카드 Auto 오류 수정 dogfoot
      var valueText = value.toString().replace('-', '').split('.')[0];
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
    return fn[type](value, unit, precision, precisionType, separator, prefix, suffix[unit], currency);
  },
};

export default NumberFormatUtility;
