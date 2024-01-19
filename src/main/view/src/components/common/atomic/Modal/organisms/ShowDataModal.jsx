
import {DataGrid} from 'devextreme-react';
import {exportDataGrid} from 'devextreme/excel_exporter';
import {Workbook} from 'exceljs';
import saveAs from 'file-saver';
import Modal from './Modal';
import {getTheme} from 'config/theme';
import {Column} from 'devextreme-react/data-grid';

const theme = getTheme();

const ShowDataModal = ({
  onSubmit, modalTitle, data, columns=[], ...props
}) => {
  return (
    <Modal
      modalTitle={modalTitle}
      width={theme.size.bigModalWidth}
      height={theme.size.bigModalHeight}
      onSubmit={() => {}}
      {...props}
    >
      <DataGrid
        dataSource={data}
        columnChooser={{
          enabled: true
        }}
        height={'100%'}
        export={{enabled: true}}
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
                });
          });
        }}
      >
        {columns.map((col) => {
          return <Column
            key={col.name}
            dataField={col.name}
            caption={col.caption}
          />;
        })}
      </DataGrid>
    </Modal>
  );
};

export default ShowDataModal;
