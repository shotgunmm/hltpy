import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.scss";
import registerServiceWorker from "./registerServiceWorker";
import store from "./store";
import { User } from "./types/User";

(window as any).readySteadyGo = (user: User) => {
  store.setUser(user);
  ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
  registerServiceWorker();
};
