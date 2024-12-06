import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import CreateAgent from './pages/CreateAgent';
import Marketplace from './pages/Marketplace';
import MyAgents from './pages/MyAgents';

// Loading component for Suspense fallback
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Error fallback for specific routes
const RouteFallback = () => (
  <div className="min-h-screen bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
    <div className="max-w-max mx-auto">
      <main className="sm:flex">
        <p className="text-4xl font-bold text-red-600 sm:text-5xl">404</p>
        <div className="sm:ml-6">
          <div className="sm:border-l sm:border-gray-200 sm:pl-6">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl">
              Page not found
            </h1>
            <p className="mt-2 text-base text-gray-500">
              Please check the URL in the address bar and try again.
            </p>
          </div>
          <div className="mt-6 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
            <NavLink
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go back home
            </NavLink>
          </div>
        </div>
      </main>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <NavLink to="/" className="text-xl font-bold text-gray-900">
                      AI Agent Studio
                    </NavLink>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <NavLink 
                      to="/my-agents" 
                      className={({ isActive }) => 
                        isActive ? 'nav-link nav-link-active' : 'nav-link'
                      }
                    >
                      My Agents
                    </NavLink>
                    <NavLink 
                      to="/create" 
                      className={({ isActive }) => 
                        isActive ? 'nav-link nav-link-active' : 'nav-link'
                      }
                    >
                      Create
                    </NavLink>
                    <NavLink 
                      to="/marketplace" 
                      className={({ isActive }) => 
                        isActive ? 'nav-link nav-link-active' : 'nav-link'
                      }
                    >
                      Marketplace
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<MyAgents />} />
                <Route path="/my-agents" element={<MyAgents />} />
                <Route path="/create" element={<CreateAgent />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="*" element={<RouteFallback />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
