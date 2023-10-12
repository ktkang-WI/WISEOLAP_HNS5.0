import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import PanelTitleText from '../Common/Panel/PanelTitleText';
import DataColumnList from './molecules/DataColumnList';
import localizedString from '../../../../config/localization';
import {selectCurrentDataFieldOption} from 'redux/selector/ReportSelector';
import {useSelector} from 'react-redux';

const theme = getTheme();

const TitleWrapper = styled.div`
  text-align: left;
  padding: 12px 15px;
  border-bottom: 1px solid ${theme.color.breakLine};
`;

const Wrapper = styled.div`
  background: ${theme.color.background};
  height: 100%;
  width: ${theme.size.panelWidth};
  display: inline-block;
  border-right: solid 1px ${theme.color.breakLine};
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
        <PanelTitleText color={theme.color.primary}>
          {localizedString.dataItem}
        </PanelTitleText>
      </TitleWrapper>
      {
        getColumnList()
      }
    </Wrapper>
  );
};

export default DataColumnTab;
