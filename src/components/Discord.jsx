import React from 'react';
import WidgetBot from '@widgetbot/react-embed';

const Discord = () => {
  return (
    <div id="discord" className="main4">
      <a className="headline">Join the Discord</a>
      <div className="main4_dc_div">
        <WidgetBot
          server="1398301785210228868"
          channel="1398456053712162887"
          className="main4_dc_widget"
        />
        <div className="main4_dc_description_div">
          <a className="main4_dc_description_title">Let's talk!</a>
          <a className="main4_dc_description"> ・Meet other players <br /> ・Ask questions <br /> ・Get notified about updates <br /> ・Give feedback  <br /><br /> &amp; more </a>
          <a href="https://discord.gg/INVITE" className="main4_dc_button_a">
            <div className="main4_dc_button">Join</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Discord;