import {
  Field,
  FieldLabel,
  FieldSet,
  FieldValue} from 'components/common/atomic/Common/DevExtreme/Field';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {getTheme} from 'config/theme';
import {CheckBox, NumberBox, SelectBox} from 'devextreme-react';
import {useState} from 'react';


const theme = getTheme();

const ItemOptionModal = ({popupName, ...props}) => {
  const [autoPaging, setAutoPaging] = useState(props.options.paging.autoPaging);
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

  const handlePaginationIndexValue = (e) => {
    setPagination((prev) => {
      return {
        ...prev,
        index: e.value
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

  const handleAutoPaging = (e) => {
    setAutoPaging((prev) => {
      return {
        ...prev,
        isOk: e.value
      };
    });
  };

  const handleAutoPagingValue = (e) => {
    setAutoPaging((prev) => {
      return {
        ...prev,
        time: e.value
      };
    });
  };

  return (
    <Modal
      onSubmit={() => {
        props.onSubmit({paging:
          {autoPaging, pagination, pageUsageOfPageCount}});
        return false;
      }}
      onClose={()=>{
        return props.onClose();
      }}
      modalTitle={props.modalTitle}
      width={theme.size.smallModalWidth}
      height='600px'
    > <FieldSet>
        <Field>
          <FieldLabel>
            페이징 사용 여부:
          </FieldLabel>
          <FieldValue>
            <CheckBox
              defaultValue={pagination.isOk}
              onValueChanged={handlePagination}
            />
          </FieldValue>
        </Field>
        <Field>
          <FieldLabel>페이징 인덱스</FieldLabel>
          <FieldValue>
            <NumberBox
              min={1}
              showSpinButtons={true}
              disabled={!pagination.isOk}
              defaultValue={pagination.index}
              onValueChanged={handlePaginationIndexValue}
            />
          </FieldValue>
        </Field>
        <Field>
          <FieldLabel>페이징 기본 값</FieldLabel>
          <FieldValue>
            <SelectBox
              items={[...pageUsageOfPageCount.pageSizes]}
              disabled={!pagination.isOk}
              defaultValue={pagination.pagingRange}
              onValueChanged={handlePaginationValue}
            />
          </FieldValue>
        </Field>
        <Field>
          <FieldLabel>
            페이징 자동넘김 :
          </FieldLabel>
          <FieldValue>
            <CheckBox
              disabled={!pagination.isOk}
              defaultValue={autoPaging.isOk}
              onValueChanged={handleAutoPaging}
            />
          </FieldValue>
        </Field>
        <Field>
          <FieldLabel>시간 (초단위) </FieldLabel>
          <FieldValue>
            <NumberBox
              min={5}
              showSpinButtons={true}
              disabled={!autoPaging.isOk}
              defaultValue={autoPaging.time}
              onValueChanged={handleAutoPagingValue}
            />
          </FieldValue>
        </Field>
        <Field>
          <FieldLabel>페이징 개수 사용 여부:</FieldLabel>
          <FieldValue>
            <CheckBox
              defaultValue={pageUsageOfPageCount.isOk}
              onValueChanged={handlePageUsageOfPageCount}
              disabled={!pagination.isOk}
            />
          </FieldValue>
        </Field>
        <Field>
          <FieldLabel>첫번째 값</FieldLabel>
          <FieldValue>
            <NumberBox
              defaultValue={pageUsageOfPageCount.pageSizes[0]}
              showSpinButtons={true}
              disabled={!pagination.isOk || !pageUsageOfPageCount.isOk}
              onValueChange={(e) => handlePageUsageOfPageCountValue(e, 0)}
            />
          </FieldValue>
        </Field>
        <Field>
          <FieldLabel>두번째 값</FieldLabel>
          <FieldValue>
            <NumberBox
              defaultValue={pageUsageOfPageCount.pageSizes[1]}
              showSpinButtons={true}
              disabled={!pagination.isOk || !pageUsageOfPageCount.isOk}
              onValueChange={(e) => handlePageUsageOfPageCountValue(e, 1)}
            />
          </FieldValue>
        </Field>
        <Field>
          <FieldLabel>세번째 값</FieldLabel>
          <FieldValue>
            <NumberBox
              defaultValue={pageUsageOfPageCount.pageSizes[2]}
              showSpinButtons={true}
              disabled={!pagination.isOk || !pageUsageOfPageCount.isOk}
              onValueChange={(e) => handlePageUsageOfPageCountValue(e, 2)}
            />
          </FieldValue>
        </Field>
      </FieldSet>
    </Modal>
  );
};
export default ItemOptionModal;
