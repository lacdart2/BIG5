import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Today from './pages/Today'
import Week from './pages/Week'
import Live from './pages/Live'
import Standings from './pages/Standings'
import Favorites from './pages/Favorites'
import MatchDetails from './pages/MatchDetails'
import TeamDetails from './pages/TeamDetails'
import { LocaleProvider } from './i18n/LocaleProvider'

function App() {
  return (
    <LocaleProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Today />} />
            <Route path="week" element={<Week />} />
            <Route path="live" element={<Live />} />
            <Route path="standings" element={<Standings />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="match/:matchId" element={<MatchDetails />} />
            <Route path="team/:teamId" element={<TeamDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LocaleProvider>
  )
}

export default App