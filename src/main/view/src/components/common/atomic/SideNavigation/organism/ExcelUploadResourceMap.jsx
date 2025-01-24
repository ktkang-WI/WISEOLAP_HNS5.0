import excelUploadImg from
  '../../../../../assets/image/icon/button/excelFile_icon.png';
import resourceMapImg from
  '../../../../../assets/image/icon/button/ico_points.png';

const ExcelUploadResourceMap = ({userId, sessionUserKey, prog}) => {
  // const origin = window.location.origin;
  const origin = 'https://10.2.3.51:18080';
  // eslint-disable-next-line max-len
  const url = `${origin}/wise-csr-mng/login?id=${userId}&pwd=1&sessionUserKey=${sessionUserKey}&&gubun=`;

  const handleExcelUploadClick = () => {
    window.open(`${url}1`, '_blank');
  };

  const handleResourceMapClick = () => {
    window.open(`${url}2`, '_blank');
  };

  return (
    <div style={{
      display: 'flex',
      height: '60px'
    }}>
      {
        prog.excelUpload &&
        <div
          onClick={() => handleExcelUploadClick()}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '0 10px',
            textAlign: 'center'
          }}
        >
          <img
            height={36}
            src={excelUploadImg}
            title={'엑셀 업로드'}
            style={{
              cursor: 'pointer',
              marginBottom: '5px'
            }}
          />
          <span style={{fontSize: '12px', cursor: 'pointer'}}>
            {'엑셀 업로드'}
          </span>
        </div>
      }
      {
        prog.resourceMap &&
        <div
          onClick={() => handleResourceMapClick()}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '0 10px',
            textAlign: 'center'
          }}
        >
          <img
            width={40}
            height={40}
            src={resourceMapImg}
            title={'리소스 맵'}
            style={{
              cursor: 'pointer',
              marginBottom: '5px'
            }}
          />
          <span style={{fontSize: '12px', cursor: 'pointer'}}>
            {'리소스 맵'}
          </span>
        </div>
      }
    </div>
  );
};

export default ExcelUploadResourceMap;
