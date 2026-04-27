import React from 'react';

// Devopstrio Artifact Management Strategy
// Executive Supply Chain Dashboard

const ComponentStatus = ({ name, status, metrics }: { name: string, status: 'Healthy' | 'Degraded', metrics: string }) => (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full shadow-md ${status === 'Healthy' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-amber-500 shadow-amber-500/50'}`}></div>
            <span className="font-bold text-slate-800 text-sm">{name}</span>
        </div>
        <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-1 rounded border border-slate-200">
            {metrics}
        </span>
    </div>
);

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-indigo-500/30">
            {/* Nav Header */}
            <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
                <div className="max-w-screen-2xl mx-auto px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-700 to-indigo-900 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-900/20">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 leading-tight">Software Supply Chain Hub</h1>
                        </div>
                    </div>
                    <nav className="flex gap-6 text-sm font-semibold">
                        <a href="#" className="text-indigo-700 border-b-2 border-indigo-700 pb-5 pt-5">Global Posture</a>
                        <a href="#" className="text-slate-500 hover:text-slate-800 transition-colors pt-5 pb-5">Promotion Workflows</a>
                        <a href="#" className="text-slate-500 hover:text-slate-800 transition-colors pt-5 pb-5">Vulnerability Index</a>
                        <a href="#" className="text-slate-500 hover:text-slate-800 transition-colors pt-5 pb-5">Retention Rules</a>
                    </nav>
                </div>
            </header>

            <main className="max-w-screen-2xl mx-auto px-8 py-8">

                {/* Aggregated Supply Chain Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { title: 'Total Repositories', value: '184', trend: 'Docker, Helm, NPM', color: 'indigo' },
                        { title: 'Active Vulnerabilities', value: '12', sub: '(Critical & High)', trend: '-4 this week', color: 'rose' },
                        { title: 'SLSA L3 Compliant', value: '94%', sub: 'Signatures & SBOMs', trend: 'Target: 100%', color: 'emerald' },
                        { title: 'Stale Storage Purged', value: '14.2 TB', sub: 'Last 30 Days', trend: 'Auto-Retention Engine', color: 'blue' }
                    ].map((kpi, idx) => (
                        <div key={idx} className={`bg-white border-l-4 border-${kpi.color}-500 p-6 rounded-r-xl border-y border-r border-slate-200 shadow-sm relative overflow-hidden group`}>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{kpi.title}</h4>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className={`text-4xl font-black text-slate-800`}>{kpi.value}</span>
                                {kpi.sub && <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded">{kpi.sub}</span>}
                            </div>
                            <p className="text-xs text-slate-400 mt-2">{kpi.trend}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                    {/* Promotion Center */}
                    <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                            <h2 className="text-lg font-bold text-slate-900">Active Promotion Requests (Quality Gates)</h2>
                            <button className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded border border-indigo-200 hover:bg-indigo-100 transition-colors">
                                View Full Backlog
                            </button>
                        </div>

                        <div className="space-y-4">
                            {[
                                { artifact: 'payment-gateway-api', version: 'v2.4.1-rc', src: 'STAGE', dest: 'PRODUCTION', status: 'Pending SBOM Check', color: 'amber' },
                                { artifact: 'react-retail-frontend', version: 'v1.9.0', src: 'QA', dest: 'STAGE', status: 'Approved (Syncing)', color: 'blue' },
                                { artifact: 'fraud-ml-model', version: 'v4.0.0', src: 'STAGE', dest: 'PRODUCTION', status: 'Blocked: High CVE (Log4j)', color: 'rose' }
                            ].map((promo, idx) => (
                                <div key={idx} className={`border border-slate-200 p-4 rounded-lg flex items-center justify-between group hover:border-${promo.color}-300 transition-colors`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center border border-slate-200">
                                            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 flex items-center gap-2">
                                                {promo.artifact}
                                                <span className="font-mono text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">{promo.version}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1 text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">
                                                <span>{promo.src}</span>
                                                <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                <span className={`text-${promo.color}-600 bg-${promo.color}-50 px-1 rounded`}>{promo.dest}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-xs font-bold text-${promo.color}-600`}>{promo.status}</span>
                                        <button className="text-slate-400 hover:text-slate-700">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Operational Engines */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 shadow-inner">
                            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Platform Engines</h2>

                            <div className="space-y-3">
                                <ComponentStatus name="Registry Engine (Proxy)" status="Healthy" metrics="942 req/s" />
                                <ComponentStatus name="Scan Engine (Trivy)" status="Healthy" metrics="0 backlog" />
                                <ComponentStatus name="Promotion Engine" status="Healthy" metrics="Live" />
                                <ComponentStatus name="Cosign Signature Validator" status="Degraded" metrics="Latency >2s" />
                                <ComponentStatus name="Retention Engine (Cron)" status="Healthy" metrics="Next: 02:00 Z" />
                            </div>
                        </div>

                        <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg shadow-md transition-colors w-full flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Generate Auditor Evidence Pack
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Dashboard;
