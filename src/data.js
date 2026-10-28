export const INITIAL_LEADS = [
  {
    id: 1,
    customer_name: 'Harendra Kumar',
    phone: '+91 7426896134',
    city: 'Jaipur',
    state: 'Rajasthan',
    requirement: '7.5 HP Standard Pulverizer',
    stage: 'won',
    assigned_rep: 'Mukeshbhai',
    deal_value: 95000,
    created_at: '2026-10-27T09:15:00Z',
    notes: 'Advance payment of ₹25,000 received via UPI. Delivery scheduled.',
    timeline: [
      { time: '2026-10-27 09:15 AM', text: 'Inquiry received via WhatsApp Bot' },
      { time: '2026-10-27 10:30 AM', text: 'Mukeshbhai called customer and shared catalog' },
      { time: '2026-10-27 04:00 PM', text: 'Quotation of ₹95,000 shared on WhatsApp' },
      { time: '2026-10-28 11:20 AM', text: 'Advance ₹25,000 confirmed! Deal Marked as Won.' }
    ]
  },
  {
    id: 2,
    customer_name: 'Abdul Chitrakoot',
    phone: '+91 9695471959',
    city: 'Chitrakoot',
    state: 'Uttar Pradesh',
    requirement: '10 HP Double Stage Cyclone Pulverizer',
    stage: 'quotation',
    assigned_rep: 'Mukeshbhai',
    deal_value: 145000,
    created_at: '2026-10-27T10:45:00Z',
    notes: 'Quotation PDF sent. Follow up on Saturday morning regarding transport subsidy.',
    timeline: [
      { time: '2026-10-27 10:45 AM', text: 'WhatsApp inquiry for 10 HP Cyclone Pulverizer' },
      { time: '2026-10-27 02:15 PM', text: 'Quotation generated & sent via WhatsApp' }
    ]
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
    created_at: '2026-10-27T11:30:00Z',
    notes: 'Visiting Ahmedabad factory next Tuesday for live demonstration.',
    timeline: [
      { time: '2026-10-27 11:30 AM', text: 'Inquiry received from Indiamart / WhatsApp' },
      { time: '2026-10-27 03:00 PM', text: 'Anilbhai explained motor specs & invited for factory visit' }
    ]
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
    created_at: '2026-10-27T12:00:00Z',
    notes: 'Requested live grinding video of wheat & maize on WhatsApp.',
    timeline: [
      { time: '2026-10-27 12:00 PM', text: 'Inquiry captured by sales agent' },
      { time: '2026-10-27 01:45 PM', text: 'YouTube demo videos sent to customer' }
    ]
  },
  {
    id: 5,
    customer_name: 'Rajendra Goswami',
    phone: '+91 9828977577',
    city: 'Jaisalmer',
    state: 'Rajasthan',
    requirement: '20 HP Heavy Commercial Masala Mill',
    stage: 'quotation',
    assigned_rep: 'Hemali',
    deal_value: 220000,
    created_at: '2026-10-27T13:20:00Z',
    notes: 'Big commercial plant inquiry for turmeric and coriander grinding.',
    timeline: [
      { time: '2026-10-27 01:20 PM', text: 'Inquiry received for full masala plant' },
      { time: '2026-10-27 04:30 PM', text: 'Formal GST quotation sent by Hemali' }
    ]
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
    created_at: '2026-10-27T14:10:00Z',
    notes: 'Needs GST quotation and transport delivery charges to UP.',
    timeline: [
      { time: '2026-10-27 02:10 PM', text: 'Inquiry assigned to Lata' },
      { time: '2026-10-27 03:50 PM', text: 'Customer requested freight estimate' }
    ]
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
    created_at: '2026-10-28T08:30:00Z',
    notes: 'New WhatsApp inquiry received this morning.',
    timeline: [
      { time: '2026-10-28 08:30 AM', text: 'Lead captured from WhatsApp greeting' }
    ]
  },
  {
    id: 8,
    customer_name: 'Dam Bataiga',
    phone: '+91 6207942531',
    city: 'Ranchi',
    state: 'Jharkhand',
    requirement: '20 HP Industrial Cyclone Pulverizer',
    stage: 'demo',
    assigned_rep: 'Mukeshbhai',
    deal_value: 210000,
    created_at: '2026-10-26T16:00:00Z',
    notes: 'Wants to see live continuous grinding demo over WhatsApp video call.',
    timeline: [
      { time: '2026-10-26 04:00 PM', text: 'WhatsApp inquiry received' },
      { time: '2026-10-27 11:00 AM', text: 'Video call demo scheduled' }
    ]
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
    created_at: '2026-10-26T10:00:00Z',
    notes: 'Order confirmed! Machine ready for dispatch.',
    timeline: [
      { time: '2026-10-26 10:00 AM', text: 'Direct WhatsApp inquiry' },
      { time: '2026-10-27 05:00 PM', text: 'Full payment received. Order closed.' }
    ]
  },
  {
    id: 10,
    customer_name: 'Dharmendra Sharma',
    phone: '+91 9829145622',
    city: 'Kota',
    state: 'Rajasthan',
    requirement: '15 HP Double Chamber Pulverizer',
    stage: 'quotation',
    assigned_rep: 'Priyanshi',
    deal_value: 165000,
    created_at: '2026-10-28T09:40:00Z',
    notes: 'Setting up new spice packaging business. Quotation submitted.',
    timeline: [
      { time: '2026-10-28 09:40 AM', text: 'WhatsApp inquiry assigned to Priyanshi' },
      { time: '2026-10-28 11:15 AM', text: 'Detailed quotation shared' }
    ]
  },
  {
    id: 11,
    customer_name: 'Maheshbhai Patel',
    phone: '+91 9427012345',
    city: 'Mehsana',
    state: 'Gujarat',
    requirement: '10 HP Cyclone Pulverizer with Starter',
    stage: 'contacted',
    assigned_rep: 'Ankitbhai',
    deal_value: 135000,
    created_at: '2026-10-28T10:15:00Z',
    notes: 'Comparing with local Rajkot machines. Emphasized our heavy MS plate body.',
    timeline: [
      { time: '2026-10-28 10:15 AM', text: 'Inquiry assigned to Ankitbhai' }
    ]
  },
  {
    id: 12,
    customer_name: 'Suresh Patil',
    phone: '+91 9822345678',
    city: 'Kolhapur',
    state: 'Maharashtra',
    requirement: '30 HP Industrial Spice Grinding Plant',
    stage: 'demo',
    assigned_rep: 'Mukeshbhai',
    deal_value: 380000,
    created_at: '2026-10-25T14:00:00Z',
    notes: 'Large order for commercial chilli processing plant.',
    timeline: [
      { time: '2026-10-25 02:00 PM', text: 'Website lead received' },
      { time: '2026-10-26 03:00 PM', text: 'Factory visit confirmed for next Monday' }
    ]
  }
];

