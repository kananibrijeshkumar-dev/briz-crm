import React, { useState, useEffect } from 'react';
import { 
  Users, Phone, MessageSquare, Plus, Search, Filter, 
  TrendingUp, Award, Clock, MapPin, FileText, ChevronRight, 
  CheckCircle, LayoutGrid, List, Sparkles, Building2, X, ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from './supabase';
import './App.css';

// Initial Mock Seed Data (Works immediately and seamlessly with live Supabase sync)
const INITIAL_LEADS = [
  {
    id: 1,
    customer_name: 'Harendra Kumar',
    phone: '+91 7426896134',
    city: 'Jaipur',
    state: 'Rajasthan',
    requirement: '7.5 HP Cyclone Pulverizer',
    stage: 'won',
    assigned_rep: 'Mukeshbhai',
    deal_value: 95000,
    notes: 'Advance payment of ₹25,000 received via UPI.'
  },
  {
    id: 2,
    customer_name: 'Abdul Chitrakoot',
    phone: '+91 9695471959',
    city: 'Chitrakoot',
    state: 'Uttar Pradesh',
    requirement: '10 HP Double Stage Pulverizer',
    stage: 'quotation',
    assigned_rep: 'Mukeshbhai',
    deal_value: 145000,
    notes: 'Quotation PDF sent. Follow up on Saturday morning.'
  },
  {
    id: 3,
    customer_name: 'Subhashish Kumar',
    phone: '+91 9934540362',
    city: 'Bhagalpur',
    state: 'Bihar',
    requirement: '5 HP Mini Flour Mill (Atta Chakki)',
    stage: 'demo',
    assigned_rep: 'Anilbhai',
    deal_value: 68000,
    notes: 'Visiting Ahmedabad factory next Tuesday for live demo.'
  },
  {
    id: 4,
    customer_name: 'Kamal Gupta',
    phone: '+91 9410679130',
    city: 'Aligarh',
    state: 'Uttar Pradesh',
    requirement: '5 HP Heavy Duty Commercial Chakki',
    stage: 'contacted',
    assigned_rep: 'Anilbhai',
    deal_value: 72000,
    notes: 'Requested live grinding video on WhatsApp.'
  },
  {
    id: 5,
    customer_name: 'Rajendra Goswami',
    phone: '+91 919828977577',
    city: 'Jaisalmer',
    state: 'Rajasthan',
    requirement: '20 HP Heavy Commercial Masala Mill',
    stage: 'quotation',
    assigned_rep: 'Hemali',
    deal_value: 220000,
    notes: 'Big commercial plant inquiry. Quotation sent.'
  },
  {
    id: 6,
    customer_name: 'Pawan Yadav',
    phone: '+91 6387549596',
    city: 'Farrukhabad',
    state: 'Uttar Pradesh',
    requirement: '10 HP Masala / Haldi Grinder',
    stage: 'contacted',
    assigned_rep: 'Lata',
    deal_value: 115000,
    notes: 'Needs GST quotation and transport delivery charges to UP.'
  },
  {
    id: 7,
    customer_name: 'Haresh Thakor',
    phone: '+91 9979098370',
    city: 'Gandhinagar',
    state: 'Gujarat',
    requirement: 'Double Chamber 7.5 HP Pulverizer',
    stage: 'new',
    assigned_rep: 'Anilbhai',
    deal_value: 85000,
    notes: 'New WhatsApp inquiry received.'
  },
  {
    id: 8,
    customer_name: 'Dam Bataiga',
    phone: '+91 6207942531',
    city: 'Ranchi',
    state: 'Jharkhand',
    requirement: '20 HP Industrial Pulverizer',
    stage: 'demo',
    assigned_rep: 'Mukeshbhai',
    deal_value: 210000,
    notes: 'Wants to see live continuous grinding demo.'
  },
  {
    id: 9,
    customer_name: 'Vijay Kumar Khatri',
    phone: '+91 9252677300',
    city: 'Deshnoke',
    state: 'Rajasthan',
    requirement: '5 HP Cyclone Pulverizer',
    stage: 'won',
    assigned_rep: 'Mukeshbhai',
    deal_value: 78000,
    notes: 'Order confirmed! Machine ready for dispatch.'
  }
];

const SALES_REPS = [
  'All Representatives (Admin View)',
  'Anilbhai',
  'Ankitbhai',
  'Hemali',
  'Lata',
  'Mansi',
  'Mukeshbhai',
  'Priyanshi',
  'Ritu',
  'Siya'
];

const STAGES = [
  { id: 'new', label: 'New Inquiries', icon: '📥', color: 'blue' },
  { id: 'contacted', label: 'Contacted / Exploring', icon: '💬', color: 'cyan' },
  { id: 'quotation', label: 'Quotation Shared', icon: '📄', color: 'amber' },
  { id: 'demo', label: 'Factory Demo / Visit', icon: '🏭', color: 'purple' },
  { id: 'won', label: 'Deal Won / Advance Paid', icon: '🏆', color: 'emerald' }
];

export default function App() {
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [selectedRep, setSelectedRep] = useState('All Representatives (Admin View)');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'table'
  const [activeClient, setActiveClient] = useState('Jay Shree Ambe Food Machinery');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [quoteLead, setQuoteLead] = useState(null);
  const [newLead, setNewLead] = useState({
    customer_name: '',
    phone: '',
    city: '',
    state: 'Gujarat',
    requirement: '10 HP Double Stage Pulverizer with Cyclone',
    assigned_rep: 'Anilbhai',
    deal_value: 95000,
    stage: 'new',
    notes: ''
  });

  // Quotation state
  const [quoteModel, setQuoteModel] = useState('10 HP Double Stage Pulverizer with Cyclone');
  const [quotePrice, setQuotePrice] = useState(115000);

  // Sync with Supabase on mount
  useEffect(() => {
    async function fetchLeads() {
      try {
        const { data, error } = await supabase.from('briz_leads').select('*').order('id', { ascending: false });
        if (data && data.length > 0) {
          setLeads(data);
        }
      } catch (e) {
        console.log('Using local state:', e.message);
      }
    }
    fetchLeads();
  }, []);

  // Filter leads based on selected sales rep and search term
  const filteredLeads = leads.filter(lead => {
    const matchRep = (selectedRep === 'All Representatives (Admin View)') || (lead.assigned_rep === selectedRep);
    const matchSearch = 
      lead.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      (lead.city && lead.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.requirement && lead.requirement.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchRep && matchSearch;
  });

  // Calculate Metrics
  const totalLeadsCount = filteredLeads.length;
  const inPipelineCount = filteredLeads.filter(l => l.stage !== 'won' && l.stage !== 'lost').length;
  const activeQuotesValue = filteredLeads
    .filter(l => l.stage === 'quotation' || l.stage === 'demo')
    .reduce((sum, l) => sum + Number(l.deal_value || 0), 0);
  const dealsWonValue = filteredLeads
    .filter(l => l.stage === 'won')
    .reduce((sum, l) => sum + Number(l.deal_value || 0), 0);

  // Advance Lead Stage
  const advanceStage = async (leadId) => {
    const stageOrder = ['new', 'contacted', 'quotation', 'demo', 'won'];
    const currentLead = leads.find(l => l.id === leadId);
    if (!currentLead) return;

    const currentIdx = stageOrder.indexOf(currentLead.stage);
    if (currentIdx < stageOrder.length - 1) {
      const nextStage = stageOrder[currentIdx + 1];
      
      // If moving to WON -> Celebrate with confetti!
      if (nextStage === 'won') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      const updated = leads.map(l => l.id === leadId ? { ...l, stage: nextStage } : l);
      setLeads(updated);

      // Attempt Supabase sync
      try {
        await supabase.from('briz_leads').update({ stage: nextStage }).eq('id', leadId);
      } catch (err) {
        console.log('State updated locally');
      }
    }
  };

  // Add New Lead
  const handleCreateLead = async (e) => {
    e.preventDefault();
    if (!newLead.customer_name || !newLead.phone) return;

    const leadToAdd = {
      ...newLead,
      id: Date.now(),
      created_at: new Date().toISOString()
    };

    setLeads([leadToAdd, ...leads]);
    setShowAddModal(false);
    setNewLead({
      customer_name: '',
      phone: '',
      city: '',
      state: 'Gujarat',
      requirement: '10 HP Double Stage Pulverizer with Cyclone',
      assigned_rep: 'Anilbhai',
      deal_value: 95000,
      stage: 'new',
      notes: ''
    });

    try {
      await supabase.from('briz_leads').insert([leadToAdd]);
    } catch (err) {
      console.log('Saved locally');
    }
  };

  // Helper for WhatsApp click
  const openWhatsApp = (phone, name, requirement) => {
    const cleanP = phone.replace(/[^0-9]/g, '');
    const waPhone = cleanP.startsWith('91') ? cleanP : `91${cleanP.slice(-10)}`;
    const msg = encodeURIComponent(`Hello ${name}! 🙏 This is regarding your inquiry for ${requirement} from Jay Shree Ambe Food Machinery Ahmedabad. How can I assist you with machine quotation and live demo?`);
    window.open(`https://wa.me/${waPhone}?text=${msg}`, '_blank');
  };

  // Helper for Sending Quotation on WhatsApp
  const sendQuotationWhatsApp = () => {
    if (!quoteLead) return;
    const cleanP = quoteLead.phone.replace(/[^0-9]/g, '');
    const waPhone = cleanP.startsWith('91') ? cleanP : `91${cleanP.slice(-10)}`;
    const gstAmount = Math.round(quotePrice * 0.18);
    const totalAmount = quotePrice + gstAmount;

    const quoteMsg = `🏭 *JAY SHREE AMBE FOOD MACHINERY — COMMERCIAL QUOTATION* 🏭
━━━━━━━━━━━━━━━━━━━━
Dear *${quoteLead.customer_name}*,
Thank you for your inquiry. Please find our official machine proposal:

⚙️ *Machine Model:* ${quoteModel}
💰 *Base Price:* ₹${quotePrice.toLocaleString('en-IN')}
📊 *GST (18%):* ₹${gstAmount.toLocaleString('en-IN')}
💵 *Net Total Amount:* ₹${totalAmount.toLocaleString('en-IN')}

📍 *Factory & Live Demo:*
Plot No. 1, Panchamrut Industrial Park-4, Dhamatvan, Ahmedabad, Gujarat 382435.
🗺️ *Google Maps:* https://maps.google.com/?q=22.9541651,72.7174421
🎥 *Watch Live YouTube Grinding Demo:* https://www.youtube.com/@jayambefoodmachinery

👤 *Assigned Sales Representative:* ${quoteLead.assigned_rep}
📞 *Direct Calling / WhatsApp:* +91 72018 90711`;

    window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(quoteMsg)}`, '_blank');
    setQuoteLead(null);
  };

  return (
    <div className="crm-app">
      {/* Top Navbar */}
      <header className="crm-header">
        <div className="brand-section">
          <div className="brand-logo-icon">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="brand-title">BrizCRM</div>
            <span className="brand-badge">Briz AI Studio</span>
          </div>
        </div>

        {/* Search Input */}
        <div className="header-center">
          <div className="search-box">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search by customer name, mobile, city, or machine..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Actions & Role Switcher */}
        <div className="header-actions">
          <div className="role-selector">
            <Users size={16} />
            <select 
              value={selectedRep} 
              onChange={(e) => setSelectedRep(e.target.value)}
            >
              {SALES_REPS.map((rep, idx) => (
                <option key={idx} value={rep}>{rep}</option>
              ))}
            </select>
          </div>

          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            <span>New Lead</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="crm-main">
        {/* Top Metric Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Total Leads</span>
              <span className="stat-value">{totalLeadsCount}</span>
            </div>
            <div className="stat-icon blue">
              <Users size={22} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">In Discussion</span>
              <span className="stat-value">{inPipelineCount}</span>
            </div>
            <div className="stat-icon cyan">
              <Clock size={22} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Quoted Pipeline Value</span>
              <span className="stat-value">₹{(activeQuotesValue / 100000).toFixed(2)}L</span>
            </div>
            <div className="stat-icon amber">
              <FileText size={22} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Closed Revenue (Won)</span>
              <span className="stat-value">₹{(dealsWonValue / 100000).toFixed(2)}L</span>
            </div>
            <div className="stat-icon emerald">
              <Award size={22} />
            </div>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="toolbar-row">
          <div className="client-badge-pill">
            <Building2 size={16} />
            <span className="dot-online"></span>
            <strong>Client:</strong> {activeClient}
          </div>

          <div className="view-tabs">
            <button 
              className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
            >
              <LayoutGrid size={15} />
              <span>Pipeline View</span>
            </button>
            <button 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <List size={15} />
              <span>Table Grid</span>
            </button>
          </div>
        </div>

        {/* Kanban Board View */}
        {viewMode === 'kanban' ? (
          <div className="kanban-board">
            {STAGES.map(stage => {
              const stageLeads = filteredLeads.filter(l => l.stage === stage.id);
              return (
                <div key={stage.id} className="kanban-column">
                  <div className="col-header">
                    <div className="col-title-group">
                      <span>{stage.icon}</span>
                      <span className="col-title">{stage.label}</span>
                    </div>
                    <span className="col-count">{stageLeads.length}</span>
                  </div>

                  <div className="cards-container">
                    {stageLeads.map(lead => (
                      <div key={lead.id} className="lead-card fade-in">
                        <div className="card-top">
                          <div>
                            <div className="customer-name">{lead.customer_name}</div>
                            <div className="customer-location">
                              <MapPin size={12} />
                              <span>{lead.city}, {lead.state}</span>
                            </div>
                          </div>
                          <span className="rep-avatar">{lead.assigned_rep}</span>
                        </div>

                        <div className="requirement-tag">
                          {lead.requirement}
                        </div>

                        {lead.deal_value > 0 && (
                          <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Deal Value:</span>
                            <strong style={{ color: '#38bdf8' }}>₹{Number(lead.deal_value).toLocaleString('en-IN')}</strong>
                          </div>
                        )}

                        <div className="card-actions-row">
                          <div className="contact-buttons">
                            {/* Call Link */}
                            <a 
                              href={`tel:${lead.phone.replace(/\s+/g, '')}`} 
                              className="btn-icon call" 
                              title="Direct Phone Call"
                            >
                              <Phone size={15} />
                            </a>

                            {/* WhatsApp Link */}
                            <button 
                              className="btn-icon whatsapp" 
                              onClick={() => openWhatsApp(lead.phone, lead.customer_name, lead.requirement)}
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare size={15} />
                            </button>

                            {/* Quotation Maker */}
                            <button 
                              className="btn-icon quote" 
                              onClick={() => {
                                setQuoteLead(lead);
                                setQuoteModel(lead.requirement || '10 HP Double Stage Pulverizer');
                                setQuotePrice(lead.deal_value || 115000);
                              }}
                              title="Generate Official WhatsApp Quotation"
                            >
                              <FileText size={15} />
                            </button>
                          </div>

                          {/* Advance Button (if not won) */}
                          {lead.stage !== 'won' && (
                            <button 
                              className="btn-stage-advance"
                              onClick={() => advanceStage(lead.id)}
                              title="Move to Next Stage"
                            >
                              <span>Next</span>
                              <ChevronRight size={13} />
                            </button>
                          )}

                          {lead.stage === 'won' && (
                            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <CheckCircle size={14} /> Won
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {stageLeads.length === 0 && (
                      <div style={{ padding: '24px 12px', textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
                        No leads in this stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table Grid View */
          <div className="table-container fade-in">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Phone Number</th>
                  <th>Location</th>
                  <th>Machine Requirement</th>
                  <th>Stage</th>
                  <th>Assigned Rep</th>
                  <th>Deal Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map(lead => (
                  <tr key={lead.id}>
                    <td><strong>{lead.customer_name}</strong></td>
                    <td>{lead.phone}</td>
                    <td>{lead.city}, {lead.state}</td>
                    <td>{lead.requirement}</td>
                    <td>
                      <span className={`stage-pill ${lead.stage}`}>
                        {lead.stage}
                      </span>
                    </td>
                    <td>{lead.assigned_rep}</td>
                    <td>₹{Number(lead.deal_value || 0).toLocaleString('en-IN')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <a href={`tel:${lead.phone.replace(/\s+/g, '')}`} className="btn-icon call" title="Call">
                          <Phone size={14} />
                        </a>
                        <button 
                          className="btn-icon whatsapp" 
                          onClick={() => openWhatsApp(lead.phone, lead.customer_name, lead.requirement)}
                          title="WhatsApp"
                        >
                          <MessageSquare size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* MODAL 1: Add New Lead */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add New Customer Lead</div>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateLead} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label>Customer Full Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ramesh Patel" 
                  required
                  value={newLead.customer_name}
                  onChange={e => setNewLead({ ...newLead, customer_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>WhatsApp / Mobile Number *</label>
                <input 
                  type="tel" 
                  placeholder="e.g. +91 98250 12345" 
                  required
                  value={newLead.phone}
                  onChange={e => setNewLead({ ...newLead, phone: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>City</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Rajkot" 
                    value={newLead.city}
                    onChange={e => setNewLead({ ...newLead, city: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Gujarat" 
                    value={newLead.state}
                    onChange={e => setNewLead({ ...newLead, state: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Machine Requirement</label>
                <input 
                  type="text" 
                  placeholder="e.g. 10 HP Pulverizer with Cyclone" 
                  value={newLead.requirement}
                  onChange={e => setNewLead({ ...newLead, requirement: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Assign Salesperson</label>
                  <select 
                    value={newLead.assigned_rep}
                    onChange={e => setNewLead({ ...newLead, assigned_rep: e.target.value })}
                  >
                    {SALES_REPS.slice(1).map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Estimated Value (₹)</label>
                  <input 
                    type="number" 
                    value={newLead.deal_value}
                    onChange={e => setNewLead({ ...newLead, deal_value: Number(e.target.value) })}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '12px', marginTop: 8 }}>
                Save & Assign Lead
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: 1-Click WhatsApp Quotation Generator */}
      {quoteLead && (
        <div className="modal-overlay" onClick={() => setQuoteLead(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">⚡ 1-Click WhatsApp Quotation Maker</div>
              <button className="modal-close" onClick={() => setQuoteLead(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label>Customer Name</label>
                <input type="text" value={quoteLead.customer_name} disabled style={{ opacity: 0.8 }} />
              </div>

              <div className="form-group">
                <label>Select Machine Specification</label>
                <select value={quoteModel} onChange={e => setQuoteModel(e.target.value)}>
                  <option value="5 HP Commercial Atta Chakki / Flour Mill">5 HP Commercial Atta Chakki (₹72,000)</option>
                  <option value="7.5 HP Standard Double Stage Pulverizer">7.5 HP Standard Pulverizer (₹85,000)</option>
                  <option value="10 HP Double Stage Pulverizer with Cyclone Collector">10 HP Pulverizer with Cyclone (₹1,15,000)</option>
                  <option value="15 HP Commercial Heavy-Duty Cyclone Pulverizer">15 HP Cyclone Pulverizer (₹1,65,000)</option>
                  <option value="20 HP Heavy Commercial Masala / Haldi Grinder">20 HP Heavy Commercial Masala Mill (₹2,20,000)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Base Price (₹ Excl. GST)</label>
                <input 
                  type="number" 
                  value={quotePrice} 
                  onChange={e => setQuotePrice(Number(e.target.value))} 
                />
              </div>

              <div className="quote-preview-box">
                <strong>📝 Quotation Summary:</strong>
                <br />
                • Base Price: ₹{quotePrice.toLocaleString('en-IN')}
                <br />
                • GST (18%): ₹{Math.round(quotePrice * 0.18).toLocaleString('en-IN')}
                <br />
                • <strong>Total Payable: ₹{(quotePrice + Math.round(quotePrice * 0.18)).toLocaleString('en-IN')}</strong>
                <br />
                • Includes: Full Motor, Starter Panel, Foundation & Toolkit
              </div>

              <button 
                className="btn-primary" 
                onClick={sendQuotationWhatsApp}
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)', justifyContent: 'center', padding: '12px' }}
              >
                <MessageSquare size={16} />
                <span>Send Quotation to {quoteLead.customer_name} on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
