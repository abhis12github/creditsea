import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FileText, TrendingUp, Users, Search, ChevronRight, CreditCard, CheckCircle, XCircle, Calendar } from 'lucide-react';
import Layout from '../components/Layout';

function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetch(`${apiUrl}/report`)
      .then(res => res.json())
      .then(data => {
        setReports(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const filteredReports = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return reports;
    return reports.filter(r =>
      r.basicDetails?.name?.toLowerCase().includes(term) ||
      r.basicDetails?.pan?.toLowerCase().includes(term) ||
      r.basicDetails?.mobilePhone?.toLowerCase().includes(term)
    );
  }, [reports, searchTerm]);

  const getScoreColor = (score) => {
    if (score >= 750) return 'from-green-500 to-emerald-600';
    if (score >= 650) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    return 'Poor';
  };

  return (
    <Layout>
      <div className="py-6 max-w-5xl mx-auto">
        {/* Header and Toolbar */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">Reports</h1>
            <p className="text-sm text-neutral-400">Monitor and manage all generated credit reports</p>
          </div>
          <div className="w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, PAN, or mobile"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 pl-10 pr-4 py-3 border border-neutral-800 bg-neutral-900 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-sm text-neutral-100 placeholder:text-neutral-500"
              />
            </div>
          </div>
        </div>

        {/* Simple Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-neutral-400" />
              <div className="text-xs text-neutral-400">Total Reports</div>
            </div>
            <div className="text-2xl font-bold">{reports.length}</div>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-neutral-400" />
              <div className="text-xs text-neutral-400">Avg Score</div>
            </div>
            <div className="text-2xl font-bold">{reports.length > 0 ? Math.round(reports.reduce((s,r)=>s+(r.basicDetails?.creditScore||0),0)/reports.length) : 0}</div>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-neutral-400" />
              <div className="text-xs text-neutral-400">Active Accounts</div>
            </div>
            <div className="text-2xl font-bold">{reports.reduce((s,r)=>s+(r.reportSummary?.activeAccounts||0),0)}</div>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-neutral-400" />
              <div className="text-xs text-neutral-400">Closed Accounts</div>
            </div>
            <div className="text-2xl font-bold">{reports.reduce((s,r)=>s+(r.reportSummary?.closedAccounts||0),0)}</div>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-neutral-400" />
              <div className="text-xs text-neutral-400">Last 7d Enquiries</div>
            </div>
            <div className="text-2xl font-bold">{reports.reduce((s,r)=>s+(r.reportSummary?.last7DaysEnquiries||0),0)}</div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="mt-4 text-neutral-400">Loading reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-3 text-neutral-700" />
            <h3 className="text-xl font-semibold mb-1">No reports found</h3>
            <p className="text-neutral-400 mb-5">{searchTerm ? 'Try another search query.' : 'Upload an XML to generate your first report.'}</p>
            <Link to="/" className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors">Upload XML</Link>
          </div>
        ) : (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-900">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-400">Name</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-400">PAN</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-400">Mobile</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-400">Score</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-400">Total</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-400">Active</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-400">Closed</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-400"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((r) => (
                    <tr key={r._id} className="border-b border-neutral-900 hover:bg-neutral-900/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-8 w-8 rounded-full bg-neutral-800 grid place-items-center text-neutral-200 text-xs font-semibold flex-shrink-0">
                            {(r.basicDetails?.name || 'U N').split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase()}
                          </div>
                          <div className="truncate">
                            <div className="truncate text-neutral-100 font-medium">{r.basicDetails?.name || 'Unknown'}</div>
                            <div className="text-neutral-500 text-xs truncate">Report ID: {r._id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-300">{r.basicDetails?.pan || 'N/A'}</td>
                      <td className="py-3 px-4 text-neutral-300">{r.basicDetails?.mobilePhone || 'N/A'}</td>
                      <td className="py-3 px-4 text-right text-neutral-100 font-semibold">{r.basicDetails?.creditScore ?? 'N/A'}</td>
                      <td className="py-3 px-4 text-right text-neutral-300">{r.reportSummary?.totalAccounts || 0}</td>
                      <td className="py-3 px-4 text-right text-neutral-300">{r.reportSummary?.activeAccounts || 0}</td>
                      <td className="py-3 px-4 text-right text-neutral-300">{r.reportSummary?.closedAccounts || 0}</td>
                      <td className="py-3 px-4 text-right">
                        <Link to={`/reports/${r._id}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-neutral-800 text-neutral-200 hover:bg-neutral-700">View <ChevronRight className="w-4 h-4" /></Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ReportsPage;