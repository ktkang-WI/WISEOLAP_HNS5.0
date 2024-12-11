import ExpressionFunctions from './ExpressionFunctions';
import {create, all} from 'mathjs';

const math = create(all);

const customFunctions = {
  'Avg': ExpressionFunctions.Avg,
  'Abs': ExpressionFunctions.Abs,
  'Count': ExpressionFunctions.Count,
  'Max': ExpressionFunctions.Max,
  'Median': ExpressionFunctions.Median,
  'Min': ExpressionFunctions.Min,
  'Sum': ExpressionFunctions.Sum,
  'Var': ExpressionFunctions.Var,
  'StdDev': ExpressionFunctions.StdDev,
  'Round': ExpressionFunctions.Round,
  'Floor': ExpressionFunctions.Floor,
  'Iif': ExpressionFunctions.Iif,
  'IsNull': ExpressionFunctions.IsNull,
  'IsNullOrEmpty': ExpressionFunctions.IsNullOrEmpty,
  'ToBoolean': ExpressionFunctions.ToBoolean,
  'divide': (a, b) => (b === 0 ? 0 : a / b),
  'or': (a, b) => Boolean(a) || Boolean(b),
  'and': (a, b) => Boolean(a) && Boolean(b),
  'not': (a) => !Boolean(a)
};

math.config({
  number: 'number'
});

math.import(customFunctions, {override: true});

math.parser().set('||', customFunctions.or);
math.parser().set('&&', customFunctions.and);
math.parser().set('!', customFunctions.not);

class ExpressionEngine {
  constructor() {
    this.math = math;
  }

  extractingExpression = (regex, expression) => {
    const pattern = new RegExp(regex, 'g');
    const matches = [];
    let match;

    while ((match = pattern.exec(expression)) !== null) {
      matches.push(match[0]);
    }

    return matches;
  };

  evaluateExpression = (expression, context, test = false) => {
    const regex = /\[([^\[\]]+)\]/g;
    const extractedKeys = this.extractingExpression(regex, expression);

    let _expression = expression
        .replaceAll('&&', 'and')
        .replaceAll('||', 'or')
        .replaceAll('!', 'not');

    extractedKeys.forEach((keyWithBrackets) => {
      const key = keyWithBrackets.slice(1, -1);

      const value = test ? 1 : context[key];

      if (value === undefined) {
        throw new Error(`context에 해당 키가 없습니다: ${key}`);
      }

      _expression = _expression.replace(keyWithBrackets, value.toString());
    });

    return _expression;
  };

  compileTest = (expression) => {
    let res = null;

    try {
      const exp = this.evaluateExpression(expression, null, true);
      res = this.math.evaluate(exp);

      if (typeof res != 'number') {
        return false;
      }
      return true;
    } catch (e) {
      console.warn(e);
    }

    return false;
  };

  evaluate(context = {}, expression, defaultValue = null) {
    try {
      const _expression = this.evaluateExpression(expression, context);
      const result = this.math.evaluate(_expression, context);

      if (result === undefined || result === Infinity ||
        result === -Infinity || isNaN(result)) {
        return defaultValue;
      }

      return result;
    } catch (error) {
      console.warn(`Error occurred while evaluating an expression:
        ${expression}`, error);
      return defaultValue;
    }
  };
}

export default ExpressionEngine;
