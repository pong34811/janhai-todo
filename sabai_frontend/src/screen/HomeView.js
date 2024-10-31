import React from "react";
import "./HomeView.css";
import {
  AiFillFacebook,
  AiFillTwitterCircle,
  AiFillInstagram,
} from "react-icons/ai";

import { GoCalendar, GoBrowser, GoMortarBoard } from "react-icons/go";

import { Outlet, Link } from "react-router-dom";

export default function HomeView() {
  return (
    <>
      <main>
        <div className="main-one">
          <h1>Trello brings all your tasks, teammates, and tools together</h1>
          <p>Keep everything in the same place—even if your team isn’t.</p>
          <button><Link to="/register">Sign up - it’s free!</Link></button>
        </div>

        <div className="main-two">
          <div className="work-two">
            <GoCalendar className="icon" />
            <p className="work-heading">Projects</p>
            <p className="work-text">
              I have worked on many projects and I am very proud of them. I am a
              very good developer and I am always looking for new projects.
            </p>
          </div>
          <div className="work-two">
            <GoBrowser className="icon" />
            <p className="work-heading">Web App</p>
            <p className="work-text">
              I have worked on many projects and I am very proud of them. I am a
              very good developer and I am always looking for new projects.
            </p>
          </div>
          <div className="work-two">
            <GoMortarBoard className="icon" />
            <p className="work-heading">Development</p>
            <p className="work-text">
              I have worked on many projects and I am very proud of them. I am a
              very good developer and I am always looking for new projects.
            </p>
          </div>
        </div>

        <div className="main-three">
          <div className="work-three">
            <h2>About Me</h2>
            <p>
              to create websites. I am a very good developer and I am always l I
              am a web developer and I love ooking for new projects. I am a very
              good developer and I am always looking for new projects.
            </p>
          </div>
          <div className="work-three">
            <img src="/logo.png" />
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-one">
          <p className="p-home">&copy; 2024 Developer Waritnan Lamai</p>
        </div>
        <div className="footer-two">
          <div className="work-footer">
            <span>More Info</span>
            <Link className="Links" to="#">
              Home
            </Link>
            <Link className="Links" to="#">
              About
            </Link>
            <Link className="Links" to="#">
              Contact
            </Link>
          </div>
          <div className="work-footer">
            <span>Social Links</span>
            <Link className="Links" to="#">
              <AiFillFacebook className="AiFillFacebook" />
            </Link>
            <Link className="Links" to="#">
              <AiFillTwitterCircle className="AiFillTwitterCircle" />
            </Link>
            <Link className="Links" to="#">
              <AiFillInstagram className="AiFillInstagram" />
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
