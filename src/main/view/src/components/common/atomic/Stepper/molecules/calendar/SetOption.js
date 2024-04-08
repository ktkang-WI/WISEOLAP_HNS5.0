import {
  Field,
  FieldLabel,
  FieldSet,
  FieldValue
} from 'components/common/atomic/Common/DevExtreme/Field';
import {SelectBox} from 'devextreme-react';
import styled from 'styled-components';

const Sketch = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f1f1f1;
`;

const OptionBoard = styled.div`
  width: 100%;
  height: 100%;
`;

const SetOption = ({

}) => {
  return (
    <Sketch>
      <OptionBoard>
        <FieldSet>
          <Field>
            <FieldLabel>데이터 형식</FieldLabel>
            <FieldValue>
              <SelectBox
              />
            </FieldValue>
          </Field>
          <Field>
            <FieldLabel>기준 년도</FieldLabel>
            <FieldValue>
              <SelectBox
              />
            </FieldValue>
          </Field>
          <Field>
            <FieldLabel>모드</FieldLabel>
            <FieldValue>
              <SelectBox
              />
            </FieldValue>
          </Field>
        </FieldSet>
      </OptionBoard>
    </Sketch>
  );
};

export default SetOption;
