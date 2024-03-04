import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import PanelTitleText from '../Common/Panel/PanelTitleText';
import DataColumnList from './molecules/DataColumnList';
import localizedString from 'config/localization';
import {selectCurrentDataFieldOption} from 'redux/selector/ItemSelector';
import {useSelector} from 'react-redux';
import {ScrollView} from 'devextreme-react';

const theme = getTheme();

const TitleWrapper = styled.div`
  text-align: left;
  padding: 15px 0px 8px 0px;
  margin-bottom: 15px;
  border-bottom: 1px solid ${theme.color.gray100};
`;

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: inline-block;
`;

const DataColumnTab = () => {
  const dataFieldOption = useSelector(selectCurrentDataFieldOption);

  const getColumnList = () => {
    const columnList = [];

    for (const key in dataFieldOption) {
      if (dataFieldOption) {
        columnList.push(
            <DataColumnList {...(dataFieldOption[key])} id={key}/>
        );
      }
    }
    return columnList;
  };

  return (
    <Wrapper>
      <TitleWrapper>
        <PanelTitleText fontWeight={500}>
          {localizedString.dataItem}
        </PanelTitleText>
      </TitleWrapper>
      <ScrollView
        height={'calc(100% - 60px)'}
        width={'100%'}
        direction='vertical'
        showScrollbar={'never'}
      >
        <div>
          {
            getColumnList()
          }
        </div>
      </ScrollView>
    </Wrapper>
  );
};

export default DataColumnTab;
