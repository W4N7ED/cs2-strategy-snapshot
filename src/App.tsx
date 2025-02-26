
import { Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import MapDetail from "./pages/MapDetail";
import { Toaster } from "./components/ui/toaster";
import AdminLogin from "./pages/AdminLogin";
import AdminProfile from "./pages/AdminProfile";
import { ProtectedRoute } from "./components/ProtectedRoute";
import StrategyList from "./pages/StrategyList";
import UtilityList from "./pages/UtilityList";
import NotFound from "./pages/NotFound";
import MapPositions from "./pages/MapPositions";
import Binds from "./pages/Binds";
import AddUtility from "./pages/AddUtility";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/maps/:mapId" element={<MapDetail />} />
        
        {/* Routes des stratégies */}
        <Route path="/maps/:mapId/strategies" element={<StrategyList />} />
        
        {/* Routes des utilitaires */}
        <Route path="/maps/:mapId/utilities/:utilityType" element={<UtilityList />} />
        <Route path="/maps/:mapId/utilities/:utilityType/add" element={<AddUtility />} />
        
        {/* Routes des positions */}
        <Route path="/maps/:mapId/positions" element={<MapPositions />} />
        
        {/* Routes d'admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
        
        {/* Route des binds */}
        <Route path="/binds" element={<Binds />} />
        
        {/* Page 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
