import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./App.css";
import { HomePage } from "./pages/Home/Home";
import { Transcript } from "./pages/Transcript/Transcript";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/transcript/:transcriptFileName"
          element={<Transcript />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
