

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add more routes as you develop your application */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
