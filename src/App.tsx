import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Projects } from './pages/Projects';
import { Skills } from './pages/Skills';
import { Experience } from './pages/Experience';
import { Certifications } from './pages/Certifications';
import { Contact } from './pages/Contact';
import { AdminLogin } from './pages/AdminLogin';
import { ForgotPassword } from './pages/ForgotPassword';
import { UpdatePassword } from './pages/UpdatePassword';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { SectionWrapper } from './components/SectionWrapper';
import { ScrollToTop } from './components/ScrollToTop';
import { TerminalBackground } from './components/TerminalBackground';
import { SplashScreen } from './components/SplashScreen';

function MainSite() {
  return (
    <div className="bg-slate-950 relative">
      <TerminalBackground />
      <div className="relative z-10 crt-flicker">
        <SectionWrapper id="home">
          <Home />
        </SectionWrapper>
        <SectionWrapper id="about">
          <About />
        </SectionWrapper>
        <SectionWrapper id="projects">
          <Projects />
        </SectionWrapper>
        <SectionWrapper id="skills">
          <Skills />
        </SectionWrapper>
        <SectionWrapper id="experience">
          <Experience />
        </SectionWrapper>
        <SectionWrapper id="certifications">
          <Certifications />
        </SectionWrapper>
        <SectionWrapper id="contact">
          <Contact />
        </SectionWrapper>
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/vicky-panel');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30">
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <ScrollToTop />}
      <AnimatePresence mode="wait">
        <Routes location={location}>
          <Route path="/" element={<MainSite />} />
          <Route path="/vicky-panel" element={<AdminLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/vicky-panel/dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AuthProvider>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}
