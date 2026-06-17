-- ====================================================================
-- MUSTALI DIRS: ENTERPRISE HEALTH INFORMATION & RESOURCE MANAGEMENT SYSTEM
-- COMPLETE RELATIONAL POSTGRESQL PRODUCTION-GRADE DATABASE SCHEMA (DDL)
-- ====================================================================

-- Enable cryptographic extensions for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CENTRALIZED SYSTEM USERS TABLE (Credentials and Multi-tenant reference)
CREATE TABLE IF NOT EXISTS system_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('super_admin', 'facility_admin', 'staff', 'citizen')),
    facility_id_ref VARCHAR(50), -- Links to a facility if role is facility_admin or staff
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(128),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TENANT FACILITIES RECORDS
CREATE TABLE IF NOT EXISTS facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(100) NOT NULL DEFAULT 'Primary Hospital',
    license_no VARCHAR(100) UNIQUE NOT NULL,
    region VARCHAR(100) DEFAULT 'Oromia',
    zone VARCHAR(100) NOT NULL,
    woreda VARCHAR(100) NOT NULL,
    kebele VARCHAR(100) NOT NULL,
    gps_latitude NUMERIC(10, 6) NOT NULL,
    gps_longitude NUMERIC(10, 6) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(100),
    working_hours VARCHAR(150) DEFAULT '24/7 Service',
    patients_waiting INT DEFAULT 0,
    estimated_wait_minutes INT DEFAULT 15,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. HUMAN RESOURCE EMPLOYEES (HRMS STAFF FILES)
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(50) PRIMARY KEY, -- Unique ID (e.g. EMP-2026-X)
    facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female')),
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(100),
    address TEXT,
    profession VARCHAR(100) NOT NULL,
    education VARCHAR(150),
    department VARCHAR(100) NOT NULL,
    position_title VARCHAR(100) NOT NULL,
    salary DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    employment_status VARCHAR(20) DEFAULT 'Active' CHECK (employment_status IN ('Active', 'On Leave', 'Suspended', 'Terminated')),
    date_of_hire DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. BIOMETRIC & GEOLOCATION ATTENDANCE LOGS
CREATE TABLE IF NOT EXISTS attendance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(50) REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    check_in VARCHAR(20) NOT NULL,
    check_out VARCHAR(20),
    status VARCHAR(20) DEFAULT 'Present' CHECK (status IN ('Present', 'Late', 'Absent', 'Excused')),
    auth_method VARCHAR(30) NOT NULL CHECK (auth_method IN ('GPS', 'Fingerprint', 'Face Recognition')),
    gps_latitude NUMERIC(10, 6),
    gps_longitude NUMERIC(10, 6),
    gps_verified BOOLEAN DEFAULT FALSE,
    overtime_hours NUMERIC(4, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. THE AUTOMATED PAYROLL SLIPS TABLE
CREATE TABLE IF NOT EXISTS payroll_slips (
    id VARCHAR(50) PRIMARY KEY, -- Unique serial ID
    facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) REFERENCES employees(id) ON DELETE CASCADE,
    employee_name VARCHAR(150) NOT NULL,
    basic_salary DECIMAL(12, 2) NOT NULL,
    overtime_amount DECIMAL(12, 2) DEFAULT 0.00,
    allowances DECIMAL(12, 2) DEFAULT 0.00,
    deductions DECIMAL(12, 2) DEFAULT 0.00,
    net_salary DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Authorized' CHECK (status IN ('Draft', 'Authorized', 'Paid', 'On Hold')),
    payslip_generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. CONTINUOUS PROFESSIONAL DEVELOPMENT (CPD) AND LESSON LOGS
CREATE TABLE IF NOT EXISTS training_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(50) REFERENCES employees(id) ON DELETE CASCADE,
    course_name VARCHAR(150) NOT NULL,
    provider VARCHAR(150) NOT NULL,
    completion_date DATE NOT NULL,
    cpd_points_earned INT DEFAULT 0,
    certification_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. CLINICAL & MEDICAL EQUIPMENT REGISTER
CREATE TABLE IF NOT EXISTS equipment (
    id VARCHAR(50) PRIMARY KEY, -- Unique medical serial register code
    facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    purchase_date DATE NOT NULL,
    supplier VARCHAR(150),
    warranty_years INT DEFAULT 1,
    status VARCHAR(30) DEFAULT 'Operational' CHECK (status IN ('Operational', 'Under Maintenance', 'Needs Repair', 'Disposed'))
);

-- 8. EQUIPMENT MAINTENANCE & COST LOGS
CREATE TABLE IF NOT EXISTS equipment_maintenance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id VARCHAR(50) REFERENCES equipment(id) ON DELETE CASCADE,
    maintenance_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    cost DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    technician VARCHAR(150) NOT NULL,
    next_service_due DATE
);

-- 9. NON-MEDICAL ENTERPRISE ASSETS LOG
CREATE TABLE IF NOT EXISTS non_medical_assets (
    id VARCHAR(50) PRIMARY KEY,
    facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    registration_no VARCHAR(100) UNIQUE NOT NULL,
    location VARCHAR(150) NOT NULL,
    assigned_to VARCHAR(150),
    status VARCHAR(30) DEFAULT 'Good' CHECK (status IN ('Good', 'Faulty', 'In Service', 'Retired'))
);

-- 10. CITIZEN COMPLAINT & SUGGESTIONS DESK
CREATE TABLE IF NOT EXISTS citizen_feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
    citizen_name VARCHAR(150) NOT NULL,
    citizen_contact VARCHAR(100),
    feedback_type VARCHAR(20) NOT NULL DEFAULT 'Suggestion' CHECK (feedback_type IN ('Complaint', 'Suggestion')),
    subject VARCHAR(200) NOT NULL,
    details TEXT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    status VARCHAR(25) DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Under Review', 'Investigating', 'Resolved', 'Dismissed')),
    resolution_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- 11. VACCINE CAMPAIGNS REGISTER
CREATE TABLE IF NOT EXISTS vaccine_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    target_group VARCHAR(150) NOT NULL,
    vaccine_type VARCHAR(100) NOT NULL,
    doses_administered INT DEFAULT 0,
    doses_allocated INT DEFAULT 1000,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Planning', 'Active', 'Completed', 'Suspended')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. DISEASE OUTBREAK ALERTS AND EMERGENCY ZONES
CREATE TABLE IF NOT EXISTS outbreak_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disease_name VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'Medium' CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    reported_cases INT DEFAULT 1,
    active_cases INT DEFAULT 1,
    location_woreda VARCHAR(150) NOT NULL,
    location_kebele VARCHAR(150) NOT NULL,
    gps_latitude NUMERIC(10, 6) NOT NULL,
    gps_longitude NUMERIC(10, 6) NOT NULL,
    quarantine_radius_km NUMERIC(5, 2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Monitoring', 'Contained', 'Resolved')),
    announced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. IMMUTABLE SECURITY AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    username VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    client_ip VARCHAR(50) NOT NULL
);

-- ====================================================================
-- CLUSTERED INDEX SETTING & KEY OPTIMIZATIONS FOR REPORTING AGGREGATION
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_facilities_status ON facilities(status);
CREATE INDEX IF NOT EXISTS idx_employees_facility ON employees(facility_id);
CREATE INDEX IF NOT EXISTS idx_attendance_employee ON attendance_logs(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_feedbacks_facility ON citizen_feedbacks(facility_id);
CREATE INDEX IF NOT EXISTS idx_outbreaks_status ON outbreak_alerts(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON vaccine_campaigns(status);
