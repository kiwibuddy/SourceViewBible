import App from './Components/App';
import React from 'React';
import { Provider } from 'react-redux';
import configureStore from './Store/configureStore';

const store = configureStore();

const SourceViewBible = () => {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
}

export default SourceViewBible;
