import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./App.css";
import { HomePage } from "./pages/Home/Home";
import { PlayerProvider } from "./state/player.context";
import { LibraryProvider } from "./state/library.context";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

// Had to add the providers in as a parent so that in the child App component
// we can susbcribe to the SSE connection and publish its events to the contexts
function AppWithProviders() {
  return (
    <>
      <LibraryProvider>
        <PlayerProvider>
          <App />
        </PlayerProvider>
      </LibraryProvider>
    </>
  );
}

export default AppWithProviders;
