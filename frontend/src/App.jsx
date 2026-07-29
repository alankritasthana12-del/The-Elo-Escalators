import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import ReportLost from './pages/ReportLost/ReportLost';
import ReportFound from './pages/ReportFound/ReportFound';
import Search from './pages/Search/Search';
import Matches from './pages/Matches/Matches';
import Dashboard from './pages/Dashboard/Dashboard';
import Claim from './pages/Claim/Claim';
import ItemDetails from './pages/ItemDetails/ItemDetails';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '12px',
            fontSize: '14px',
            padding: '12px 16px',
            background: 'var(--color-surface-base)',
            color: 'var(--color-text-base)',
            border: '1px solid var(--color-border-base)',
          },
        }}
      />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="report-lost" element={<ReportLost />} />
          <Route path="report-found" element={<ReportFound />} />
          <Route path="search" element={<Search />} />
          <Route path="matches" element={<Matches />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="claim/:id" element={<Claim />} />
          <Route path="item/:id" element={<ItemDetails />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
