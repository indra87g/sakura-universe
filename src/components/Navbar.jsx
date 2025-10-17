import React from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="desktop_navbar">
        <a href="#"><img className="desktop_navbar_logo_img" src="/media/logo_small.png" alt="logo" /></a>
        <a href="https://wiki.example.com/" className="desktop_navbar_link">Wiki</a>
        <a href="#discord" className="desktop_navbar_link scroll">Community</a>
        <a href="#about" className="desktop_navbar_link scroll">About Us</a>
        <div className="desktop_navbar_link2_div">
          <a href="#join" className="desktop_navbar_link2 scroll">Join Us!</a>
        </div>
      </nav>
      <div className="mobile_navbar">
        <a href="#" className="mobile_navbar_logo_img_a"><img className="mobile_navbar_logo_img" src="/media/logo_small.png" alt="logo" /></a>
        <div id="mobile_navbar_links" style={{ display: isOpen ? 'flex' : 'none' }}>
          <a className="mobile_navbar_link" onClick={toggleMenu} href="https://wiki.example.com/">Wiki</a>
          <a className="mobile_navbar_link scroll" onClick={toggleMenu} href="#discord">Community</a>
          <a className="mobile_navbar_link scroll" onClick={toggleMenu} href="#about">About Us</a>
          <a className="mobile_navbar_link scroll" onClick={toggleMenu} href="#join">Join Us</a>
        </div>
        <div className="icon" onClick={toggleMenu}>
          <i className="fa fa-bars"></i>
        </div>
      </div>
    </>
  );
};

export default Navbar;