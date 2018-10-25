import { RMWCProvider } from '@rmwc/provider';
import { ThemeProvider } from '@rmwc/theme';
import { Provider } from 'mobx-react';
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.scss';
import themeOptions from './components/theme';
import Routes from './routes';
import store from './store';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <RMWCProvider>
          <ThemeProvider options={themeOptions}>
            <BrowserRouter basename="/dashboard">
              <Routes />
            </BrowserRouter>
          </ThemeProvider>
        </RMWCProvider>
      </Provider>
    );
  }
}

export default App;
