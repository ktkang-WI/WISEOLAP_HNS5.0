import {
  formatNumber,
  generateLabelSuffix
} from 'components/utils/NumberFormatUtility';
import {useRef} from 'react';
import styled from 'styled-components';

const CardBoard = styled.div`
  width: 100%;
  height: ${(props) => props.height || '100%'};
  background-color: #FAFAFA;
  border-radius: 10px;
  border: 1px solid #bdbdbd;
  display: flex;
  flex-direction: column;

  &.selected {
    background-color: #f4f8ff;
    border: 1px solid #a2c4ff
  }
`;

const Title = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #818181;
  overflow: hidden;
  text-overflow: ellipsis; 
  white-space: pre-line;
  height: auto;
`;

const Content = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #818181;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Bottom = styled.div`
  font-weight: 600;
  color: #818181;
  display: flex;
  height: auto;
  padding: 20px;
  width: 100%;
  flex-direction: column;
  text-align: right;

  .red {
    color: red;
  }

  .blue {
    color: #3c3cdb;
  }
`;

const CardChart = ({
  onClick,
  title,
  content,
  height,
  id,
  targets,
  selected
}) => {
  const ref = useRef();

  const getValue = (value, format) => {
    const labelSuffix = generateLabelSuffix(format);

    return formatNumber(value, format, labelSuffix);
  };

  return (
    <CardBoard
      className={selected && 'selected'}
      ref={ref}
      id={id}
      height={height}
      onClick={(e) => {
        e.ref = ref;
        return onClick(e, {
          title: title,
          content: content
        });
      }}>
      <Title>{title}</Title>
      <Content>{getValue(content.value, content.format)}</Content>
      <Bottom>
        {targets.map((t, i) => {
          let cn = '';

          if (t.format.formatType == 'Percent') {
            cn = t.value < 0 ? 'blue' : t.value > 0 ? 'red' : '';
          } else {
            cn = t.value < content.value ? 'blue' :
              t.value > content.value ? 'red' : '';
          }

          return <p
            key={'t' + i}
            className={cn}>
            {t.key}: {getValue(t.value, t.format)}
          </p>;
        })}
      </Bottom>
    </CardBoard>
  );
};

export default CardChart;
