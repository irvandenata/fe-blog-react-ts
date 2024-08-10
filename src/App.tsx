import { FC, useState } from "react";
import { RouterProvider } from "react-router-dom";

import "./App.css";
import './assets/css/satoshi.css';
import routes from "./routes";

const App: FC = () => {
    return <RouterProvider router={routes} />;
};

export default App;
