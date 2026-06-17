import React, { useState } from 'react';
import { Language, TenantFacility, Equipment, VaccineStock, MaintenanceLog, AssignmentLog, Employee } from '../types';
import { 
  Wrench, 
  Trash2, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Download, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  RotateCcw, 
  User, 
  Activity, 
  Truck, 
  Layers, 
  ShieldAlert, 
  FileSpreadsheet, 
  CalendarDays, 
  ChevronDown, 
  ChevronUp, 
  Building2, 
  QrCode, 
  Boxes, 
  PlusCircle, 
  PackageMinus, 
  PackagePlus, 
  Info 
} from 'lucide-react';

interface MedicalEquipmentLedgerProps {
  currentLanguage: Language;
  facilities: TenantFacility[];
  equipment: Equipment[];
  vaccineStocks: VaccineStock[];
  employees: Employee[];
  activeRole: 'public' | 'staff' | 'facility_admin' | 'super_admin';
  userFacilityId?: string;
  isOffline: boolean;
  onAddEquipment: (newEq: Equipment) => void;
  onUpdateEquipment: (eqId: string, updatedFields: Partial<Equipment>) => void;
  onDeleteEquipment: (eqId: string) => void;
  onAddVaccine: (newVac: VaccineStock) => void;
  onUpdateVaccine: (vacId: string, updatedFields: Partial<VaccineStock>) => void;
  onDeleteVaccine: (vacId: string) => void;
  addNewAudit: (action: string, details: string) => void;
}

