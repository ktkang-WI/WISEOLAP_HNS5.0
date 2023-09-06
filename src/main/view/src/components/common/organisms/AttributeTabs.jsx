import ItemAttributeTab from './ItemAttributeTab';
import DataColumntab from './DataColumnTab';
import localizedString from '../../../config/localization';
import CommonTab from '../atoms/CommonTab';

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
