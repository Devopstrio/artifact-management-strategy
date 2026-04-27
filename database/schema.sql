-- Devopstrio Artifact Management Strategy
-- Platform Central Metadata & Governance Schema
-- Target: PostgreSQL 14+

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizational Mapping
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'Developer', -- ReleaseManager, SecurityAuditor, Developer
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Core Logical Environments
CREATE TABLE IF NOT EXISTS environments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL, -- Dev, QA, Stage, Prod
    requires_approval BOOLEAN DEFAULT false,
    requires_signature BOOLEAN DEFAULT true
);

-- Registries & Repositories (Logical Grouping)
CREATE TABLE IF NOT EXISTS repositories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- Docker, Helm, NuGet, Maven, NPM
    environment_id UUID REFERENCES environments(id),
    retention_policy_days INT DEFAULT 30, -- Used by Retention Engine
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- The Artifact Definition
CREATE TABLE IF NOT EXISTS artifacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
    namespace VARCHAR(255), -- e.g., @devopstrio
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Immutable Versions of an Artifact
CREATE TABLE IF NOT EXISTS artifact_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artifact_id UUID REFERENCES artifacts(id) ON DELETE CASCADE,
    version_tag VARCHAR(100) NOT NULL, -- v1.2.3, latest, rc-1
    sha256_digest VARCHAR(64) NOT NULL, -- Cryptographic Proof
    size_bytes BIGINT,
    sbom_payload JSONB, -- Stored CycloneDX/SPDX metadata
    is_signed BOOLEAN DEFAULT false,
    is_quarantined BOOLEAN DEFAULT false,
    published_by UUID REFERENCES users(id),
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Promotion Gates (Moving an artifact from QA -> Prod)
CREATE TABLE IF NOT EXISTS promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artifact_version_id UUID REFERENCES artifact_versions(id) ON DELETE CASCADE,
    source_env_id UUID REFERENCES environments(id),
    target_env_id UUID REFERENCES environments(id),
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Approved, Rejected, Executed
    requested_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    promotion_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tracking Scan Results against a specific version payload
CREATE TABLE IF NOT EXISTS scan_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artifact_version_id UUID REFERENCES artifact_versions(id) ON DELETE CASCADE,
    scanner_name VARCHAR(100) NOT NULL, -- Trivy, Grype
    critical_cves INT DEFAULT 0,
    high_cves INT DEFAULT 0,
    scan_payload JSONB,
    passed_policy BOOLEAN DEFAULT true,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for rapid portal rendering
CREATE INDEX idx_artifacts_repo ON artifacts(repository_id);
CREATE INDEX idx_versions_artifact ON artifact_versions(artifact_id, version_tag);
CREATE INDEX idx_promotions_status ON promotions(status);
