// // App.jsx
// import React, { useState, useEffect } from 'react';
// // import Header from './components/Header';
import Home from './components/Home';
// // import About from './components/About';
// // import Contact from './components/Contact';
// // import Login from './components/Auth/Login';
// // import Signup from './components/Auth/Signup';

function App() {
  // const [currentPage, setCurrentPage] = useState('home');
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showSignup, setShowSignup] = useState(false);

//   useEffect(() => {
//     // Check if user is logged in (from localStorage)
//     const user = localStorage.getItem('user');
//     if (user) {
//       setIsLoggedIn(true);
//     }
//   }, []);

//   const handleLogin = (userData) => {
//     localStorage.setItem('user', JSON.stringify(userData));
//     setIsLoggedIn(true);
//     setShowSignup(false);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     setIsLoggedIn(false);
//     setCurrentPage('home');
//   };

//   const toggleAuthMode = () => {
//     setShowSignup(!showSignup);
//   };

//   if (!isLoggedIn) {
//     return showSignup ? (
//       <Signup onLogin={handleLogin} onToggleMode={toggleAuthMode} />
//     ) : (
//       <Login onLogin={handleLogin} onToggleMode={toggleAuthMode} />
//     );
//   }

//   const renderPage = () => {
//     switch (currentPage) {
//       case 'home':
//         return <Home />;
//       case 'about':
//         return <About />;
//       case 'contact':
//         return <Contact />;
//       default:
//         return <Home />;
//     }
//   };

  return (
    <Home/>
    // <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    //   <Header 
    //     currentPage={currentPage} 
    //     setCurrentPage={setCurrentPage} 
    //     onLogout={handleLogout}
    //   />
    //   <main className="container mx-auto px-4 py-8">
    //     {renderPage()}
    //   </main>
    // </div>
  );
}

export default App;