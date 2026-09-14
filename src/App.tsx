import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Today from './pages/Today'
import Week from './pages/Week'
import Live from './pages/Live'
import Standings from './pages/Standings'
import Favorites from './pages/Favorites'

/**
 * App — defines every route. All pages render inside <Layout>,
 * so the bottom nav persists while <Outlet> swaps the page content.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Today />} />
          <Route path="week" element={<Week />} />
          <Route path="live" element={<Live />} />
          <Route path="standings" element={<Standings />} />
          <Route path="favorites" element={<Favorites />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App