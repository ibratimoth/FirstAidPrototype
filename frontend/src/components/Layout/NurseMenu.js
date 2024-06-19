import React from "react";
import { Link } from "react-router-dom";
import './../../customStyles.css'

const NurseMenu = () => {
  return (
    <>
    <div className="text-center">
        <h3>Nurse Panel</h3>
      <div className="list-group list-group-dark">
        <Link to='/dashboard/user/create-category'
          className="list-group-item list-group-item-action px-3 border-0 list-group-item-secondary"
          aria-current="true"
        >
          Create Category
        </Link>
        <Link to='/dashboard/user/create-content'
          className="list-group-item list-group-item-action px-3 border-0 list-group-item-secondary"
        >
          Create Content
        </Link>
        <Link to='/dashboard/user/All-contents'
          className="list-group-item list-group-item-action px-3 border-0 list-group-item-secondary"
        >
          Contents
        </Link>
      </div>
    </div>
    </>
  );
};

export default NurseMenu;
