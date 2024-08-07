import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import CreatePortfolio from "./components/CreatePortfolio";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Logout from "./pages/Logout";
import { useEffect } from "react";
import Metrics from "./components/Metrics";
import { useAuth } from "./context/auth";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useAuth();

  const routesWithoutTopbarSidebar = ["/", "/login", "/signup"];

  // Check if the current location matches any route where Topbar and Sidebar should be hidden
  const shouldHideTopbarSidebar = routesWithoutTopbarSidebar.includes(location.pathname);

  useEffect(() => {
    // const auth = localStorage.getItem("portauth");    
    if (auth.user) {      
      console.log(auth);
      setUser(auth.user);
    }
  }, [auth]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
        {!shouldHideTopbarSidebar && (
            <>
              <Sidebar isSidebar={isSidebar} />
              <Topbar setIsSidebar={setIsSidebar} />
            </>
          )}
          <main className="content">
          {/* <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} /> */}
            <Routes>                            
              {/* <Route path="/" element={user ? <CreatePortfolio /> : <Navigate to="/login" />} />                             */}
              <Route path="/" element={<CreatePortfolio /> } />                            
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/logout" element={<Logout/>}/>
              {user && <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />}
              <Route path="/team/:name" element={<Team /> } />
              <Route path="/contacts/:name" element={<Contacts /> } />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/metrics" element={<Metrics/>}/>
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
