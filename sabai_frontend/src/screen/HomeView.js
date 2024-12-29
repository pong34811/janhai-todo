import React from "react";
import "./HomeView.css";
import {
  AiFillFacebook,
  AiFillTwitterCircle,
  AiFillInstagram,
} from "react-icons/ai";

import {
  IoLogoHtml5,
  IoLogoCss3,
  IoLogoNodejs,
  IoLogoPython,
} from "react-icons/io";

import { IoLogoReact, IoClipboardSharp } from "react-icons/io5";
import { GrUpdate } from "react-icons/gr";
import { BiLogoDjango, BiTask } from "react-icons/bi";
import { DiSqllite } from "react-icons/di";

import { Link } from "react-router-dom";

export default function HomeView() {
  return (
    <>
      <div className="row-hero_section">
        <div className="col">
          <h2>
            ยินดีต้อนรับสู่ <strong>Sabai App</strong> - โซลูชันจัดการงานของคุณ
          </h2>
          <p>
            ปฏิวัติการจัดการงานและโครงการของคุณ Sabai App
            ช่วยให้ทีมสามารถทำงานได้อย่างมีประสิทธิภาพด้วยอินเตอร์เฟซที่ชัดเจน
            ยืดหยุ่น และใช้งานง่าย สำหรับการจัดการงานและการทำงานร่วมกันในทีม
          </p>
          <Link to="/register">เริ่มต้นใช้งาน</Link>
        </div>
      </div>

      <div className="row-about-header">
        <h2>เกี่ยวกับ Sabai App</h2>
      </div>

      <div className="row-about">
        <div className="col">
          <div>
            <h3>จัดการงานอย่างมีประสิทธิภาพด้วยระบบที่เข้าใจง่าย</h3>
            <p>
              Sabai App นำเสนอวิธีการจัดการโครงการและงานแบบภาพรวม สร้างบอร์ด
              รายการ และการ์ดเพื่อจัดระเบียบและจัดลำดับความสำคัญของงาน
              ได้อย่างยืดหยุ่นและมีประสิทธิภาพ
            </p>
            <br />
            <p>
              ไม่ว่าคุณจะทำงานคนเดียวหรือทำงานเป็นทีม Sabai App
              สามารถปรับให้เข้ากับรูปแบบการทำงานของคุณ ลากและวางงานระหว่างรายการ
              เพิ่มรายละเอียด และติดตามความคืบหน้าได้ในที่เดียว
              ด้วยอินเตอร์เฟซที่ได้แรงบันดาลใจจาก Trello
            </p>
          </div>
        </div>
        <div className="col">
          <img src="/logo.png" alt="Sabai App Interface" />
        </div>
      </div>

      <div className="row-service-header">
        <h2>คุณสมบัติเด่น</h2>
      </div>

      <div className="row-service">
        <div className="col">
          <span>
            <IoClipboardSharp />
          </span>
          <h2>บอร์ดที่ยืดหยุ่น</h2>
          <p>
            สร้างบอร์ดไม่จำกัดเพื่อจัดระเบียบโครงการหรือเวิร์กโฟลว์ต่างๆ
            ปรับแต่งรายการ
          </p>
        </div>
        <div className="col">
          <span>
            <GrUpdate />
          </span>
          <h2>อัพเดทแบบเรียลไทม์</h2>
          <p>
            ติดตามการเปลี่ยนแปลงพร้อมกับทีมแบบเรียลไทม์
            เห็นการเปลี่ยนแปลงทันทีเมื่อมีการย้ายการ์ด เพิ่มความคิดเห็น
            หรืออัพเดทสถานะงาน
          </p>
        </div>
        <div className="col">
          <span>
            <BiTask />
          </span>
          <h2>จัดการงาน</h2>
          <p>
            แบ่งโครงการใหญ่เป็นงานย่อยที่จัดการได้ง่าย เพิ่มคำอธิบาย
            กำหนดวันครบกำหนด
            และแนบไฟล์เพื่อเก็บข้อมูลที่เกี่ยวข้องทั้งหมดไว้ในที่เดียว
          </p>
        </div>
      </div>

      <div className="row-clients-header">
        <h2>Technology Stack</h2>
      </div>

      <div className="row-clients">
        <div className="col">
          <span>
            <IoLogoReact />
          </span>
          <h2>React</h2>
        </div>
        <div className="col">
          <span>
            <IoLogoHtml5 />
          </span>
          <h2>HTML5</h2>
        </div>
        <div className="col">
          <span>
            <IoLogoCss3 />
          </span>
          <h2>CSS3</h2>
        </div>
        <div className="col">
          <span>
            <IoLogoNodejs />
          </span>
          <h2>Node.js</h2>
        </div>
        <div className="col">
          <span>
            <IoLogoPython />
          </span>
          <h2>python</h2>
        </div>
        <div className="col">
          <span>
            <BiLogoDjango />
          </span>
          <h2>django</h2>
        </div>
        <div className="col">
          <span>
            <DiSqllite />
          </span>
          <h2>SQLlite</h2>
        </div>
      </div>
      <section class="timeline">
        <ul>
          <li>
            <div>
              <time>11 กรกฎาคม 2024</time>
              เริ่มต้นโครงการพัฒนา Sabai App - แอปพลิเคชันจัดการงานและโปรเจค
            </div>
          </li>
          <li>
            <div>
              <time>20 สิงหาคม 2024</time>
              พัฒนาส่วน Backend ด้วย Python และ Django REST Framework เพื่อสร้าง
              API สำหรับจัดการข้อมูล
            </div>
          </li>
          <li>
            <div>
              <time>16 ตุลาคม 2024</time>
              พัฒนาระบบ Backend เสร็จสมบูรณ์ พร้อมทดสอบการทำงานของ API
            </div>
          </li>
          <li>
            <div>
              <time>18 พฤศจิกายน 2024</time>
              เริ่มพัฒนาส่วน Frontend ด้วย React 18
              สร้างส่วนติดต่อผู้ใช้ที่ทันสมัยและใช้งานง่าย
            </div>
          </li>
          <li>
            <div>
              <time>20 ธันวาคม 2024</time>
              พัฒนาระบบ Frontend เสร็จสมบูรณ์ พร้อมเชื่อมต่อกับ Backend API
            </div>
          </li>
          <li>
            <div>
              <time>25 ธันวาคม 2024</time>
              ปรับแต่ง UI/UX เพื่อเพิ่มประสบการณ์การใช้งานที่ดียิ่งขึ้น
            </div>
          </li>
          <li>
            <div>
              <time>29 ธันวาคม 2024</time>
              ทดสอบระบบแบบบูรณาการและแก้ไขข้อบกพร่อง พร้อมสำหรับการใช้งานจริง
            </div>
          </li>
        </ul>
      </section>
      <footer className="footer">
        <div className="footer-one">
          <p className="p-home">&copy; 2024 Developer Waritnan Lamai</p>
        </div>
        <div className="footer-two">
          <div className="work-footer">
            <span>ข้อมูลเพิ่มเติม</span>
            <Link className="Links" to="#">
              หน้าแรก
            </Link>
            <Link className="Links" to="#">
              เกี่ยวกับเรา
            </Link>
            <Link className="Links" to="#">
              ติดต่อ
            </Link>
          </div>
          <div className="work-footer">
            <span>โซเชียลมีเดีย</span>
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
