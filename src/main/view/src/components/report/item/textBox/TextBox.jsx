import {itemExportsObject}
  from 'components/report/atomic/ItemBoard/organisms/ItemBoard';
import {HtmlEditor} from 'devextreme-react';
import {
  ImageUpload,
  MediaResizing,
  Toolbar,
  Item
} from 'devextreme-react/html-editor';
import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import ItemSlice from 'redux/modules/ItemSlice';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';

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


const TextBox = ({setItemExports, id, item, node}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;

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

  const dxRef = useRef();
  const itemExportObject =
    itemExportsObject(id, dxRef, 'TEXTBOX', mart.data.data);

  const textBoxOption = (id, key, value) => {
    let textBoxOption = selectedItem.meta.textBoxOption;
    const isThisRadio = id === key;
    if (!isThisRadio) {
      textBoxOption = {
        ...textBoxOption,
        [key]: {
          ...textBoxOption[key],
          [id]: value
        }
      };
    } else {
      textBoxOption = {
        ...textBoxOption,
        [key]: value
      };
    }

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
    const item = textBoxOption(id, 'markdown', dataSource);
    dispatch(updateItem({reportId, item}));
  }, [dataSource]);

  useEffect(() => {
    setItemExports((prev) => {
      const itemExports =
        prev.filter((item) => item.id !== itemExportObject.id);
      return [
        ...itemExports,
        itemExportObject
      ];
    });
  }, [mart.data.data]);

  // const seriesNames = mart.data.info.seriesMeasureNames;

  return (
    <div className="widget-container">
      <HtmlEditor
        width={node?._rect?.width - 40}
        height={node?._rect?.height - 30}
        defaultValue={dataSource}
        onValueChanged={handleValue}
      >
        <MediaResizing enabled={true} />
        <ImageUpload tabs={currentTab} fileUploadMode="base64" />
        <Toolbar multiline={isMultiline}>
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
          <Item name="image" />
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
        </Toolbar>
      </HtmlEditor>
    </div>
  );
};

export default React.memo(TextBox);
