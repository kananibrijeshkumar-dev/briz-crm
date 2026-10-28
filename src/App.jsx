import React, { useState, useEffect } from "react";
import { 
  Users, Phone, MessageSquare, Plus, Search, Filter, 
  TrendingUp, Award, Clock, MapPin, FileText, ChevronRight, 
  CheckCircle, LayoutGrid, List, Sparkles, Building2, X, ExternalLink,
  LogIn, LogOut, Shield, ShieldCheck, Download, Eye, Send, Settings,
  ArrowUpRight, Check, AlertCircle, RefreshCw, BarChart3, Briefcase,
  DollarSign, UserCheck, ChevronDown, Bell, Copy, Printer
} from "lucide-react";
import confetti from "canvas-confetti";
import { supabase } from "./supabase";
import { INITIAL_LEADS, SALES_REPS, CLIENT_TENANTS, MACHINE_PRESETS } from "./data";
import "./App.css";

export default function App() {
  // Authentication State
  const [user, setUser] = useState({
    name: "Briz Patel",
    email: "briz@brizpatel.online",
    role: "super_admin",
    company: "Jay Shree Ambe Food Machinery",
    repName: "All Representatives (Admin View)"
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // App Navigation
  const [activeTab, setActiveTab] = useState("leads");
  const [activeClient, setActiveClient] = useState("Jay Shree Ambe Food Machinery");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Data State
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [selectedRep, setSelectedRep] = useState("All Representatives (Admin View)");
  const [stageFilter, setStageFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeLeadDrawer, setActiveLeadDrawer] = useState(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notesEdit, setNotesEdit] = useState("");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [showAddRepModal, setShowAddRepModal] = useState(false);
  const [repsList, setRepsList] = useState(SALES_REPS);
  const [newRepForm, setNewRepForm] = useState({
    name: "",
    phone: "",
    email: "",
    role: "sales_rep",
    company: activeClient
  });
  const [quoteLead, setQuoteLead] = useState(null);

  // Quotation Builder State
  const [selectedMachine, setSelectedMachine] = useState(MACHINE_PRESETS[4]);
  const [quoteCustomer, setQuoteCustomer] = useState("");
  const [quotePhone, setQuotePhone] = useState("");
  const [customPrice, setCustomPrice] = useState(MACHINE_PRESETS[4].basePrice);
  const [quoteLanguage, setQuoteLanguage] = useState("gujarati");
  const [copiedNotification, setCopiedNotification] = useState(false);

  // New Lead Form State
  const [newLeadForm, setNewLeadForm] = useState({
    customer_name: "",
    phone: "",
    city: "",
    state: "Gujarat",
    requirement: "10 HP Double Stage Pulverizer with Cyclone",
    deal_value: 125000,
    assigned_rep: "Anilbhai",
    notes: ""
  });

  // Client Onboarding Form State
  const [newClientForm, setNewClientForm] = useState({
    name: "",
    industry: "Manufacturing & Agro",
    city: "",
    ownerName: "",
    whatsapp: "",
    plan: "Enterprise Plan"
  });

  // Supabase sync
  useEffect(() => {
    async function loadSupabaseData() {
      try {
        const { data, error } = await supabase.from("briz_leads").select("*").order("id", { ascending: false });
        if (data && data.length > 0) {
          setLeads(data);
        }
      } catch (err) {
        console.log("Supabase fallback");
      }
    }
    loadSupabaseData();
  }, []);

  // Filter Leads (Strict Client Workspace Separation)
  const filteredLeads = leads.filter(lead => {
    const leadComp = lead.company || "Jay Shree Ambe Food Machinery";
    const matchCompany = leadComp === activeClient;
    const matchRep = (selectedRep === "All Representatives (Admin View)") || (lead.assigned_rep === selectedRep);
    const matchStage = stageFilter === "all" || lead.stage === stageFilter;
    const matchSearch = 
      lead.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      (lead.city && lead.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.requirement && lead.requirement.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCompany && matchRep && matchStage && matchSearch;
  });

  // Financial Metrics
  const totalLeadsCount = leads.length;
  const inPipelineCount = leads.filter(l => l.stage !== "won" && l.stage !== "lost").length;
  const activePipelineValue = leads
    .filter(l => l.stage !== "won" && l.stage !== "lost")
    .reduce((sum, l) => sum + Number(l.deal_value || 0), 0);
  const closedRevenueValue = leads
    .filter(l => l.stage === "won")
    .reduce((sum, l) => sum + Number(l.deal_value || 0), 0);
  const winRate = Math.round((leads.filter(l => l.stage === "won").length / (leads.length || 1)) * 100);

  // Advance Stage
  const advanceStage = async (leadId) => {
    const stageOrder = ["new", "contacted", "quotation", "demo", "won"];
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    const currentIdx = stageOrder.indexOf(lead.stage);
    if (currentIdx < stageOrder.length - 1) {
      const nextStage = stageOrder[currentIdx + 1];
      if (nextStage === "won") {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      }
      const updated = leads.map(l => l.id === leadId ? { ...l, stage: nextStage } : l);
      setLeads(updated);
      if (activeLeadDrawer && activeLeadDrawer.id === leadId) {
        setActiveLeadDrawer({ ...activeLeadDrawer, stage: nextStage });
      }
      try {
        await supabase.from("briz_leads").update({ stage: nextStage }).eq("id", leadId);
      } catch (e) {}
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["ID", "Customer Name", "Phone", "City", "State", "Requirement", "Deal Value", "Stage", "Assigned Rep", "Created At"];
    const rows = filteredLeads.map(l => [
      l.id,
      `"${l.customer_name}"`,
      `"${l.phone}"`,
      `"${l.city || ""}"`,
      `"${l.state || ""}"`,
      `"${l.requirement || ""}"`,
      l.deal_value || 0,
      l.stage,
      `"${l.assigned_rep}"`,
      `"${l.created_at || ""}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BrizCRM_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add Lead Handler
  const handleAddLead = async (e) => {
    e.preventDefault();
    if (!newLeadForm.customer_name || !newLeadForm.phone) return;
    const created = {
      ...newLeadForm,
      id: Date.now(),
      created_at: new Date().toISOString(),
      timeline: [{ time: "Just now", text: "Lead created manually via CRM" }]
    };
    setLeads([created, ...leads]);
    setShowAddModal(false);
    setNewLeadForm({
      customer_name: "",
      phone: "",
      city: "",
      state: "Gujarat",
      requirement: "10 HP Double Stage Pulverizer with Cyclone",
      deal_value: 125000,
      assigned_rep: "Anilbhai",
      notes: ""
    });
    try {
      await supabase.from("briz_leads").insert([created]);
    } catch (e) {}
  };

  // Save Note in Drawer
  const handleSaveNote = (leadId) => {
    if (!notesEdit.trim()) return;
    const updated = leads.map(l => {
      if (l.id === leadId) {
        const newNotes = l.notes ? `${l.notes}\n[${new Date().toLocaleTimeString()}]: ${notesEdit}` : notesEdit;
        return { ...l, notes: newNotes };
      }
      return l;
    });
    setLeads(updated);
    setActiveLeadDrawer({ ...activeLeadDrawer, notes: activeLeadDrawer.notes ? `${activeLeadDrawer.notes}\n[${new Date().toLocaleTimeString()}]: ${notesEdit}` : notesEdit });
    setNotesEdit("");
  };

  // Quotation Calculations
  const base = Number(customPrice || 0);
  const gst = Math.round(base * 0.18);
  const total = base + gst;

  // Format WhatsApp Quotation Text
  const getQuotationText = () => {
    if (quoteLanguage === "gujarati") {
      return `નમસ્તે શ્રી ${quoteCustomer || "ગ્રાહક"},\n\nજય શ્રી અંબે ફૂડ મશીનરી (અમદાવાદ) તરફથી આપનું ક્વોટેશન:\n\n⚙️ મશીન: ${selectedMachine.name}\n⚡ મોટર: ${selectedMachine.hp}\n💰 બેઝ પ્રાઈઝ: ₹${base.toLocaleString("en-IN")}\n📊 GST (18%): ₹${gst.toLocaleString("en-IN")}\n🔥 કુલ રકમ (GST સહિત): ₹${total.toLocaleString("en-IN")}\n\n✅ હેવી ડ્યુટી MS બોડી\n✅ 1 વર્ષની વૉરંટી અને લાઈવ ડેમો સુવિધા\n\nફેક્ટરી મુલાકાત માટે સંપર્ક: +91 98988 60145\nજય અંબે ફૂડ મશીનરી - અમદાવાદ`;
    }
    return `Namaste Shri ${quoteCustomer || "Customer"},\n\nOfficial Quotation from Jay Shree Ambe Food Machinery (Ahmedabad):\n\n⚙️ Model: ${selectedMachine.name}\n⚡ Motor: ${selectedMachine.hp}\n💰 Base Price: ₹${base.toLocaleString("en-IN")}\n📊 GST (18%): ₹${gst.toLocaleString("en-IN")}\n🔥 Total Net Amount: ₹${total.toLocaleString("en-IN")}\n\n✅ 1 Year Warranty & Live Demonstration\n✅ Immediate Factory Dispatch Available\n\nContact Factory: +91 98988 60145\nWebsite: jayambefoodmachinery.com`;
  };

  const copyQuotation = () => {
    navigator.clipboard.writeText(getQuotationText().replace(/\\n/g, "\n"));
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const openWhatsAppQuotation = () => {
    const phoneClean = (quotePhone || "").replace(/[^0-9]/g, "");
    const target = phoneClean.startsWith("91") ? phoneClean : `91${phoneClean}`;
    const url = `https://wa.me/${target}?text=${encodeURIComponent(getQuotationText().replace(/\\n/g, "\n"))}`;
    window.open(url, "_blank");
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="login-wrapper">
        <div className="login-card fade-in">
          <div className="login-brand">
            <div className="brand-logo-icon">
              <Sparkles size={28} className="text-primary-glow" />
            </div>
            <div>
              <h1 className="brand-title">BrizCRM</h1>
              <p className="brand-subtitle">Enterprise WhatsApp & Sales Intelligence</p>
            </div>
          </div>

          <div className="login-client-tag">
            <Building2 size={16} />
            <span>Workspace: <strong>{activeClient}</strong></span>
          </div>

          <div className="login-box">
            <h2 className="login-heading">Sign In to Workspace</h2>
            <p className="login-desc">Enter your business credentials or pick a test profile below:</p>

            <form onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); }}>
              <div className="form-group">
                <label>Work Email or Mobile</label>
                <input 
                  type="text" 
                  defaultValue={user.email} 
                  placeholder="name@company.com or +91..." 
                  className="login-input"
                  required 
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  defaultValue="••••••••••••" 
                  className="login-input" 
                  required 
                />
              </div>

              <button type="submit" className="login-btn-primary">
                <LogIn size={18} /> Sign In to CRM
              </button>
            </form>

            <div className="demo-accounts-divider">
              <span>OR 1-CLICK QUICK ACCESS FOR CLIENT DEMO</span>
            </div>

            <div className="quick-access-grid">
              <button 
                type="button"
                className="quick-role-btn super-admin"
                onClick={() => {
                  setUser({
                    name: "Briz Patel (Super Admin)",
                    email: "briz@brizpatel.online",
                    role: "super_admin",
                    company: "Briz AI Studio",
                    repName: "All Representatives (Admin View)"
                  });
                  setIsAuthenticated(true);
                }}
              >
                <div className="role-top"><ShieldCheck size={16} /> <strong>Super Admin (Briz AI)</strong></div>
                <div className="role-sub">Full access, multi-client switcher, billing</div>
              </button>

              <button 
                type="button"
                className="quick-role-btn client-owner"
                onClick={() => {
                  setUser({
                    name: "Jay Ambe Owner (Admin)",
                    email: "owner@jayambefoodmachinery.com",
                    role: "client_admin",
                    company: "Jay Shree Ambe Food Machinery",
                    repName: "All Representatives (Admin View)"
                  });
                  setIsAuthenticated(true);
                }}
              >
                <div className="role-top"><Building2 size={16} /> <strong>Client Owner (Jay Ambe)</strong></div>
                <div className="role-sub">Company dashboard, all 9 sales reps, full pipeline</div>
              </button>

              <button 
                type="button"
                className="quick-role-btn sales-rep"
                onClick={() => {
                  setUser({
                    name: "Mukeshbhai",
                    email: "mukesh@jayambefoodmachinery.com",
                    role: "sales_rep",
                    company: "Jay Shree Ambe Food Machinery",
                    repName: "Mukeshbhai"
                  });
                  setSelectedRep("Mukeshbhai");
                  setIsAuthenticated(true);
                }}
              >
                <div className="role-top"><Users size={16} /> <strong>Sales Rep (Mukeshbhai)</strong></div>
                <div className="role-sub">Rep view: assigned leads, quick WhatsApp quotes</div>
              </button>

              <button 
                type="button"
                className="quick-role-btn pitch-demo"
                onClick={() => {
                  setUser({
                    name: "Prospective Buyer (Live Demo)",
                    email: "buyer@newfactory.in",
                    role: "client_admin",
                    company: "Gujarat Spices & Agro",
                    repName: "All Representatives (Admin View)"
                  });
                  setActiveClient("Gujarat Agro Mills & Spices");
                  setIsAuthenticated(true);
                }}
              >
                <div className="role-top"><Sparkles size={16} /> <strong>Interactive Client Demo</strong></div>
                <div className="role-sub">Pitch mode for new clients to test features</div>
              </button>
            </div>
          </div>

          <div className="login-footer">
            <Shield size={14} />
            <span>256-Bit SSL Encrypted | Custom Domain: <strong>crm.brizpatel.online</strong></span>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MAIN CRM APPLICATION SHELL
  // -------------------------------------------------------------
  return (
    <div className="crm-shell">
      {/* SIDEBAR NAVIGATION */}
      <aside className={`crm-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-badge-icon">
              <Sparkles size={20} />
            </div>
            {!sidebarCollapsed && (
              <div>
                <span className="brand-name">BrizCRM</span>
                <span className="brand-tag">BRIZ AI STUDIO</span>
              </div>
            )}
          </div>
        </div>

        {/* Client Workspace Badge */}
        {!sidebarCollapsed && (
          <div className="sidebar-workspace-card">
            <div className="workspace-label">ACTIVE CLIENT WORKSPACE</div>
            <div className="workspace-name">{activeClient}</div>
            <div className="workspace-plan">Enterprise Cloud Plan</div>
          </div>
        )}

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <BarChart3 size={18} />
            {!sidebarCollapsed && <span>Executive Dashboard</span>}
          </button>

          <button 
            className={`nav-item ${activeTab === "leads" ? "active" : ""}`}
            onClick={() => setActiveTab("leads")}
          >
            <List size={18} />
            {!sidebarCollapsed && (
              <span className="flex-row-between">
                <span>Master Leads List</span>
                <span className="count-pill">{leads.length}</span>
              </span>
            )}
          </button>

          <button 
            className={`nav-item ${activeTab === "pipeline" ? "active" : ""}`}
            onClick={() => setActiveTab("pipeline")}
          >
            <LayoutGrid size={18} />
            {!sidebarCollapsed && <span>Kanban Pipeline</span>}
          </button>

          <button 
            className={`nav-item ${activeTab === "quotes" ? "active" : ""}`}
            onClick={() => setActiveTab("quotes")}
          >
            <FileText size={18} />
            {!sidebarCollapsed && <span>Quotation Studio</span>}
          </button>

          <button 
            className={`nav-item ${activeTab === "team" ? "active" : ""}`}
            onClick={() => setActiveTab("team")}
          >
            <Users size={18} />
            {!sidebarCollapsed && <span>Sales Team (9 Reps)</span>}
          </button>

          <button 
            className={`nav-item ${activeTab === "clients" ? "active" : ""}`}
            onClick={() => setActiveTab("clients")}
          >
            <Building2 size={18} />
            {!sidebarCollapsed && (
              <span className="flex-row-between">
                <span>Client Workspaces</span>
                <span className="badge-saas">SaaS</span>
              </span>
            )}
          </button>

          <button 
            className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={18} />
            {!sidebarCollapsed && <span>Integrations & API</span>}
          </button>
        </nav>

        {/* User Card & Logout in Sidebar */}
        <div className="sidebar-footer">
          {!sidebarCollapsed && (
            <div className="user-profile-widget">
              <div className="user-avatar-circle">{user.name.charAt(0)}</div>
              <div className="user-meta">
                <div className="user-name-text">{user.name}</div>
                <div className="user-role-badge">{user.role.replace("_", " ").toUpperCase()}</div>
              </div>
            </div>
          )}
          <button 
            className="logout-button" 
            title="Log Out"
            onClick={() => setIsAuthenticated(false)}
          >
            <LogOut size={16} />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="crm-main-viewport">
        {/* TOPBAR */}
        <header className="crm-topbar">
          <div className="topbar-left">
            <button 
              className="sidebar-toggle-btn" 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title="Toggle Sidebar"
            >
              <List size={20} />
            </button>
            <div className="client-switcher-pill">
              <Building2 size={15} />
              <select 
                value={activeClient} 
                onChange={(e) => setActiveClient(e.target.value)}
                className="client-select-dropdown"
              >
                {CLIENT_TENANTS.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="topbar-center">
            <div className="global-search-container">
              <Search size={16} className="search-icon-muted" />
              <input 
                type="text" 
                placeholder="Search leads by customer, phone, machine, or city..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="global-search-field"
              />
              {searchTerm && (
                <button className="clear-search-btn" onClick={() => setSearchTerm("")}>
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="topbar-right">
            <button 
              className="btn-create-lead" 
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} /> <span>+ New Lead</span>
            </button>

            {/* Notification Bell */}
            <div className="notification-wrapper">
              <button 
                className="bell-btn" 
                onClick={() => setNotificationOpen(!notificationOpen)}
              >
                <Bell size={18} />
                <span className="bell-badge">3</span>
              </button>
              {notificationOpen && (
                <div className="notification-dropdown fade-in">
                  <div className="notif-header">Recent WhatsApp Leads</div>
                  <div className="notif-item">
                    <span className="notif-dot green"></span>
                    <div>
                      <div className="notif-title">Haresh Thakor (+91 9979098370)</div>
                      <div className="notif-sub">Assigned to Anilbhai • Just now</div>
                    </div>
                  </div>
                  <div className="notif-item">
                    <span className="notif-dot blue"></span>
                    <div>
                      <div className="notif-title">Quotation ₹1,45,000 Delivered</div>
                      <div className="notif-sub">Abdul Chitrakoot • Mukeshbhai</div>
                    </div>
                  </div>
                  <div className="notif-item">
                    <span className="notif-dot yellow"></span>
                    <div>
                      <div className="notif-title">Morning Dispatch Completed</div>
                      <div className="notif-sub">All 9 Sales Reps Received Leads</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Role indicator */}
            <div className="current-user-pill">
              <div className="user-dot"></div>
              <span>{user.name.split(" ")[0]} ({user.role === "super_admin" ? "Admin" : "Rep"})</span>
            </div>
          </div>
        </header>

        {/* TAB 1: EXECUTIVE DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="content-container fade-in">
            <div className="view-header">
              <div>
                <h1 className="view-title">Executive Revenue & Sales Dashboard</h1>
                <p className="view-subtitle">Live analytics for {activeClient} across all 9 sales representatives</p>
              </div>
              <div className="view-actions">
                <button className="btn-secondary" onClick={exportToCSV}>
                  <Download size={15} /> Export Report
                </button>
                <button className="btn-primary" onClick={() => setActiveTab("quotes")}>
                  <FileText size={15} /> Generate Quotation
                </button>
              </div>
            </div>

            {/* 4 Big KPI Cards */}
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-icon-wrapper blue">
                  <DollarSign size={22} />
                </div>
                <div>
                  <div className="kpi-label">Active Pipeline Value</div>
                  <div className="kpi-value">₹{(activePipelineValue / 100000).toFixed(2)} Lakhs</div>
                  <div className="kpi-trend positive"><TrendingUp size={14} /> {inPipelineCount} Deals in active discussion</div>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-wrapper emerald">
                  <Award size={22} />
                </div>
                <div>
                  <div className="kpi-label">Closed Revenue (Won)</div>
                  <div className="kpi-value">₹{(closedRevenueValue / 100000).toFixed(2)} Lakhs</div>
                  <div className="kpi-trend positive"><CheckCircle size={14} /> Payments & Advances received</div>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-wrapper purple">
                  <Users size={22} />
                </div>
                <div>
                  <div className="kpi-label">Total Inquiries Tracked</div>
                  <div className="kpi-value">{totalLeadsCount} Leads</div>
                  <div className="kpi-trend neutral"><Clock size={14} /> Live WhatsApp & Website sync</div>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-wrapper amber">
                  <TrendingUp size={22} />
                </div>
                <div>
                  <div className="kpi-label">Sales Conversion Rate</div>
                  <div className="kpi-value">{winRate}%</div>
                  <div className="kpi-trend positive"><Sparkles size={14} /> 88% WhatsApp response speed</div>
                </div>
              </div>
            </div>

            {/* Monthly Target Progress */}
            <div className="target-progress-card">
              <div className="target-header">
                <div>
                  <span className="target-title">October 2026 Sales Target: ₹25,00,000</span>
                  <span className="target-subtitle">Current Pipeline: ₹{((activePipelineValue + closedRevenueValue) / 100000).toFixed(2)} Lakhs (78% of Target)</span>
                </div>
                <span className="target-percent">78%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: "78%" }}></div>
              </div>
            </div>

            {/* Two Column Layout: Pipeline Breakdown & Top Reps */}
            <div className="dashboard-columns-grid">
              <div className="panel-card">
                <h3 className="panel-title">Pipeline Stage Velocity</h3>
                <div className="stage-velocity-list">
                  {[
                    { id: "new", name: "New WhatsApp Inquiries", color: "#3b82f6" },
                    { id: "contacted", name: "Contacted / Exploring", color: "#06b6d4" },
                    { id: "quotation", name: "Quotation Shared", color: "#f59e0b" },
                    { id: "demo", name: "Factory Demo / Visit", color: "#a855f7" },
                    { id: "won", name: "Deal Won / Advance Paid", color: "#10b981" }
                  ].map(s => {
                    const count = leads.filter(l => l.stage === s.id).length;
                    const val = leads.filter(l => l.stage === s.id).reduce((sum, l) => sum + Number(l.deal_value || 0), 0);
                    const pct = Math.round((count / (leads.length || 1)) * 100);
                    return (
                      <div key={s.id} className="stage-velocity-item">
                        <div className="flex-row-between">
                          <span className="stage-name-bullet">
                            <span className="color-dot" style={{ backgroundColor: s.color }}></span>
                            {s.name}
                          </span>
                          <span className="stage-val-text">{count} leads (₹{(val / 1000).toFixed(0)}k)</span>
                        </div>
                        <div className="stage-progress-bg">
                          <div className="stage-progress-fill" style={{ width: `${Math.max(pct, 6)}%`, backgroundColor: s.color }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="panel-card">
                <div className="flex-row-between panel-header-row">
                  <h3 className="panel-title">Sales Representatives Performance</h3>
                  <button className="link-button" onClick={() => setActiveTab("team")}>View All 9 Reps &rarr;</button>
                </div>
                <div className="rep-leaderboard-list">
                  {SALES_REPS.slice(0, 5).map((rep, idx) => (
                    <div key={rep.id} className="rep-leaderboard-item">
                      <div className="rep-rank-num">#{idx + 1}</div>
                      <div className="rep-info-block">
                        <div className="rep-name-bold">{rep.name}</div>
                        <div className="rep-phone-small">{rep.phone}</div>
                      </div>
                      <div className="rep-stats-block">
                        <span className="stat-tag won">{rep.won} Won</span>
                        <span className="stat-tag rev">{rep.revenue}</span>
                        <span className="stat-tag rate">{rep.rate} speed</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MASTER LEADS DATABASE (THE DATA LIST) */}
        {activeTab === "leads" && (
          <div className="content-container fade-in">
            <div className="view-header">
              <div>
                <h1 className="view-title">Master Leads Database (Data List)</h1>
                <p className="view-subtitle">Showing active inquiries for <strong>{activeClient}</strong> ({filteredLeads.length} leads). Switch workspace in the top bar to toggle between Jay Shree Ambe and MNP Holidays.</p>
              </div>
              <div className="view-actions">
                <button className="btn-secondary" onClick={exportToCSV}>
                  <Download size={15} /> Export CSV / Excel
                </button>
                <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                  <Plus size={15} /> + Add Customer Lead
                </button>
              </div>
            </div>

            <div className="table-filter-bar">
              <div className="filter-item">
                <Filter size={15} className="text-muted" />
                <span className="filter-label">Stage:</span>
                <select 
                  value={stageFilter} 
                  onChange={(e) => setStageFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Stages ({leads.length})</option>
                  <option value="new">New Inquiries</option>
                  <option value="contacted">Contacted / Exploring</option>
                  <option value="quotation">Quotation Shared</option>
                  <option value="demo">Factory Demo / Visit</option>
                  <option value="won">Deal Won</option>
                </select>
              </div>

              <div className="filter-item">
                <Users size={15} className="text-muted" />
                <span className="filter-label">Sales Rep:</span>
                <select 
                  value={selectedRep} 
                  onChange={(e) => setSelectedRep(e.target.value)}
                  className="filter-select"
                >
                  <option value="All Representatives (Admin View)">All Sales Desks</option>
                  {SALES_REPS.filter(r => (r.company || "Jay Shree Ambe Food Machinery") === activeClient).map(r => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="results-counter">
                Showing <strong>{filteredLeads.length}</strong> of <strong>{leads.length}</strong> inquiries
              </div>
            </div>

            <div className="table-responsive-card">
              <table className="crm-data-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Phone / WhatsApp</th>
                    <th>Location</th>
                    <th>{activeClient === "MNP Holidays" ? "Tour Package / Destination" : "Machine Requirement"}</th>
                    <th>Deal Value</th>
                    <th>Current Stage</th>
                    <th>Assigned Rep</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="data-row">
                      <td className="lead-name-cell" onClick={() => { setActiveLeadDrawer(lead); setNotesEdit(""); }}>
                        <div className="customer-avatar">{lead.customer_name.charAt(0)}</div>
                        <div>
                          <div className="customer-name-text">{lead.customer_name}</div>
                          <div className="lead-created-date">{lead.created_at ? lead.created_at.slice(0, 10) : "Today"}</div>
                        </div>
                      </td>

                      <td>
                        <a 
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="phone-link-pill"
                        >
                          <MessageSquare size={13} className="text-emerald" />
                          <span>{lead.phone}</span>
                        </a>
                      </td>

                      <td>
                        <div className="location-cell">
                          <MapPin size={13} className="text-muted" />
                          <span>{lead.city || "Not specified"}, {lead.state || "Gujarat"}</span>
                        </div>
                      </td>

                      <td className="requirement-cell">
                        <span className="requirement-badge">{lead.requirement}</span>
                      </td>

                      <td className="value-cell">
                        ₹{Number(lead.deal_value || 0).toLocaleString("en-IN")}
                      </td>

                      <td>
                        <span className={`stage-pill ${lead.stage}`}>
                          {lead.stage === "new" && "📥 New Inquiry"}
                          {lead.stage === "contacted" && "💬 Contacted"}
                          {lead.stage === "quotation" && "📄 Quote Shared"}
                          {lead.stage === "demo" && "🏭 Factory Demo"}
                          {lead.stage === "won" && "🏆 Deal Won"}
                        </span>
                      </td>

                      <td>
                        <span className="rep-badge-pill">
                          <span className="rep-mini-dot"></span>
                          {lead.assigned_rep}
                        </span>
                      </td>

                      <td>
                        <div className="actions-cluster">
                          <button 
                            className="icon-action-btn view" 
                            title="View Full Profile & Notes"
                            onClick={() => { setActiveLeadDrawer(lead); setNotesEdit(""); }}
                          >
                            <Eye size={15} />
                          </button>

                          <button 
                            className="icon-action-btn quote" 
                            title="Generate 1-Click WhatsApp Quotation"
                            onClick={() => {
                              setQuoteLead(lead);
                              setQuoteCustomer(lead.customer_name);
                              setQuotePhone(lead.phone);
                              setShowQuoteModal(true);
                            }}
                          >
                            <FileText size={15} />
                          </button>

                          {lead.stage !== "won" && (
                            <button 
                              className="icon-action-btn advance" 
                              title="Advance to Next Stage"
                              onClick={() => advanceStage(lead.id)}
                            >
                              <ChevronRight size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: VISUAL PIPELINE (KANBAN BOARD) */}
        {activeTab === "pipeline" && (
          <div className="content-container fade-in">
            <div className="view-header">
              <div>
                <h1 className="view-title">Visual Sales Pipeline (Kanban)</h1>
                <p className="view-subtitle">Interactive stage progression with 1-click stage advance and victory confetti</p>
              </div>
              <div className="view-actions">
                <button className="btn-secondary" onClick={() => setActiveTab("leads")}>
                  <List size={15} /> Switch to Data List
                </button>
                <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                  <Plus size={15} /> + New Lead
                </button>
              </div>
            </div>

            <div className="kanban-board-grid">
              {[
                { id: "new", title: "New Inquiries", icon: "📥", color: "blue" },
                { id: "contacted", title: "Contacted / Exploring", icon: "💬", color: "cyan" },
                { id: "quotation", title: "Quotation Shared", icon: "📄", color: "amber" },
                { id: "demo", title: "Factory Demo / Visit", icon: "🏭", color: "purple" },
                { id: "won", title: "Deal Won / Advance Paid", icon: "🏆", color: "emerald" }
              ].map(col => {
                const colLeads = filteredLeads.filter(l => l.stage === col.id);
                const colSum = colLeads.reduce((s, l) => s + Number(l.deal_value || 0), 0);
                return (
                  <div key={col.id} className="kanban-column">
                    <div className={`column-header ${col.color}`}>
                      <div className="column-title-row">
                        <span className="col-icon">{col.icon}</span>
                        <span className="col-name">{col.title}</span>
                        <span className="col-count">{colLeads.length}</span>
                      </div>
                      <div className="col-sum">₹{(colSum / 1000).toFixed(0)}k pipeline</div>
                    </div>

                    <div className="kanban-cards-stack">
                      {colLeads.map(lead => (
                        <div key={lead.id} className="lead-card-item">
                          <div className="card-top-row">
                            <span className="card-customer-name" onClick={() => { setActiveLeadDrawer(lead); setNotesEdit(""); }}>
                              {lead.customer_name}
                            </span>
                            <span className="card-rep-badge">{lead.assigned_rep}</span>
                          </div>

                          <div className="card-location">
                            <MapPin size={12} />
                            <span>{lead.city || "Not specified"}, {lead.state}</span>
                          </div>

                          <div className="card-machine-pill">{lead.requirement}</div>

                          <div className="card-footer-row">
                            <div className="card-price-tag">
                              ₹{Number(lead.deal_value || 0).toLocaleString("en-IN")}
                            </div>
                            <div className="card-action-btns">
                              <a 
                                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="card-btn-wa"
                                title="Chat on WhatsApp"
                              >
                                <MessageSquare size={13} />
                              </a>
                              <button 
                                className="card-btn-quote"
                                title="Quotation"
                                onClick={() => {
                                  setQuoteLead(lead);
                                  setQuoteCustomer(lead.customer_name);
                                  setQuotePhone(lead.phone);
                                  setShowQuoteModal(true);
                                }}
                              >
                                <FileText size={13} />
                              </button>
                              {col.id !== "won" ? (
                                <button 
                                  className="card-btn-next"
                                  onClick={() => advanceStage(lead.id)}
                                >
                                  Next &rarr;
                                </button>
                              ) : (
                                <span className="won-badge"><Check size={12} /> Won</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: QUOTATION STUDIO */}
        {activeTab === "quotes" && (
          <div className="content-container fade-in">
            <div className="view-header">
              <div>
                <h1 className="view-title">Quotation & Deal Studio</h1>
                <p className="view-subtitle">Generate official GST quotations and send directly to customer WhatsApp in 1 click</p>
              </div>
            </div>

            <div className="quote-studio-grid">
              <div className="panel-card">
                <h3 className="panel-title">Quotation Generator</h3>

                <div className="form-group">
                  <label>Customer Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Ramesh Patel" 
                    value={quoteCustomer} 
                    onChange={(e) => setQuoteCustomer(e.target.value)}
                    className="crm-input"
                  />
                </div>

                <div className="form-group">
                  <label>Customer WhatsApp Mobile</label>
                  <input 
                    type="text" 
                    placeholder="e.g. +91 98988 60145" 
                    value={quotePhone} 
                    onChange={(e) => setQuotePhone(e.target.value)}
                    className="crm-input"
                  />
                </div>

                <div className="form-group">
                  <label>Select Machine Model</label>
                  <select 
                    value={selectedMachine.name}
                    onChange={(e) => {
                      const m = MACHINE_PRESETS.find(p => p.name === e.target.value);
                      if (m) {
                        setSelectedMachine(m);
                        setCustomPrice(m.basePrice);
                      }
                    }}
                    className="crm-select"
                  >
                    {MACHINE_PRESETS.map((m, idx) => (
                      <option key={idx} value={m.name}>{m.name} ({m.hp})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Base Machine Price (₹)</label>
                  <input 
                    type="number" 
                    value={customPrice} 
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="crm-input"
                  />
                </div>

                <div className="form-group">
                  <label>Quotation Message Language</label>
                  <div className="radio-group-row">
                    <button 
                      type="button" 
                      className={`lang-chip ${quoteLanguage === "gujarati" ? "active" : ""}`}
                      onClick={() => setQuoteLanguage("gujarati")}
                    >
                      ગુજરાતી (Gujarati)
                    </button>
                    <button 
                      type="button" 
                      className={`lang-chip ${quoteLanguage === "english" ? "active" : ""}`}
                      onClick={() => setQuoteLanguage("english")}
                    >
                      English / Hinglish
                    </button>
                  </div>
                </div>

                <div className="quote-math-box">
                  <div className="flex-row-between">
                    <span>Base Amount:</span>
                    <span>₹{base.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex-row-between">
                    <span>GST @ 18% (CGST 9% + SGST 9%):</span>
                    <span>₹{gst.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex-row-between total-row">
                    <strong>Net Payable Amount:</strong>
                    <strong className="text-emerald">₹{total.toLocaleString("en-IN")}</strong>
                  </div>
                </div>
              </div>

              <div className="panel-card wa-preview-card">
                <div className="wa-header-row">
                  <MessageSquare size={18} className="text-emerald" />
                  <span className="wa-header-title">Live WhatsApp Message Preview</span>
                </div>

                <div className="wa-bubble-preview">
                  <pre className="wa-message-text">{getQuotationText().replace(/\\n/g, "\n")}</pre>
                </div>

                <div className="wa-actions-row">
                  <button className="btn-secondary" onClick={copyQuotation}>
                    <Copy size={15} /> {copiedNotification ? "Copied to Clipboard!" : "Copy Text"}
                  </button>
                  <button className="btn-emerald" onClick={openWhatsAppQuotation}>
                    <Send size={15} /> Send via WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SALES TEAM MANAGEMENT (ADMIN & REPS) */}
        {activeTab === "team" && (
          <div className="content-container fade-in">
            <div className="view-header">
              <div>
                <h1 className="view-title">Sales Team & Access Management</h1>
                <p className="view-subtitle">Manage login IDs, assign leads, and monitor performance for {activeClient}</p>
              </div>
              <div className="view-actions">
                <button className="btn-primary" onClick={() => {
                  setNewRepForm({ ...newRepForm, company: activeClient });
                  setShowAddRepModal(true);
                }}>
                  <Plus size={15} /> + Add Sales Representative
                </button>
              </div>
            </div>

            <div className="team-cards-grid">
              {repsList.filter(r => (r.company || "Jay Shree Ambe Food Machinery") === activeClient).map((rep) => (
                <div key={rep.id} className="team-rep-card">
                  <div className="rep-card-top">
                    <div className="rep-big-avatar">{rep.name.charAt(0)}</div>
                    <div>
                      <h3 className="rep-card-name">{rep.name}</h3>
                      <div className="rep-card-phone">{rep.phone}</div>
                    </div>
                  </div>

                  <div className="rep-metrics-row">
                    <div className="rep-metric-box">
                      <div className="m-val">{rep.leads}</div>
                      <div className="m-lbl">Active Leads</div>
                    </div>
                    <div className="rep-metric-box">
                      <div className="m-val text-emerald">{rep.won}</div>
                      <div className="m-lbl">Deals Won</div>
                    </div>
                    <div className="rep-metric-box">
                      <div className="m-val">{rep.revenue}</div>
                      <div className="m-lbl">Sales Value</div>
                    </div>
                  </div>

                  <div className="rep-card-footer">
                    <div className="rep-access-credentials">
                      <span className="cred-lbl">Login ID:</span>
                      <strong className="cred-val">{rep.phone}</strong>
                      <span className="badge-active-rep">Active Account</span>
                    </div>
                    <span className="speed-tag">⚡ Response Rate: {rep.rate}</span>
                    <div className="rep-footer-buttons">
                      <a 
                        href={`https://wa.me/${rep.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("નમસ્તે " + rep.name + ", BrizCRM માં આપનું એકાઉન્ટ એક્ટિવ છે. Login: https://crm.brizpatel.online/login (Mobile: " + rep.phone + ")")}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn-invite-wa"
                        title="Send login link to sales rep on WhatsApp"
                      >
                        <Send size={13} /> Send Login Details
                      </a>
                      <a 
                        href={`https://wa.me/${rep.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("નમસ્તે " + rep.name + ", BrizCRM તરફથી આપના આજના નવા લીડ્સ ચેક કરો.")}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="dispatch-wa-btn"
                      >
                        <MessageSquare size={13} /> Leads
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: CLIENT WORKSPACES (SAAS MULTI-TENANCY FOR SELLING TO CLIENTS) */}
        {activeTab === "clients" && (
          <div className="content-container fade-in">
            <div className="view-header">
              <div>
                <h1 className="view-title">Client Workspaces & SaaS Onboarding</h1>
                <p className="view-subtitle">How Briz AI Studio onboards and manages multiple manufacturing clients with dedicated portals</p>
              </div>
              <div className="view-actions">
                <button className="btn-primary" onClick={() => setShowOnboardModal(true)}>
                  <Plus size={15} /> + Onboard New Client
                </button>
              </div>
            </div>

            <div className="clients-showcase-grid">
              {CLIENT_TENANTS.map((c) => (
                <div key={c.id} className="client-tenant-card">
                  <div className="client-tenant-header">
                    <div className="client-icon-box">{c.logo}</div>
                    <div>
                      <h3 className="client-card-title">{c.name}</h3>
                      <p className="client-card-city">{c.city}</p>
                    </div>
                  </div>

                  <div className="client-industry-badge">{c.industry}</div>

                  <div className="client-stats-row">
                    <div className="client-stat">
                      <div className="cs-val">{c.repsCount} Reps</div>
                      <div className="cs-lbl">Sales Team</div>
                    </div>
                    <div className="client-stat">
                      <div className="cs-val">{c.pipelineValue}</div>
                      <div className="cs-lbl">Active Pipeline</div>
                    </div>
                    <div className="client-stat">
                      <div className="cs-val text-emerald">Active</div>
                      <div className="cs-lbl">{c.status}</div>
                    </div>
                  </div>

                  <div className="client-card-actions">
                    <button 
                      className="btn-switch-client"
                      onClick={() => {
                        setActiveClient(c.name);
                        setActiveTab("dashboard");
                      }}
                    >
                      <Building2 size={15} /> Open Workspace
                    </button>
                    <button 
                      className="btn-share-link"
                      onClick={() => {
                        navigator.clipboard.writeText(`https://crm.brizpatel.online/login?client=${c.id}`);
                        alert(`Client invite link copied: https://crm.brizpatel.online/login?client=${c.id}`);
                      }}
                    >
                      <Copy size={15} /> Share Invite Link
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: SETTINGS & INTEGRATIONS */}
        {activeTab === "settings" && (
          <div className="content-container fade-in">
            <div className="view-header">
              <div>
                <h1 className="view-title">System Settings & Cloud Integrations</h1>
                <p className="view-subtitle">Production endpoints connected to BrizCRM for WhatsApp and Supabase</p>
              </div>
            </div>

            <div className="settings-grid">
              <div className="panel-card">
                <h3 className="panel-title">WhatsApp Cloud API (Meta)</h3>
                <div className="status-indicator-box">
                  <span className="pulse-dot green"></span>
                  <div>
                    <div className="status-main">WhatsApp Business Bot Connected</div>
                    <div className="status-sub">Phone: +91 72018 90711 (ID: 1260228570511181)</div>
                  </div>
                </div>
                <div className="setting-detail-row">
                  <span>Daily Missed Leads Dispatch:</span>
                  <strong>Automated at 09:30 AM IST (GitHub Actions)</strong>
                </div>
              </div>

              <div className="panel-card">
                <h3 className="panel-title">Supabase Database Sync</h3>
                <div className="status-indicator-box">
                  <span className="pulse-dot green"></span>
                  <div>
                    <div className="status-main">Supabase Cloud Connected</div>
                    <div className="status-sub">Project: rhbxrjqwascgjjrzpbiw (briz-aiweb-studio)</div>
                  </div>
                </div>
                <div className="setting-detail-row">
                  <span>Active Custom Domain:</span>
                  <strong className="text-emerald">crm.brizpatel.online (SSL Active)</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* LEAD DETAIL SLIDE-OUT DRAWER */}
      {activeLeadDrawer && (
        <div className="drawer-overlay" onClick={() => setActiveLeadDrawer(null)}>
          <div className="drawer-panel fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-title-row">
                <div className="customer-avatar big">{activeLeadDrawer.customer_name.charAt(0)}</div>
                <div>
                  <h2 className="drawer-name">{activeLeadDrawer.customer_name}</h2>
                  <div className="drawer-phone">{activeLeadDrawer.phone}</div>
                </div>
              </div>
              <button className="drawer-close-btn" onClick={() => setActiveLeadDrawer(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="drawer-body">
              <div className="drawer-stage-box">
                <label>Current Sales Stage:</label>
                <div className="drawer-stage-selector">
                  {["new", "contacted", "quotation", "demo", "won"].map(s => (
                    <button 
                      key={s}
                      className={`stage-btn ${activeLeadDrawer.stage === s ? "active" : ""}`}
                      onClick={() => {
                        const updated = leads.map(l => l.id === activeLeadDrawer.id ? { ...l, stage: s } : l);
                        setLeads(updated);
                        setActiveLeadDrawer({ ...activeLeadDrawer, stage: s });
                        if (s === "won") confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
                      }}
                    >
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="drawer-contact-actions">
                <a 
                  href={`tel:${activeLeadDrawer.phone}`} 
                  className="drawer-action-btn call"
                >
                  <Phone size={16} /> Direct Call
                </a>
                <a 
                  href={`https://wa.me/${activeLeadDrawer.phone.replace(/[^0-9]/g, "")}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="drawer-action-btn wa"
                >
                  <MessageSquare size={16} /> WhatsApp Chat
                </a>
                <button 
                  className="drawer-action-btn quote"
                  onClick={() => {
                    setQuoteCustomer(activeLeadDrawer.customer_name);
                    setQuotePhone(activeLeadDrawer.phone);
                    setShowQuoteModal(true);
                  }}
                >
                  <FileText size={16} /> WhatsApp Quotation
                </button>
              </div>

              <div className="drawer-section">
                <h4 className="section-title">Inquiry Specifications</h4>
                <div className="spec-row">
                  <span className="spec-label">Machine Requirement:</span>
                  <span className="spec-value">{activeLeadDrawer.requirement}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Deal Value:</span>
                  <span className="spec-value text-emerald">₹{Number(activeLeadDrawer.deal_value || 0).toLocaleString("en-IN")}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Assigned Representative:</span>
                  <span className="spec-value">{activeLeadDrawer.assigned_rep}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Customer Location:</span>
                  <span className="spec-value">{activeLeadDrawer.city || "Not specified"}, {activeLeadDrawer.state}</span>
                </div>
              </div>

              <div className="drawer-section">
                <h4 className="section-title">Sales Notes & Follow-Up Log</h4>
                <div className="notes-box-display">
                  {activeLeadDrawer.notes || "No notes entered yet."}
                </div>
                <div className="add-note-box">
                  <textarea 
                    placeholder="Type new follow-up update..." 
                    value={notesEdit}
                    onChange={(e) => setNotesEdit(e.target.value)}
                    className="crm-textarea"
                    rows={2}
                  />
                  <button 
                    className="btn-primary-sm" 
                    onClick={() => handleSaveNote(activeLeadDrawer.id)}
                  >
                    Save Note
                  </button>
                </div>
              </div>

              <div className="drawer-section">
                <h4 className="section-title">Inquiry Timeline</h4>
                <div className="timeline-stack">
                  {(activeLeadDrawer.timeline || [
                    { time: "Yesterday", text: "Inquiry captured from WhatsApp conversation" }
                  ]).map((t, idx) => (
                    <div key={idx} className="timeline-event">
                      <div className="timeline-bullet"></div>
                      <div className="timeline-info">
                        <div className="time-lbl">{t.time}</div>
                        <div className="time-txt">{t.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW CUSTOMER LEAD */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-dialog fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add New Customer Lead</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddLead} className="modal-form">
              <div className="form-group">
                <label>Customer Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Narendra Bhai"
                  value={newLeadForm.customer_name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, customer_name: e.target.value })}
                  required
                  className="crm-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>WhatsApp Phone Number *</label>
                  <input 
                    type="text" 
                    placeholder="+91..."
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    required
                    className="crm-input"
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Surat"
                    value={newLeadForm.city}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, city: e.target.value })}
                    className="crm-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Machine Requirement</label>
                <select 
                  value={newLeadForm.requirement}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, requirement: e.target.value })}
                  className="crm-select"
                >
                  {MACHINE_PRESETS.map((m, i) => (
                    <option key={i} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Deal Value (₹)</label>
                  <input 
                    type="number" 
                    value={newLeadForm.deal_value}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, deal_value: Number(e.target.value) })}
                    className="crm-input"
                  />
                </div>
                <div className="form-group">
                  <label>Assign Sales Representative</label>
                  <select 
                    value={newLeadForm.assigned_rep}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, assigned_rep: e.target.value })}
                    className="crm-select"
                  >
                    {SALES_REPS.map(r => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Initial Notes</label>
                <textarea 
                  placeholder="Notes from initial call..."
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  className="crm-textarea"
                  rows={2}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: 1-CLICK WHATSAPP QUOTATION MODAL */}
      {showQuoteModal && (
        <div className="modal-backdrop" onClick={() => setShowQuoteModal(false)}>
          <div className="modal-dialog quote-modal fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">1-Click WhatsApp Quotation for {quoteCustomer}</h3>
              <button className="modal-close" onClick={() => setShowQuoteModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Select Machine Specification</label>
                <select 
                  value={selectedMachine.name}
                  onChange={(e) => {
                    const m = MACHINE_PRESETS.find(p => p.name === e.target.value);
                    if (m) {
                      setSelectedMachine(m);
                      setCustomPrice(m.basePrice);
                    }
                  }}
                  className="crm-select"
                >
                  {MACHINE_PRESETS.map((m, i) => (
                    <option key={i} value={m.name}>{m.name} - ₹{m.basePrice.toLocaleString("en-IN")}</option>
                  ))}
                </select>
              </div>

              <div className="quote-math-box">
                <div className="flex-row-between">
                  <span>Base Price:</span>
                  <span>₹{base.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex-row-between">
                  <span>GST (18%):</span>
                  <span>₹{gst.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex-row-between total-row">
                  <strong>Total with GST:</strong>
                  <strong className="text-emerald">₹{total.toLocaleString("en-IN")}</strong>
                </div>
              </div>

              <div className="wa-bubble-preview small">
                <pre>{getQuotationText().replace(/\\n/g, "\n")}</pre>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={copyQuotation}>
                <Copy size={15} /> {copiedNotification ? "Copied!" : "Copy Text"}
              </button>
              <button className="btn-emerald" onClick={openWhatsAppQuotation}>
                <Send size={15} /> Open WhatsApp Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE SALES REP ACCOUNT */}
      {showAddRepModal && (
        <div className="modal-backdrop" onClick={() => setShowAddRepModal(false)}>
          <div className="modal-dialog fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create Sales Representative Account</h3>
              <button className="modal-close" onClick={() => setShowAddRepModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newRepForm.name || !newRepForm.phone) return;
              const newRep = {
                id: Date.now(),
                name: newRepForm.name,
                phone: newRepForm.phone,
                company: activeClient,
                leads: 0,
                won: 0,
                revenue: "₹0",
                rate: "100%"
              };
              setRepsList([...repsList, newRep]);
              setShowAddRepModal(false);
              const waInvite = `https://wa.me/${newRepForm.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Welcome to BrizCRM! Your sales account is created for " + activeClient + ". Login: https://crm.brizpatel.online/login with your phone: " + newRepForm.phone)}`;
              window.open(waInvite, "_blank");
            }} className="modal-form">
              <div className="form-group">
                <label>Representative Full Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Nileshbhai Patel"
                  value={newRepForm.name}
                  onChange={(e) => setNewRepForm({ ...newRepForm, name: e.target.value })}
                  required
                  className="crm-input"
                />
              </div>

              <div className="form-group">
                <label>WhatsApp Mobile (Used as Login ID) *</label>
                <input 
                  type="text" 
                  placeholder="+91..."
                  value={newRepForm.phone}
                  onChange={(e) => setNewRepForm({ ...newRepForm, phone: e.target.value })}
                  required
                  className="crm-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Assign to Business Workspace</label>
                  <select 
                    value={activeClient}
                    disabled
                    className="crm-select"
                  >
                    <option value={activeClient}>{activeClient}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Access Role</label>
                  <select 
                    value={newRepForm.role}
                    onChange={(e) => setNewRepForm({ ...newRepForm, role: e.target.value })}
                    className="crm-select"
                  >
                    <option value="sales_rep">Sales Representative</option>
                    <option value="sales_admin">Sales Manager / Admin</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddRepModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Account & Send WhatsApp Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ONBOARD NEW CLIENT WORKSPACE */}
      {showOnboardModal && (
        <div className="modal-backdrop" onClick={() => setShowOnboardModal(false)}>
          <div className="modal-dialog fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Onboard New Business Client (SaaS)</h3>
              <button className="modal-close" onClick={() => setShowOnboardModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              alert(`Client "${newClientForm.name}" onboarded successfully! Shareable invite link: https://crm.brizpatel.online/login?client=${encodeURIComponent(newClientForm.name)}`);
              setShowOnboardModal(false);
            }} className="modal-form">
              <div className="form-group">
                <label>Company Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Mahavir Flour Mills" 
                  value={newClientForm.name}
                  onChange={(e) => setNewClientForm({ ...newClientForm, name: e.target.value })}
                  required
                  className="crm-input"
                />
              </div>

              <div className="form-group">
                <label>Industry</label>
                <input 
                  type="text" 
                  placeholder="e.g. Spice Processing & Packaging" 
                  value={newClientForm.industry}
                  onChange={(e) => setNewClientForm({ ...newClientForm, industry: e.target.value })}
                  className="crm-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Owner / Manager WhatsApp</label>
                  <input 
                    type="text" 
                    placeholder="+91..." 
                    value={newClientForm.whatsapp}
                    onChange={(e) => setNewClientForm({ ...newClientForm, whatsapp: e.target.value })}
                    required
                    className="crm-input"
                  />
                </div>
                <div className="form-group">
                  <label>Plan Tier</label>
                  <select 
                    value={newClientForm.plan}
                    onChange={(e) => setNewClientForm({ ...newClientForm, plan: e.target.value })}
                    className="crm-select"
                  >
                    <option value="Starter (3 Reps)">Starter Plan (3 Reps)</option>
                    <option value="Pro (6 Reps)">Pro Plan (6 Reps)</option>
                    <option value="Enterprise Plan">Enterprise Unlimited</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowOnboardModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Generate Client Workspace</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
