import {DropDownBox, TextBox} from 'devextreme-react';
import {useRef} from 'react';
import DesignerReportTabs from '../../ReportTab/organism/DesignerReportTabs';
import useReportLoad from 'hooks/useReportLoad';
import {useNavigate} from 'react-router-dom';

const DropdownBoxReportSearch = ({showAll, report, button, id}) => {
  // hook
  const {getReportList, handleSubmit} = useReportLoad();
  const nav = useNavigate();

  // local
  const {reportList} = getReportList(showAll);
  const dropdownBoxRef = useRef();

  const reportListRender = () => {
    return (
      <DesignerReportTabs
        reportList={reportList}
        onSubmit={handleSubmit}
        dropdownBoxRef={dropdownBoxRef}
        navigator={nav}
      />
    );
  };

  const fieldRender = (e) => {
    return (
      <div className='custom-item'>
        <TextBox
          width='90px'
          placeholder='보고서 검색'
          disabled={true}
        />
      </div>
    );
  };

  return (
    <DropDownBox
      dataSource={reportList}
      ref={dropdownBoxRef}
      buttons={button}
      placeholder='보고서 검색'
      contentRender={reportListRender}
      elementAttr={{
        id: id
      }}
      dropDownOptions={{
        width: '350px'
        // position: {
        //   of: dropdownBoxRef.current,
        //   at: 'left top'
        // }
      }}
      displayExpr={'name'}
      valueExpr={'id'}
      fieldRender={fieldRender}
    >
    </DropDownBox>

  );
};

export default DropdownBoxReportSearch;
