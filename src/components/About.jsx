import React from 'react';

const About = () => {
  return (
    <div id="about" className="main5">
      <a className="headline">Who we are</a>
      <div className="main5_admin_div">
        <div className="main5_admins_div main5_admins_dev_type2">
          <img className="main5_admins_img" alt="admin member img" src="/media/member_placeholder.webp" />
          <div className="main5_admins_description_div">
            <a className="main5_admins_description_rank main5_admins_description_rank_owner">[Owner]</a>
            <a className="main5_admins_description_title" href="https://example.com">Owner Name</a>
            <a className="main5_admins_description">Owner<br />description</a>
          </div>
        </div>
        <div className="main5_admins_div main5_admins_dev_type1">
          <img className="main5_admins_img" alt="admin member img" src="/media/member_placeholder.webp" />
          <div className="main5_admins_description_div">
            <a className="main5_admins_description_rank main5_admins_description_rank_admin">[Admin]</a>
            <a className="main5_admins_description_title" href="https://example.com">Admin Name</a>
            <a className="main5_admins_description">Admin<br />description</a>
          </div>
        </div>
      </div>
      <div className="main5_supporter_div">
        <div className="main5_supporters_div">
          <img className="main5_supporters_img" alt="supporters member img" src="/media/member_placeholder.webp" />
          <div className="main5_supporters_description_div">
            <a className="main5_supporters_description_rank main5_supporters_description_rank_supporter">[Supporter]</a>
            <a className="main5_supporters_description_title">Replacable Supporter 1</a>
            <a className="main5_supporters_description">Supporter<br />Description</a>
          </div>
        </div>
        <div className="main5_supporters_div">
          <img className="main5_supporters_img" alt="supporters member img" src="/media/member_placeholder.webp" />
          <div className="main5_supporters_description_div">
            <a className="main5_supporters_description_rank main5_supporters_description_rank_supporter">[Supporter]</a>
            <a className="main5_supporters_description_title">Replacable Supporter 2</a>
            <a className="main5_supporters_description">Supporter<br />Description</a>
          </div>
        </div>
        <div className="main5_supporters_div">
          <img className="main5_supporters_img" alt="supporters member img" src="/media/member_placeholder.webp" />
          <div className="main5_supporters_description_div">
            <a className="main5_supporters_description_rank main5_supporters_description_rank_supporter">[Supporter]</a>
            <a className="main5_supporters_description_title">Replacable Supporter 3</a>
            <a className="main5_supporters_description">Supporter<br />Description</a>
          </div>
        </div>
        <div className="main5_supporters_div">
          <img className="main5_supporters_img" alt="supporters member img" src="/media/member_placeholder.webp" />
          <div className="main5_supporters_description_div">
            <a className="main5_supporters_description_rank main5_supporters_description_rank_supporter">[Supporter]</a>
            <a className="main5_supporters_description_title">Replacable Supporter 4</a>
            <a className="main5_supporters_description">Supporter<br />Description</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;