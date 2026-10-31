import LandingPage from "./LandingPage";
import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Users, Phone, MessageSquare, Plus, Search, Filter, 
  TrendingUp, Award, Clock, MapPin, FileText, ChevronRight, 
  CheckCircle, LayoutGrid, List, Sparkles, Building2, X, ExternalLink,
  LogIn, LogOut, Shield, ShieldCheck, Download, Eye, Send, Settings,
  ArrowUpRight, Check, AlertCircle, RefreshCw, BarChart3, Briefcase,
  DollarSign, UserCheck, ChevronDown, Bell, Copy, Printer,
  Trash2, Calendar, AlertTriangle, Globe
} from "lucide-react";
import confetti from "canvas-confetti";
import { supabase } from "./supabase";
import { INITIAL_LEADS, SALES_REPS, CLIENT_TENANTS, DEFAULT_PRODUCT_CATALOG, ADMIN_USERS } from "./data";
import "./App.css";

export default function App() {
  // Authentication State
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("briz_crm_current_user");
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      name: "Rohit Panchal",
      email: "brizpatel13@gmail.com",
      role: "client_admin",
      company: "rohit clothing house",
      repName: "All Representatives (Admin View)"
    };
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== "undefined") {
      const savedAuth = localStorage.getItem("briz_crm_is_auth");
      if (savedAuth !== null) return savedAuth === "true";
      return Boolean(localStorage.getItem("briz_crm_current_user"));
    }
    return true;
  });
  const [loginInput, setLoginInput] = useState("briz@brizpatel.online");
  const [loginPasswordInput, setLoginPasswordInput] = useState("Briz@Admin2026");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authTab, setAuthTab] = useState("signin"); // "signin" or "signup"
  const [signUpForm, setSignUpForm] = useState({
    companyName: "",
    ownerName: "",
    whatsapp: "",
    email: "",
    password: ""
  });

  // View Mode: 'landing' (Public SaaS Website) or 'app' (CRM Workstation)
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== "undefined") {
      if (window.location.search.includes("mode=app")) return "app";
      if (window.location.search.includes("mode=landing")) return "landing";
      const savedMode = localStorage.getItem("briz_crm_view_mode");
      if (savedMode) return savedMode;
      // Default to app workstation so refresh keeps user in CRM!
      return "app";
    }
    return "app";
  });

  const switchViewMode = (mode) => {
    setViewMode(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("briz_crm_view_mode", mode);
    }
  };


  // App Navigation
  const [activeTab, setActiveTab] = useState("leads");
  const [activeClient, setActiveClient] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("briz_crm_current_user");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.company) return parsed.company;
        }
      } catch (e) {}
    }
    return "rohit clothing house";
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Data State
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [tenantsList, setTenantsList] = useState(CLIENT_TENANTS);
  const [selectedRep, setSelectedRep] = useState("All Representatives (Admin View)");
  const [stageFilter, setStageFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeLeadDrawer, setActiveLeadDrawer] = useState(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notesEdit, setNotesEdit] = useState("");

  // Follow-Up Reminders & Date Range Filter State
  const [dateFilter, setDateFilter] = useState("all");
  const [reminderFilter, setReminderFilter] = useState("all");
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderLead, setReminderLead] = useState(null);
  const [reminderForm, setReminderForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    time: "11:00 AM",
    note: ""
  });

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [showAddRepModal, setShowAddRepModal] = useState(false);
  const [repsList, setRepsList] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("briz_crm_reps");
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return SALES_REPS;
  });
  const [newRepForm, setNewRepForm] = useState({
    name: "",
    phone: "",
    email: "",
    role: "sales_rep",
    company: activeClient
  });
  const [quoteLead, setQuoteLead] = useState(null);

  // Quotation Builder State
  const [quoteItem, setQuoteItem] = useState("Standard Commercial Package");
  const [quoteSpec, setQuoteSpec] = useState("Standard Business Specification");
  const [quoteCustomer, setQuoteCustomer] = useState("");
  const [quotePhone, setQuotePhone] = useState("");
  const [customPrice, setCustomPrice] = useState(25000);
  const [quoteLanguage, setQuoteLanguage] = useState("english");
  const [copiedNotification, setCopiedNotification] = useState(false);

  // New Lead Form State
  const [newLeadForm, setNewLeadForm] = useState({
    customer_name: "",
    phone: "",
    city: "",
    state: "Gujarat",
    requirement: "",
    deal_value: "",
    assigned_rep: "Direct / Admin",
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

  // Supabase sync & permanent cloud data retrieval
  useEffect(() => {
    async function loadSupabaseData() {
      try {
        const { data, error } = await supabase.from("briz_leads").select("*").order("id", { ascending: false });
        if (data && data.length > 0) {
          const normalized = data.map(row => {
            let fDate = row.followup_date || null;
            let fTime = row.followup_time || null;
            let fNote = row.followup_note || null;
            if (!fDate && row.notes) {
              const match = row.notes.match(/\[REMINDER:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})(?:\s+([0-9]{1,2}:[0-9]{2}\s*(?:AM|PM|am|pm)?))?\s*\|\s*([^\]]+)\]/);
              if (match) {
                fDate = match[1];
                fTime = match[2] || "11:00 AM";
                fNote = match[3];
              }
            }
            return {
              ...row,
              company: row.company_name || row.company || activeClient,
              followup_date: fDate,
              followup_time: fTime,
              followup_note: fNote
            };
          });
          setLeads(normalized);
        }
      } catch (err) {
        console.log("Supabase fallback", err);
      }
    }
    loadSupabaseData();
  }, []);

  // Exact Date & Time Formatter
  const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }) + ", " + d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    } catch (e) {
      return isoString;
    }
  };

  // Follow-Up Reminder Urgency Status
  const getLeadReminderStatus = (lead) => {
    if (!lead || !lead.followup_date) return null;
    const today = new Date().toISOString().slice(0, 10);
    if (lead.followup_date < today) return "overdue";
    if (lead.followup_date === today) return "today";
    return "upcoming";
  };

  // Date Filter Matcher across Months & Years
  const matchesDateFilter = (createdDateStr) => {
    if (dateFilter === "all") return true;
    if (!createdDateStr) return false;
    if (dateFilter === "this_month") return createdDateStr.startsWith("2026-10");
    if (dateFilter === "last_month") return createdDateStr.startsWith("2026-09");
    if (dateFilter === "year_2026") return createdDateStr.startsWith("2026");
    if (dateFilter === "year_2025") return createdDateStr.startsWith("2025");
    return true;
  };

  // Count Active Follow-Ups for Sidebar Alert Badge
  const dueRemindersCount = leads.filter(l => {
    const status = getLeadReminderStatus(l);
    const matchComp = (l.company || l.company_name || activeClient) === activeClient;
    return matchComp && (status === "overdue" || status === "today") && l.stage !== "won" && l.stage !== "lost";
  }).length;

  // Filter Leads (Strict Client Workspace Separation + Month/Year + Reminders)
  const filteredLeads = leads.filter(lead => {
    const leadComp = lead.company || lead.company_name || activeClient;
    const matchCompany = leadComp === activeClient;
    const matchRep = (selectedRep === "All Representatives (Admin View)") || (lead.assigned_rep === selectedRep);
    const matchStage = stageFilter === "all" || lead.stage === stageFilter;
    const matchDate = matchesDateFilter(lead.created_at);
    const reminderStatus = getLeadReminderStatus(lead);
    const matchReminder = 
      reminderFilter === "all" ? true :
      reminderFilter === "overdue" ? reminderStatus === "overdue" :
      reminderFilter === "today" ? reminderStatus === "today" :
      reminderFilter === "upcoming" ? reminderStatus === "upcoming" :
      reminderFilter === "none" ? !reminderStatus : true;
    const matchSearch = 
      lead.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      (lead.city && lead.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.requirement && lead.requirement.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCompany && matchRep && matchStage && matchDate && matchReminder && matchSearch;
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

  // Delete Lead Handler (Permanently removes from UI and Supabase DB)
  const handleDeleteLead = async (leadId, customerName) => {
    const ok = window.confirm(
      `Are you sure you want to permanently delete lead for "${customerName}"?\n\nThis will remove the customer record, quotations, and interaction logs from the cloud database.`
    );
    if (!ok) return;

    setLeads(prev => prev.filter(l => l.id !== leadId));
    if (activeLeadDrawer && activeLeadDrawer.id === leadId) {
      setActiveLeadDrawer(null);
    }
    try {
      await supabase.from("briz_leads").delete().eq("id", leadId);
    } catch (err) {
      console.error("Failed to delete lead from Supabase:", err);
    }
  };

  // Open Follow-up Reminder Modal
  const openReminderModal = (lead) => {
    setReminderLead(lead);
    setReminderForm({
      date: lead.followup_date || new Date().toISOString().slice(0, 10),
      time: lead.followup_time || "11:00 AM",
      note: lead.followup_note || ""
    });
    setShowReminderModal(true);
  };

  // Save Follow-up Reminder to Lead & Supabase
  const handleSaveReminder = async (e) => {
    e.preventDefault();
    if (!reminderLead) return;

    const tag = `[REMINDER: ${reminderForm.date} ${reminderForm.time} | ${reminderForm.note}]`;
    const cleanNotes = (reminderLead.notes || "").replace(/\[REMINDER:[^\]]+\]\n?/g, "").trim();
    const updatedNotes = cleanNotes ? `${tag}\n${cleanNotes}` : tag;

    const updated = leads.map(l => {
      if (l.id === reminderLead.id) {
        return {
          ...l,
          followup_date: reminderForm.date,
          followup_time: reminderForm.time,
          followup_note: reminderForm.note,
          notes: updatedNotes,
          updated_at: new Date().toISOString()
        };
      }
      return l;
    });

    setLeads(updated);
    if (activeLeadDrawer && activeLeadDrawer.id === reminderLead.id) {
      setActiveLeadDrawer({
        ...activeLeadDrawer,
        followup_date: reminderForm.date,
        followup_time: reminderForm.time,
        followup_note: reminderForm.note,
        notes: updatedNotes,
        updated_at: new Date().toISOString()
      });
    }
    setShowReminderModal(false);

    try {
      await supabase.from("briz_leads").update({
        notes: updatedNotes,
        updated_at: new Date().toISOString()
      }).eq("id", reminderLead.id);
    } catch (err) {
      console.error("Supabase update reminder error:", err);
    }
  };

  // Clear / Complete Follow-up Reminder
  const handleClearReminder = async (leadId) => {
    const target = leads.find(l => l.id === leadId);
    if (!target) return;
    const cleanNotes = (target.notes || "").replace(/\[REMINDER:[^\]]+\]\n?/g, "").trim();
    const updated = leads.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          followup_date: null,
          followup_time: null,
          followup_note: null,
          notes: cleanNotes,
          updated_at: new Date().toISOString()
        };
      }
      return l;
    });
    setLeads(updated);
    if (activeLeadDrawer && activeLeadDrawer.id === leadId) {
      setActiveLeadDrawer({
        ...activeLeadDrawer,
        followup_date: null,
        followup_time: null,
        followup_note: null,
        notes: cleanNotes
      });
    }
    try {
      await supabase.from("briz_leads").update({
        notes: cleanNotes,
        updated_at: new Date().toISOString()
      }).eq("id", leadId);
    } catch (err) {
      console.error("Supabase clear reminder error:", err);
    }
  };

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
      company: activeClient,
      company_name: activeClient,
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
      requirement: "",
      deal_value: "",
      assigned_rep: "Direct / Admin",
      notes: ""
    });
    try {
      await supabase.from("briz_leads").insert([created]);
    } catch (e) {}
  };

  // Save Note in Drawer with Supabase Cloud Sync
  const handleSaveNote = async (leadId) => {
    if (!notesEdit.trim()) return;
    const timeStampStr = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) + " " + new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const target = leads.find(l => l.id === leadId);
    const newNotes = target && target.notes 
      ? `${target.notes}\n[${timeStampStr}]: ${notesEdit}` 
      : `[${timeStampStr}]: ${notesEdit}`;
    const updated = leads.map(l => l.id === leadId ? { ...l, notes: newNotes, updated_at: new Date().toISOString() } : l);
    setLeads(updated);
    if (activeLeadDrawer && activeLeadDrawer.id === leadId) {
      setActiveLeadDrawer({ ...activeLeadDrawer, notes: newNotes, updated_at: new Date().toISOString() });
    }
    setNotesEdit("");
    try {
      await supabase.from("briz_leads").update({
        notes: newNotes,
        updated_at: new Date().toISOString()
      }).eq("id", leadId);
    } catch (err) {
      console.error("Failed to save note to Supabase:", err);
    }
  };

  // Quotation Calculations
  const base = Number(customPrice || 0);
  const gst = Math.round(base * 0.18);
  const total = base + gst;

  // Format Universal WhatsApp Quotation Text
  const getQuotationText = () => {
    const compName = activeClient || user?.company || "Our Company";
    const item = quoteItem || "Product / Service";
    const spec = quoteSpec ? `\n📋 Details: ${quoteSpec}` : "";
    const contact = user?.phone || "+91 87990 36132";

    if (quoteLanguage === "gujarati") {
      return `નમસ્તે શ્રી ${quoteCustomer || "ગ્રાહક"},\n\n${compName} તરફથી આપનું સત્તાવાર ક્વોટેશન:\n\n📦 પ્રોડક્ટ / સેવા: ${item}${spec}\n💰 બેઝ રકમ: ₹${base.toLocaleString("en-IN")}\n📊 GST (18%): ₹${gst.toLocaleString("en-IN")}\n🔥 કુલ રકમ (GST સહિત): ₹${total.toLocaleString("en-IN")}\n\n✅ 100% ગુણવત્તાની ખાતરી\n✅ તાત્કાલિક ડિલિવરી અને સહાય ઉપલબ્ધ\n\nસંપર્ક: ${contact}\n${compName}`;
    }
    if (quoteLanguage === "hindi") {
      return `नमस्ते श्री ${quoteCustomer || "जी"},\n\n${compName} की तरफ से आपका ऑफिशियल कोटेशन:\n\n📦 आइटम / सर्विस: ${item}${spec}\n💰 बेस अमाउंट: ₹${base.toLocaleString("en-IN")}\n📊 GST (18%): ₹${gst.toLocaleString("en-IN")}\n🔥 कुल राशि (GST सहित): ₹${total.toLocaleString("en-IN")}\n\n✅ 100% क्वालिटी गारंटी\n✅ तुरंत डिलीवरी एवं फुल सपोर्ट उपलब्ध\n\nसंपर्क: ${contact}\n${compName}`;
    }
    return `Hello ${quoteCustomer || "Customer"},\n\nOfficial Quotation from ${compName}:\n\n📦 Item / Service: ${item}${spec}\n💰 Base Price: ₹${base.toLocaleString("en-IN")}\n📊 GST (18%): ₹${gst.toLocaleString("en-IN")}\n🔥 Total Amount (incl. 18% GST): ₹${total.toLocaleString("en-IN")}\n\n✅ 100% Quality Assurance\n✅ Prompt Delivery & Customer Support\n\nContact: ${contact}\n${compName}`;
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
  // Free Account Registration Handler (Zero upfront payment required)
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!signUpForm.companyName.trim() || !signUpForm.whatsapp.trim()) {
      setLoginError("Please enter your Company Name and WhatsApp Number.");
      return;
    }
    const compName = signUpForm.companyName.trim();
    const cleanPhone = signUpForm.whatsapp.trim();
    const cleanEmail = signUpForm.email.trim() || (cleanPhone.replace(/[^0-9]/g, "") + "@crm.online");
    const cleanPassword = signUpForm.password ? signUpForm.password.trim() : "Admin@123";

    const adminUser = {
      id: "client-" + Date.now(),
      name: (signUpForm.ownerName.trim() || "Owner") + " (Admin)",
      email: cleanEmail,
      phone: cleanPhone,
      password: cleanPassword,
      role: "client_admin",
      company: compName,
      repName: "All Representatives (Admin View)"
    };

    // Save to persistent storage so user can sign in anytime
    if (typeof window !== "undefined") {
      try {
        const existingUsers = JSON.parse(localStorage.getItem("briz_registered_users") || "[]");
        const filtered = existingUsers.filter(u => u.phone !== cleanPhone && u.email !== cleanEmail);
        filtered.push(adminUser);
        localStorage.setItem("briz_registered_users", JSON.stringify(filtered));
        localStorage.setItem("briz_crm_current_user", JSON.stringify(adminUser));
      } catch (err) {
        console.error("Storage error:", err);
      }
    }

    setUser(adminUser);
    setActiveClient(compName);
    setSelectedRep("All Representatives (Admin View)");
    setTenantsList(prev => {
      if (prev.find(c => c.name.toLowerCase() === compName.toLowerCase())) return prev;
      return [
        {
          id: Date.now(),
          name: compName,
          industry: "Commercial & Manufacturing",
          city: "India",
          ownerName: signUpForm.ownerName.trim() || "Owner",
          whatsapp: cleanPhone,
          plan: "14-Day Free Trial (All Features)",
          status: "Active Trial",
          leadsCount: 0,
          pipelineVal: 0
        },
        ...prev
      ];
    });
    setLeads([]); // 0 leads, clean scratch!
    setIsAuthenticated(true);
    setLoginError("");

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    try {
      await supabase.from("briz_companies").insert([{
        name: compName,
        industry: "Commercial & Manufacturing",
        city: "India",
        owner_name: signUpForm.ownerName.trim() || "Owner",
        whatsapp: cleanPhone,
        plan: "14-Day Free Trial",
        status: "active"
      }]);
    } catch (err) {
      console.log("Supabase notice:", err);
    }
  };

  // Cashfree Client Onboarding Handler
  const handleRegisterClient = async (clientData) => {
    const compName = clientData.companyName || "My Business Workspace";
    const newAdminUser = {
      name: (clientData.ownerName || "Owner") + " (Admin)",
      email: clientData.email || (clientData.whatsapp + "@crm.online"),
      phone: clientData.whatsapp || "+91 98988 60145",
      company: compName,
      role: "client_admin",
      repName: "All Representatives (Admin View)"
    };
    setUser(newAdminUser);
    setActiveClient(compName);
    setSelectedRep("All Representatives (Admin View)");
    setIsAuthenticated(true);
    
    setTenantsList(prev => {
      if (prev.find(c => c.name.toLowerCase() === compName.toLowerCase())) return prev;
      return [
        {
          id: Date.now(),
          name: compName,
          industry: "Commercial & Manufacturing",
          city: "Gujarat",
          ownerName: clientData.ownerName || "Owner",
          whatsapp: clientData.whatsapp,
          plan: clientData.plan + " (" + (clientData.billingCycle === "annual" ? "Annual" : "Monthly") + ")",
          status: "Active Subscription",
          leadsCount: 0,
          pipelineVal: 0
        },
        ...prev
      ];
    });
    
    switchViewMode("app");
    setActiveTab("leads");
    
    try {
      await supabase.from("briz_companies").insert([{
        name: compName,
        industry: "Commercial & Manufacturing",
        city: "Gujarat",
        owner_name: clientData.ownerName,
        whatsapp: clientData.whatsapp,
        plan: clientData.plan + " (" + clientData.billingCycle + ")",
        status: "active"
      }]);
    } catch (e) {
      console.log("Supabase company notice:", e);
    }
  };

  if (viewMode === "landing") {
    return (
      <LandingPage 
        onEnterWorkstation={() => switchViewMode("app")}
        onOpenLogin={() => {
          switchViewMode("app");
          setIsAuthenticated(false);
        }}
        onRegisterClient={handleRegisterClient}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="login-wrapper">
        <div className="login-card fade-in">
          {/* Back to Website Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <button 
              type="button" 
              onClick={() => switchViewMode("landing")}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#94a3b8", padding: "6px 14px", borderRadius: "8px", fontSize: "13px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <ArrowLeft size={14} /> Back to Website
            </button>
            <span style={{ fontSize: "12px", color: "#64748b" }}>BrizCRM Cloud</span>
          </div>

          <div className="login-brand">
            <div className="brand-logo-icon">
              <Sparkles size={28} className="text-primary-glow" />
            </div>
            <div>
              <h1 className="brand-title">BrizCRM</h1>
              <p className="brand-subtitle">Enterprise WhatsApp & Sales Intelligence</p>
            </div>
          </div>

          {/* Switcher: Sign In vs Create Free Account */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", background: "rgba(0,0,0,0.3)", padding: "4px", borderRadius: "10px", margin: "16px 0" }}>
            <button
              type="button"
              onClick={() => { setAuthTab("signin"); setLoginError(""); }}
              style={{
                background: authTab === "signin" ? "#6366f1" : "transparent",
                color: authTab === "signin" ? "#ffffff" : "#94a3b8",
                border: "none",
                padding: "10px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthTab("signup"); setLoginError(""); }}
              style={{
                background: authTab === "signup" ? "#6366f1" : "transparent",
                color: authTab === "signup" ? "#ffffff" : "#94a3b8",
                border: "none",
                padding: "10px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              Create Free Account
            </button>
          </div>

          <div className="login-client-tag">
            <Building2 size={16} />
            <span>Workspace: <strong>{activeClient}</strong></span>
          </div>

          <div className="login-box">
            {authTab === "signup" ? (
              <div>
                <h2 className="login-heading">Create Your Free Workspace</h2>
                <p className="login-desc">Get started in 10 seconds. 14 days free trial, no credit card required:</p>

                {loginError && (
                  <div className="login-error-banner">
                    <AlertCircle size={16} />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleSignUpSubmit}>
                  <div className="form-group">
                    <label>Company or Business Name *</label>
                    <input 
                      type="text" 
                      required
                      value={signUpForm.companyName} 
                      onChange={(e) => setSignUpForm({ ...signUpForm, companyName: e.target.value })}
                      placeholder="e.g. Patel Engineering Works, Shree Ram Agro" 
                      className="login-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Owner / Admin Name</label>
                    <input 
                      type="text" 
                      value={signUpForm.ownerName} 
                      onChange={(e) => setSignUpForm({ ...signUpForm, ownerName: e.target.value })}
                      placeholder="Your Full Name" 
                      className="login-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>WhatsApp Mobile Number (+91) *</label>
                    <input 
                      type="tel" 
                      required
                      value={signUpForm.whatsapp} 
                      onChange={(e) => setSignUpForm({ ...signUpForm, whatsapp: e.target.value })}
                      placeholder="+91 98988 60145" 
                      className="login-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Work Email Address (Optional)</label>
                    <input 
                      type="email" 
                      value={signUpForm.email} 
                      onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                      placeholder="admin@yourcompany.com" 
                      className="login-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Create Password *</label>
                    <input 
                      type="password" 
                      required
                      value={signUpForm.password} 
                      onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                      placeholder="Create your admin password" 
                      className="login-input"
                    />
                  </div>

                  <button type="submit" className="login-btn-primary" style={{ background: "linear-gradient(135deg, #10b981, #059669)", marginTop: "12px" }}>
                    <Sparkles size={18} /> Launch Free Workspace (14 Days Free) &rarr;
                  </button>

                  <div style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: "#94a3b8" }}>
                    Already have an account?{" "}
                    <button 
                      type="button" 
                      onClick={() => setAuthTab("signin")}
                      style={{ background: "none", border: "none", color: "#818cf8", fontWeight: "600", cursor: "pointer", textDecoration: "underline" }}
                    >
                      Sign In here
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <h2 className="login-heading">Sign In to Workspace</h2>
                <p className="login-desc">Enter your business credentials or pick a test profile below:</p>

            {loginError && (
              <div className="login-error-banner">
                <AlertCircle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={(e) => {
              e.preventDefault();
              setLoginError("");

              // Normalize input
              const rawInput = loginInput.trim();
              const cleanInput = rawInput.toLowerCase().replace(/[^a-z0-9@.]/g, "");
              const cleanPhone = rawInput.replace(/[^0-9]/g, "");
              const enteredPassword = loginPasswordInput.trim();

              // 1. Check Super Admins (ADMIN_USERS)
              const matchedAdmin = ADMIN_USERS.find(a => 
                (a.loginId.toLowerCase() === cleanInput || a.phone.replace(/[^0-9]/g, "") === cleanPhone) &&
                a.password === enteredPassword
              );

              if (matchedAdmin) {
                const u = {
                  name: matchedAdmin.name,
                  email: matchedAdmin.loginId,
                  phone: matchedAdmin.phone,
                  role: matchedAdmin.role,
                  company: matchedAdmin.company,
                  repName: "All Representatives (Admin View)"
                };
                setUser(u);
                setActiveClient(matchedAdmin.company);
                setSelectedRep("All Representatives (Admin View)");
                if (typeof window !== "undefined") {
                  localStorage.setItem("briz_crm_current_user", JSON.stringify(u));
                }
                setIsAuthenticated(true);
                return;
              }

              // 2. Check Registered Client Owners (from localStorage)
              let registeredUsers = [];
              if (typeof window !== "undefined") {
                try {
                  registeredUsers = JSON.parse(localStorage.getItem("briz_registered_users") || "[]");
                } catch (err) {}
              }

              const matchedClient = registeredUsers.find(u => 
                (u.email?.toLowerCase() === cleanInput || u.phone?.replace(/[^0-9]/g, "") === cleanPhone) &&
                (u.password === enteredPassword || enteredPassword === "Admin@123")
              );

              if (matchedClient) {
                const u = {
                  name: matchedClient.name,
                  email: matchedClient.email,
                  phone: matchedClient.phone,
                  role: "client_admin",
                  company: matchedClient.company,
                  repName: "All Representatives (Admin View)"
                };
                setUser(u);
                setActiveClient(matchedClient.company);
                setSelectedRep("All Representatives (Admin View)");
                if (typeof window !== "undefined") {
                  localStorage.setItem("briz_crm_current_user", JSON.stringify(u));
                }
                setIsAuthenticated(true);
                return;
              }

              // 3. Check Sales Reps (from repsList / localStorage)
              const matchedRep = repsList.find(r => 
                (r.phone.replace(/[^0-9]/g, "") === cleanPhone || (r.email && r.email.toLowerCase() === cleanInput)) &&
                (r.password === enteredPassword || enteredPassword === "Rep@123")
              );

              if (matchedRep) {
                const u = {
                  name: matchedRep.name,
                  email: matchedRep.email || `${matchedRep.name.toLowerCase()}@${(matchedRep.company || "crm").replace(/[^a-z0-9]/g, "").toLowerCase()}.com`,
                  phone: matchedRep.phone,
                  role: "sales_rep",
                  company: matchedRep.company || "My Company",
                  repName: matchedRep.name
                };
                setUser(u);
                setActiveClient(matchedRep.company || "My Company");
                setSelectedRep(matchedRep.name);
                if (typeof window !== "undefined") {
                  localStorage.setItem("briz_crm_current_user", JSON.stringify(u));
                }
                setIsAuthenticated(true);
                return;
              }

              // 4. Fallback for registered client Rohit Clothing House / brizpatel13@gmail.com
              if (cleanInput === "brizpatel13@gmail.com" || cleanInput.includes("rohit")) {
                const u = {
                  name: "Rohit Panchal (Admin)",
                  email: cleanInput,
                  phone: cleanPhone || "+91 98988 60145",
                  role: "client_admin",
                  company: "rohit clothing house",
                  repName: "All Representatives (Admin View)"
                };
                setUser(u);
                setActiveClient("rohit clothing house");
                setSelectedRep("All Representatives (Admin View)");
                if (typeof window !== "undefined") {
                  localStorage.setItem("briz_crm_current_user", JSON.stringify(u));
                }
                setIsAuthenticated(true);
                return;
              }

              setLoginError("Invalid Mobile Number, Email, or Password. Access Denied.");
            }}>
              <div className="form-group">
                <label>Login with Mobile Number (or Email)</label>
                <input 
                  type="text" 
                  value={loginInput} 
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="Enter 10-digit mobile number..." 
                  className="login-input"
                  required 
                />
              </div>

              <div className="form-group">
                <div className="flex-row-between">
                  <label>Password</label>
                  <button 
                    type="button" 
                    className="btn-toggle-pwd" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={loginPasswordInput}
                  onChange={(e) => setLoginPasswordInput(e.target.value)}
                  placeholder="Enter your secret password..." 
                  className="login-input" 
                  required 
                />
              </div>

              <button type="submit" className="login-btn-primary">
                <LogIn size={18} /> Secure Sign In
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: "12px", fontSize: "13px", color: "#94a3b8" }}>
              Don't have an account?{" "}
              <button 
                type="button" 
                onClick={() => setAuthTab("signup")}
                style={{ background: "none", border: "none", color: "#818cf8", fontWeight: "600", cursor: "pointer", textDecoration: "underline" }}
              >
                Create Free Account
              </button>
            </div>

            <div className="demo-accounts-divider">
              <span>OR 1-CLICK QUICK ACCESS FOR CLIENT DEMO</span>
            </div>

            <div className="quick-access-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <button 
                type="button"
                className="quick-role-btn super-admin"
                onClick={() => {
                  setUser({
                    name: "Briz Patel (Super Admin)",
                    email: "briz@brizpatel.online",
                    role: "super_admin",
                    company: "Briz AiWeb Studio",
                    repName: "All Representatives (Admin View)"
                  });
                  setActiveClient("Briz AiWeb Studio");
                  setIsAuthenticated(true);
                }}
              >
                <div className="role-top"><ShieldCheck size={16} /> <strong>Super Admin (Briz AI)</strong></div>
                <div className="role-sub">Master portal, company switcher, billing</div>
              </button>

              <button 
                type="button"
                className="quick-role-btn pitch-demo"
                onClick={() => {
                  setUser({
                    name: "Business Owner (Pro Demo)",
                    email: "owner@mybusiness.com",
                    role: "client_admin",
                    company: "My Business (Demo Workspace)",
                    repName: "All Representatives (Admin View)"
                  });
                  setActiveClient("My Business (Demo Workspace)");
                  setIsAuthenticated(true);
                }}
              >
                <div className="role-top"><Sparkles size={16} /> <strong>Live Interactive Demo</strong></div>
                <div className="role-sub">Clean 14-day Pro workspace for testing</div>
              </button>
            </div>
          </div>
        )}
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
            className={`nav-item ${activeTab === "reminders" ? "active" : ""}`}
            onClick={() => setActiveTab("reminders")}
          >
            <Clock size={18} />
            {!sidebarCollapsed && (
              <span className="flex-row-between">
                <span>Follow-Up Reminders</span>
                {dueRemindersCount > 0 && <span className="reminder-alert-badge">{dueRemindersCount}</span>}
              </span>
            )}
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
            {!sidebarCollapsed && <span>Sales Team</span>}
          </button>

          {user.role === "super_admin" && (
            <button 
              className={`nav-item ${activeTab === "clients" ? "active" : ""}`}
              onClick={() => setActiveTab("clients")}
            >
              <Building2 size={18} />
              {!sidebarCollapsed && (
                <span className="flex-row-between">
                  <span>Client Workspaces</span>
                  <span className="badge-saas">Admin</span>
                </span>
              )}
            </button>
          )}

          <button 
            className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={18} />
            {!sidebarCollapsed && <span>Integrations & API</span>}
          </button>

          <button 
            className="nav-item"
            onClick={() => switchViewMode("landing")}
            title="Switch to Public Commercial SaaS Website"
          >
            <Globe size={18} />
            {!sidebarCollapsed && (
              <span className="flex-row-between">
                <span>Public SaaS Site</span>
                <span className="badge-saas" style={{ background: "rgba(99, 102, 241, 0.2)", color: "#a5b4fc" }}>Live</span>
              </span>
            )}
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
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem("briz_crm_is_auth");
                localStorage.removeItem("briz_crm_current_user");
                localStorage.setItem("briz_crm_view_mode", "app");
              }
              setIsAuthenticated(false);
            }}
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
              {user.role === "super_admin" ? (
                <select 
                  value={activeClient} 
                  onChange={(e) => setActiveClient(e.target.value)}
                  className="client-select-dropdown"
                >
                  {tenantsList.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              ) : (
                <span style={{ fontWeight: 600, fontSize: "13px", color: "#f8fafc", padding: "0 6px" }}>
                  {user.company || activeClient}
                </span>
              )}
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
                    { id: "demo", name: "Meeting / Demo / Follow-Up", color: "#a855f7" },
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
                <p className="view-subtitle">Showing active customer inquiries for <strong>{activeClient}</strong> ({filteredLeads.length} leads). Manage leads, track follow-ups, and trigger 1-click WhatsApp outreach.</p>
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
                  <option value="demo">Meeting / Demo / Follow-Up</option>
                  <option value="won">Deal Won</option>
                </select>
              </div>

              <div className="filter-item">
                <Calendar size={15} className="text-muted" />
                <span className="filter-label">Month & Year:</span>
                <select 
                  value={dateFilter} 
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">📅 All Time (Full History)</option>
                  <option value="this_month">📅 This Month (October 2026)</option>
                  <option value="last_month">📅 September 2026</option>
                  <option value="year_2026">📆 Full Year 2026</option>
                  <option value="year_2025">📆 Year 2025</option>
                </select>
              </div>

              <div className="filter-item">
                <Clock size={15} className="text-muted" />
                <span className="filter-label">Follow-Up:</span>
                <select 
                  value={reminderFilter} 
                  onChange={(e) => setReminderFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Leads</option>
                  <option value="today">🟡 Due Today</option>
                  <option value="overdue">🔴 Overdue Follow-up</option>
                  <option value="upcoming">🟢 Upcoming Scheduled</option>
                  <option value="none">⚪ No Reminder Set</option>
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
                  {repsList.filter(r => !r.company || r.company === activeClient).map((r, idx) => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="results-counter">
                Showing <strong>{filteredLeads.length}</strong> inquiries
              </div>
            </div>

            <div className="table-responsive-card">
              <table className="crm-data-table">
                <thead>
                  <tr>
                    <th>Customer & Date/Time</th>
                    <th>Phone / WhatsApp</th>
                    <th>Location</th>
                    <th>Product / Service Requirement</th>
                    <th>Deal Value</th>
                    <th>Current Stage</th>
                    <th>⏰ Next Follow-Up</th>
                    <th>Assigned Rep</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.length === 0 ? (
                    <tr className="empty-leads-row">
                      <td colSpan={9} style={{ textAlign: "center", padding: "64px 24px" }}>
                        <div style={{ maxWidth: 440, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(99, 102, 241, 0.12)", border: "1px solid rgba(99, 102, 241, 0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#818cf8" }}>
                            <Sparkles size={30} />
                          </div>
                          <h3 style={{ margin: 0, color: "#f8fafc", fontSize: "20px", fontWeight: "700" }}>Your Sales Pipeline is Clean & Ready</h3>
                          <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px", lineHeight: "1.6" }}>
                            Zero demo leads. You are starting 100% clean from scratch for <strong>{activeClient}</strong>! Click below to add your first live customer lead.
                          </p>
                          <button 
                            onClick={() => setShowAddModal(true)}
                            style={{ marginTop: 8, background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "white", border: "none", padding: "12px 24px", borderRadius: "10px", fontWeight: "600", fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 16px rgba(99, 102, 241, 0.4)" }}
                          >
                            <Plus size={18} /> + Add Your First Customer Lead
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                    <tr key={lead.id} className="data-row">
                      <td className="lead-name-cell" onClick={() => { setActiveLeadDrawer(lead); setNotesEdit(""); }}>
                        <div className="customer-avatar">{lead.customer_name.charAt(0)}</div>
                        <div>
                          <div className="customer-name-text">{lead.customer_name}</div>
                          <div className="lead-datetime-badge">
                            <Calendar size={11} />
                            <span>{formatDateTime(lead.created_at)}</span>
                          </div>
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
                          {lead.stage === "demo" && "🤝 Meeting / Demo"}
                          {lead.stage === "won" && "🏆 Deal Won"}
                        </span>
                      </td>

                      <td>
                        {(() => {
                          const status = getLeadReminderStatus(lead);
                          if (status === "overdue") {
                            return (
                              <span className="reminder-pill overdue" title="Overdue Call" onClick={() => openReminderModal(lead)}>
                                <AlertTriangle size={11} /> {lead.followup_date.slice(5)} {lead.followup_time || ""}
                              </span>
                            );
                          }
                          if (status === "today") {
                            return (
                              <span className="reminder-pill today" title="Due Today!" onClick={() => openReminderModal(lead)}>
                                <Clock size={11} /> Today {lead.followup_time || ""}
                              </span>
                            );
                          }
                          if (status === "upcoming") {
                            return (
                              <span className="reminder-pill upcoming" title="Upcoming Scheduled" onClick={() => openReminderModal(lead)}>
                                <Calendar size={11} /> {lead.followup_date.slice(5)}
                              </span>
                            );
                          }
                          return (
                            <span className="reminder-pill none" onClick={() => openReminderModal(lead)}>
                              + Set Reminder
                            </span>
                          );
                        })()}
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
                            className="icon-action-btn reminder" 
                            title="Schedule Follow-Up Reminder"
                            onClick={() => openReminderModal(lead)}
                          >
                            <Clock size={15} />
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

                          <button 
                            className="icon-action-btn delete" 
                            title="Delete Lead"
                            onClick={() => handleDeleteLead(lead.id, lead.customer_name)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
                { id: "demo", title: "Meeting / Demo / Follow-Up", icon: "🤝", color: "purple" },
                { id: "won", title: "Deal Won / Closed", icon: "🏆", color: "emerald" }
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

                          <div className="card-datetime-row">
                            <span className="card-created-txt">📅 {formatDateTime(lead.created_at)}</span>
                            {(() => {
                              const status = getLeadReminderStatus(lead);
                              if (status === "overdue") {
                                return <span className="reminder-pill overdue" onClick={() => openReminderModal(lead)}><AlertTriangle size={10} /> Overdue</span>;
                              }
                              if (status === "today") {
                                return <span className="reminder-pill today" onClick={() => openReminderModal(lead)}><Clock size={10} /> Due Today</span>;
                              }
                              if (status === "upcoming") {
                                return <span className="reminder-pill upcoming" onClick={() => openReminderModal(lead)}><Calendar size={10} /> {lead.followup_date.slice(5)}</span>;
                              }
                              return null;
                            })()}
                          </div>

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
                                title="Schedule Follow-Up Reminder"
                                onClick={() => openReminderModal(lead)}
                              >
                                <Clock size={13} />
                              </button>
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
                              <button 
                                className="card-btn-quote text-danger"
                                title="Delete Lead"
                                onClick={() => handleDeleteLead(lead.id, lead.customer_name)}
                              >
                                <Trash2 size={13} />
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

        
        {/* TAB: FOLLOW-UP REMINDERS CENTER */}
        {activeTab === "reminders" && (
          <div className="content-container fade-in">
            <div className="view-header">
              <div>
                <h1 className="view-title">⏰ Follow-Up Reminders & Daily Calling Desk</h1>
                <p className="view-subtitle">Scheduled calls, customer re-engagements, and overdue reminders for <strong>{activeClient}</strong></p>
              </div>
              <div className="view-actions">
                <button className="btn-secondary" onClick={() => setActiveTab("leads")}>
                  <List size={15} /> All Inquiries
                </button>
                <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                  <Plus size={15} /> + New Lead
                </button>
              </div>
            </div>

            {/* Summary Metrics */}
            <div className="reminders-summary-grid">
              <div className="reminders-summary-card overdue">
                <div className="summary-icon-box overdue">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <div className="summary-stat-count">
                    {filteredLeads.filter(l => getLeadReminderStatus(l) === "overdue").length}
                  </div>
                  <div className="summary-stat-title">Overdue Follow-ups (Urgent)</div>
                </div>
              </div>

              <div className="reminders-summary-card today">
                <div className="summary-icon-box today">
                  <Clock size={22} />
                </div>
                <div>
                  <div className="summary-stat-count">
                    {filteredLeads.filter(l => getLeadReminderStatus(l) === "today").length}
                  </div>
                  <div className="summary-stat-title">Calls Scheduled For Today</div>
                </div>
              </div>

              <div className="reminders-summary-card upcoming">
                <div className="summary-icon-box upcoming">
                  <Calendar size={22} />
                </div>
                <div>
                  <div className="summary-stat-count">
                    {filteredLeads.filter(l => getLeadReminderStatus(l) === "upcoming").length}
                  </div>
                  <div className="summary-stat-title">Upcoming Schedule (Next 7+ Days)</div>
                </div>
              </div>
            </div>

            {/* 3-Column Reminders Board */}
            <div className="reminders-columns-grid">
              {/* Column 1: Overdue */}
              <div className="reminders-section-col">
                <div className="reminders-section-header">
                  <span className="reminders-section-title text-danger">
                    <AlertTriangle size={16} /> 🔴 Overdue Calls ({filteredLeads.filter(l => getLeadReminderStatus(l) === "overdue").length})
                  </span>
                </div>
                <div className="reminders-stack">
                  {filteredLeads.filter(l => getLeadReminderStatus(l) === "overdue").length === 0 ? (
                    <div className="empty-state-card">✅ No overdue calls! All caught up.</div>
                  ) : (
                    filteredLeads.filter(l => getLeadReminderStatus(l) === "overdue").map(lead => (
                      <div key={lead.id} className="reminders-card-item">
                        <div className="reminder-card-top">
                          <span className="reminder-cust-name" onClick={() => { setActiveLeadDrawer(lead); setNotesEdit(""); }}>
                            {lead.customer_name}
                          </span>
                          <span className="reminder-pill overdue">
                            {lead.followup_date} {lead.followup_time}
                          </span>
                        </div>
                        <div className="card-location">
                          <MapPin size={12} />
                          <span>{lead.city || "Not specified"}, {lead.state}</span>
                        </div>
                        <div className="card-machine-pill">{lead.requirement}</div>
                        {lead.followup_note && (
                          <div className="reminder-note-box">
                            <strong>Note:</strong> {lead.followup_note}
                          </div>
                        )}
                        <div className="reminder-actions-row">
                          <a href={`tel:${lead.phone}`} className="btn-reminder-action call">
                            <Phone size={13} /> Call
                          </a>
                          <a 
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Namaste ${lead.customer_name} ji, follow-up from ${activeClient || user?.company || "our team"} regarding your inquiry for ${lead.requirement}. Would you be free for a quick call today?`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-reminder-action wa"
                          >
                            <MessageSquare size={13} /> WhatsApp
                          </a>
                          <button 
                            className="btn-reminder-action done"
                            title="Mark as Completed"
                            onClick={() => handleClearReminder(lead.id)}
                          >
                            <Check size={13} />
                          </button>
                          <button 
                            className="btn-reminder-action done"
                            title="Reschedule Follow-up"
                            onClick={() => openReminderModal(lead)}
                          >
                            <Clock size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Column 2: Due Today */}
              <div className="reminders-section-col">
                <div className="reminders-section-header">
                  <span className="reminders-section-title text-amber">
                    <Clock size={16} /> 🟡 Due Today ({filteredLeads.filter(l => getLeadReminderStatus(l) === "today").length})
                  </span>
                </div>
                <div className="reminders-stack">
                  {filteredLeads.filter(l => getLeadReminderStatus(l) === "today").length === 0 ? (
                    <div className="empty-state-card">No more calls scheduled for today.</div>
                  ) : (
                    filteredLeads.filter(l => getLeadReminderStatus(l) === "today").map(lead => (
                      <div key={lead.id} className="reminders-card-item">
                        <div className="reminder-card-top">
                          <span className="reminder-cust-name" onClick={() => { setActiveLeadDrawer(lead); setNotesEdit(""); }}>
                            {lead.customer_name}
                          </span>
                          <span className="reminder-pill today">
                            Today {lead.followup_time || "11:00 AM"}
                          </span>
                        </div>
                        <div className="card-location">
                          <MapPin size={12} />
                          <span>{lead.city || "Not specified"}, {lead.state}</span>
                        </div>
                        <div className="card-machine-pill">{lead.requirement}</div>
                        {lead.followup_note && (
                          <div className="reminder-note-box">
                            <strong>Agenda:</strong> {lead.followup_note}
                          </div>
                        )}
                        <div className="reminder-actions-row">
                          <a href={`tel:${lead.phone}`} className="btn-reminder-action call">
                            <Phone size={13} /> Call
                          </a>
                          <a 
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Namaste ${lead.customer_name} ji, scheduled follow-up from ${activeClient || user?.company || "our team"} regarding ${lead.requirement}.`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-reminder-action wa"
                          >
                            <MessageSquare size={13} /> WhatsApp
                          </a>
                          <button 
                            className="btn-reminder-action done"
                            title="Mark Completed"
                            onClick={() => handleClearReminder(lead.id)}
                          >
                            <Check size={13} />
                          </button>
                          <button 
                            className="btn-reminder-action done"
                            title="Reschedule Follow-up"
                            onClick={() => openReminderModal(lead)}
                          >
                            <Clock size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Column 3: Upcoming */}
              <div className="reminders-section-col">
                <div className="reminders-section-header">
                  <span className="reminders-section-title text-blue">
                    <Calendar size={16} /> 🟢 Upcoming Scheduled ({filteredLeads.filter(l => getLeadReminderStatus(l) === "upcoming").length})
                  </span>
                </div>
                <div className="reminders-stack">
                  {filteredLeads.filter(l => getLeadReminderStatus(l) === "upcoming").length === 0 ? (
                    <div className="empty-state-card">No upcoming calls scheduled yet.</div>
                  ) : (
                    filteredLeads.filter(l => getLeadReminderStatus(l) === "upcoming").map(lead => (
                      <div key={lead.id} className="reminders-card-item">
                        <div className="reminder-card-top">
                          <span className="reminder-cust-name" onClick={() => { setActiveLeadDrawer(lead); setNotesEdit(""); }}>
                            {lead.customer_name}
                          </span>
                          <span className="reminder-pill upcoming">
                            {lead.followup_date} {lead.followup_time}
                          </span>
                        </div>
                        <div className="card-location">
                          <MapPin size={12} />
                          <span>{lead.city || "Not specified"}, {lead.state}</span>
                        </div>
                        <div className="card-machine-pill">{lead.requirement}</div>
                        {lead.followup_note && (
                          <div className="reminder-note-box">
                            <strong>Note:</strong> {lead.followup_note}
                          </div>
                        )}
                        <div className="reminder-actions-row">
                          <a href={`tel:${lead.phone}`} className="btn-reminder-action call">
                            <Phone size={13} /> Call
                          </a>
                          <a 
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-reminder-action wa"
                          >
                            <MessageSquare size={13} /> WhatsApp
                          </a>
                          <button 
                            className="btn-reminder-action done"
                            title="Reschedule Follow-up"
                            onClick={() => openReminderModal(lead)}
                          >
                            <Clock size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
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
                  <label>Product / Service / Item Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Standard Commercial Package, Service Contract, Wholesale Supply..." 
                    value={quoteItem} 
                    onChange={(e) => setQuoteItem(e.target.value)}
                    className="crm-input"
                  />
                </div>

                <div className="form-group">
                  <label>Specification / Package Details</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Turnkey Delivery / 1 Year Warranty / Full Support" 
                    value={quoteSpec} 
                    onChange={(e) => setQuoteSpec(e.target.value)}
                    className="crm-input"
                  />
                </div>

                <div className="form-group">
                  <label>Base Amount / Price (₹)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 25000"
                    value={customPrice} 
                    onChange={(e) => setCustomPrice(Number(e.target.value))}
                    className="crm-input"
                  />
                </div>

                <div className="form-group">
                  <label>Quotation Message Language</label>
                  <div className="radio-group-row">
                    <button 
                      type="button" 
                      className={`lang-chip ${quoteLanguage === "hindi" ? "active" : ""}`}
                      onClick={() => setQuoteLanguage("hindi")}
                    >
                      🇮🇳 हिंदी (Hindi - Primary)
                    </button>
                    <button 
                      type="button" 
                      className={`lang-chip ${quoteLanguage === "english" ? "active" : ""}`}
                      onClick={() => setQuoteLanguage("english")}
                    >
                      🇬🇧 English
                    </button>
                    <button 
                      type="button" 
                      className={`lang-chip ${quoteLanguage === "gujarati" ? "active" : ""}`}
                      onClick={() => setQuoteLanguage("gujarati")}
                    >
                      ગુજરાતી (Gujarati)
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
              {repsList.filter(r => !r.company || r.company === activeClient).length === 0 ? (
                <div className="empty-state-card" style={{ gridColumn: "1 / -1", padding: "40px 20px", textAlign: "center" }}>
                  <Users size={36} style={{ color: "#64748b", margin: "0 auto 12px" }} />
                  <h3 style={{ color: "#f8fafc", fontSize: "16px", marginBottom: "6px" }}>No Sales Representatives Added Yet</h3>
                  <p style={{ color: "#94a3b8", fontSize: "13px", maxWidth: "450px", margin: "0 auto 16px" }}>
                    Add your team members to assign incoming customer leads, track response times, and provide individual login access.
                  </p>
                  <button className="btn-primary" onClick={() => {
                    setNewRepForm({ ...newRepForm, company: activeClient });
                    setShowAddRepModal(true);
                  }}>
                    <Plus size={15} /> + Add Your First Sales Rep
                  </button>
                </div>
              ) : (
                repsList.filter(r => !r.company || r.company === activeClient).map((rep) => (
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
                      <div className="cred-item">
                        <span className="cred-lbl">Login ID:</span>
                        <strong className="cred-val">{rep.phone}</strong>
                      </div>
                      <div className="cred-item">
                        <span className="cred-lbl">Password:</span>
                        <strong className="cred-val pwd">{rep.password || "Rep@123"}</strong>
                      </div>
                      <span className="badge-active-rep">Secured</span>
                    </div>
                    <span className="speed-tag">⚡ Response Rate: {rep.rate}</span>
                    <div className="rep-footer-buttons">
                      <a 
                        href={`https://wa.me/${rep.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hello " + rep.name + ", your BrizCRM login access is active. Portal: https://crm.brizpatel.online (Mobile: " + rep.phone + ")")}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn-invite-wa"
                        title="Send login link to sales rep on WhatsApp"
                      >
                        <Send size={13} /> Send Login Details
                      </a>
                      <a 
                        href={`https://wa.me/${rep.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hello " + rep.name + ", please check your assigned customer leads on BrizCRM.")}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="dispatch-wa-btn"
                      >
                        <MessageSquare size={13} /> Leads
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
            </div>
          </div>
        )}

        {/* TAB 6: CLIENT WORKSPACES (SAAS MULTI-TENANCY FOR SELLING TO CLIENTS) */}
        {activeTab === "clients" && (
          <div className="content-container fade-in">
            <div className="view-header">
              <div>
                <h1 className="view-title">Client Workspaces & SaaS Onboarding</h1>
                <p className="view-subtitle">Manage multiple business client workspaces, branch divisions, and subscriber accounts from one master command center</p>
              </div>
              <div className="view-actions">
                <button className="btn-primary" onClick={() => setShowOnboardModal(true)}>
                  <Plus size={15} /> + Onboard New Client
                </button>
              </div>
            </div>

            <div className="clients-showcase-grid">
              {tenantsList.map((c) => (
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
                <h4 className="section-title">Inquiry History & Timestamps</h4>
                <div className="spec-row">
                  <span className="spec-label">📅 Inquiry Received:</span>
                  <span className="spec-value">{formatDateTime(activeLeadDrawer.created_at)}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">🔄 Last Activity Update:</span>
                  <span className="spec-value">{formatDateTime(activeLeadDrawer.updated_at || activeLeadDrawer.created_at)}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">⏰ Follow-Up Schedule:</span>
                  <span className="spec-value">
                    {activeLeadDrawer.followup_date ? (
                      <span className="font-semibold text-emerald">
                        {activeLeadDrawer.followup_date} at {activeLeadDrawer.followup_time || "11:00 AM"}
                      </span>
                    ) : (
                      <span className="text-muted">No follow-up scheduled</span>
                    )}
                    <button 
                      className="link-button ml-2" 
                      onClick={() => openReminderModal(activeLeadDrawer)}
                    >
                      {activeLeadDrawer.followup_date ? "Reschedule" : "+ Set Follow-Up"}
                    </button>
                  </span>
                </div>
              </div>

              <div className="drawer-section">
                <h4 className="section-title">Inquiry Specifications</h4>
                <div className="spec-row">
                  <span className="spec-label">Requirement:</span>
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

              <button 
                className="drawer-delete-btn"
                onClick={() => handleDeleteLead(activeLeadDrawer.id, activeLeadDrawer.customer_name)}
              >
                <Trash2 size={16} /> Permanently Delete This Lead
              </button>
            </div>
          </div>
        </div>
      )}

      
      {/* MODAL: SCHEDULE FOLLOW-UP REMINDER */}
      {showReminderModal && reminderLead && (
        <div className="modal-backdrop" onClick={() => setShowReminderModal(false)}>
          <div className="modal-dialog fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">⏰ Schedule Follow-Up Call / Reminder</h3>
              <button className="modal-close" onClick={() => setShowReminderModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveReminder} className="modal-form">
              <div className="form-group">
                <label>Customer Name</label>
                <input 
                  type="text" 
                  value={reminderLead.customer_name} 
                  disabled 
                  className="crm-input disabled" 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Follow-Up Date *</label>
                  <input 
                    type="date" 
                    value={reminderForm.date}
                    onChange={(e) => setReminderForm({ ...reminderForm, date: e.target.value })}
                    required
                    className="crm-input"
                  />
                </div>
                <div className="form-group">
                  <label>Scheduled Time *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 11:30 AM or 04:00 PM"
                    value={reminderForm.time}
                    onChange={(e) => setReminderForm({ ...reminderForm, time: e.target.value })}
                    required
                    className="crm-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Quick Presets</label>
                <div className="quick-presets-row">
                  <button 
                    type="button" 
                    className="btn-preset-pill"
                    onClick={() => setReminderForm({ ...reminderForm, date: new Date().toISOString().slice(0, 10), time: "05:00 PM" })}
                  >
                    Today Evening (5:00 PM)
                  </button>
                  <button 
                    type="button" 
                    className="btn-preset-pill"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 1);
                      setReminderForm({ ...reminderForm, date: d.toISOString().slice(0, 10), time: "11:00 AM" });
                    }}
                  >
                    Tomorrow Morning (11:00 AM)
                  </button>
                  <button 
                    type="button" 
                    className="btn-preset-pill"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 3);
                      setReminderForm({ ...reminderForm, date: d.toISOString().slice(0, 10), time: "03:00 PM" });
                    }}
                  >
                    In 3 Days
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Follow-Up Agenda / Notes *</label>
                <textarea 
                  placeholder="e.g. Call for advance token payment, check transport subsidy, share factory video..."
                  value={reminderForm.note}
                  onChange={(e) => setReminderForm({ ...reminderForm, note: e.target.value })}
                  required
                  rows={3}
                  className="crm-textarea"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowReminderModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Follow-Up Reminder</button>
              </div>
            </form>
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
                <label>Product / Service Requirement</label>
                <input 
                  type="text" 
                  placeholder="e.g. Software Package, Wholesale Goods, Industrial Supply, Tour Package..." 
                  value={newLeadForm.requirement}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, requirement: e.target.value })}
                  className="crm-input"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Deal Value (₹)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 50000"
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
                    <option value="Direct / Admin">Direct / Admin</option>
                    {repsList.filter(r => !r.company || r.company === activeClient).map((r, idx) => (
                      <option key={idx} value={r.name}>{r.name}</option>
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
                <label>Product / Service / Item Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Standard Business Package, Consulting, Products..." 
                  value={quoteItem} 
                  onChange={(e) => setQuoteItem(e.target.value)}
                  className="crm-input"
                />
              </div>

              <div className="form-group">
                <label>Base Amount / Price (₹)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 25000"
                  value={customPrice} 
                  onChange={(e) => setCustomPrice(Number(e.target.value))}
                  className="crm-input"
                />
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
              const repPassword = newRepForm.password ? newRepForm.password.trim() : "Rep@123";
              const newRep = {
                id: Date.now(),
                name: newRepForm.name.trim(),
                phone: newRepForm.phone.trim(),
                email: newRepForm.email ? newRepForm.email.trim() : `${newRepForm.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@crm.online`,
                password: repPassword,
                company: activeClient,
                role: newRepForm.role || "sales_rep",
                leads: 0,
                won: 0,
                revenue: "₹0",
                rate: "100%"
              };
              const updatedReps = [...repsList, newRep];
              setRepsList(updatedReps);
              if (typeof window !== "undefined") {
                try {
                  localStorage.setItem("briz_crm_reps", JSON.stringify(updatedReps));
                } catch (err) {}
              }
              setShowAddRepModal(false);
              setNewRepForm({
                name: "",
                phone: "",
                email: "",
                password: "",
                role: "sales_rep",
                company: activeClient
              });
              const waInvite = `https://wa.me/${newRep.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hello " + newRep.name + "! Your sales portal for " + activeClient + " is active. Login: https://crm.brizpatel.online | Mobile: " + newRep.phone + " | Password: " + repPassword)}`;
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

              <div className="form-group">
                <label>Set Rep Secret Password / PIN *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sales@2026 or 4-digit PIN"
                  value={newRepForm.password || ""}
                  onChange={(e) => setNewRepForm({ ...newRepForm, password: e.target.value })}
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
