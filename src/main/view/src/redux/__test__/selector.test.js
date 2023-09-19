import {selectCurrentReport} from 'redux/selector/ReportSelector';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch
}));

describe('Selector Test', () => {
  it('Not Exist Report', () => {
    const state = {meta: {
      report: {
        selectedReportId: 123,
        reports: [{
          reportId: 3532, option: {},
          datasets: [{
            id: 'dataSource1',
            fields: [],
            parameters: []
          }]
        }]
      }
    }};

    expect(selectCurrentReport(state)).toEqual(undefined);
  });

  it('Exist Report', () => {
    const state = {meta: {
      report: {
        selectedReportId: 3532,
        reports: [{
          reportId: 3532, option: {},
          datasets: [{
            id: 'dataSource1',
            fields: [],
            parameters: []
          }]
        }]
      }
    }};

    expect(selectCurrentReport(state).datasets[0].id).toEqual('dataSource1');
  });
});
