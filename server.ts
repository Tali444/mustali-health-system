/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// Seeded Data Store representing the PostgreSQL Tables
let facilities = [
  {
    id: "F-101",
    code: "ADM-G-09",
    name: "Adama Referral Hospital",
    type: "Referral General Hospital",
    licenseNo: "O-MOH-2026-993",
    region: "Oromia",
    zone: "East Shewa Zone",
    woreda: "Adama Town",
    kebele: "Kebele 04",
    gpsLatitude: 8.5414,
    gpsLongitude: 39.2689,
    phone: "+251-221-112233",
    email: "adama.referral@oromia.gov.et",
    workingHours: "24 Hours Service",
    patientsWaiting: 14,
    estimatedWaitMinutes: 45,
    status: "approved"
  },
  {
    id: "F-102",
    code: "BCH-P-33",
    name: "Bishoftu Primary Hospital",
    type: "Primary Hospital",
    licenseNo: "O-MOH-2026-482",
    region: "Oromia",
    zone: "East Shewa Zone",
    woreda: "Bishoftu Town",
    kebele: "Kebele 01",
    gpsLatitude: 8.7522,
    gpsLongitude: 38.9785,
    phone: "+251-221-445566",
    email: "bishoftu.primary@oromia.gov.et",
    workingHours: "24 Hours Service",
    patientsWaiting: 6,
    estimatedWaitMinutes: 20,
    status: "approved"
  },
  {
    id: "F-103",
    code: "GIM-HC-12",
    name: "Gimbi Health Center",
    type: "Health Center",
    licenseNo: "O-MOH-2026-661",
    region: "Oromia",
    zone: "West Wollega Zone",
    woreda: "Gimbi Aanaa",
    kebele: "Ganda 02",
    gpsLatitude: 9.1678,
    gpsLongitude: 35.8333,
    phone: "+251-577-710022",
    email: "gimbi.hc@oromia.gov.et",
    workingHours: "Day shift (08:00 AM - 05:30 PM)",
    patientsWaiting: 2,
    estimatedWaitMinutes: 10,
    status: "approved"
  },
  {
    id: "F-104",
    code: "SHA-G-20",
    name: "Shashemene General Hospital",
    type: "Referral General Hospital",
    licenseNo: "O-MOH-2026-815",
    region: "Oromia",
    zone: "West Arsi Zone",
    woreda: "Shashemene Town",
    kebele: "Kebele 08",
    gpsLatitude: 7.2014,
    gpsLongitude: 38.5985,
    phone: "+251-461-123456",
    email: "shash.general@oromia.gov.et",
    workingHours: "24 Hours Service",
    patientsWaiting: 0,
    estimatedWaitMinutes: 0,
    status: "pending"
  }
];

let employees = [
  {
    id: "EMP-2026-001",
    facilityId: "F-101",
    fullName: "Dr. Aster Lemma",
    gender: "Female",
    phone: "+251-911-223344",
    email: "aster.lemma@health.gov.et",
    address: "Adama, Kebele 02",
    profession: "Senior Surgeon",
    education: "MD from Addis Ababa University (AAU)",
    department: "Emergency Surgical Department",
    position_title: "Lead Medical Surgeon",
    salary: 28500,
    status: "Active",
    dateOfHire: "2024-03-15",
    trainingHistory: [
      { id: "T-10", name: "Trauma Life Support Certification", provider: "Black Lion MOH", date: "2025-02-12", points: 15 },
      { id: "T-11", name: "Modern Laparoscopy Module", provider: "AAU Medical", date: "2025-11-09", points: 10 }
    ],
    attendanceSummary: { present: 22, late: 1, excused: 0, overtimeHours: 12 }
  },
  {
    id: "EMP-2026-002",
    facilityId: "F-101",
    fullName: "Nurse Tolosa Kenessa",
    gender: "Male",
    phone: "+251-912-887766",
    email: "tolosa.k@health.gov.et",
    address: "Adama, Kebele 05",
    profession: "ER Head Nurse",
    education: "BSc in Nursing from Harar Health College",
    department: "Emergency Care Unit",
    position_title: "Senior Head Nurse",
    salary: 16200,
    status: "Active",
    dateOfHire: "2024-06-01",
    trainingHistory: [
      { id: "T-20", name: "Cardiopulmonary Resuscitation (CPR)", provider: "St. Paul MOH", date: "2025-05-18", points: 8 }
    ],
    attendanceSummary: { present: 24, late: 0, excused: 0, overtimeHours: 4 }
  },
  {
    id: "EMP-2026-003",
    facilityId: "F-102",
    fullName: "Dr. Chala Gemechu",
    gender: "Male",
    phone: "+251-914-554433",
    email: "chala.g@health.gov.et",
    address: "Bishoftu, Kebele 01",
    profession: "Pediatrician",
    education: "MD from Jimma University",
    department: "Pediatrics Department",
    position_title: "Chief Pediatric Advisor",
    salary: 26000,
    status: "Active",
    dateOfHire: "2025-01-10",
    trainingHistory: [
      { id: "T-30", name: "Advanced Neonatal Support", provider: "Jimma MOH Hub", date: "2025-08-20", points: 12 }
    ],
    attendanceSummary: { present: 20, late: 3, excused: 1, overtimeHours: 8 }
  }
];

