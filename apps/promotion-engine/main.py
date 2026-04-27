import logging
import time

# Devopstrio Artifact Management Strategy
# Promotion Engine - DevSecOps Quality Gate Evaluator

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - PROMOTION-ENGINE - %(message)s")
logger = logging.getLogger(__name__)

class ArtifactPromotionEngine:
    def __init__(self):
        logger.info("Initializing Enterprise Promotion Engine...")
        self.enforced_rules = {
            "max_critical_cve": 0,
            "max_high_cve": 0,
            "require_signature_for_prod": True,
            "require_sbom": True
        }

    def evaluate_promotion(self, artifact_name: str, version: str, target_env: str, payload_meta: dict) -> dict:
        """
        Simulates evaluating an artifact against strict Supply Chain Quality Gates
        before it is allowed to be replicated into a Production Container Registry.
        """
        logger.info(f"Evaluating Promotion Request: [{artifact_name}:{version}] -> Environment: [{target_env}]")
        time.sleep(1) # Simulating database lookup for Scan Results and Sigstore queries
        
        reasons = []
        is_approved = True
        
        # 1. SBOM Check
        if self.enforced_rules["require_sbom"] and not payload_meta.get("has_sbom", False):
            reasons.append("Artifact is missing a valid CycloneDX/SPDX SBOM payload.")
            is_approved = False
            
        # 2. Vulnerability Gate
        cves = payload_meta.get("cves", {"critical": 0, "high": 0})
        if cves["critical"] > self.enforced_rules["max_critical_cve"] or cves["high"] > self.enforced_rules["max_high_cve"]:
            reasons.append(f"Security Gate Failed. Critical: {cves['critical']}, High: {cves['high']}.")
            is_approved = False
            
        # 3. Cryptographic Signature Gate (Prod Only)
        if target_env.lower() == "prod" and self.enforced_rules["require_signature_for_prod"]:
            if not payload_meta.get("is_signed", False):
                reasons.append("Production target requires cryptographic Cosign signature. Artifact is unsigned.")
                is_approved = False
                
        if not is_approved:
            logger.warning(f"Promotion REJECTED for {artifact_name}:{version}. Reasons: {reasons}")
        else:
            logger.info(f"Promotion APPROVED. Triggering backend replication to {target_env} registry.")
            
        return {
            "artifact": f"{artifact_name}:{version}",
            "target": target_env,
            "approved": is_approved,
            "reasons": reasons
        }

if __name__ == "__main__":
    logger.info("Promotion Engine Worker Standby.")
    engine = ArtifactPromotionEngine()
    
    # Simulate a Developer trying to push an unsigned image with a High CVE to Production
    mock_payload = {
        "has_sbom": True,
        "is_signed": False,
        "cves": {"critical": 0, "high": 1}
    }
    
    result = engine.evaluate_promotion("core-payment-api", "v2.1.4", "PROD", mock_payload)
    print(f"Gate Evaluation: {result}")
