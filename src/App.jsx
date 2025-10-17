import React from 'react';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Features from './components/Features';
import Discord from './components/Discord';
import About from './components/About';
import Join from './components/Join';
import Footer from './components/Footer';

function App() {
  React.useEffect(() => {
    const scrollLinks = document.querySelectorAll('.scroll');
    scrollLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        const offsetTop = target.offsetTop;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      });
    });
  }, []);

  return (
    <>
      <Navbar />
      <div className="mainflex">
        <Header />
        <div id="more"></div>
        <Features />
        <Discord />
        <About />
        <Join />
      </div>
      <Footer />
    </>
  );
}

export default App;