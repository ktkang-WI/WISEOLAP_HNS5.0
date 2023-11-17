import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import store from 'redux/modules';
import {Provider} from 'react-redux';
import Modals from 'components/common/atomic/Modal/organisms/Modals';
// import PopoverComp from 'components/common/atomic/Popover/organism/Popover';
import Popover2 from 'components/common/atomic/Popover/organism/Popover2';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
      <App />
      <Modals/>
      {/* <PopoverComp/> */}
      <Popover2/>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
