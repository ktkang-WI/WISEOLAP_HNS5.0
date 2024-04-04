import {DropDownBox, List} from 'devextreme-react';
import {Container} from '../../molecules/choropleth/MappingDataChoropleth';
import {useCallback, useContext, useEffect, useRef} from 'react';
import {Field, FieldLabel, FieldSet, FieldValue}
  from 'components/common/atomic/Common/DevExtreme/Field';
import {ChoroplethContext}
  from 'components/common/atomic/Modal/organisms/ChoroplethModal';


const MappingKeyChoropleth = () => {
  const getContext = useContext(ChoroplethContext);
  const [geoJson] = getContext.state.geoJson;
  const mappingKeys = Object.keys(geoJson.features[0].properties);
  const [key, setKey] = getContext.state.key;
  const dropDownBoxRef = useRef(null);

  useEffect(() => {
    setKey(mappingKeys[0]);
  }, []);

  const changeDropDownBoxValue = useCallback((arg) => {
    setKey(arg.addedItems[0]);
    dropDownBoxRef.current.instance.close();
  }, []);

  const onValueChanged = useCallback((e) => {
    setKey(e.value);
  }, []);

  return (
    <Container
      display='flex'
      flexDirection='column'
    >
      <FieldSet>
        <Field>
          <FieldLabel>매칭키</FieldLabel>
          <FieldValue>
            <DropDownBox
              dataSource={mappingKeys}
              value={key}
              ref={dropDownBoxRef}
              onValueChanged={onValueChanged}
            >
              <List
                dataSource={mappingKeys}
                selectionMode='single'
                onSelectionChanged={changeDropDownBoxValue}
              />
            </DropDownBox>
          </FieldValue>
        </Field>
      </FieldSet>
    </Container>
  );
};

export default MappingKeyChoropleth;
