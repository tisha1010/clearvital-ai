import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppShell from "./layouts/AppShell";
import Analyze from "./pages/Analyze";
import History from "./pages/History";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Result from "./pages/Result";

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/history" element={<History />} />
          <Route path="/login" element={<Login />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
