<div align="center">

<img src="https://raw.githubusercontent.com/Devopstrio/.github/main/assets/Browser_logo.png" height="85" alt="Devopstrio Logo" />

<h1>Artifact Management Strategy Platform</h1>

<p><strong>Enterprise Software Supply Chain: Secure, Version, Promote, and Distribute Assets</strong></p>

[![Strategy](https://img.shields.io/badge/Strategy-DevSecOps-522c72?style=for-the-badge&labelColor=000000)](https://devopstrio.co.uk/)
[![Cloud](https://img.shields.io/badge/Platform-Multi_Cloud-0078d4?style=for-the-badge&logo=microsoftazure&labelColor=000000)](/terraform)
[![Standard](https://img.shields.io/badge/Compliance-SLSA_Level_3-962964?style=for-the-badge&labelColor=000000)](/security/supply-chain-security.md)
[![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge&labelColor=000000)](https://devopstrio.co.uk/)

</div>

---

## 🏛️ Executive Summary

![Artifact Management Architecture](assets/diagram-architecture.png)

The **Artifact Management Strategy (AMS)** platform is the definitive governor of your enterprise's Software Supply Chain. It enforces a strict, SLSA-aligned lifecycle for all Containers, NuGet packages, Python wheels, and ML models. Engineers do not deploy source code; they deploy immutable, cryptographically signed, and continuously scanned artifacts curated by this platform.

### Strategic Business Outcomes
- **Zero-Trust Supply Chain**: Integrates Sigstore/Cosign. Binaries lacking cryptographically verifiable SBOMs and signatures are isolated and blocked from entering the Production Kubernetes perimeter.
- **Automated Lifecycle Promotion**: Standardizes the "Dev → QA → Stage → Prod" pipeline via a metadata-driven Promotion Engine. No direct uploads to Production registries are permitted.
- **Shadow Repo Eradication**: Consolidates untracked Maven/NPM feeds into a single governed index, protecting corporate IP and preventing left-pad incidents via Dependency proxying.
- **FinOps Retention**: Unused integration-test artifacts are aggressively purged or shifted to Cold Storage by the Retention Engine, saving hundreds of terabytes in registry costs.

---

## 🏗️ Technical Architecture Details

### 1. High-Level Architecture
```mermaid
graph TD
    CI[GitHub Actions CI/CD] --> API[Platform API]
    API --> Reg[Registry Engine (ACR/Nexus proxy)]
    API --> Scan[Scan Engine (Trivy/Grype)]
    Scan --> DB[(Metadata DB)]
    Reg --> Prom[Promotion Engine]
    Prom --> Env[Production Registry]
```

### 2. Artifact Publish Workflow
```mermaid
sequenceDiagram
    participant CI
    participant Gate as Platform API
    participant Scan as Scan Engine
    participant Registry as Dev Registry
    
    CI->>Gate: POST /artifacts/publish (Asset + SBOM)
    Gate->>Scan: Trigger asynchronous deep scan
    Scan-->>Gate: Zero critical vulnerabilities detected
    Gate->>Registry: Push immutable asset (v1.2.4-rc)
    Gate->>CI: Return 200 OK + SHA Digest
```

### 3. Promotion Lifecycle (Dev to Prod)
```mermaid
graph LR
    Dev[Dev Registry] --> |QA Approval| Stage[Stage Registry]
    Stage --> |Pen-Test Signoff| Sign[Inject Cosign Signature]
    Sign --> Prod[Production Registry]
    Prod --> AKS[Production Workload Pull]
```

### 4. Vulnerability Mapping & Scan Flow
```mermaid
graph TD
    Image[Container Image] --> Engine[Scan Engine]
    Engine --> CVE[Map CVE Databases]
    Engine --> License[Verify GPL License Rules]
    Engine --> Secret[Check Hardcoded Secrets]
    CVE --> Aggregate[Compute Risk Score]
    License --> Aggregate
    Secret --> Aggregate
    Aggregate -->|Score > 90| Block[Quarantine Artifact]
```

### 5. Automated Retention Flow
```mermaid
graph TD
    Cron[Nightly Chron Job] --> Engine[Retention Engine]
    Engine --> Policy[Query Policy: Keep Last 5 Prod, 14 Days Dev]
    Policy --> Delete[Purge 4,200 stale Dev containers]
    Policy --> Archive[Move older Prod containers to Glacier/Archive Tier]
```

### 6. Security Trust Boundary
```mermaid
graph TD
    Developer -->|OAuth2 / MFA| Portal[Next.js Portal]
    CI_Pipeline -->|SPN Token| API[FastAPI Gateway]
    API --> PrivateNet[Airgapped Subnet]
    PrivateNet --> Regis[(Managed Registries)]
```

### 7. Core Workload Topology (AKS)
```mermaid
graph TD
    subgraph Artifact_Platform
        NextJS[Portal UI]
        FastAPI[Central Backend]
        Workers[Promotion / Scan Async Workers]
    end
    FastAPI --> Workers
    Workers --> Redis[(Job Queue)]
```

### 8. SBOM Generation Lifecycle
```mermaid
graph LR
    Build[Go/Node Build] --> Syft[Syft Generation]
    Syft --> Format[CycloneDX JSON]
    Format --> API[Upload to Platform Metadata DB]
    API --> Query[Global Searchable Index]
```

---

## 🛠️ Global Platform Components

| Engine | Directory | Purpose |
|:---|:---|:---|
| **Portal UI** | `apps/portal/` | The Next.js Executive Dashboard detailing supply chain health. |
| **Platform API** | `backend/src/` | Central router governing pushes, pulls, and promotion events. |
| **Promotion Engine**| `apps/promotion-engine/`| Moves assets between logical environments contingent on approval gates. |
| **Scan Engine** | `apps/scan-engine/` | Interrogates SBOMs and containers for CVEs. |
| **Retention Engine**| `apps/retention-engine/`| Automates the cleanup of massive storage bloat. |

---

## 🚀 Environment Deployment

Provision the registry management framework.

```bash
cd bicep
az deployment sub create --name artifact-platform --location uksouth --template-file main.bicep
```

---
<sub>&copy; 2026 Devopstrio &mdash; Securing the Code that Secures the Business.</sub>
