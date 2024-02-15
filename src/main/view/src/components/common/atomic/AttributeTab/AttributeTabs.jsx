import ItemAttributeTab
  from '../ItemAttributeTab/organism/ItemAttributeTab';
import DataColumntab from '../DataColumnTab/DataColumnTab';
import localizedString from '../../../../config/localization';
import CommonTab from '../Common/Interactive/CommonTab';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';

const theme = getTheme();

const StyledTab = styled(CommonTab)`
  border: 1px ${theme.color.gray200} solid;
  border-radius: 0px 10px 10px 0px;
  border-left: 1px solid ${theme.color.gray100};
  margin-left: 0px;
  width: calc(${theme.size.panelWidth} - 30px);
  overflow: hidden;
  padding: 10px 15px;
  background: ${theme.color.white};
`;

const AttributeTabsSource = [
  {
    id: 'field',
    title: localizedString.field
  },
  {
    id: 'attribute',
    title: localizedString.attribute
  }
];

const getTabContent = ({data}) => {
  if (data.id === 'attribute') {
    return (
      <ItemAttributeTab/>
    );
  } else if (data.id === 'field') {
    return (
      <DataColumntab/>
    );
  }
};

const AttributeTabs = () => {
  return (
    <StyledTab
      swipeEnabled={false}
      dataSource={AttributeTabsSource}
      itemComponent={getTabContent}
    >
    </StyledTab>
  );
};

export default AttributeTabs;
