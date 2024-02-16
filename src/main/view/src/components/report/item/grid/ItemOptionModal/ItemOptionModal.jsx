import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {getTheme} from 'config/theme';
import {CheckBox, NumberBox} from 'devextreme-react';
import {useState} from 'react';


const theme = getTheme();

const ItemOptionModal = ({popupName, ...props}) => {
  const [pagination, setPagination] = useState(props.options.paging.pagination);
  const [pageUsageOfPageCount, setPageUsageOfPageCount] =
    useState(props.options.paging.pageUsageOfPageCount);

  const handlePagination = (e) => {
    setPagination((prev) => {
      return {
        ...prev,
        isOk: e.value
      };
    });
  };

  const handlePaginationValue = (e) => {
    setPagination((prev) => {
      return {
        ...prev,
        pagingRange: e.value
      };
    });
  };

  const handlePageUsageOfPageCount = (e) => {
    setPageUsageOfPageCount((prev) => {
      return {
        ...prev,
        isOk: e.value
      };
    });
  };

  const handlePageUsageOfPageCountValue = (e, index) => {
    const tempOptions = [...pageUsageOfPageCount.pageSizes];
    tempOptions[index] = e;
    setPageUsageOfPageCount((prev) => {
      return {
        ...prev,
        pageSizes: [...tempOptions]
      };
    });
  };


  return (
    <Modal
      onSubmit={() => {
        props.onSubmit({paging: {pagination, pageUsageOfPageCount}});
        return false;
      }}
      onClose={()=>{
        return props.onClose();
      }}
      modalTitle={props.modalTitle}
      width={theme.size.smallModalWidth}
      height='600px'
    > <div>
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field">
              <div className="dx-field-label">페이징 사용 여부:</div>
              <div className="dx-field-value">
                <CheckBox
                  defaultValue={pagination.isOk}
                  onValueChanged={handlePagination}
                />
              </div>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">페이징 기본 값</div>
            <div className="dx-field-value">
              <NumberBox
                defaultValue={pagination.pagingRange}
                showSpinButtons={true}
                disabled={!pagination.isOk}
                onValueChanged={handlePaginationValue}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">페이징 개수 사용 여부:</div>
            <div className="dx-field-value">
              <CheckBox
                defaultValue={pageUsageOfPageCount.isOk}
                onValueChanged={handlePageUsageOfPageCount}
                disabled={!pagination.isOk}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">첫번째 값</div>
            <div className="dx-field-value">
              <NumberBox
                defaultValue={pageUsageOfPageCount.pageSizes[0]}
                showSpinButtons={true}
                disabled={!pagination.isOk || !pageUsageOfPageCount.isOk}
                onValueChange={(e) => handlePageUsageOfPageCountValue(e, 0)}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">두번째 값</div>
            <div className="dx-field-value">
              <NumberBox
                defaultValue={pageUsageOfPageCount.pageSizes[1]}
                showSpinButtons={true}
                disabled={!pagination.isOk || !pageUsageOfPageCount.isOk}
                onValueChange={(e) => handlePageUsageOfPageCountValue(e, 1)}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">세번째 값</div>
            <div className="dx-field-value">
              <NumberBox
                defaultValue={pageUsageOfPageCount.pageSizes[2]}
                showSpinButtons={true}
                disabled={!pagination.isOk || !pageUsageOfPageCount.isOk}
                onValueChange={(e) => handlePageUsageOfPageCountValue(e, 2)}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default ItemOptionModal;
