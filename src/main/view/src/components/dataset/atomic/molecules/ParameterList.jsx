
import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import {Column} from 'devextreme-react/data-grid';
import localizedString from 'config/localization';

const ParameterList = ({compact=false, ...props}) => {
  return (
    <CommonDataGrid
      useFilter={false}
      {...props}
    >
      <Column caption={localizedString.parameterName} dataField='name'/>
      <Column caption={localizedString.parameterCaption} dataField='caption'/>
      <Column
        caption={localizedString.dataType}
        dataField='dataType'
        visible={!compact}
      />
      <Column
        caption={localizedString.parameterType}
        dataField='paramType'
        visible={!compact}
      />
      <Column
        caption='Visible'
        dataField='visible'
        visible={!compact}
        dataType='string'
        customizeText={(e) => {
          return e.value? 'Y' : 'N';
        }}
      />
      <Column
        caption={localizedString.multiSelect}
        dataField='multiSelect'
        dataType='string'
        customizeText={(e) => {
          return e.value? 'Y' : 'N';
        }}
        visible={!compact}/>
      <Column caption={localizedString.order} dataField='order'/>
      <Column
        caption={localizedString.conditionName}
        visible={!compact}
        dataField='operation'
      />
    </CommonDataGrid>
  );
};

export default ParameterList;