export const SALES_REPS = [
  { id: 1, name: 'Anilbhai', phone: '+91 99253 43582', leads: 11, won: 3, revenue: '₹2,35,000', rate: '88%' },
  { id: 2, name: 'Ankitbhai', phone: '+91 81606 94888', leads: 6, won: 1, revenue: '₹1,35,000', rate: '75%' },
  { id: 3, name: 'Hemali', phone: '+91 76228 85040', leads: 10, won: 2, revenue: '₹2,20,000', rate: '82%' },
  { id: 4, name: 'Lata', phone: '+91 72018 90809', leads: 10, won: 1, revenue: '₹1,15,000', rate: '70%' },
  { id: 5, name: 'Mansi', phone: '+91 87809 64019', leads: 8, won: 1, revenue: '₹95,000', rate: '78%' },
  { id: 6, name: 'Mukeshbhai', phone: '+91 90545 85040', leads: 14, won: 6, revenue: '₹6,48,000', rate: '96%' },
  { id: 7, name: 'Priyanshi', phone: '+91 93282 63342', leads: 12, won: 3, revenue: '₹2,95,000', rate: '85%' },
  { id: 8, name: 'Ritu', phone: '+91 79904 71987', leads: 11, won: 2, revenue: '₹1,80,000', rate: '80%' },
  { id: 9, name: 'Siya', phone: '+91 97239 28746', leads: 7, won: 1, revenue: '₹85,000', rate: '79%' }
];

export const CLIENT_TENANTS = [
  {
    id: 'jay-ambe',
    name: 'Jay Shree Ambe Food Machinery',
    industry: 'Food Processing & Agricultural Machinery',
    city: 'Ahmedabad, Gujarat',
    repsCount: 9,
    pipelineValue: '₹20,08,000',
    status: 'Active (Enterprise Plan)',
    logo: '🏭'
  },
  {
    id: 'gujarat-agro',
    name: 'Gujarat Agro Mills & Spices',
    industry: 'Commercial Flour & Spice Milling',
    city: 'Surat, Gujarat',
    repsCount: 4,
    pipelineValue: '₹8,50,000',
    status: 'Active Trial',
    logo: '🌾'
  },
  {
    id: 'apex-eng',
    name: 'Apex Industrial Grinders',
    industry: 'Industrial Equipment Manufacturing',
    city: 'Rajkot, Gujarat',
    repsCount: 3,
    pipelineValue: '₹6,20,000',
    status: 'Demo Client',
    logo: '⚙️'
  }
];

export const MACHINE_PRESETS = [
  { name: '5 HP Mini Flour Mill (Atta Chakki)', basePrice: 58000, hp: '5 HP' },
  { name: '5 HP Heavy Duty Commercial Chakki', basePrice: 62000, hp: '5 HP' },
  { name: '7.5 HP Standard Pulverizer', basePrice: 80500, hp: '7.5 HP' },
  { name: '7.5 HP Double Chamber Pulverizer', basePrice: 72000, hp: '7.5 HP' },
  { name: '10 HP Cyclone Pulverizer with Starter', basePrice: 122880, hp: '10 HP' },
  { name: '10 HP Double Stage Pulverizer', basePrice: 122880, hp: '10 HP' },
  { name: '15 HP Double Chamber Pulverizer', basePrice: 140000, hp: '15 HP' },
  { name: '20 HP Heavy Commercial Masala Mill', basePrice: 186440, hp: '20 HP' },
  { name: '30 HP Industrial Spice Grinding Plant', basePrice: 322000, hp: '30 HP' }
];
