import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [hasUploaded, setHasUploaded] = useState(false); 

  const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleUpload = async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (!file) return;
    
    setIsLoading(true);
    setMessage('');
    setIsSuccess(false);
    setValidationError('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${apiUrl}/reports`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setMessage(data.message || data.error);
      setIsSuccess(!!data.message);
      setHasUploaded(true)
    } catch (error) {
      setMessage('Upload failed. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-upload when a valid file is selected/dropped
  useEffect(() => {
    if (file && !isLoading && !validationError && !hasUploaded) {
      const t = setTimeout(() => handleUpload(), 150);
      return () => clearTimeout(t);
    }
  }, [file, isLoading, validationError]);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    const isXml = droppedFile.name.toLowerCase().endsWith('.xml') || droppedFile.type === 'text/xml' || droppedFile.type === 'application/xml';
    if (!isXml) {
      setValidationError('Please upload a valid .xml file.');
      setFile(null);
      return;
    }
    if (droppedFile.size > MAX_FILE_SIZE_BYTES) {
      setValidationError('File is too large. Maximum allowed size is 5 MB.');
      setFile(null);
      return;
    }
    setValidationError('');
    setFile(droppedFile);
    setHasUploaded(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    const isXml = selectedFile.name.toLowerCase().endsWith('.xml') || selectedFile.type === 'text/xml' || selectedFile.type === 'application/xml';
    if (!isXml) {
      setValidationError('Please choose a .xml file only.');
      setFile(null);
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setValidationError('File is too large. Maximum allowed size is 2 MB.');
      setFile(null);
      return;
    }
    setValidationError('');
    setFile(selectedFile);
    setHasUploaded(false);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto relative py-10">
        {/* Enhanced Header */}
        <div className="mb-8 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white grid place-items-center shadow-lg">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-heading bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
                  Upload Credit Report
                </h1>
                <p className="text-sm text-neutral-400 flex items-center gap-2">
                  
                  Supported format: .xml • Max 2 MB • Secure Processing
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">Secure</span>
              <span className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 font-medium">Fast</span>
              <span className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 font-medium">Private</span>
            </div>
          </div>
        </div>

        {/* Upload + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 bg-neutral-900 rounded-2xl shadow-lg p-6 md:p-8 border border-neutral-800">
          <form onSubmit={handleUpload}>
            {/* Drag and Drop Area */}
            <div
              data-testid="upload-dropzone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              role="region"
              aria-label="File upload dropzone"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  document.getElementById('file-upload')?.click();
                }
              }}
              className={`relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-900 ${
                isDragging
                  ? 'border-indigo-500 bg-gradient-to-br from-indigo-950/40 to-purple-950/40 scale-105 shadow-lg shadow-indigo-500/20'
                  : file
                  ? 'border-emerald-500 bg-gradient-to-br from-emerald-950/40 to-teal-950/40 shadow-lg shadow-emerald-500/20'
                  : 'border-neutral-700 hover:border-indigo-400 hover:bg-neutral-800/30 hover:shadow-lg hover:shadow-indigo-500/10'
              }`}
            >
              <input
                data-testid="upload-page-file-input"
                type="file"
                accept=".xml"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="file-upload"
              />
              
              <div className="pointer-events-none">
                {file ? (
                  <div className="animate-bounce">
                    <CheckCircle className="w-16 h-16 mx-auto mb-6 text-emerald-400 drop-shadow-lg" />
                  </div>
                ) : (
                  <div className="animate-pulse">
                    <Upload className="w-16 h-16 mx-auto mb-6 text-neutral-400 drop-shadow-lg" />
                  </div>
                )}
                
                <h3 className="text-xl md:text-2xl font-bold mb-2 text-neutral-100">
                  {file ? file.name : 'Drop your XML file here'}
                </h3>
                <p className="text-neutral-400 mb-4">
                  {file ? 'File ready to upload' : 'or click to browse'}
                </p>
                
                {!file && (
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-6 py-3 bg-gradient-to-r bg-purple-600 text-white rounded-xl font-semibold cursor-pointer hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-indigo-500/25 hover:scale-105"
                  >
                    Choose File
                  </label>
                )}
              </div>
            </div>

            {/* Upload hints */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs md:text-sm text-neutral-300">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neutral-800">
                <Info className="w-4 h-4 text-neutral-400" /> Only .xml files
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neutral-800">
                <Info className="w-4 h-4 text-neutral-400" /> Max size 2 MB
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neutral-800">
                <Info className="w-4 h-4 text-neutral-400" /> Drag & drop supported
              </span>
            </div>

            {/* File Info */}
              {file && (
              <div className="mt-6 p-4 bg-neutral-800 rounded-lg border border-neutral-700 flex items-center justify-between animate-fade-in min-h-[72px]">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-neutral-200" />
                  <div>
                    <p className="font-semibold text-neutral-100">{file.name}</p>
                    <p className="text-sm text-neutral-400">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-red-400 hover:text-red-300 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {/* Validation error */}
            {validationError && (
              <div className="mt-4 p-4 rounded-lg bg-red-950/40 border border-red-900 text-red-300 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-400" />
                <p data-testid="validation-error" className="text-sm font-medium">{validationError}</p>
              </div>
            )}

            {/* Submit Button removed - auto upload enabled */}
          </form>

          {/* Message Display */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-lg flex items-start space-x-3 animate-fade-in ${
                isSuccess
                  ? 'bg-emerald-950/40 border border-emerald-900'
                  : 'bg-red-950/40 border border-red-900'
              }`}
            >
              {isSuccess ? (
                  <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                  <p className={`font-medium ${isSuccess ? 'text-emerald-200' : 'text-red-200'}`}>
                  {message}
                </p>
                {isSuccess && (
                  <div className="mt-3">
                    <Link to="/reports" className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors">
                      View Reports
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
          </div>

          {/* Sidebar */}
          <aside className="bg-neutral-900 rounded-2xl shadow-lg p-6 border border-neutral-800">
            <h3 className="text-lg font-semibold mb-4">Before you upload</h3>
            <ul className="space-y-3 text-sm text-neutral-300">
              <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-neutral-600"></span> Ensure the file is the latest Experian XML.</li>
              <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-neutral-600"></span> Remove any password protection if applied.</li>
              <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-neutral-600"></span> Do not modify the XML structure.</li>
              <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-neutral-600"></span> Keep file size under 5 MB.</li>
            </ul>
            <div className="mt-5 rounded-lg border border-neutral-800 bg-neutral-800 p-4">
              <p className="text-xs text-neutral-300">We process files securely on the server. Your data is not shared with third parties.</p>
            </div>
          </aside>
        </div>

        {/* Extra sections */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 rounded-2xl shadow-sm border border-neutral-800 p-6">
            <h4 className="text-base font-semibold mb-2">How it works</h4>
            <ol className="list-decimal list-inside text-sm text-neutral-300 space-y-1">
              <li>Upload your Experian XML</li>
              <li>We extract and validate the data</li>
              <li>View your detailed credit report</li>
            </ol>
          </div>
          <div className="bg-neutral-900 rounded-2xl shadow-sm border border-neutral-800 p-6">
            <h4 className="text-base font-semibold mb-2">Security & Privacy</h4>
            <p className="text-sm text-neutral-300">All uploads are handled over HTTPS. Files are processed securely and can be deleted upon completion.</p>
          </div>
          <div className="bg-neutral-900 rounded-2xl shadow-sm border border-neutral-800 p-6">
            <h4 className="text-base font-semibold mb-2">FAQs</h4>
            <div className="text-sm text-neutral-300 space-y-1">
              <p><span className="font-semibold">Which files?</span> Only .xml</p>
              <p><span className="font-semibold">How long?</span> Usually a few seconds</p>
              <p><span className="font-semibold">What next?</span> Navigate to Reports</p>
            </div>
          </div>
        </div>
      </div>

        <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(-20%); }
          100% { transform: translateX(100%); }
        }
          /* Reduce layout thrash during spinner animation */
          .animate-spin { will-change: transform; }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
      `}</style>
    </Layout>
  );
}

export default UploadPage;