let attendanceLogs = [
  {
    id: "L-901",
    employeeId: "EMP-2026-001",
    employeeName: "Dr. Aster Lemma",
    date: "2026-06-15",
    checkIn: "07:44 AM",
    checkOut: "05:12 PM",
    method: "GPS",
    gpsVerified: true,
    overtimeHours: 1.5,
    gpsLocation: "8.5415, 39.2688"
  },
  {
    id: "L-902",
    employeeId: "EMP-2026-002",
    employeeName: "Nurse Tolosa Kenessa",
    date: "2026-06-15",
    checkIn: "07:55 AM",
    checkOut: "04:30 PM",
    method: "Fingerprint",
    gpsVerified: false,
    overtimeHours: 0.0,
    gpsLocation: "System Terminal"
  }
];

let feedbacks = [
  {
    id: "FED-501",
    facilityId: "F-101",
    facilityName: "Adama Referral Hospital",
    citizenName: "Getachew Woldemariam",
    citizenContact: "+251-910-445566",
    type: "Complaint",
    subject: "Long Waiting Time in ER Unit",
    details: "I and my brother had to wait for more than 2 hours to see the emergency doctor last night during a severe fever incident.",
    rating: 2,
    status: "Submitted",
    createdAt: "2026-06-14T10:30:00.000Z",
    logs: [
      { id: "FL-1", status: "Submitted", comment: "Complaint filed into central desk feedback logs", date: "2026-06-14T10:30:00.000Z" }
    ]
  },
  {
    id: "FED-502",
    facilityId: "F-102",
    facilityName: "Bishoftu Primary Hospital",
    citizenName: "Hawi Bikila",
    citizenContact: "hawi.b@gmail.com",
    type: "Suggestion",
    subject: "Excellent Maternity Wing Services",
    details: "The midwives and clinical staff are exceptionally supportive and clean! Please add more pediatric chairs in the reception corridor.",
    rating: 5,
    status: "Under Review",
    createdAt: "2026-06-15T08:15:00.000Z",
    logs: [
      { id: "FL-2", status: "Submitted", comment: "Suggestion successfully registered", date: "2026-06-15T08:15:00.000Z" },
      { id: "FL-3", status: "Under Review", comment: "Assigned to Bishoftu head clinical registrar for audit", date: "2026-06-15T09:00:00.000Z" }
    ]
  }
];

let vaccineCampaigns = [
  {
    id: "VAC-001",
    title: "Measles Zero Dose Reach Out",
    targetGroup: "Children Under 5 Years",
    vaccineType: "Measles-Rubella (MR)",
    dosesAdministered: 4920,
    dosesAllocated: 5000,
    startDate: "2026-06-01",
    endDate: "2026-06-25",
    status: "Active"
  },
  {
    id: "VAC-002",
    title: "COVID-19 Booster Campaign",
    targetGroup: "Senior Adults & Health Staff",
    vaccineType: "Pfizer mRNA Combo",
    dosesAdministered: 1250,
    dosesAllocated: 3000,
    startDate: "2026-06-10",
    endDate: "2026-07-10",
    status: "Active"
  }
];

