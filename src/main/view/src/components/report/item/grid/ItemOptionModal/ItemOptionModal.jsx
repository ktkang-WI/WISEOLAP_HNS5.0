import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {getTheme} from 'config/theme';
import {SelectBox} from 'devextreme-react';
import service from './data.ts';
import ArrayStore from 'devextreme/data/array_store';
// import {useSelector} from 'react-redux';
// import ItemSlice from 'redux/modules/ItemSlice';


const theme = getTheme();

const ItemOptionModal = ({popupName, ...props}) => {
  // const selectedItem = useSelector(selectCurrentItem);
  // const ref = useRef();
  // const {updateItem} = ItemSlice.actions;


  const simpleProducts = service.getSimpleProducts();
  const simpleProductLabel = {'aria-label': 'Simple Product'};
  const productIDLabel = {'aria-label': 'Product ID'};
  const productWithPlaceholderLabel =
    {'aria-label': 'Product With Placeholder'};
  const readOnlyProductLabel = {'aria-label': 'ReadOnly Product'};
  const disabledProductLabel = {'aria-label': 'Disabled Product'};
  const products = service.getProducts();
  const data = new ArrayStore({
    data: products,
    key: 'ID'
  });
  /*
  const setMeta = (item, key, value) => {
    return {
      ...item,
      meta: {
        ...item.meta,
        [key]: value
      }
    };
  };
  */
  return (
    <Modal
      onSubmit={() => {
        return true;
      }}
      modalTitle={props.modalTitle}
      width={theme.size.smallModalWidth}
      height='600px'
      {...props}
    > <div>
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">페이징 설명</div>
            <div className="dx-field-value">
              <SelectBox
                items={simpleProducts}
                inputAttr={simpleProductLabel}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">페이징 기본 값</div>
            <div className="dx-field-value">
              <SelectBox
                items={simpleProducts}
                placeholder="Choose Product"
                inputAttr={productWithPlaceholderLabel}
                showClearButton={true}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">첫번째 값</div>
            <div className="dx-field-value">
              <SelectBox
                items={simpleProducts}
                defaultValue={simpleProducts[0]}
                inputAttr={readOnlyProductLabel}
                readOnly={true}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">두번째 값</div>
            <div className="dx-field-value">
              <SelectBox
                items={simpleProducts}
                inputAttr={disabledProductLabel}
                defaultValue={simpleProducts[0]}
                disabled={true}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">세번째 값</div>
            <div className="dx-field-value">
              <SelectBox
                dataSource={data}
                displayExpr="Name"
                inputAttr={productIDLabel}
                valueExpr="ID"
                defaultValue={products[0].ID}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default ItemOptionModal;
