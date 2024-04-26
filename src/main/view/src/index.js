import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import store from 'redux/modules';
import {Provider} from 'react-redux';
import Modals from 'components/common/atomic/Modal/organisms/Modals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
      <App />
      <Modals/>
    </Provider>
);

// reportWebVitals();
