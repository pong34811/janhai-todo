import React from 'react';
import { Link } from 'react-router-dom';
import './NoPage404.css';  // สไตล์แยกไฟล์

export default function NoPage404() {
  return (
    <div className="nopage-container">
    
      <h1 className="nopage-title">404</h1>
      <p className="nopage-message">ขออภัย ไม่พบหน้าที่คุณต้องการ</p>
      <p className="nopage-description">
        หน้านี้อาจถูกลบหรือไม่เคยมีอยู่เลย
      </p>
      <Link to="/" className="home-link">
        <button className="home-button">กลับสู่หน้าหลัก</button>
      </Link>
    </div>
  );
}
