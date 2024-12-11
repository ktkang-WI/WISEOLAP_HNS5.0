class ExpressionFunctions {
  static Avg = (o) => {
    const nums = ExpressionFunctions.extractNumberArray(o);
    const sum = nums.reduce((a, b) => a + b, 0);
    return sum / nums.length;
  };

  static Abs = (o) => Math.abs(o);

  static Count = (o) => ExpressionFunctions.extractNumberArray(o).length;

  static Max = (o1, o2) => {
    if (o2 || o2 === 0) {
      return Math.max(o1, o2);
    }

    Math.max(...ExpressionFunctions.extractNumberArray(o1));
  };

  static Min = (o1, o2) => {
    if (o2 || o2 === 0) {
      return Math.min(o1, o2);
    }

    Math.min(...ExpressionFunctions.extractNumberArray(o1));
  };

  static Median = (o) => {
    const nums = ExpressionFunctions.
        extractNumberArray(o).sort((a, b) => a - b);
    const mid = Math.floor(nums.length / 2);
    return nums.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  };

  static Sum = (o) => ExpressionFunctions
      .extractNumberArray(o).reduce((a, b) => a + b, 0);

  static Var = (o) => {
    const nums = ExpressionFunctions.extractNumberArray(o);
    // eslint-disable-next-line new-cap
    const mean = ExpressionFunctions.Avg(nums);
    return nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / nums.length;
  };

  static Round = (o) => Math.round(o);

  static Floor = (o) => Math.floor(o);

  // eslint-disable-next-line new-cap
  static StdDev = (o) => Math.sqrt(ExpressionFunctions.Var(o));

  static Iif = (n1, n2, n3) => (n1 ? n2 : n3);

  static IsNull = (o) => o === null;

  static IsNullOrEmpty = (o) => o === null || o === '';

  static ToBoolean = (v) => !!v;

  static extractNumberArray = (o) => {
    if (o._data) {
      return o._data;
    }
    if (Array.isArray(o)) {
      return o.map(Number);
    } else if (typeof o === 'object' && o !== null) {
      return Object.values(o).map(Number);
    }
    return [Number(o)];
  };
}

export default ExpressionFunctions;
