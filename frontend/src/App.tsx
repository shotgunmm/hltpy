import { RMWCProvider } from '@rmwc/provider';
import * as React from 'react';
import { HashRouter } from 'react-router-dom';
import './App.scss';
import Routes from './routes';


class App extends React.Component {
  render() {
    return (
      <RMWCProvider>
        <HashRouter>
          <Routes />
        </HashRouter>
      </RMWCProvider>
    );
  }
}

export default App;
