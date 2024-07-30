import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {HtmlEditor} from 'devextreme-react';
import {
  ImageUpload,
  MediaResizing,
  Toolbar,
  Item
} from 'devextreme-react/html-editor';
import React, {useEffect, useState} from 'react';
import {useRef} from 'react';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import ItemSlice from 'redux/modules/ItemSlice';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import useSizeObserver from '../util/hook/useSizeObserver';
import * as koMessages from '../../../utils/ko.json';
import {loadMessages} from 'devextreme/localization';
const tabs = [
  {name: 'From This Device', value: ['file']},
  {name: 'From the Web', value: ['url']},
  {name: 'Both', value: ['file', 'url']}
];

const sizeValues = ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'];
const fontValues = [
  'Arial',
  'Courier New',
  'Georgia',
  'Impact',
  'Lucida Console',
  'Tahoma',
  'Times New Roman',
  'Verdana'
];
const headerValues = [false, 1, 2, 3, 4, 5];
const fontSizeOptions = {
  inputAttr: {
    'aria-label': 'Font size'
  }
};
const fontFamilyOptions = {
  inputAttr: {
    'aria-label': 'Font family'
  }
};
const headerOptions = {
  inputAttr: {
    'aria-label': 'Font family'
  }
};


const TextBox = ({setItemExports, id, item}) => {
  const meta = item ? item.meta : null;

  const ref = useRef();
  const {height, width} = useSizeObserver(ref);
  const dispatch = useDispatch();
  const selectedItem = useSelector(selectCurrentItem);
  const reportId = useSelector(selectCurrentReportId);
  const [isMultiline] = useState(true);
  const [currentTab] = useState(tabs[2].value);
  const [dataSource, setDataSource] = useState(meta.textBoxOption.markdown);
  const {updateItem} = ItemSlice.actions;

  const handleValue = (e) => {
    setDataSource(e.value);
  };

  const textBoxOption = (id, key, value) => {
    let textBoxOption = selectedItem.meta.textBoxOption;
    textBoxOption = {
      ...textBoxOption,
      [key]: value
    };

    return setMeta('textBoxOption', textBoxOption);
  };

  const setMeta = (key, value) => {
    const item = selectedItem;
    return {
      ...item,
      meta: {
        ...item.meta,
        textBoxOption: {
          ...value
        }
      }
    };
  };

  useEffect(() => {
    const resizeElements =
      document.querySelectorAll(`.dx-resize-frame,
      .dx-resizable, .dx-state-invisible`);

    resizeElements.forEach((element) => {
      element.addEventListener('resize', (event) => {
        event.preventDefault();
      });
    });
    const item = textBoxOption(id, 'markdown', dataSource);
    loadMessages(koMessages);
    // locale(navigator.language);

    dispatch(updateItem({reportId, item}));
  }, [dataSource]);

  return (
    <Wrapper
      ref={ref}
      id={id}
    >
      <div className="widget-container">
        <HtmlEditor
          className="custom-html-editor-container"
          width={width - 40}
          height={height - 30}
          defaultValue={dataSource}
          onValueChanged={handleValue}
          readOnly={meta.textBoxOption.readOnly}
        >
          <MediaResizing enabled={true} />
          <ImageUpload tabs={currentTab} fileUploadMode="base64" />
          {
            meta.textBoxOption.toolBar ?
          <Toolbar
            multiline={isMultiline}
          >
            <Item name="undo" />
            <Item name="redo" />
            <Item name="separator" />
            <Item
              name="size"
              acceptedValues={sizeValues} options={fontSizeOptions} />
            <Item
              name="font"
              acceptedValues={fontValues} options={fontFamilyOptions} />
            <Item name="separator" />
            <Item name="bold" />
            <Item name="italic" />
            <Item name="strike" />
            <Item name="underline" />
            <Item name="separator" />
            <Item name="alignLeft" />
            <Item name="alignCenter" />
            <Item name="alignRight" />
            <Item name="alignJustify" />
            <Item name="separator" />
            <Item name="orderedList" />
            <Item name="bulletList" />
            <Item name="separator" />
            <Item
              name="header"
              acceptedValues={headerValues} options={headerOptions} />
            <Item name="separator" />
            <Item name="color" />
            <Item name="background" />
            <Item name="separator" />
            <Item name="link" />
            <Item name="image"/>
            <Item name="separator" />
            <Item name="clear" />
            <Item name="codeBlock" />
            <Item name="blockquote" />
            <Item name="separator" />
            <Item name="insertTable" />
            <Item name="deleteTable" />
            <Item name="insertRowAbove" />
            <Item name="insertRowBelow" />
            <Item name="deleteRow" />
            <Item name="insertColumnLeft" />
            <Item name="insertColumnRight" />
            <Item name="deleteColumn" />
          </Toolbar> : <></>}
        </HtmlEditor>
      </div>
    </Wrapper>
  );
};

export default React.memo(TextBox);
