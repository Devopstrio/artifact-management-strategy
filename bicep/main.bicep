// Devopstrio Artifact Management Strategy
// Platform Operations Infrastructure Bicep

targetScope = 'subscription'

param location string = 'uksouth'
param prefix string = 'artifact-ops'
param env string = 'prd'

resource rgPlatform 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${prefix}-platform-${env}'
  location: location
}

resource rgRegistries 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${prefix}-registries-${env}'
  location: location
  tags: {
    SecurityBoundary: 'Private'
  }
}

// 1. Scalable Metadata Store (PostgreSQL)
module database './modules/postgres.bicep' = {
  scope: rgPlatform
  name: 'postgresDeploy'
  params: {
    location: location
    serverName: 'psql-${prefix}-meta-${env}'
  }
}

// 2. High-Performance Container Registry (ACR) Array for Environment Segregation
module devAcr './modules/acr.bicep' = {
  scope: rgRegistries
  name: 'devAcrDeploy'
  params: {
    location: location
    registryName: 'acr${prefix}dev'
  }
}

module prodAcr './modules/acr.bicep' = {
  scope: rgRegistries
  name: 'prodAcrDeploy'
  params: {
    location: location
    registryName: 'acr${prefix}prod'
  }
}

// 3. Central Web Application Hosting for Gateway, Workers, and Portal
module appHosting './modules/aks.bicep' = {
  scope: rgPlatform
  name: 'k8sDeploy'
  params: {
    location: location
    clusterName: 'aks-${prefix}-host-${env}'
  }
}

output platformUrl string = appHosting.outputs.portalFqdn
output prodRegistryLoginServer string = prodAcr.outputs.loginServer
