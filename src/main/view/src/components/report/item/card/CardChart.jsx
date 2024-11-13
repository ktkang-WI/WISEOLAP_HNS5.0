import {
  formatNumber,
  generateLabelSuffix
} from 'components/utils/NumberFormatUtility';
import {useRef} from 'react';
import styled from 'styled-components';

const CardBoard = styled.div`
  font-family: 'NanumGothic';
  padding: 10px 20px;
  width: 100%;
  height: ${(props) => props.height || '100%'};
  background-color: #f3f4f8;
  border: 1px solid #bdbdbd;
  border-radius: 10px;
  display: flex;
  flex-direction: column;

  &.selected {
    border: 1px solid #a2c4ff;
    background-color: #e8f0ff;
  }
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: auto;
  max-width: 40%;
`;

const Content = styled.div`
  font-size: 30px;
  font-weight: 600;
  max-width: 60%;
  padding-left: 10px;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: right;
  overflow: hidden;
`;

const Row = styled.div`
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
`;

const Bottom = styled.div`
  display: flex;
  height: auto;
  padding: 10px 0px;
  padding-top: 5px;
  font-size: 16px;
  width: 100%;
  flex-direction: column;
  text-align: right;

  & span {
    font-weight: 600;
    font-size: 20px;
  }

  & p {
    margin-bottom: 5px;
  }

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

  const contentStr = getValue(content.value, content.format);
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
      <Row>
        <Title title={title}>{title}</Title>
        <Content title={contentStr}>{contentStr}</Content>
      </Row>
      <Bottom>
        {targets.map((t, i) => {
          const cn = '';
          const v = getValue(t.value, t.format);

          // if (t.format.formatType == 'Percent') {
          //   cn = t.value < 0 ? 'blue' : t.value > 0 ? 'red' : '';
          // } else {
          //   cn = t.value < content.value ? 'blue' :
          //     t.value > content.value ? 'red' : '';
          // }

          return <p
            key={'t' + i}
            title={v}
            className={cn}>
            {t.key}: <span>{v}</span>
          </p>;
        })}
      </Bottom>
    </CardBoard>
  );
};

export default CardChart;
