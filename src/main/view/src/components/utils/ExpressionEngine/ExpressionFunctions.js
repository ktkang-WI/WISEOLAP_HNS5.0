class ExpressionFunctions {
  static Avg = (o) => {
    const nums = ExpressionFunctions.extractNumberArray(o);
    const sum = nums.reduce((a, b) => a + b, 0);
    return sum / nums.length;
  };

  static Count = (o) => ExpressionFunctions.extractNumberArray(o).length;

  static Max = (o) => Math.max(...ExpressionFunctions.extractNumberArray(o));

  static Median = (o) => {
    const nums = ExpressionFunctions.
        extractNumberArray(o).sort((a, b) => a - b);
    const mid = Math.floor(nums.length / 2);
    return nums.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  };

  static Min = (o) => Math.min(...ExpressionFunctions.extractNumberArray(o));

  static Sum = (o) => ExpressionFunctions
      .extractNumberArray(o).reduce((a, b) => a + b, 0);

  static Var = (o) => {
    const nums = ExpressionFunctions.extractNumberArray(o);
    // eslint-disable-next-line new-cap
    const mean = ExpressionFunctions.Avg(nums);
    return nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / nums.length;
  };

  // eslint-disable-next-line new-cap
  static StdDev = (o) => Math.sqrt(ExpressionFunctions.Var(o));

  static Iif = (n1, n2, n3) => (n1 ? n2 : n3);

  static IsNull = (o) => o === null;

  static IsNullOrEmpty = (o) => o === null || o === '';

  static ToBoolean = (v) => !!v;

  static extractNumberArray = (o) => {
    if (Array.isArray(o)) {
      return o.map(Number);
    } else if (typeof o === 'object' && o !== null) {
      return Object.values(o).map(Number);
    }
    return [Number(o)];
  };
}

export default ExpressionFunctions;
