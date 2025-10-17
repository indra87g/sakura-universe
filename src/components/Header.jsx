import React from 'react';

const Header = () => {
  const [showPopup, setShowPopup] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText("play.example.com");
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 1000);
  };

  return (
    <div className="main1">
      <a className="main1_logo_a" href="#">
        <img className="main1_logo" src="/media/logo.png" alt="logo" />
      </a>
      <div className="main1_description">
        <a>Minecraft,<br />like</a>
        <a className="main1_actcent">already done before</a><a>.</a>
      </div>
      <div className="main1_ipcopier_div">
        <button className="main1_ipcopier" onClick={copyToClipboard} type="button">
          <span className="main1_ipcopier_text1">play.example.com</span>
          <br />
          <span className="main1_ipcopier_text2">Click to copy</span>
        </button>
        {showPopup && (
          <div className="main1_popup">
            <h3 className="copy_confirm">Copied IP to clipboard</h3>
          </div>
        )}
      </div>
      <a href="#more" className="scroll">
        <img alt="downarrow" className="main1_downarrow" src="/media/downarrow.png" />
      </a>
    </div>
  );
};

export default Header;