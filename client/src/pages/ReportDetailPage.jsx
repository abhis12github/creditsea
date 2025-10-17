import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, User, Phone, CreditCard, TrendingUp, 
  Building2, MapPin, DollarSign, AlertCircle, 
  CheckCircle, XCircle, Activity, Calendar,
  Download, Share2
} from 'lucide-react';
import Layout from '../components/Layout';

function ReportDetailPage() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetch(`${apiUrl}/reports/${id}`)
      .then(res => res.json())
      .then(data => {
        setReport(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-20 w-20 border-4 border-indigo-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-xl font-medium">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Report Not Found</h2>
          <p className="text-gray-600 mb-6">The report you're looking for doesn't exist.</p>
          <Link
            to="/reports"
            className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Back to Reports
          </Link>
        </div>
      </div>
    );
  }

  const getScoreLabel = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    return 'Poor';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="py-6">
        <div className="max-w-5xl mx-auto px-4 max-sm:px-1 mb-4 ">
          <Link
            to="/reports"
            className="inline-flex items-center space-x-2 text-neutral-300 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Reports</span>
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-tight mb-1">Credit Report</h1>
              <p className="text-neutral-400 text-sm">{report.basicDetails?.name}</p>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-all flex items-center space-x-2 border border-neutral-800">
                <Download className="w-5 h-5" />
                <span className="font-medium">Download</span>
              </button>
              <button className="px-4 py-2 bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-all flex items-center space-x-2 border border-neutral-800">
                <Share2 className="w-5 h-5" />
                <span className="font-medium">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 max-sm:px-1 -mt-2 pb-10">
        {/* Overview KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[{
            label: 'Credit Score', value: report.basicDetails?.creditScore ?? 'N/A', icon: TrendingUp
          },{
            label: 'Total Accounts', value: report.reportSummary?.totalAccounts ?? 0, icon: Building2
          },{
            label: 'Active Accounts', value: report.reportSummary?.activeAccounts ?? 0, icon: CheckCircle
          },{
            label: 'Closed Accounts', value: report.reportSummary?.closedAccounts ?? 0, icon: XCircle
          }].map((kpi, idx) => (
            <div key={idx} className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon className="w-4 h-4 text-neutral-400" />
                <div className="text-xs text-neutral-400">{kpi.label}</div>
              </div>
              <div className="text-2xl font-bold text-neutral-100">{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Basic Details Card */}
        <div className="bg-neutral-900 rounded-xl p-6 mb-8 border border-neutral-800">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-neutral-400" />
            <h2 className="text-lg font-semibold text-neutral-100">Basic Details</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: User, label: 'Full Name', value: report.basicDetails?.name },
              { icon: Phone, label: 'Mobile Phone', value: report.basicDetails?.mobilePhone },
              { icon: CreditCard, label: 'PAN Number', value: report.basicDetails?.pan },
              { icon: TrendingUp, label: 'Credit Score', value: report.basicDetails?.creditScore },
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className="w-4 h-4 text-neutral-400" />
                  <div className="text-xs text-neutral-400">{item.label}</div>
                </div>
                <div className="text-lg font-semibold text-neutral-100">{item.value || 'N/A'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-neutral-900 rounded-xl p-6 mb-8 border border-neutral-800">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-neutral-400" />
            <h2 className="text-lg font-semibold text-neutral-100">Financial Summary</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Accounts', value: report.reportSummary?.totalAccounts, icon: Building2 },
              { label: 'Active Accounts', value: report.reportSummary?.activeAccounts, icon: CheckCircle },
              { label: 'Closed Accounts', value: report.reportSummary?.closedAccounts, icon: XCircle },
              { label: 'Last 7 Days Enquiries', value: report.reportSummary?.last7DaysEnquiries, icon: Calendar },
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className="w-4 h-4 text-neutral-400" />
                  <div className="text-xs text-neutral-400">{item.label}</div>
                </div>
                <div className="text-2xl font-bold text-neutral-100">{item.value || 0}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Current Balance', value: formatCurrency(report.reportSummary?.currentBalance) },
              { label: 'Secured Amount', value: formatCurrency(report.reportSummary?.securedAmount) },
              { label: 'Unsecured Amount', value: formatCurrency(report.reportSummary?.unsecuredAmount) },
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-neutral-400" />
                  <div className="text-xs text-neutral-400">{item.label}</div>
                </div>
                <div className="text-2xl font-bold text-neutral-100">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Credit Accounts Table */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden ">
          <div className="p-6 border-b border-neutral-800">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5 text-neutral-400" />
              <h2 className="text-lg font-semibold text-neutral-100">Credit Accounts</h2>
            </div>
            <p className="text-sm text-neutral-400">
              {report.creditAccounts?.length || 0} accounts found
            </p>
          </div>

          {report.creditAccounts && report.creditAccounts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-900">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-400 w-1/5">Account Number</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-400 w-1/5">Bank Name</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-400 w-1/5">Current Balance</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-400 w-1/5">Overdue</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-400 w-2/5">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {report.creditAccounts.map((acc, idx) => (
                    <tr key={idx} className="border-b border-neutral-900 hover:bg-neutral-900/70 transition-colors">
                      <td className="py-3 px-4 font-mono text-neutral-300">{acc.accountNumber || 'N/A'}</td>
                      <td className="py-3 px-4 text-neutral-300">{acc.bankName || 'N/A'}</td>
                      <td className="py-3 px-4 text-right text-neutral-100 font-semibold">
                        {formatCurrency(acc.currentBalance)}
                      </td>
                      <td className="py-3 px-4 text-right text-neutral-100 font-semibold">
                        {formatCurrency(acc.overdueAmount)}
                      </td>
                      <td className="py-3 px-4 text-neutral-300">{acc.address || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
              <p className="text-neutral-400 text-lg">No credit accounts found</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ReportDetailPage;