let outbreakAlerts = [
  {
    id: "OUT-001",
    diseaseName: "Cholera Water-Borne Incident",
    severity: "High",
    reportedCases: 14,
    activeCases: 9,
    locationWoreda: "Bishoftu Town",
    locationKebele: "Kebele 06 Waterway",
    gpsLat: 8.7510,
    gpsLng: 38.9810,
    quarantineRadiusKm: 2.5,
    status: "Active",
    announcedAt: "2026-06-12T04:00:00.000Z"
  }
];

let auditLogs = [
  {
    id: "AUD-1001",
    timestamp: new Date().toISOString(),
    user: "System Bootstrap",
    role: "System",
    action: "SYSTEM_START",
    details: "MUSTALI DIRS Enterprise node successfully mounted with encrypted storage registers.",
    ip: "127.0.0.1"
  }
];

let systemNotifications: string[] = [
  "SYSTEM_ALERT: Core network connection listening at port 3000",
  "BROADCAST: Measles campaign allocation updated for East Shewa Zone."
];

async function startServer() {
  const app = express();
  app.use(express.json());

  // API v1 Routing Endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "MUSTALI_DIRS", localTimestamp: new Date().toISOString() });
  });

  // Fetch Facilities
  app.get("/api/facilities", (req, res) => {
    res.json(facilities);
  });

  // Register New Tenant Facility and log audit
  app.post("/api/facilities/register", (req, res) => {
    const { name, code, type, licenseNo, region, zone, woreda, kebele, phone, email, lat, lng } = req.body;
    if (!name || !licenseNo || !woreda || !kebele) {
      return res.status(400).json({ error: "Missing required parameters: Facility Name, License, and Location are mandatory." });
    }

    const uniqueId = `F-${100 + facilities.length + 1}`;
    const newFacility = {
      id: uniqueId,
      code: code || `FAC-CUSTOM-${Math.floor(10 + Math.random() * 90)}`,
      name,
      type: type || "Primary Hospital",
      licenseNo,
      region: region || "Oromia",
      zone: zone || "East Shewa Zone",
      woreda,
      kebele,
      gpsLatitude: lat ? parseFloat(lat) : 8.5414,
      gpsLongitude: lng ? parseFloat(lng) : 39.2689,
      phone: phone || "+251-000-000000",
      email: email || "info@healthcenter.gov.et",
      workingHours: "24 Hours Service",
      patientsWaiting: 0,
      estimatedWaitMinutes: 0,
      status: "pending"
    };

    facilities.push(newFacility);

    // Audit logs
    auditLogs.unshift({
      id: `AUD-${1000 + auditLogs.length + 1}`,
      timestamp: new Date().toISOString(),
      user: name,
      role: "Public User",
      action: "TENANT_REGISTER",
      details: `New health facility registered: ${name} with license ${licenseNo}. Awaiting administrator sign-off.`,
      ip: req.ip || "127.0.0.1"
    });

    res.status(201).json(newFacility);
  });

  // Approve Facility
  app.post("/api/facilities/approve/:id", (req, res) => {
    const fac = facilities.find(f => f.id === req.params.id);
    if (!fac) {
      return res.status(404).json({ error: "Facility not found" });
    }
    fac.status = "approved";

    auditLogs.unshift({
      id: `AUD-${1000 + auditLogs.length + 1}`,
      timestamp: new Date().toISOString(),
      user: "Super Admin",
      role: "Super Admin",
      action: "TENANT_APPROVAL",
      details: `Successfully activated operational license and approved tenant facility: ${fac.name} (${fac.id})`,
      ip: req.ip || "127.0.0.1"
    });

    systemNotifications.unshift(`BROADCAST: APPROVED & ACTIVE: ${fac.name} is now open for public queues.`);

    res.json(fac);
  });

  // Reject Facility
  app.post("/api/facilities/reject/:id", (req, res) => {
    const fac = facilities.find(f => f.id === req.params.id);
    if (!fac) {
      return res.status(404).json({ error: "Facility not found" });
    }
    fac.status = "rejected";

    auditLogs.unshift({
      id: `AUD-${1000 + auditLogs.length + 1}`,
      timestamp: new Date().toISOString(),
      user: "Super Admin",
      role: "Super Admin",
      action: "TENANT_REJECT",
      details: `Disapproved license credentials & rejected registry entry for facility: ${fac.name}`,
      ip: req.ip || "127.0.0.1"
    });

    res.json(fac);
  });

  // Get Employees
  app.get("/api/employees", (req, res) => {
    res.json(employees);
  });

  // Create Employee
  app.post("/api/employees", (req, res) => {
    const { facilityId, fullName, gender, phone, email, address, profession, education, department, position_title, salary } = req.body;
    if (!fullName || !phone || !salary) {
      return res.status(400).json({ error: "FullName, Phone, and Base Salary are required." });
    }

    const uniqueId = `EMP-2026-${String(employees.length + 1).padStart(3, '0')}`;
    const newEmp = {
      id: uniqueId,
      facilityId: facilityId || "F-101",
      fullName,
      gender: gender || "Male",
      phone,
      email: email || "staff@health.gov.et",
      address: address || "Oromia District",
      profession: profession || "Clinical Nurse",
      education: education || "Diploma in Clinical Nursing",
      department: department || "General Outpatient Intake",
      position_title: position_title || "Junior Nurse",
      salary: parseFloat(salary),
      status: "Active",
      dateOfHire: new Date().toISOString().split('T')[0],
      trainingHistory: [],
      attendanceSummary: { present: 0, late: 0, excused: 0, overtimeHours: 0 }
    };

    employees.push(newEmp);

    auditLogs.unshift({
      id: `AUD-${1000 + auditLogs.length + 1}`,
      timestamp: new Date().toISOString(),
      user: "Facility Coordinator",
      role: "Facility Admin",
      action: "HRMS_ADD_EMPLOYEE",
      details: `Registered new medical staff employee: ${fullName} (Assigned ID: ${uniqueId})`,
      ip: req.ip || "127.0.0.1"
    });

    res.status(201).json(newEmp);
  });

  // Submit Biometric/GPS Attendance punch
  app.post("/api/attendance/punch", (req, res) => {
    const { employeeId, method, lat, lng, gpsVerified } = req.body;
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) {
      return res.status(444).json({ error: "Registered Employee ID key not found." });
    }

    const checkInTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const logId = `L-${900 + attendanceLogs.length + 1}`;
    const newLog = {
      id: logId,
      employeeId,
      employeeName: emp.fullName,
      date: new Date().toISOString().split('T')[0],
      checkIn: checkInTime,
      checkOut: "",
      method: method || "GPS",
      gpsVerified: gpsVerified || false,
      overtimeHours: method === "GPS" ? 0.0 : 1.0,
      gpsLocation: lat && lng ? `${lat}, ${lng}` : "Biometric Register"
    };

    // Update summary counters
    emp.attendanceSummary.present += 1;
    if (method === "GPS" && gpsVerified) {
      emp.attendanceSummary.overtimeHours += 0.5;
    }

    attendanceLogs.unshift(newLog);

    auditLogs.unshift({
      id: `AUD-${1000 + auditLogs.length + 1}`,
      timestamp: new Date().toISOString(),
      user: emp.fullName,
      role: "Staff",
      action: "SHIFT_ATTENDANCE_PUNCH",
      details: `Shift entry checked-in using biometric method: ${method}. (Verification Radius matched: ${gpsVerified ? 'YES' : 'NO'})`,
      ip: req.ip || "127.0.0.1"
    });

    systemNotifications.unshift(`NOTIFICATION: ${emp.fullName} punched in successfully via verified ${method}.`);

    res.status(201).json(newLog);
  });

  // Submit Feedback Complains Suggestion and logs
  app.post("/api/feedback", (req, res) => {
    const { facilityId, citizenName, citizenContact, type, subject, details, rating } = req.body;
    if (!citizenName || !details || !subject) {
      return res.status(400).json({ error: "Complaint subject, descriptive details, and citizen contact name must be specified." });
    }

    const fac = facilities.find(f => f.id === facilityId) || facilities[0];
    const newFeedback = {
      id: `FED-${500 + feedbacks.length + 1}`,
      facilityId: fac.id,
      facilityName: fac.name,
      citizenName,
      citizenContact: citizenContact || "+251-Anonymous",
      type: type || "Complaint",
      subject,
      details,
      rating: rating ? parseInt(rating) : 3,
      status: "Submitted",
      createdAt: new Date().toISOString(),
      logs: [
        { id: `FL-${Date.now()}`, status: "Submitted", comment: "Community portal submitted item, pending operational triage.", date: new Date().toISOString() }
      ]
    };

    feedbacks.unshift(newFeedback);

    auditLogs.unshift({
      id: `AUD-${1000 + auditLogs.length + 1}`,
      timestamp: new Date().toISOString(),
      user: citizenName,
      role: "Citizen",
      action: "COMMUNITY_FEEDBACK_SUBMIT",
      details: `Submitted a ${type} response file regarding: ${subject} to ${fac.name}`,
      ip: req.ip || "127.0.0.1"
    });

    systemNotifications.unshift(`SMS DISPATCH: Sent feedback reference ID ${newFeedback.id} back to citizen tracker ${newFeedback.citizenContact}.`);

    res.status(201).json(newFeedback);
  });

  // Get feedbacks
  app.get("/api/feedback", (req, res) => {
    res.json(feedbacks);
  });

  // Get campaigns
  app.get("/api/vaccines", (req, res) => {
    res.json(vaccineCampaigns);
  });

  // Administer dose
  app.post("/api/vaccines/administer", (req, res) => {
    const { campaignId, doses } = req.body;
    const camp = vaccineCampaigns.find(c => c.id === campaignId);
    if (!camp) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    const dosesToAdd = parseInt(doses) || 1;
    camp.dosesAdministered += dosesToAdd;

    auditLogs.unshift({
      id: `AUD-${1000 + auditLogs.length + 1}`,
      timestamp: new Date().toISOString(),
      user: "Vaccine Coordinator",
      role: "Staff",
      action: "VACCINE_ADMINISTER",
      details: `Administered ${dosesToAdd} patient doses under program: ${camp.title}`,
      ip: req.ip || "127.0.0.1"
    });

    res.json(camp);
  });

  // Fetch Outbreaks
  app.get("/api/outbreaks", (req, res) => {
    res.json(outbreakAlerts);
  });

  // Report Outbreak Incident
  app.post("/api/outbreaks", (req, res) => {
    const { diseaseName, severity, locationWoreda, locationKebele, gpsLat, gpsLng, cases } = req.body;
    if (!diseaseName || !locationWoreda || !locationKebele) {
      return res.status(400).json({ error: "Epidemic incident requires Outbreak Disease, Woreda, and Kebele zone." });
    }

    const newIncident = {
      id: `OUT-${String(outbreakAlerts.length + 1).padStart(3, '0')}`,
      diseaseName,
      severity: severity || "Medium",
      reportedCases: parseInt(cases) || 1,
      activeCases: parseInt(cases) || 1,
      locationWoreda,
      locationKebele,
      gpsLat: gpsLat ? parseFloat(gpsLat) : 8.5414,
      gpsLng: gpsLng ? parseFloat(gpsLng) : 39.2689,
      quarantineRadiusKm: severity === "Critical" ? 5.0 : 1.5,
      status: "Active",
      announcedAt: new Date().toISOString()
    };

    outbreakAlerts.unshift(newIncident);

    auditLogs.unshift({
      id: `AUD-${1000 + auditLogs.length + 1}`,
      timestamp: new Date().toISOString(),
      user: "Clinical Epi Responder",
      role: "Staff",
      action: "EPIDEMIC_OUTBREAK_REPORT",
      details: `Reported incident trigger. Waterway containment and emergency alerts issued for: ${diseaseName} in ${locationWoreda}.`,
      ip: req.ip || "127.0.0.1"
    });

    systemNotifications.unshift(`CRITICAL ALERT: Broadcast SMS and email alerts dispatched regarding ${diseaseName} outbreaks in zone ${locationWoreda}.`);

    res.status(201).json(newIncident);
  });

  // Fetch Audit Logs
  app.get("/api/audits", (req, res) => {
    res.json(auditLogs);
  });

  // Trigger Local Sync Queue Batch and flush
  app.post("/api/sync/flush", (req, res) => {
    const { queue } = req.body;
    if (!queue || !Array.isArray(queue)) {
      return res.status(400).json({ error: "Synchronize bundle format error." });
    }

    let itemsProcessed = 0;
    queue.forEach((item: any) => {
      // Process pending offline items based on their actions
      if (item.action === 'addFeedback') {
        const payload = item.payload;
        const fac = facilities.find(f => f.id === payload.facilityId) || facilities[0];
        feedbacks.unshift({
          id: `FED-${500 + feedbacks.length + 1}`,
          facilityId: fac.id,
          facilityName: fac.name,
          citizenName: payload.citizenName,
          citizenContact: payload.citizenContact || "+251-900-Offline",
          type: payload.type || "Complaint",
          subject: payload.subject,
          details: payload.details,
          rating: payload.rating || 4,
          status: "Submitted",
          createdAt: item.timestamp || new Date().toISOString(),
          logs: [
            { id: `FL-${Date.now()}`, status: "Submitted", comment: "Submitted in Local Offline State. Automatically synchronized.", date: new Date().toISOString() }
          ]
        });
        itemsProcessed++;
      } else if (item.action === 'punchAttendance') {
        const payload = item.payload;
        const emp = employees.find(e => e.id === payload.employeeId);
        if (emp) {
          attendanceLogs.unshift({
            id: `L-${900 + attendanceLogs.length + 1}`,
            employeeId: emp.id,
            employeeName: emp.fullName,
            date: new Date().toISOString().split('T')[0],
            checkIn: "08:00 AM (Sync)",
            checkOut: "",
            method: payload.method || "GPS",
            gpsVerified: payload.gpsVerified || false,
            overtimeHours: 0.0,
            gpsLocation: "Cached Offline Coordinate"
          });
          emp.attendanceSummary.present++;
          itemsProcessed++;
        }
      } else if (item.action === 'registerFacility') {
        const p = item.payload;
        facilities.push({
          id: `F-${100 + facilities.length + 1}`,
          code: p.code || `OFF-${Math.floor(100+Math.random()*900)}`,
          name: p.name,
          type: p.type || "Health Center",
          licenseNo: p.licenseNo,
          region: p.region || "Oromia",
          zone: p.zone || "Wollega Zone",
          woreda: p.woreda,
          kebele: p.kebele,
          gpsLatitude: p.gpsLatitude || 8.5414,
          gpsLongitude: p.gpsLongitude || 39.2689,
          phone: p.phone,
          email: p.email || "offline@oromia.gov.et",
          workingHours: "24 Hours Service",
          patientsWaiting: 0,
          estimatedWaitMinutes: 0,
          status: "pending"
        });
        itemsProcessed++;
      }
    });

    auditLogs.unshift({
      id: `AUD-${1000 + auditLogs.length + 1}`,
      timestamp: new Date().toISOString(),
      user: "Local Sync Worker",
      role: "System",
      action: "STATE_OFFLINE_SYNC",
      details: `Successfully compiled and synchronized offline queuing records: ${itemsProcessed} items flushed.`,
      ip: req.ip || "127.0.0.1"
    });

    res.json({ success: true, processed: itemsProcessed, backendCount: feedbacks.length });
  });

  // Server notifications API
  app.get("/api/notifications", (req, res) => {
    res.json({ logs: systemNotifications });
  });

  // Vite middleware mounting in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production from dist/
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MUSTALI DIRS Enterprise full-stack service listening at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start the Express enterprise server: ", err);
});
