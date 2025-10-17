import React from 'react';

const Join = () => {
  return (
    <div id="join" className="main3">
      <a className="headline">How to join</a>
      <div className="main3_join_div_div">
        <div className="main3_join_div">
          <a className="main3_join_title">Java</a>
          <div className="main3_join_content_div">
            <div className="main3_join_categories">
              <a>IP:</a>
              <a>Version:</a>
            </div>
            <div className="main3_join_values">
              <a>play.example.com</a>
              <a>1.20.1</a>
            </div>
          </div>
        </div>
        <div className="main3_join_div">
          <a className="main3_join_title">Bedrock</a>
          <div className="main3_join_content_div">
            <div className="main3_join_categories">
              <a>IP:</a>
              <a>Port:</a>
            </div>
            <div className="main3_join_values">
              <a>be.example.com</a>
              <a>69420</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Join;