
import {DataGrid} from 'devextreme-react';
import {exportDataGrid} from 'devextreme/excel_exporter';
import {Workbook} from 'exceljs';
import saveAs from 'file-saver';
import Modal from './Modal';
import {getTheme} from 'config/theme';
import {Column} from 'devextreme-react/data-grid';
import {
  formatNumber,
  generateLabelSuffix
} from 'components/utils/NumberFormatUtility';

const theme = getTheme();

const ShowDataModal = ({
  onSubmit, modalTitle, data, columns=[], ...props
}) => {
  const cellRender = (e, col) => {
    const value = e.data[col.name] ? e.data[col.name] : 0;
    const displayValue = e.displayValue ? e.displayValue : 0;

    if (col.type === 'MEA') {
      const labelSuffix = generateLabelSuffix(col.format);
      e.value = formatNumber(displayValue, col.format, labelSuffix);
      return e.value;
    }

    if (value === 0) return '0';

    return value;
  };

  return (
    <Modal
      modalTitle={modalTitle}
      width={theme.size.bigModalWidth}
      height={theme.size.bigModalHeight}
      {...props}
    >
      <DataGrid
        dataSource={data}
        columnChooser={{
          enabled: true
        }}
        height={'100%'}
        export={{enabled: true}}
        allowColumnResizing={true}
        onExporting={(e) => {
          const workbook = new Workbook();
          const worksheet = workbook.addWorksheet('Main sheet');
          exportDataGrid({
            component: e.component,
            worksheet: worksheet,
            customizeCell: function(options) {
              options.excelCell.font = {name: 'Arial', size: 12};
              options.excelCell.alignment = {horizontal: 'left'};
            }
          }).then(function() {
            workbook.xlsx.writeBuffer()
                .then(function(buffer) {
                  saveAs(new Blob([buffer], {
                    type: 'application/octet-stream'
                  }), modalTitle + '.xlsx');
                }).catch((e) => {
                  console.log(e);
                });
          }).catch((e) => {
            console.log(e);
          });
        }}
      >
        {columns.map((col) => {
          return <Column
            key={col.name}
            dataField={col.name}
            caption={col.caption}
            cellRender={(e) => cellRender(e, col)}
          />;
        })}
      </DataGrid>
    </Modal>
  );
};

export default ShowDataModal;
