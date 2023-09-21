import ItemAttributeTab
  from '../ItemAttributeTab/organism/ItemAttributeTab';
import DataColumntab from '../DataColumnTab/DataColumnTab';
import localizedString from '../../../../config/localization';
import CommonTab from '../Common/Interactive/CommonTab';

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
    <CommonTab
      dataSource={AttributeTabsSource}
      itemComponent={getTabContent}
    >
    </CommonTab>
  );
};

export default AttributeTabs;
