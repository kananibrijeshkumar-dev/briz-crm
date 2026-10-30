import React, { useState } from "react";
import { 
  Zap, Check, ArrowRight, Shield, MessageSquare, Clock, 
  FileText, LayoutGrid, Users, Building2, ChevronRight,
  TrendingUp, Award, Star, ExternalLink, Globe, Sparkles,
  PhoneCall, CheckCircle2, Lock, BarChart3, Database, Phone, Mail, MapPin
} from "lucide-react";
import "./LandingPage.css";

export default function LandingPage({ onEnterWorkstation, onOpenLogin }) {
  const [billingCycle, setBillingCycle] = useState("annual"); // "monthly" or "annual"

  return (
    <div className="landing-page-root">
      {/* Ambient Glows */}
      <div className="landing-ambient-glow-1"></div>
      <div className="landing-ambient-glow-2"></div>

      {/* NAVBAR */}
      <header className="landing-navbar">
        <div className="landing-logo-group" onClick={onEnterWorkstation}>
          <div className="landing-logo-icon">
            <Zap size={22} />
          </div>
          <div className="landing-logo-text">
            Briz<span>CRM</span>
            <span className="landing-logo-badge">Enterprise SaaS</span>
          </div>
        </div>

        <nav className="landing-nav-links">
          <a href="#features" className="landing-nav-item">Core Features</a>
          <a href="#integrations" className="landing-nav-item">Integrations</a>
          <a href="#pricing" className="landing-nav-item">Pricing Plans</a>
          <a href="#testimonials" className="landing-nav-item">Case Studies</a>
        </nav>

        <div className="landing-nav-actions">
          <button className="btn-landing-login" onClick={onOpenLogin || onEnterWorkstation}>
            <Lock size={14} /> Client Sign In
          </button>
          <button className="btn-landing-cta" onClick={onEnterWorkstation}>
            <span>Launch Live CRM</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="landing-hero">
        <div className="hero-pill-badge">
          <Sparkles size={14} className="text-amber" />
          <span>Next-Gen WhatsApp Sales Automation for Indian Enterprises</span>
        </div>

        <h1 className="hero-headline">
          Empower Your Sales Team with <br />
          <span className="hero-headline-gradient">BrizCRM: Where Efficiency Meets Scale!</span>
        </h1>

        <p className="hero-subheadline">
          Stop losing inquiries across WhatsApp, IndiaMART, Justdial, and phone calls. 
          Automatically organize leads, schedule daily follow-up calls, generate 1-click GST quotations in Hindi & English, 
          and track your team's pipeline from one unified command center.
        </p>

        <div className="hero-cta-cluster">
          <button className="btn-hero-primary" onClick={onEnterWorkstation}>
            <Zap size={18} />
            <span>Launch Workstation &rarr;</span>
          </button>
          <a href="#pricing" className="btn-hero-secondary">
            <span>Explore Pricing & Plans</span>
          </a>
        </div>

        <div className="hero-trust-bar">
          <div className="trust-badge-item">
            <Shield size={15} className="text-emerald" />
            <span>Banking-Grade PostgreSQL Security</span>
          </div>
          <span>•</span>
          <div className="trust-badge-item">
            <CheckCircle2 size={15} className="text-emerald" />
            <span>WhatsApp Cloud API Verified</span>
          </div>
          <span>•</span>
          <div className="trust-badge-item">
            <Award size={15} className="text-emerald" />
            <span>Trusted by Food Machinery & Tourism Leaders</span>
          </div>
        </div>

        {/* HERO INTERACTIVE MOCKUP SHOWCASE */}
        <div className="hero-mockup-frame">
          <div className="mockup-inner-header">
            <div className="browser-dots">
              <div className="browser-dot red"></div>
              <div className="browser-dot yellow"></div>
              <div className="browser-dot green"></div>
            </div>
            <div className="mockup-url-pill">
              https://crm.brizpatel.online/pipeline
            </div>
            <div style={{ width: 40 }}></div>
          </div>

          <div className="mockup-preview-content">
            {/* Top Stat Row */}
            <div className="mini-stats-grid">
              <div className="mini-stat-card">
                <div className="mini-stat-label">Active Pipeline Value</div>
                <div className="mini-stat-val">₹8,45,000</div>
              </div>
              <div className="mini-stat-card">
                <div className="mini-stat-label">Closed Revenue (Won)</div>
                <div className="mini-stat-val" style={{ color: "#34d399" }}>₹2,63,000</div>
              </div>
              <div className="mini-stat-card">
                <div className="mini-stat-label">Calls Due Today</div>
                <div className="mini-stat-val" style={{ color: "#fbbf24" }}>4 Follow-Ups</div>
              </div>
              <div className="mini-stat-card">
                <div className="mini-stat-label">Average Win Rate</div>
                <div className="mini-stat-val" style={{ color: "#818cf8" }}>82%</div>
              </div>
            </div>

            {/* Kanban Columns Preview */}
            <div className="mini-pipeline-row">
              <div className="mini-col">
                <div className="mini-col-title">📥 New Inquiries (2)</div>
                <div className="mini-card-sample">
                  <div className="mini-card-name">Haresh Thakor</div>
                  <div className="mini-card-val">Double Chamber 7.5 HP</div>
                </div>
              </div>
              <div className="mini-col">
                <div className="mini-col-title">💬 Contacted (2)</div>
                <div className="mini-card-sample">
                  <div className="mini-card-name">Kamal Gupta</div>
                  <div className="mini-card-val">5 HP Atta Chakki</div>
                </div>
              </div>
              <div className="mini-col">
                <div className="mini-col-title">📄 Quote Shared (3)</div>
                <div className="mini-card-sample">
                  <div className="mini-card-name">Abdul Chitrakoot</div>
                  <div className="mini-card-val">₹1,45,000 (Cyclone)</div>
                </div>
              </div>
              <div className="mini-col">
                <div className="mini-col-title">🏭 Factory Demo (1)</div>
                <div className="mini-card-sample">
                  <div className="mini-card-name">Subhashish Kumar</div>
                  <div className="mini-card-val">₹68,000 (Live Demo)</div>
                </div>
              </div>
              <div className="mini-col">
                <div className="mini-col-title">🏆 Won / Paid (2)</div>
                <div className="mini-card-sample">
                  <div className="mini-card-name">Harendra Kumar</div>
                  <div className="mini-card-val">₹95,000 Advance Paid</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM METRICS STRIP */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,15,28,0.5)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24, textAlign: "center" }}>
          <div>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#ffffff" }}>₹1.5 Cr+</div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Sales Pipeline Tracked</div>
          </div>
          <div>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#818cf8" }}>88%</div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Faster Quotation Generation</div>
          </div>
          <div>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#34d399" }}>10+ Years</div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Permanent Cloud Data History</div>
          </div>
          <div>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#fbbf24" }}>99.9%</div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Vercel & Supabase Cloud Uptime</div>
          </div>
        </div>
      </section>

      {/* INTEGRATIONS SECTION */}
      <section id="integrations" className="landing-section">
        <div className="section-header-center">
          <span className="section-tag">Omnichannel Lead Ingestion</span>
          <h2 className="section-title">Seamlessly Connected to Where Your Customers Are</h2>
          <p className="section-desc">
            BrizCRM aggregates high-intent customer inquiries from India's biggest B2B and consumer channels into one streamlined workflow.
          </p>
        </div>

        <div className="integrations-grid">
          <div className="integration-card">
            <div className="integration-icon-wrap" style={{ color: "#25D366" }}>
              <MessageSquare size={28} />
            </div>
            <div className="integration-meta">
              <h4>WhatsApp Cloud API</h4>
              <p>Official 2-way verified business messaging, automatic lead capture & quotation PDFs.</p>
            </div>
          </div>

          <div className="integration-card">
            <div className="integration-icon-wrap" style={{ color: "#3b82f6" }}>
              <Building2 size={28} />
            </div>
            <div className="integration-meta">
              <h4>IndiaMART & TradeIndia</h4>
              <p>Direct B2B inquiry webhook sync for manufacturing, wholesale, and export leads.</p>
            </div>
          </div>

          <div className="integration-card">
            <div className="integration-icon-wrap" style={{ color: "#f59e0b" }}>
              <PhoneCall size={28} />
            </div>
            <div className="integration-meta">
              <h4>Justdial & Phone Inquiries</h4>
              <p>Capture caller phone numbers, assign to sales reps, and log conversation audio.</p>
            </div>
          </div>

          <div className="integration-card">
            <div className="integration-icon-wrap" style={{ color: "#ec4899" }}>
              <Globe size={28} />
            </div>
            <div className="integration-meta">
              <h4>Meta & Google Ads</h4>
              <p>Auto-sync instant form leads directly into your pipeline with zero manual copy-paste.</p>
            </div>
          </div>

          <div className="integration-card">
            <div className="integration-icon-wrap" style={{ color: "#38bdf8" }}>
              <Database size={28} />
            </div>
            <div className="integration-meta">
              <h4>Supabase PostgreSQL</h4>
              <p>Enterprise cloud database with encrypted lead storage, row-level security, and audit logs.</p>
            </div>
          </div>

          <div className="integration-card">
            <div className="integration-icon-wrap" style={{ color: "#a855f7" }}>
              <Zap size={28} />
            </div>
            <div className="integration-meta">
              <h4>Vercel Edge Network</h4>
              <p>Sub-second page speeds anywhere in India with automatic enterprise SSL certificates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SHOWCASE */}
      <section id="features" className="landing-section" style={{ background: "rgba(15,23,42,0.3)" }}>
        <div className="section-header-center">
          <span className="section-tag">Purpose-Built for Industry</span>
          <h2 className="section-title">Everything You Need to Run High-Velocity Sales</h2>
          <p className="section-desc">
            Unlike generic American CRMs with complicated setups, BrizCRM is built around the daily realities of Indian trade and sales desks.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-box">
            <div className="feature-icon-circle indigo">
              <FileText size={26} />
            </div>
            <h3 className="feature-title">1-Click WhatsApp Quotation Studio</h3>
            <p className="feature-desc">
              Generate accurate GST quotations in <strong>Hindi, English, or Gujarati</strong>. Include motor HP, base price, and 18% GST with a single tap directly to customer WhatsApp.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-circle amber">
              <Clock size={26} />
            </div>
            <h3 className="feature-title">Follow-Up Reminders & Daily Agenda</h3>
            <p className="feature-desc">
              80% of sales happen on follow-up calls. Our dedicated Reminders Desk highlights <strong>🔴 Overdue</strong>, <strong>🟡 Due Today</strong>, and <strong>🟢 Upcoming</strong> calls for every rep.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-circle emerald">
              <LayoutGrid size={26} />
            </div>
            <h3 className="feature-title">Visual 5-Stage Kanban Pipeline</h3>
            <p className="feature-desc">
              Track deals across <em>New Inquiry &rarr; Contacted &rarr; Quotation &rarr; Demo &rarr; Won</em>. Advance stages with 1 click and celebrate closed deals with interactive victory confetti.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-circle purple">
              <Building2 size={26} />
            </div>
            <h3 className="feature-title">Multi-Client SaaS Workspace Isolation</h3>
            <p className="feature-desc">
              Run multiple businesses under one master portal. Seamlessly toggle between <strong>Jay Shree Ambe Food Machinery</strong>, <strong>MNP Holidays</strong>, and new client accounts.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-circle pink">
              <Users size={26} />
            </div>
            <h3 className="feature-title">Sales Team Access & Performance</h3>
            <p className="feature-desc">
              Assign individual Login IDs and passwords to each representative. Track won deals, revenue generated, and send WhatsApp login credentials in 1 click.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-circle cyan">
              <Database size={26} />
            </div>
            <h3 className="feature-title">Decade-Long Historical Data & Filter</h3>
            <p className="feature-desc">
              Filter leads across <strong>September 2026, October 2026, Full Year 2026</strong>, or all time. Export clean CSV/Excel spreadsheets whenever required.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING PLANS */}
      <section id="pricing" className="landing-section">
        <div className="section-header-center">
          <span className="section-tag">Predictable & Honest Pricing</span>
          <h2 className="section-title">Plans Designed to Grow with Your Sales Volume</h2>
          <p className="section-desc">
            No hidden per-contact charges. Simple monthly or annual subscriptions with full access to WhatsApp automation.
          </p>

          <div className="pricing-toggle-wrap" style={{ marginTop: 24 }}>
            <div className="toggle-pill">
              <button 
                className={`toggle-btn ${billingCycle === "monthly" ? "active" : ""}`}
                onClick={() => setBillingCycle("monthly")}
              >
                Billed Monthly
              </button>
              <button 
                className={`toggle-btn ${billingCycle === "annual" ? "active" : ""}`}
                onClick={() => setBillingCycle("annual")}
              >
                Billed Annually
              </button>
            </div>
            <span className="pricing-discount-badge">Save 20% on Annual</span>
          </div>
        </div>

        <div className="pricing-grid">
          {/* Plan 1 */}
          <div className="pricing-card">
            <h3 className="plan-name">Starter Growth</h3>
            <p className="plan-desc">Perfect for small workshops, traders, and single-desk offices.</p>
            <div className="plan-price-row">
              <span className="plan-price-num">{billingCycle === "annual" ? "₹799" : "₹999"}</span>
              <span className="plan-price-period">/ month</span>
            </div>
            <ul className="plan-features-list">
              <li className="plan-feature-item"><Check size={16} className="plan-check-icon" /> Up to 3 Sales Representatives</li>
              <li className="plan-feature-item"><Check size={16} className="plan-check-icon" /> WhatsApp Ingestion & Lead Capture</li>
              <li className="plan-feature-item"><Check size={16} className="plan-check-icon" /> Master Leads Database & CSV Export</li>
              <li className="plan-feature-item"><Check size={16} className="plan-check-icon" /> Basic Follow-Up Call Scheduling</li>
              <li className="plan-feature-item"><Check size={16} className="plan-check-icon" /> PostgreSQL Cloud Data Security</li>
            </ul>
            <button className="btn-pricing-cta" onClick={onEnterWorkstation}>
              Get Started with Starter &rarr;
            </button>
          </div>

          {/* Plan 2: Featured */}
          <div className="pricing-card featured">
            <div className="popular-ribbon">⭐ Most Popular for Manufacturers</div>
            <h3 className="plan-name">Pro Business</h3>
            <p className="plan-desc">For active factories, travel agencies, and growing sales teams.</p>
            <div className="plan-price-row">
              <span className="plan-price-num" style={{ color: "#818cf8" }}>{billingCycle === "annual" ? "₹1,999" : "₹2,499"}</span>
              <span className="plan-price-period">/ month</span>
            </div>
            <ul className="plan-features-list">
              <li className="plan-feature-item"><Check size={16} className="plan-check-icon" /> Up to 10 Sales Representatives</li>
              <li className="plan-feature-item"><Check size={16} className="plan-check-icon" /> <strong>1-Click WhatsApp Quotation Studio</strong></li>
              <li className="plan-feature-item"><Check size={16} className="plan-check-icon" /> <strong>Hindi, English & Gujarati Templates</strong></li>
              <li className="plan-feature-item"><Check size={16} className="plan-check-icon" /> Visual 5-Stage Kanban Pipeline</li>
              <li className="plan-feature-item"><Check size={16} className="plan-check-icon" /> Daily Follow-Up Reminder Alert Desk</li>
              <li className="plan-feature-item"><Check size={16} className="plan-check-icon" /> Rep Performance & Won Deal Tracking</li>
              <li className="plan-feature-item"><Check size={16} className="plan-check-icon" /> Direct WhatsApp Credential Invites</li>
            </ul>
            <button className="btn-pricing-cta featured" onClick={onEnterWorkstation}>
              Start Pro Business &rarr;
            </button>
          </div>

          {/* Plan 3 */}
          <div className="pricing-card">
            <h3 className="plan-name">Enterprise Custom</h3>
            <p className="plan-desc">For large industrial plants, multi-branch firms, and SaaS agencies.</p>
            <div className="plan-price-row">
              <span className="plan-price-num">{billingCycle === "annual" ? "₹4,799" : "₹5,999"}</span>
              <span className="plan-price-period">/ month</span>
            </div>
            <ul className="plan-features-list">
              <li className="plan-feature-item"><Check size={16} className="plan-check-icon" /> <strong>Unlimited Sales Representatives</strong></li>
              <li className="plan-feature-item"><Check size={16} className="plan-check-icon" /> <strong>Multi-Tenant Client Onboarding (SaaS)</strong></li>
              <li className="plan-feature-item"><Check size={16} className="plan-check-icon" /> Custom Domain (crm.yourcompany.online)</li>
              <li className="plan-feature-item"><Check size={16} className="plan-check-icon" /> Custom GST & Transport Calculator Rules</li>
              <li className="plan-feature-item"><Check size={16} className="plan-check-icon" /> Dedicated Account Manager & VIP Support</li>
            </ul>
            <button className="btn-pricing-cta" onClick={onEnterWorkstation}>
              Contact for Enterprise &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* CASE STUDIES / TESTIMONIALS */}
      <section id="testimonials" className="landing-section" style={{ background: "rgba(15,23,42,0.3)" }}>
        <div className="section-header-center">
          <span className="section-tag">Client Success Stories</span>
          <h2 className="section-title">Trusted by Real Indian Enterprises</h2>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-quote">
              "We receive dozens of inquiries daily from UP, Bihar, and Rajasthan for our commercial pulverizers and flour mills. BrizCRM's 1-click WhatsApp quotation generator in Hindi allows our sales reps Mukeshbhai and Anilbhai to send quotes with GST in 30 seconds. It transformed our factory follow-up speed!"
            </div>
            <div className="testimonial-author-row">
              <div className="author-avatar">JA</div>
              <div>
                <div className="author-name">Jay Shree Ambe Food Machinery</div>
                <div className="author-title">Food Processing Equipment Manufacturer (Ahmedabad, Gujarat)</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-quote">
              "Managing holiday inquiries for Dubai, Thailand, Bali, and Goa requires instant itinerary sharing and polite follow-ups. BrizCRM gave us a dedicated workspace with customized tour packages, eliminating lead chaos across our booking desks."
            </div>
            <div className="testimonial-author-row">
              <div className="author-avatar" style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)" }}>MN</div>
              <div>
                <div className="author-name">MNP Holidays</div>
                <div className="author-title">International & Domestic Tour Operators (Gujarat)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="landing-final-cta">
        <h2 className="final-cta-title">Ready to Eliminate Lost Leads and Accelerate Sales?</h2>
        <p className="final-cta-desc">
          Join high-performance sales teams running on BrizCRM. Launch your command center or explore the live interactive demo right now.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-hero-primary" onClick={onEnterWorkstation}>
            <Zap size={18} />
            <span>Open BrizCRM Workstation</span>
          </button>
        </div>
      </section>

            {/* PROFESSIONAL MULTI-COLUMN FOOTER */}
      <footer className="landing-footer">
        <div className="footer-grid-container">
          {/* Column 1: Brand & Social */}
          <div className="footer-col footer-col-brand">
            <div className="landing-logo-group" onClick={onEnterWorkstation}>
              <div className="landing-logo-icon" style={{ width: 34, height: 34 }}>
                <Zap size={20} />
              </div>
              <div className="landing-logo-text" style={{ fontSize: 20 }}>
                Briz<span>CRM</span>
              </div>
            </div>
            <p className="footer-brand-tagline">
              Intelligent Sales Pipeline & Automated WhatsApp CRM engineered for fast-moving sales teams.
            </p>

            <div className="footer-social-wrap">
              <span className="footer-social-heading">Follow Us</span>
              <div className="footer-social-icons">
                <a href="https://wa.me/919898860145" target="_blank" rel="noreferrer" className="social-icon-btn whatsapp" title="WhatsApp Business">
                  <MessageSquare size={16} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon-btn linkedin" title="LinkedIn">
                  <Globe size={16} />
                </a>
                <a href="https://brizpatel.online" target="_blank" rel="noreferrer" className="social-icon-btn portfolio" title="Briz AI Studio">
                  <Sparkles size={16} />
                </a>
              </div>
            </div>

            <div className="footer-copyright-note">
              Copyright &copy; 2024–2026. All Rights Reserved.
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links-list">
              <li><a href="#hero">Home</a></li>
              <li><a href="#features">Key Features</a></li>
              <li><a href="#integrations">WhatsApp Automation</a></li>
              <li><a href="#pricing">Pricing & Plans</a></li>
              <li><span className="footer-interactive-link" onClick={onEnterWorkstation}>Live Pipeline Demo</span></li>
              <li><span className="footer-interactive-link" onClick={onOpenLogin}>Team Sign In</span></li>
            </ul>
          </div>

          {/* Column 3: Help & Legal */}
          <div className="footer-col">
            <h4 className="footer-col-title">Help & Legal</h4>
            <ul className="footer-links-list">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms & Conditions</a></li>
              <li><a href="#refund">Refund & Cancellation</a></li>
              <li><a href="#security">Multi-Tenant Security</a></li>
              <li><a href="#sla">99.9% Uptime SLA</a></li>
              <li><a href="#compliance">Meta Cloud Compliance</a></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="footer-col footer-col-contact">
            <h4 className="footer-col-title">Contact Info</h4>
            <div className="footer-company-legal">Briz AI Studio (Briz Patel)</div>

            <div className="footer-contact-item">
              <MapPin size={16} className="contact-icon" />
              <span><strong>Address:</strong> Near SG Highway, Ahmedabad, Gujarat 380054, India</span>
            </div>

            <div className="footer-contact-item">
              <Mail size={16} className="contact-icon" />
              <span><strong>Email:</strong> <a href="mailto:briz@brizpatel.online">briz@brizpatel.online</a></span>
            </div>

            <div className="footer-contact-item">
              <Phone size={16} className="contact-icon" />
              <span><strong>Phone / WA:</strong> <a href="tel:+919898860145">+91 98988 60145</a></span>
            </div>

            <div className="footer-support-hours">
              Support Hours: Mon – Sat: 9:30 AM – 7:30 PM IST
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="bottom-bar-left">
            Crafted with pride in India &bull; Powering High-Performance Sales Automation
          </div>
          <div className="bottom-bar-badges">
            <span className="security-badge"><Lock size={13} /> SSL 256-Bit Encrypted</span>
            <span>&bull;</span>
            <span className="security-badge"><Database size={13} /> PostgreSQL Protected</span>
            <span>&bull;</span>
            <span className="security-badge"><Shield size={13} /> RLS Tenant Isolated</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
