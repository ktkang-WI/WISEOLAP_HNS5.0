import {formatNumber, generateLabelSuffix}
  from 'components/utils/NumberFormatUtility';
import {renderToString} from 'react-dom/server';

export const getTooltip = (data, tooltipFormat) => {
  const [min, q1, q2, q3, max] = data.data;

  const labelSuffix = generateLabelSuffix(tooltipFormat);

  const ele = (
    <>
      <b>{data.name}</b>
      <p>min: {formatNumber(min, tooltipFormat, labelSuffix)}</p>
      <p>Q1: {formatNumber(q1, tooltipFormat, labelSuffix)}</p>
      <p>Q2: {formatNumber(q2, tooltipFormat, labelSuffix)}</p>
      <p>Q3: {formatNumber(q3, tooltipFormat, labelSuffix)}</p>
      <p>max: {formatNumber(max, tooltipFormat, labelSuffix)}</p>
    </>
  );

  return renderToString(ele);
};
