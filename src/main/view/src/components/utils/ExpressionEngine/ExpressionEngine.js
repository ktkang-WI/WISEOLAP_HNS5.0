import ExpressionFunctions from './ExpressionFunctions';
import {create, all} from 'mathjs';

const math = create(all);
const functions = new ExpressionFunctions();

const customFunctions = {
  avg: (...args) => functions.avg(...args),
  stdDev: (...args) => functions.stdDev(...args),
  var: (...args) => functions.var(...args)
};

math.import(customFunctions);

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

  evaluateExpression = (expression, context) => {
    const extractedKeys = this.extractingExpression('\\[.*?\\]', expression);

    let _expression = expression;

    extractedKeys.forEach((keyWithBrackets) => {
      const key = keyWithBrackets.slice(1, -1);

      const value = context[key];

      if (value === undefined) {
        throw new Error(`context에 해당 키가 없습니다: ${key}`);
      }

      _expression = _expression.replace(keyWithBrackets, value.toString());
    });

    return _expression;
  };

  evaluate(context = {}, expression, defaultValue = null) {
    try {
      const _expression = this.evaluateExpression(expression, context);
      const result = this.math.evaluate(_expression, context);
      return result !== undefined ? result : defaultValue;
    } catch (error) {
      console.warn(`Error occurred while evaluating an expression:
        ${expression}`, error);
      return defaultValue;
    }
  };
}

export default ExpressionEngine;