export default function MedicalEquipmentLedger({
  currentLanguage,
  facilities,
  equipment,
  vaccineStocks,
  employees,
  activeRole,
  userFacilityId,
  isOffline,
  onAddEquipment,
  onUpdateEquipment,
  onDeleteEquipment,
  onAddVaccine,
  onUpdateVaccine,
  onDeleteVaccine,
  addNewAudit
}: MedicalEquipmentLedgerProps) {

  const [activeTab, setActiveTab] = useState<'equipment' | 'vaccines'>('equipment');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Collapse / expand equipment rows
  const [expandedEqId, setExpandedEqId] = useState<string | null>(null);

  // Modal / overlay states
  const [showAddEqForm, setShowAddEqForm] = useState(false);
  const [showAddVacForm, setShowAddVacForm] = useState(false);
  
  const [selectedMaintEqId, setSelectedMaintEqId] = useState<string | null>(null);
  const [selectedAssignEqId, setSelectedAssignEqId] = useState<string | null>(null);
  const [selectedDisposeEqId, setSelectedDisposeEqId] = useState<string | null>(null);
  const [selectedStockAdjVacId, setSelectedStockAdjVacId] = useState<string | null>(null);
  const [stockAdjType, setStockAdjType] = useState<'add' | 'deduct'>('add');
  const [stockAdjQty, setStockAdjQty] = useState(1);

  // New Equipment fields
  const [newEqName, setNewEqName] = useState('');
  const [newEqCategory, setNewEqCategory] = useState('Diagnostic & Imaging');
  const [newEqSerial, setNewEqSerial] = useState('');
  const [newEqPurchaseDate, setNewEqPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEqSupplier, setNewEqSupplier] = useState('');
  const [newEqWarrantyYears, setNewEqWarrantyYears] = useState(2);
  const [newEqFacility, setNewEqFacility] = useState(userFacilityId || facilities[0]?.id || 'F-101');

  // New Vaccine stock fields
  const [newVacName, setNewVacName] = useState('');
  const [newVacBatch, setNewVacBatch] = useState('');
  const [newVacLot, setNewVacLot] = useState('');
  const [newVacExpiryDate, setNewVacExpiryDate] = useState('');
  const [newVacQty, setNewVacQty] = useState(100);
  const [newVacManufacturer, setNewVacManufacturer] = useState('');
  const [newVacThreshold, setNewVacThreshold] = useState(20);
  const [newVacFacility, setNewVacFacility] = useState(userFacilityId || facilities[0]?.id || 'F-101');

  // New Maintenance overlay parameters
  const [maintDesc, setMaintDesc] = useState('');
  const [maintCost, setMaintCost] = useState(0);
  const [maintTech, setMaintTech] = useState('');

  // New Assignment parameters
  const [assignName, setAssignName] = useState('');
  const [assignDept, setAssignDept] = useState('Outpatient Department (OPD)');

  // New Disposal details
  const [disposeReason, setDisposeReason] = useState('');
  const [disposeAuth, setDisposeAuth] = useState('');

  // Restrict facility filtering if not super admin
  const effectiveFacilityId = activeRole !== 'super_admin' ? (userFacilityId || 'all') : selectedFacility;

  // Filter Equipment items
  const filteredEquipment = equipment.filter(eq => {
    // Facility restriction check
    if (activeRole !== 'super_admin' && userFacilityId && eq.facilityId !== userFacilityId) {
      return false;
    }
    if (activeRole === 'super_admin' && selectedFacility !== 'all' && eq.facilityId !== selectedFacility) {
      return false;
    }
    
    // Status check
    if (selectedStatus !== 'all' && eq.status !== selectedStatus) {
      return false;
    }

    // Category check
    if (selectedCategory !== 'all' && eq.category !== selectedCategory) {
      return false;
    }

    // Search query check (id, name, serial number, supplier)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        eq.id.toLowerCase().includes(query) ||
        eq.name.toLowerCase().includes(query) ||
        eq.serialNumber.toLowerCase().includes(query) ||
        eq.supplier.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Filter Vaccine stocks
  const filteredVaccines = vaccineStocks.filter(vac => {
    // Facility restriction check
    if (activeRole !== 'super_admin' && userFacilityId && vac.facilityId !== userFacilityId) {
      return false;
    }
    if (activeRole === 'super_admin' && selectedFacility !== 'all' && vac.facilityId !== selectedFacility) {
      return false;
    }

    // Custom status filters
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'In Stock' && vac.status !== 'In Stock') return false;
      if (selectedStatus === 'Expired' && vac.status !== 'Expired') return false;
      if (selectedStatus === 'Low Stock' && vac.status !== 'Low Stock') return false;
      if (selectedStatus === 'Depleted' && vac.status !== 'Depleted') return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        vac.name.toLowerCase().includes(query) ||
        vac.batchNumber.toLowerCase().includes(query) ||
        vac.lotNumber.toLowerCase().includes(query) ||
        vac.manufacturer.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Export functions (renders as a perfect CSV string download)
  const handleExportData = () => {
    let csvHeader = '';
    let csvContent = '';
    const dateStr = new Date().toISOString().split('T')[0];

    if (activeTab === 'equipment') {
      csvHeader = 'Equipment ID,Facility Name,Device Name,Category,Serial Number,Purchase Date,Supplier,Warranty Years,Status\n';
      csvContent = filteredEquipment.map(eq => {
        const facName = facilities.find(f => f.id === eq.facilityId)?.name || eq.facilityId;
        return `"${eq.id}","${facName}","${eq.name}","${eq.category}","${eq.serialNumber}","${eq.purchaseDate}","${eq.supplier}",${eq.warrantyYears},"${eq.status}"`;
      }).join('\n');
    } else {
      csvHeader = 'Vaccine ID,Facility Name,Vials/Stock Name,Batch Number,Lot Number,Expiry Date,Quantity,Manufacturer,Status\n';
      csvContent = filteredVaccines.map(vac => {
        const facName = facilities.find(f => f.id === vac.facilityId)?.name || vac.facilityId;
        return `"${vac.id}","${facName}","${vac.name}","${vac.batchNumber}","${vac.lotNumber}","${vac.expiryDate}",${vac.quantity},"${vac.manufacturer}","${vac.status}"`;
      }).join('\n');
    }

    const blob = new Blob([csvHeader + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MUSTALI_DIRS_${activeTab}_report_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addNewAudit('CATALOG_EXPORTED', `User exported administrative ledger sheet details of type: ${activeTab}`);
  };

  // Add equipment submit
  const handleAddEquipmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEqName || !newEqSerial || !newEqSupplier) {
      alert('Please fill out all required fields.');
      return;
    }

    const newEq: Equipment = {
      id: `EQP-${Math.floor(1001 + Math.random() * 8999)}`,
      facilityId: newEqFacility,
      name: newEqName,
      category: newEqCategory,
      serialNumber: newEqSerial,
      purchaseDate: newEqPurchaseDate,
      supplier: newEqSupplier,
      warrantyYears: Number(newEqWarrantyYears),
      status: 'Operational',
      maintenanceHistory: [],
      assignmentHistory: []
    };

    onAddEquipment(newEq);
    addNewAudit('EQUIPMENT_REGISTERED', `Device created on registry: ${newEqName} with code ${newEq.id}`);
    
    // reset parameters
    setNewEqName('');
    setNewEqSerial('');
    setNewEqSupplier('');
    setShowAddEqForm(false);
  };

  // Add vaccine stock submit
  const handleAddVaccineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVacName || !newVacBatch || !newVacLot || !newVacExpiryDate) {
      alert('Fill out vaccine parameters securely.');
      return;
    }

    let calculatedStatus: VaccineStock['status'] = 'In Stock';
    const isExpired = new Date(newVacExpiryDate) < new Date();
    if (isExpired) {
      calculatedStatus = 'Expired';
    } else if (newVacQty === 0) {
      calculatedStatus = 'Depleted';
    } else if (newVacQty <= newVacThreshold) {
      calculatedStatus = 'Low Stock';
    }

    const newVac: VaccineStock = {
      id: `VAC-${newVacBatch.replace(/\s+/g, '-').toUpperCase()}`,
      facilityId: newVacFacility,
      name: newVacName,
      batchNumber: newVacBatch,
      lotNumber: newVacLot,
      expiryDate: newVacExpiryDate,
      quantity: Number(newVacQty),
      manufacturer: newVacManufacturer || 'Global Bio-Research',
      status: calculatedStatus,
      threshold: Number(newVacThreshold),
      lastUpdated: new Date().toISOString()
    };

    onAddVaccine(newVac);
    addNewAudit('VACCINE_BATCH_ONBOARDED', `Onboarded vaccine lot segment on cold-chain log: ${newVacName} (Batch: ${newVacBatch})`);
    
    setNewVacName('');
    setNewVacBatch('');
    setNewVacLot('');
    setNewVacExpiryDate('');
    setShowAddVacForm(false);
  };

  // Record Assignment inline form logic
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignEqId) return;

    const newLog: AssignmentLog = {
      id: `ASN-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      assignedTo: assignName || 'Unassigned Staff',
      department: assignDept
    };

    const targetEq = equipment.find(eq => eq.id === selectedAssignEqId);
    if (!targetEq) return;

    const updatedAssignment = [newLog, ...(targetEq.assignmentHistory || [])];
    onUpdateEquipment(selectedAssignEqId, {
      assignmentHistory: updatedAssignment
    });

    addNewAudit('EQUIPMENT_ASSIGNED', `Assigned equipment device ${targetEq.name} to ${assignName} (${assignDept})`);
    
    // reset
    setAssignName('');
    setSelectedAssignEqId(null);
  };

  // Record Maintenance inline logic
  const handleMaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaintEqId || !maintDesc) return;

    const newLog: MaintenanceLog = {
      id: `MNT-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      description: maintDesc,
      cost: Number(maintCost),
      technician: maintTech || 'On-Call Technician'
    };

    const targetEq = equipment.find(eq => eq.id === selectedMaintEqId);
    if (!targetEq) return;

    const updatedMaint = [newLog, ...(targetEq.maintenanceHistory || [])];
    onUpdateEquipment(selectedMaintEqId, {
      maintenanceHistory: updatedMaint,
      status: 'Operational' // Automatically restores status once checked-out
    });

    addNewAudit('EQUIPMENT_MAINTENANCE_RECORDED', `Logged bio-medical servicing for ${targetEq.name} costing ${maintCost} ETB`);
    
    // reset
    setMaintDesc('');
    setMaintCost(0);
    setMaintTech('');
    setSelectedMaintEqId(null);
  };

  // Record Disposal Logic
  const handleDisposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDisposeEqId || !disposeReason) return;

    const targetEq = equipment.find(eq => eq.id === selectedDisposeEqId);
    if (!targetEq) return;

    onUpdateEquipment(selectedDisposeEqId, {
      status: 'Disposed',
      disposalDate: new Date().toISOString().split('T')[0],
      disposalReason: disposeReason,
      disposalAuthorizedBy: disposeAuth || 'Lead Medical Officer'
    });

    addNewAudit('EQUIPMENT_DISPOSED', `Regulatory authorized disposal recorded for ${targetEq.name} (${disposeReason})`);

    setDisposeReason('');
    setDisposeAuth('');
    setSelectedDisposeEqId(null);
  };

  // Restock / Deduct Quantity Vaccine log
  const handleStockAdjSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStockAdjVacId) return;

    const targetVac = vaccineStocks.find(v => v.id === selectedStockAdjVacId);
    if (!targetVac) return;

    let nextQty = targetVac.quantity;
    if (stockAdjType === 'add') {
      nextQty += Number(stockAdjQty);
    } else {
      nextQty = Math.max(0, nextQty - Number(stockAdjQty));
    }

    let calculatedStatus: VaccineStock['status'] = 'In Stock';
    const isExpired = new Date(targetVac.expiryDate) < new Date();
    if (isExpired) {
      calculatedStatus = 'Expired';
    } else if (nextQty === 0) {
      calculatedStatus = 'Depleted';
    } else if (nextQty <= targetVac.threshold) {
      calculatedStatus = 'Low Stock';
    }

    onUpdateVaccine(selectedStockAdjVacId, {
      quantity: nextQty,
      status: calculatedStatus,
      lastUpdated: new Date().toISOString()
    });

    addNewAudit('VACCINE_QUANTITY_ADJUSTED', `Adjusted vaccine stock ${targetVac.name} by ${stockAdjType === 'add' ? '+' : '-'}${stockAdjQty}`);
    
    setSelectedStockAdjVacId(null);
    setStockAdjQty(1);
  };

  // Delete handlers
  const handleDeleteEquipmentClick = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the clinical equipment record: ${name}?`)) {
      onDeleteEquipment(id);
      addNewAudit('EQUIPMENT_DELETED', `Permanently deleted equipment document: ${id}`);
    }
  };

  const handleDeleteVaccineClick = (id: string, name: string) => {
    if (confirm(`Permanently remove ${name} from inventory registries?`)) {
      onDeleteVaccine(id);
      addNewAudit('VACCINE_DELETED', `Deleted vaccine batch document: ${id}`);
    }
  };

  // Calculated KPI statistics
  const totalEquipmentCount = equipment.length;
  const operationalCount = equipment.filter(e => e.status === 'Operational').length;
  const needRepairCount = equipment.filter(e => e.status === 'Needs Repair' || e.status === 'Under Maintenance').length;
  const disposedCount = equipment.filter(e => e.status === 'Disposed').length;

  const totalVials = vaccineStocks.reduce((sum, v) => sum + v.quantity, 0);
  const lowStockCount = vaccineStocks.filter(v => v.status === 'Low Stock' || v.status === 'Depleted').length;
  const expiredCount = vaccineStocks.filter(v => v.status === 'Expired' || new Date(v.expiryDate) < new Date()).length;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <span className="text-[10px] font-extrabold text-[#3b82f6] uppercase tracking-wider font-mono">
            {currentLanguage === 'en' ? 'Sovereign Regulatory Ledger' : 'Lejeri Regulatory Abbaa Taayitaa'}
          </span>
          <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight mt-1">
            {currentLanguage === 'en' ? 'Medical Equipment & Supply Cold Chain Ledger' : 'Galmeessa Meeshaa Hospitaalaa fi Lilmoo Cold-Chain'}
          </h2>
          <p className="text-[11px] text-slate-400 mt-1">
            {currentLanguage === 'en' ? 'Supervise medical resource allocations, warranty compliance, multi-tenant inventories, and vaccine stock security.' : 'Meeshaalee fayyaa, eegumsa, liilmoo fi yaala daddarboo qajeelchuu fi to\'achuu.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export Ledger Button */}
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-205 text-slate-700 font-bold text-xs py-2 px-3 rounded-xl transition"
            title="Export catalog list to Excel/CSV sheet"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* New Item Registers */}
          {activeRole !== 'public' && activeRole !== 'staff' && (
            <button
              onClick={() => activeTab === 'equipment' ? setShowAddEqForm(!showAddEqForm) : setShowAddVacForm(!showAddVacForm)}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-4 rounded-xl transition uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              <span>
                {activeTab === 'equipment' 
                  ? (showAddEqForm ? 'Close Onboard Form' : 'Register Equipment') 
                  : (showAddVacForm ? 'Close Onboard Form' : 'Register Vaccine Batch')
                }
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Synchronized PWA Local Cache Alert Indicator */}
      {isOffline && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl flex items-center gap-3 text-xs leading-normal">
          <AlertTriangle className="text-amber-600 w-5 h-5 shrink-0" />
          <div>
            <span className="font-extrabold uppercase tracking-wide block">Sovereign Offline Synchronizer Active</span>
            <p className="mt-0.5 text-slate-650">Network disconnection active. Updates queue inside client indexed storage buffers to prevent clinical logging delay. Links merge automatically on database reconnection.</p>
          </div>
        </div>
      )}

      {/* Tabs Switcher and Analytics Overview Panels */}
      <div className="border-b border-slate-200 flex justify-between items-center bg-slate-50/50 p-1 rounded-xl">
        <div className="flex gap-2">
          <button
            onClick={() => { setActiveTab('equipment'); setSearchQuery(''); }}
            className={`py-2 px-4 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'equipment' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>{currentLanguage === 'en' ? 'Clinical Device Assets' : 'Ufanni Meeshaa Yaalaa'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('vaccines'); setSearchQuery(''); }}
            className={`py-2 px-4 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'vaccines' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>{currentLanguage === 'en' ? 'Vaccine Cold-Chain Stock' : 'Lilmoota Talaallii'}</span>
          </button>
        </div>

        <div className="text-[10px] text-slate-400 font-mono pr-2">
          {activeTab === 'equipment' ? `${filteredEquipment.length} units listed` : `${filteredVaccines.length} batches listed`}
        </div>
      </div>

      {/* Tab Specific KPI Cards */}
      {activeTab === 'equipment' ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4.5 rounded-2xl border border-slate-200">
            <span className="block text-[8.5px] font-mono tracking-widest text-slate-400 uppercase">Registered Assets</span>
            <span className="text-xl font-black text-slate-800 block mt-1">{totalEquipmentCount} Units</span>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-slate-200">
            <span className="block text-[8.5px] font-mono tracking-widest text-[#10b981] uppercase">Operational Status</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-slate-800">{operationalCount}</span>
              <span className="text-[10px] text-slate-400">({totalEquipmentCount > 0 ? Math.round((operationalCount/totalEquipmentCount)*100) : 0}%)</span>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-slate-200">
            <span className="block text-[8.5px] font-mono tracking-widest text-amber-500 uppercase">Maintenance Required</span>
            <span className="text-xl font-black text-slate-800 block mt-1">{needRepairCount} Units</span>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-slate-200">
            <span className="block text-[8.5px] font-mono tracking-widest text-slate-500 uppercase">Purged / Disposed Portfolio</span>
            <span className="text-xl font-black text-slate-800 block mt-1">{disposedCount} Retired</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4.5 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="block text-[8.5px] font-mono tracking-widest text-slate-400 uppercase">Total Active Vials</span>
              <span className="text-xl font-black text-slate-800 block mt-1">{totalVials.toLocaleString()} doses</span>
            </div>
            <Boxes className="text-slate-300 w-8 h-8" />
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="block text-[8.5px] font-mono tracking-widest text-rose-500 uppercase">Critical Depleted/Low Warnings</span>
              <span className="text-xl font-black text-slate-800 block mt-1">{lowStockCount} Batches</span>
            </div>
            <AlertTriangle className="text-rose-400 w-8 h-8" />
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="block text-[8.5px] font-mono tracking-widest text-amber-500 uppercase">Expired Batches (Needs Flushing)</span>
              <span className="text-xl font-black text-slate-800 block mt-1">{expiredCount} Units</span>
            </div>
            <CalendarDays className="text-amber-400 w-8 h-8" />
          </div>
        </div>
      )}

      {/* Register Forms Container */}
      {showAddEqForm && activeTab === 'equipment' && (
        <form onSubmit={handleAddEquipmentSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 animate-fade-in text-xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <h3 className="font-extrabold text-slate-900 uppercase tracking-wider">Onboard Healthcare Clinical Asset</h3>
            <span className="text-[10px] text-slate-400 font-mono">REGULATORY SUBMISSION NODE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Equipment / Device Name *</label>
              <input
                type="text"
                required
                placeholder="Mindray Premium Ultrasound Spec-8"
                value={newEqName}
                onChange={(e) => setNewEqName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Category Classification</label>
              <select
                value={newEqCategory}
                onChange={(e) => setNewEqCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              >
                <option value="Diagnostic & Imaging">Diagnostic & Imaging</option>
                <option value="Surgical / Operative Area">Surgical / Operative Area</option>
                <option value="ICU & Life Support">ICU & Life Support</option>
                <option value="Laboratory Analytical Spec">Laboratory Analytical Spec</option>
                <option value="Sterilization & Autoclave">Sterilization & Autoclave</option>
                <option value="Dental Suite Care">Dental Suite Care</option>
                <option value="Therapeutic & Cardiovascular">Therapeutic & Cardiovascular</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Manufacturer Serial Number (SN) *</label>
              <input
                type="text"
                required
                placeholder="SN-MED-993-801X"
                value={newEqSerial}
                onChange={(e) => setNewEqSerial(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Purchase Booking Date</label>
              <input
                type="date"
                value={newEqPurchaseDate}
                onChange={(e) => setNewEqPurchaseDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Supplier Node Name *</label>
              <input
                type="text"
                required
                placeholder="Ethiopian Pharmaceuticals Supply Agency"
                value={newEqSupplier}
                onChange={(e) => setNewEqSupplier(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Warranty Duration (Years)</label>
              <input
                type="number"
                min="0"
                max="10"
                value={newEqWarrantyYears}
                onChange={(e) => setNewEqWarrantyYears(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Assigned Facility Node</label>
              <select
                disabled={activeRole !== 'super_admin'}
                value={newEqFacility}
                onChange={(e) => setNewEqFacility(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              >
                {facilities.map(fac => (
                  <option key={fac.id} value={fac.id}>{fac.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition shadow-md uppercase tracking-wider"
          >
            Authorize Regulatory Registration Clearance
          </button>
        </form>
      )}

      {showAddVacForm && activeTab === 'vaccines' && (
        <form onSubmit={handleAddVaccineSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 animate-fade-in text-xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <h3 className="font-extrabold text-slate-900 uppercase tracking-wider">Sovereign Vaccine Lot Onboarding</h3>
            <span className="text-[10px] text-slate-400 font-mono">COLD-CHAIN COMPLIANT BATCH STAMP</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Vaccine Name / Disease Type *</label>
              <input
                type="text"
                required
                placeholder="Pentavalent DTP-HepB-Hib Vaccine"
                value={newVacName}
                onChange={(e) => setNewVacName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Batch Code Identifier *</label>
              <input
                type="text"
                required
                placeholder="PENTA-2026-X4"
                value={newVacBatch}
                onChange={(e) => setNewVacBatch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Lot Serial Reference *</label>
              <input
                type="text"
                required
                placeholder="LOT-2291-C"
                value={newVacLot}
                onChange={(e) => setNewVacLot(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Expiry Date Threshold *</label>
              <input
                type="date"
                required
                value={newVacExpiryDate}
                onChange={(e) => setNewVacExpiryDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Vial Inventory Quantity *</label>
              <input
                type="number"
                required
                min="0"
                value={newVacQty}
                onChange={(e) => setNewVacQty(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Low-Stock Alert Trigger Limit</label>
              <input
                type="number"
                min="5"
                value={newVacThreshold}
                onChange={(e) => setNewVacThreshold(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Storage Node Facility</label>
              <select
                disabled={activeRole !== 'super_admin'}
                value={newVacFacility}
                onChange={(e) => setNewVacFacility(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              >
                {facilities.map(fac => (
                  <option key={fac.id} value={fac.id}>{fac.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Global Manufacturer Profile</label>
            <input
              type="text"
              placeholder="Serum Institute of India / WHO Certified Lab"
              value={newVacManufacturer}
              onChange={(e) => setNewVacManufacturer(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition shadow-md uppercase tracking-wider"
          >
            Issue Compliant Vaccine Stock Voucher
          </button>
        </form>
      )}

      {/* Filter and Query Board */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center gap-3 justify-between shadow-2xs">
        
        {/* Real-time search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={
              activeTab === 'equipment' 
                ? 'Search equipment directory...' 
                : 'Search vaccine inventory catalog...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none"
          />
        </div>

        {/* Modular dropdown filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto md:justify-end text-xs">
          
          {/* Facility Enclave Switch (Only Super Admin can select different enclaves) */}
          {activeRole === 'super_admin' && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-bold text-[10px] uppercase">Enclave:</span>
              <select
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="bg-slate-50 border border-slate-150 rounded-lg px-2.5 py-1.5 focus:outline-none text-[11px]"
              >
                <option value="all">Sovereign Directory All</option>
                {facilities.map(fac => (
                  <option key={fac.id} value={fac.id}>{fac.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-bold text-[10px] uppercase">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-150 rounded-lg px-2.5 py-1.5 focus:outline-none text-[11px]"
            >
              <option value="all">All States</option>
              {activeTab === 'equipment' ? (
                <>
                  <option value="Operational">Operational</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Needs Repair">Needs Repair</option>
                  <option value="Disposed">Disposed Profile</option>
                </>
              ) : (
                <>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Expired">Expired</option>
                  <option value="Depleted">Depleted</option>
                </>
              )}
            </select>
          </div>

          {/* Category Dropdown (only for Equipment tab) */}
          {activeTab === 'equipment' && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-bold text-[10px] uppercase">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-150 rounded-lg px-2.5 py-1.5 focus:outline-none text-[11px]"
              >
                <option value="all">All Categories</option>
                <option value="Diagnostic & Imaging">Diagnostic & Imaging</option>
                <option value="Surgical / Operative Area">Surgical / Operative Area</option>
                <option value="ICU & Life Support">ICU & Life Support</option>
                <option value="Laboratory Analytical Spec">Laboratory Analytical Spec</option>
                <option value="Sterilization & Autoclave">Sterilization & Autoclave</option>
                <option value="Dental Suite Care">Dental Suite Care</option>
                <option value="Therapeutic & Cardiovascular">Therapeutic & Cardiovascular</option>
              </select>
            </div>
          )}

          {/* Reset Filters */}
          {(selectedFacility !== 'all' || selectedStatus !== 'all' || selectedCategory !== 'all' || searchQuery !== '') && (
            <button
              onClick={() => {
                setSelectedFacility('all');
                setSelectedStatus('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-slate-500 hover:text-slate-900 font-bold flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

        </div>
      </div>

      {/* Main Tab Panels */}
      {activeTab === 'equipment' ? (
        
        /* Grid Display of Equipment Cards */
        <div className="grid grid-cols-1 gap-4">
          {filteredEquipment.length === 0 ? (
            <div className="bg-white p-12 border rounded-3xl text-center space-y-2">
              <Wrench className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-bold">No clinical devices found matching the query.</p>
              <span className="text-[10px] text-slate-400 block">Expand filter parameters or register a new medical device node.</span>
            </div>
          ) : (
            filteredEquipment.map(eq => {
              const facProfile = facilities.find(f => f.id === eq.facilityId);
              const isExpanded = expandedEqId === eq.id;
              
              // Estimate warranty validity
              const purchaseYear = new Date(eq.purchaseDate).getFullYear();
              const currentYear = new Date().getFullYear();
              const yearsSincePurchase = currentYear - purchaseYear;
              const isWarrantyValid = yearsSincePurchase < eq.warrantyYears;

              return (
                <div key={eq.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-slate-350 transition shadow-2xs">
                  
                  {/* Top Header Grid */}
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-50/20 bg-slate-50/20">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-50 border border-blue-105 text-[10px] text-blue-700 font-mono font-bold px-2 py-0.5 rounded-lg uppercase">
                          {eq.id}
                        </span>
                        <span className="text-[10.5px] font-mono text-slate-400 font-semibold uppercase">
                          SN: {eq.serialNumber}
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-900 mt-2 flex items-center gap-2">
                        {eq.name}
                        {eq.status === 'Disposed' && (
                          <span className="text-[9px] bg-rose-100 text-rose-800 font-black px-1.5 py-0.5 rounded uppercase">DISPOSED</span>
                        )}
                      </h3>
                      <div className="text-[10.5px] text-slate-500 mt-1 flex items-center gap-1.5">
                        <span className="font-semibold">{eq.category}</span>
                        <span>•</span>
                        <span className="font-medium text-slate-400">Enclave: {facProfile ? facProfile.name : eq.facilityId}</span>
                      </div>
                    </div>

                    {/* Right statuses and indicators */}
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl border ${
                        eq.status === 'Operational' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
                        eq.status === 'Under Maintenance' ? 'bg-indigo-50 border-indigo-100 text-indigo-800' :
                        eq.status === 'Needs Repair' ? 'bg-amber-50 border-amber-100 text-amber-800' :
                        'bg-slate-100 border-slate-200 text-slate-600'
                      }`}>
                        {eq.status.toUpperCase()}
                      </span>

                      {/* Interactive toggle dropdown */}
                      <button
                        onClick={() => setExpandedEqId(isExpanded ? null : eq.id)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg transition"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Summary Parameters */}
                  <div className="px-5 py-4.5 grid grid-cols-2 lg:grid-cols-4 gap-4 text-[11px] border-b border-slate-100">
                    <div>
                      <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold leading-normal">Supplier Node</span>
                      <span className="text-slate-700 font-semibold">{eq.supplier}</span>
                    </div>

                    <div>
                      <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold leading-normal">Purchase Date</span>
                      <span className="text-slate-700 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {eq.purchaseDate}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold leading-normal">Warranty Integrity</span>
                      <span className={`font-semibold ${isWarrantyValid ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {eq.warrantyYears} Years ({isWarrantyValid ? 'ACTIVE' : 'EXPIRED'})
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold leading-normal">Historical Logs</span>
                      <span className="text-indigo-600 font-mono font-bold">
                        {eq.maintenanceHistory ? eq.maintenanceHistory.length : 0} Maint • {eq.assignmentHistory ? eq.assignmentHistory.length : 0} Assign
                      </span>
                    </div>
                  </div>

                  {/* Expanded Maintenance / Assignment Log area */}
                  {isExpanded && (
                    <div className="bg-slate-50/50 p-5 divide-y divide-slate-100 space-y-4 text-xs animate-fade-in">
                      
                      {/* Disposal information banner (if disposed) */}
                      {eq.status === 'Disposed' && eq.disposalDate && (
                        <div className="bg-rose-50 border border-rose-100 text-rose-900 p-4 rounded-xl flex items-center gap-3 mb-4 leading-normal">
                          <Trash2 className="w-5 h-5 text-rose-600 shrink-0" />
                          <div>
                            <span className="font-extrabold uppercase">DECOMMISSIONED ASSET LEDGER RECORD</span>
                            <span className="block mt-0.5 text-slate-650">Retired from regulatory roster on <b>{eq.disposalDate}</b>.</span>
                            <span className="block text-[10.5px] text-slate-500 mt-1">Reason: <i>{eq.disposalReason}</i> • Approved by: {eq.disposalAuthorizedBy}</span>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
                        
                        {/* Maintenance Logs */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                              <Activity className="w-4 h-4 text-indigo-550" />
                              Bio-Medical Servicing & Maintenance History
                            </h4>
                            {activeRole !== 'public' && eq.status !== 'Disposed' && (
                              <button
                                onClick={() => setSelectedMaintEqId(eq.id)}
                                className="text-blue-600 hover:text-blue-800 font-extrabold text-[10px] flex items-center gap-0.5 uppercase tracking-wide"
                              >
                                <PlusCircle className="w-3.5 h-3.5" /> Book Service
                              </button>
                            )}
                          </div>

                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {!eq.maintenanceHistory || eq.maintenanceHistory.length === 0 ? (
                              <div className="text-[10.5px] italic text-slate-400 text-center py-4">No bio-medical maintenance certificates filed.</div>
                            ) : (
                              eq.maintenanceHistory.map(m => (
                                <div key={m.id} className="bg-white p-3 rounded-xl border border-slate-100 relative">
                                  <div className="flex justify-between text-[11px] font-bold">
                                    <span className="text-slate-800">{m.description}</span>
                                    <span className="text-indigo-600 font-mono text-[9px]">{m.cost} ETB</span>
                                  </div>
                                  <div className="text-[9.5px] text-slate-400 mt-1 flex justify-between">
                                    <span>Cert Technical In-Charge: {m.technician}</span>
                                    <span>Date: {m.date}</span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Assignment Logs */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                              <User className="w-4 h-4 text-[#10b981]" />
                              Custody Registry & Staff Assignment History
                            </h4>
                            {activeRole !== 'public' && eq.status !== 'Disposed' && (
                              <button
                                onClick={() => setSelectedAssignEqId(eq.id)}
                                className="text-blue-600 hover:text-blue-800 font-extrabold text-[10px] flex items-center gap-0.5 uppercase tracking-wide"
                              >
                                <PlusCircle className="w-3.5 h-3.5" /> Assign Staff
                              </button>
                            )}
                          </div>

                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {!eq.assignmentHistory || eq.assignmentHistory.length === 0 ? (
                              <div className="text-[10.5px] italic text-slate-400 text-center py-4">No custody assignments logged.</div>
                            ) : (
                              eq.assignmentHistory.map(a => (
                                <div key={a.id} className="bg-white p-3 rounded-xl border border-slate-100">
                                  <div className="flex justify-between text-[11px] font-bold">
                                    <span className="text-slate-800">{a.assignedTo}</span>
                                    <span className="text-slate-400 font-mono text-[9px]">{a.date}</span>
                                  </div>
                                  <div className="text-[9.5px] text-slate-500 mt-1">Department: {a.department}</div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                      </div>

                      {/* Controls Area for Decommission & Purging */}
                      {activeRole !== 'public' && (
                        <div className="pt-4 flex flex-wrap gap-2.5 justify-between items-center text-[10.5px]">
                          <div className="flex gap-2">
                            {eq.status !== 'Disposed' && (
                              <>
                                <button
                                  onClick={() => setSelectedDisposeEqId(eq.id)}
                                  className="text-rose-600 hover:text-rose-800 font-bold border border-rose-100 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition uppercase tracking-wide"
                                >
                                  Decommission & Retire Asset
                                </button>
                                
                                {eq.status === 'Operational' ? (
                                  <button
                                    onClick={() => onUpdateEquipment(eq.id, { status: 'Needs Repair' })}
                                    className="text-amber-700 hover:text-amber-900 border border-amber-100 hover:bg-amber-50 px-3 py-1.5 rounded-xl transition uppercase tracking-wide"
                                  >
                                    Flag: Needs Servicing
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => onUpdateEquipment(eq.id, { status: 'Operational' })}
                                    className="text-emerald-700 hover:text-emerald-900 border border-emerald-100 hover:bg-emerald-50 px-3 py-1.5 rounded-xl transition uppercase tracking-wide"
                                  >
                                    Checkout: Mark Ready
                                  </button>
                                )}
                              </>
                            )}
                          </div>

                          {activeRole === 'super_admin' && (
                            <button
                              onClick={() => handleDeleteEquipmentClick(eq.id, eq.name)}
                              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition"
                              title="Erase registry ledger completely"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      ) : (

        /* Stocks & Lot Coldchain layout */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVaccines.length === 0 ? (
            <div className="col-span-1 md:col-span-2 bg-white p-12 border rounded-3xl text-center space-y-2">
              <Boxes className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-bold">No active vaccine lots found matching the parameters.</p>
              <span className="text-[10px] text-slate-400 block font-medium">Reconfigure filters or add a custom vaccine lot batch in cold chain storage.</span>
            </div>
          ) : (
            filteredVaccines.map(vac => {
              const facProfile = facilities.find(f => f.id === vac.facilityId);
              
              // Expiry calculations
              const isExpired = new Date(vac.expiryDate) < new Date();
              const diffTime = new Date(vac.expiryDate).getTime() - new Date().getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              const isNearExpiry = diffDays > 0 && diffDays <= 90;

              return (
                <div key={vac.id} className="bg-white border border-slate-205 rounded-3xl p-5 hover:border-slate-350 transition flex flex-col justify-between shadow-2xs space-y-3">
                  
                  <div>
                    <div className="flex justify-between items-start border-b border-indigo-50/20 pb-3">
                      <div>
                        <span className="text-[9px] font-mono bg-blue-50 border border-blue-105 text-blue-700 font-bold px-2 py-0.5 rounded uppercase">
                          Batch: {vac.batchNumber}
                        </span>
                        <h4 className="text-xs font-black text-slate-800 mt-1.5 leading-snug">{vac.name}</h4>
                        <span className="text-[9.5px] font-mono text-slate-400 block mt-0.5">Lot Code: {vac.lotNumber}</span>
                      </div>

                      <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                        isExpired ? 'bg-rose-50 border-rose-100 text-rose-800' :
                        vac.quantity === 0 ? 'bg-slate-50 border-slate-150 text-slate-500' :
                        vac.quantity <= vac.threshold ? 'bg-amber-50 border-amber-100 text-amber-800' :
                        'bg-emerald-50 border-emerald-100 text-emerald-800'
                      }`}>
                        {isExpired ? 'Expired' : (vac.quantity === 0 ? 'Depleted' : (vac.quantity <= vac.threshold ? 'Low Stock' : 'In Stock'))}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center text-xs">
                      <div>
                        <span className="block text-[8px] font-mono uppercase text-slate-400">Total Vials</span>
                        <span className="font-extrabold text-slate-800 text-[12px]">{vac.quantity.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] font-mono uppercase text-slate-400">Low Trigger Limit</span>
                        <span className="font-semibold text-slate-500 text-[10.5px]">{vac.threshold} units</span>
                      </div>
                    </div>

                    <div className="mt-3.5 space-y-1.5 text-[10.5px] text-slate-500">
                      <div className="flex items-center justify-between">
                        <span>Manufacturer Profile:</span>
                        <span className="font-semibold text-slate-700">{vac.manufacturer}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Registered Storage:</span>
                        <span className="font-semibold text-slate-700">{facProfile ? facProfile.name : vac.facilityId}</span>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> Expiry Date:
                        </span>
                        <span className={`font-mono font-bold ${
                          isExpired ? 'text-rose-600' : isNearExpiry ? 'text-amber-500' : 'text-slate-600'
                        }`}>
                          {vac.expiryDate} {isNearExpiry && `(${diffDays} days left)`} {isExpired && '(EXPIRED)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stock Management Actions Overlay */}
                  {activeRole !== 'public' && (
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedStockAdjVacId(vac.id);
                            setStockAdjType('add');
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold p-1.5 rounded-lg transition"
                          title="Restock delivery"
                        >
                          <PackagePlus className="w-4 h-4 text-emerald-600" />
                        </button>
                        
                        <button
                          disabled={vac.quantity === 0}
                          onClick={() => {
                            setSelectedStockAdjVacId(vac.id);
                            setStockAdjType('deduct');
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold p-1.5 rounded-lg transition"
                          title="Log dosage use"
                        >
                          <PackageMinus className="w-4 h-4 text-rose-500" />
                        </button>
                      </div>

                      {activeRole === 'super_admin' && (
                        <button
                          onClick={() => handleDeleteVaccineClick(vac.id, vac.name)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition"
                          title="Delete vaccine node ledger"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>
      )}

      {/* DIALOGS / SLIDEOVER MODAL SIMULATORS */}

      {/* 1. Maintenance Ticket Dialogue */}
      {selectedMaintEqId && (
        <div className="fixed inset-0 bg-slate-900/50 flex justify-center items-center z-50 p-4 font-sans backdrop-blur-xs">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full border text-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 uppercase tracking-wider">Record Bio-Medical Maintenance</h3>
            <p className="text-[10.5px] text-slate-405">Configure service costs, replacement parts, and technical clearance certifications.</p>
            
            <form onSubmit={handleMaintSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Service Job Description *</label>
                <input
                  type="text"
                  required
                  placeholder="Replaced damaged laser diode on Spec Scanner"
                  value={maintDesc}
                  onChange={(e) => setMaintDesc(e.target.value)}
                  className="w-full bg-slate-50 border rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Maintenance Cost (ETB)</label>
                  <input
                    type="number"
                    min="0"
                    value={maintCost}
                    onChange={(e) => setMaintCost(Number(e.target.value))}
                    className="w-full bg-slate-50 border rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Lead Technician *</label>
                  <input
                    type="text"
                    required
                    placeholder="Eng. Kenesa Abdi"
                    value={maintTech}
                    onChange={(e) => setMaintTech(e.target.value)}
                    className="w-full bg-slate-50 border rounded-lg px-3 py-2 focus:outline-none font-sans"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold flex-1 py-2 rounded-xl transition uppercase tracking-wide cursor-pointer"
                >
                  Verify Service
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMaintEqId(null)}
                  className="bg-slate-105 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl transition uppercase tracking-wide"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Assignment Ticket Dialogue */}
      {selectedAssignEqId && (
        <div className="fixed inset-0 bg-slate-900/50 flex justify-center items-center z-50 p-4 font-sans backdrop-blur-xs">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full border text-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 uppercase tracking-wider">Device Custody Assignment</h3>
            <p className="text-[10.5px] text-slate-405">Authorize biological device custody transfer to a registered practitioner or ward.</p>
            
            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Assignee Full Name *</label>
                <select
                  required
                  value={assignName}
                  onChange={(e) => setAssignName(e.target.value)}
                  className="w-full bg-slate-50 border rounded-lg px-3 py-2.5 focus:outline-none"
                >
                  <option value="">-- Choose Staff Personnel --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.fullName}>{emp.fullName} ({emp.position || emp.profession})</option>
                  ))}
                  <option value="Dr. Merga Kenesa">Dr. Merga Kenesa (Surgical Chief)</option>
                  <option value="Sister Lensa Kebede">Sister Lensa Kebede (Emergency Ward Sister)</option>
                  <option value="Biomedical Dept Spare">Biomedical Dept Storage Enclosure</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Assigned Department Ward</label>
                <input
                  type="text"
                  required
                  value={assignDept}
                  onChange={(e) => setAssignDept(e.target.value)}
                  className="w-full bg-slate-50 border rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="bg-emerald-650 hover:bg-emerald-700 text-white font-bold flex-1 py-2 rounded-xl transition uppercase tracking-wide cursor-pointer"
                >
                  Approve Custody
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAssignEqId(null)}
                  className="bg-slate-105 hover:bg-slate-200 text-slate-705 font-bold px-4 py-2 rounded-xl transition uppercase tracking-wide"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Disposal Decommission Dialogue */}
      {selectedDisposeEqId && (
        <div className="fixed inset-0 bg-slate-900/50 flex justify-center items-center z-50 p-4 font-sans backdrop-blur-xs">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full border text-xs space-y-4">
            <h3 className="font-extrabold text-rose-800 uppercase tracking-wider">Authorize Asset Disposal</h3>
            <p className="text-[10.5px] text-slate-405">Purge operational status permanently and log environmental regulatory compliance guidelines.</p>
            
            <form onSubmit={handleDisposalSubmit} className="space-y-4">
              <div>
                <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Disposal Reason Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Irreparable core sensor degradation. Safe localized recycling approved."
                  value={disposeReason}
                  onChange={(e) => setDisposeReason(e.target.value)}
                  className="w-full bg-slate-50 border rounded-lg p-2.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Authorized Certifier Node</label>
                <input
                  type="text"
                  placeholder="Dr. Merga Kenesa (Lead Clinical Admin)"
                  value={disposeAuth}
                  onChange={(e) => setDisposeAuth(e.target.value)}
                  className="w-full bg-slate-50 border rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold flex-1 py-2 rounded-xl transition uppercase tracking-wide"
                >
                  Conclude Disposal
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDisposeEqId(null)}
                  className="bg-slate-105 hover:bg-slate-200 text-slate-705 font-bold px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Stock Adjustment Quantity Dialogue */}
      {selectedStockAdjVacId && (
        <div className="fixed inset-0 bg-slate-900/50 flex justify-center items-center z-50 p-4 font-sans backdrop-blur-xs">
          <div className="bg-white p-6 rounded-3xl max-w-xs w-full border text-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 uppercase tracking-wider">
              {stockAdjType === 'add' ? 'Restock Cold Chain Lot' : 'Deduct Administered Doses'}
            </h3>
            <p className="text-[10.5px] text-slate-405">Update physical inventory counts securely inside storage modules.</p>
            
            <form onSubmit={handleStockAdjSubmit} className="space-y-4">
              <div>
                <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Dosage Vial Amount *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={stockAdjQty}
                  onChange={(e) => setStockAdjQty(Number(e.target.value))}
                  className="w-full bg-slate-50 border rounded-lg px-3 py-2 focus:outline-none text-center font-bold text-slate-800"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className={`font-bold flex-1 py-2 rounded-xl transition uppercase tracking-wide ${
                    stockAdjType === 'add' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-rose-655 hover:bg-rose-700 text-white'
                  }`}
                >
                  Record Adjustment
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStockAdjVacId(null)}
                  className="bg-slate-105 hover:bg-slate-200 text-slate-705 font-bold px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
