import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProductsPage from './pages/ProductsPage';
import CreateProductPage from './pages/CreateProductPage';
import CreateOrderPage from './pages/CreateOrderPage';
import StatisticsPage from './pages/StatisticsPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/create" element={<CreateProductPage />} />
        <Route path="/orders/create" element={<CreateOrderPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
