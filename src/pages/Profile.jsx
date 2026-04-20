import React from 'react';
import { Camera, Edit2, Shield, Lock, ExternalLink } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  return (
    <div className="page-container profile-page">
      <header className="profile-header">
        <div className="profile-header-left">
          <div className="avatar-wrapper">
             <img src="https://ui-avatars.com/api/?name=Alex+Rivers&background=353534&color=A3E635&size=128" alt="Alex Rivers" />
             <button className="btn-edit-avatar">
               <Camera size={14} />
             </button>
          </div>
          <div className="profile-header-info">
            <h2>Alex Rivers</h2>
            <div className="profile-badges">
              <span className="badge">Student</span>
              <span className="bullet">•</span>
              <span className="badge">Enrolled since Oct 2023</span>
            </div>
          </div>
        </div>
      </header>

      <div className="profile-grid">
        <div className="profile-col-left">
          <section className="profile-section info-section">
            <div className="section-header">
              <h3>Personal Information</h3>
              <button className="btn-icon">
                <Edit2 size={16} />
              </button>
            </div>

            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Full Name</span>
                <span className="info-value">Alex Rivers</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email Address</span>
                <span className="info-value">alex.rivers@example.com</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone Number</span>
                <span className="info-value">+1 (555) 012-3456</span>
              </div>
              <div className="info-item">
                <span className="info-label">Organization</span>
                <span className="info-value">Independent Scholar</span>
              </div>
            </div>
          </section>
        </div>

        <div className="profile-col-right">
          <section className="profile-section progress-section">
            <h3>My Progress</h3>
            
            <div className="progress-items">
              <div className="progress-item">
                <div className="progress-item-left">
                  <div className="progress-item-info">
                    <h4>UI/UX Advanced</h4>
                    <span>65% Completed</span>
                  </div>
                  <div className="status-pill in-progress">
                    <div className="dot"></div>
                    In Progress
                  </div>
                </div>
                <div className="progress-circle">
                  {/* SVG Circle omitted for simplicity */}
                  <span>65%</span>
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-item-left">
                  <div className="progress-item-info">
                    <h4>Motion Design</h4>
                    <span>20% Completed</span>
                  </div>
                  <div className="status-pill in-progress">
                    <div className="dot"></div>
                    In Progress
                  </div>
                </div>
                <div className="progress-circle">
                  <span>20%</span>
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-item-left">
                  <div className="progress-item-info">
                    <h4>Foundations</h4>
                    <span>100% Completed</span>
                  </div>
                  <div className="status-pill completed">
                    <div className="check-icon">✓</div>
                    Completed
                  </div>
                </div>
                <div className="progress-circle full">
                  <span>100%</span>
                </div>
              </div>
            </div>
          </section>

          <section className="profile-section security-section">
            <div className="security-info">
               <div className="security-text">
                 <h4>Security</h4>
                 <p>Manage your password and account access.</p>
               </div>
               <button className="btn-secondary">Change Password</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
