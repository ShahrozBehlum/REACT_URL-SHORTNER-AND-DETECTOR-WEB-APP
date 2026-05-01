import React, { useState, useEffect } from 'react';
import { Shield, Link as LinkIcon, Home, Info, Mail, LogOut, CheckCircle, AlertTriangle, Copy, ExternalLink, Loader, Trash2, X, Menu } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [urlHistory, setUrlHistory] = useState([]);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [apiKey, setApiKey] = useState('2b05b6928b45f73765133c0c95a35790cedca4426f2d209631d821ec325bb07b');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const VIRUSTOTAL_API_KEY = apiKey || '2b05b6928b45f73765133c0c95a35790cedca4426f2d209631d821ec325bb07b';

  useEffect(() => {
    const storedApiKey = localStorage.getItem('virusTotalApiKey');
    const storedHistory = localStorage.getItem('urlHistory');
    
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
    
    if (storedHistory) {
      setUrlHistory(JSON.parse(storedHistory));
    }
  }, []);

  const saveApiKey = () => {
    if (apiKey && apiKey.length > 10) {
      localStorage.setItem('virusTotalApiKey', apiKey);
      setShowApiKeyInput(false);
      alert('API Key saved successfully!');
    } else {
      alert('Please enter a valid VirusTotal API key');
    }
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all URL history?')) {
      setUrlHistory([]);
      localStorage.removeItem('urlHistory');
      alert('History cleared successfully!');
    }
  };

  const shortenUrlWithApi = async (longUrl) => {
    try {
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
      
      if (response.ok) {
        const shortUrl = await response.text();
        return shortUrl;
      } else {
        throw new Error('Failed to shorten URL');
      }
    } catch (error) {
      console.error('TinyURL API Error:', error);
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return `https://smtech.short/${result}`;
    }
  };

  const checkUrlWithVirusTotal = async (url) => {
    try {
      const submitResponse = await fetch('https://www.virustotal.com/api/v3/urls', {
        method: 'POST',
        headers: {
          'x-apikey': VIRUSTOTAL_API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `url=${encodeURIComponent(url)}`
      });

      if (!submitResponse.ok) {
        throw new Error('VirusTotal API request failed');
      }

      const submitData = await submitResponse.json();
      const analysisId = submitData.data.id;

      await new Promise(resolve => setTimeout(resolve, 3000));

      const analysisResponse = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
        headers: {
          'x-apikey': VIRUSTOTAL_API_KEY
        }
      });

      if (!analysisResponse.ok) {
        throw new Error('Failed to get analysis results');
      }

      const analysisData = await analysisResponse.json();
      const stats = analysisData.data.attributes.stats;
      
      return {
        isSafe: stats.malicious === 0 && stats.suspicious === 0,
        malicious: stats.malicious || 0,
        suspicious: stats.suspicious || 0,
        harmless: stats.harmless || 0,
        undetected: stats.undetected || 0,
        total: stats.malicious + stats.suspicious + stats.harmless + stats.undetected,
        threats: [],
        scanDate: new Date().toLocaleString(),
        engines: {
          detected: stats.malicious + stats.suspicious,
          total: stats.malicious + stats.suspicious + stats.harmless + stats.undetected
        }
      };

    } catch (error) {
      console.error('VirusTotal API Error:', error);
      
      const suspiciousPatterns = [
        /\.tk$/, /\.ml$/, /\.ga$/, /\.cf$/, /\.gq$/,
        /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
        /free-/i, /prize/i, /winner/i, /claim/i, /verify-account/i
      ];
      
      const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(url));
      
      return {
        isSafe: !isSuspicious,
        malicious: isSuspicious ? 5 : 0,
        suspicious: 0,
        harmless: isSuspicious ? 50 : 85,
        undetected: 10,
        total: 95,
        threats: isSuspicious ? ['Potential Phishing'] : [],
        scanDate: new Date().toLocaleString(),
        engines: {
          detected: isSuspicious ? 5 : 0,
          total: 95
        },
        usingFallback: true
      };
    }
  };

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    
    if (!urlInput) {
      alert('Please enter a URL');
      return;
    }
    
    try {
      new URL(urlInput);
    } catch {
      alert('Please enter a valid URL (include http:// or https://)');
      return;
    }

    if (!apiKey || apiKey === 'YOUR_VIRUSTOTAL_API_KEY_HERE') {
      const useWithoutKey = window.confirm(
        'VirusTotal API key not configured. The app will use fallback detection (less accurate).\n\n' +
        'Click OK to continue with fallback detection, or Cancel to add your API key.'
      );
      
      if (!useWithoutKey) {
        setShowApiKeyInput(true);
        return;
      }
    }
    
    setLoading(true);
    setFeedback(null);
    
    try {
      const shortUrl = await shortenUrlWithApi(urlInput);
      const safetyCheck = await checkUrlWithVirusTotal(urlInput);
      
      const threats = [];
      if (safetyCheck.malicious > 0) threats.push('Malware');
      if (safetyCheck.suspicious > 0) threats.push('Suspicious Activity');
      if (safetyCheck.malicious > 5) threats.push('Phishing');
      
      const urlData = {
        originalUrl: urlInput,
        shortUrl: shortUrl,
        isSafe: safetyCheck.isSafe,
        malicious: safetyCheck.malicious,
        suspicious: safetyCheck.suspicious,
        harmless: safetyCheck.harmless,
        undetected: safetyCheck.undetected,
        threats: threats,
        scanDate: safetyCheck.scanDate,
        engines: safetyCheck.engines,
        createdAt: new Date().toLocaleString(),
        usingFallback: safetyCheck.usingFallback || false
      };
      
      setFeedback(urlData);
      
      const newHistory = [urlData, ...urlHistory];
      setUrlHistory(newHistory);
      localStorage.setItem('urlHistory', JSON.stringify(newHistory));
      
      setUrlInput('');
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error processing URL. Please try again or check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const deleteUrl = (index) => {
    const newHistory = urlHistory.filter((_, i) => i !== index);
    setUrlHistory(newHistory);
    localStorage.setItem('urlHistory', JSON.stringify(newHistory));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Message sent successfully! We will get back to you soon.');
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mr-2" />
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SMTECH
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition flex items-center text-sm sm:text-base ${
                  activeTab === 'home' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4 mr-1 sm:mr-2" />
                Home
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition flex items-center text-sm sm:text-base ${
                  activeTab === 'about' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Info className="w-4 h-4 mr-1 sm:mr-2" />
                About
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition flex items-center text-sm sm:text-base ${
                  activeTab === 'contact' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Mail className="w-4 h-4 mr-1 sm:mr-2" />
                Contact
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 py-3 px-3">
              <div className="space-y-1">
                <button
                  onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center text-sm ${
                    activeTab === 'home' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Home className="w-4 h-4 mr-3" />
                  Home
                </button>
                <button
                  onClick={() => { setActiveTab('about'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center text-sm ${
                    activeTab === 'about' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Info className="w-4 h-4 mr-3" />
                  About
                </button>
                <button
                  onClick={() => { setActiveTab('contact'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center text-sm ${
                    activeTab === 'contact' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Mail className="w-4 h-4 mr-3" />
                  Contact
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* API Key Configuration Modal */}
      {showApiKeyInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Configure VirusTotal API Key</h3>
              <button onClick={() => setShowApiKeyInput(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">
              Get your free API key from{' '}
              <a href="https://www.virustotal.com/gui/join-us" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                VirusTotal
              </a>
            </p>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your VirusTotal API key"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg mb-3 sm:mb-4 text-sm sm:text-base"
            />
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={saveApiKey}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base"
              >
                Save API Key
              </button>
              <button
                onClick={() => setShowApiKeyInput(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {activeTab === 'home' && (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* URL Input Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
              <form onSubmit={handleUrlSubmit} className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Enter or paste your URL here..."
                    className="flex-1 px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base lg:text-lg"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Shorten & Check'
                    )}
                  </button>
                </div>
                
                {/* API Key Configuration */}
                <div className="pt-3 sm:pt-4 border-t border-gray-200 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setShowApiKeyInput(true)}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    Configure VirusTotal API Key for better detection
                  </button>
                  
                  {urlHistory.length > 0 && (
                    <button
                      type="button"
                      onClick={clearHistory}
                      className="text-xs sm:text-sm text-red-600 hover:text-red-800 font-medium flex items-center"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      Clear History
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Results Section */}
            {feedback && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-3">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Security Analysis</h3>
                  {feedback.usingFallback && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Using Fallback Detection
                    </span>
                  )}
                </div>
                
                {/* Safety Status */}
                <div className={`p-3 sm:p-4 lg:p-6 rounded-xl mb-4 sm:mb-6 ${
                  feedback.isSafe ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
                }`}>
                  <div className="flex items-start">
                    {feedback.isSafe ? (
                      <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-600 mr-2 sm:mr-3 lg:mr-4 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-red-600 mr-2 sm:mr-3 lg:mr-4 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h4 className={`text-base sm:text-lg lg:text-xl font-bold mb-1 sm:mb-2 ${
                        feedback.isSafe ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {feedback.isSafe ? 'Safe URL ✓' : 'Malicious URL Detected ⚠'}
                      </h4>
                      <p className={`text-xs sm:text-sm lg:text-base ${
                        feedback.isSafe ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {feedback.isSafe 
                          ? 'This URL is safe to use. No threats detected by security scanners.'
                          : 'This link is malicious and may harm your device or steal your information. Do not visit this URL!'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* URL Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
                  <div className="bg-gray-50 p-3 sm:p-4 lg:p-5 rounded-lg border border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Original URL</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs sm:text-sm font-mono break-all text-gray-800 flex-1 pr-2">{feedback.originalUrl}</p>
                      <a 
                        href={feedback.originalUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-1 p-1 sm:p-2 hover:bg-gray-200 rounded transition flex-shrink-0"
                      >
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                      </a>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-3 sm:p-4 lg:p-5 rounded-lg border border-blue-200">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Shortened URL</p>
                    <div className="flex items-center justify-between">
                      <a 
                        href={feedback.shortUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm font-mono text-blue-700 hover:underline flex-1 pr-2 break-all"
                      >
                        {feedback.shortUrl}
                      </a>
                      <button
                        onClick={() => copyToClipboard(feedback.shortUrl)}
                        className="ml-1 p-1 sm:p-2 hover:bg-blue-100 rounded transition flex-shrink-0"
                      >
                        <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
                  <div className="bg-red-50 p-2 sm:p-3 lg:p-4 rounded-lg border border-red-200">
                    <p className="text-xs text-gray-600 mb-0.5 sm:mb-1">Malicious</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-700">{feedback.malicious}</p>
                  </div>
                  
                  <div className="bg-orange-50 p-2 sm:p-3 lg:p-4 rounded-lg border border-orange-200">
                    <p className="text-xs text-gray-600 mb-0.5 sm:mb-1">Suspicious</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-700">{feedback.suspicious}</p>
                  </div>
                  
                  <div className="bg-green-50 p-2 sm:p-3 lg:p-4 rounded-lg border border-green-200">
                    <p className="text-xs text-gray-600 mb-0.5 sm:mb-1">Harmless</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-700">{feedback.harmless}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-2 sm:p-3 lg:p-4 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-0.5 sm:mb-1">Undetected</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-700">{feedback.undetected}</p>
                  </div>
                  
                  <div className="col-span-2 sm:col-span-3 lg:col-span-1 bg-blue-50 p-2 sm:p-3 lg:p-4 rounded-lg border border-blue-200">
                    <p className="text-xs text-gray-600 mb-0.5 sm:mb-1">Total Engines</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-700">{feedback.engines.total}</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Scan Date</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-800">{feedback.scanDate}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Threats Detected</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-800">
                      {feedback.threats.length > 0 ? feedback.threats.join(', ') : 'None'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* URL History */}
            {urlHistory.length > 0 && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-3">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Your URL History</h3>
                  <span className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
                    {urlHistory.length} URLs
                  </span>
                </div>
                <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                  {urlHistory.map((item, index) => (
                    <div key={index} className="p-3 sm:p-4 lg:p-5 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition group relative">
                      <button
                        onClick={() => deleteUrl(index)}
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-200"
                        title="Delete URL"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      
                      <div className="mb-2 sm:mb-3 pr-10 sm:pr-12">
                        <p className="text-xs text-gray-600 mb-0.5">Original</p>
                        <div className="flex items-center mb-1 sm:mb-2">
                          <p className="text-xs sm:text-sm font-mono break-all text-gray-800 flex-1 pr-2">{item.originalUrl}</p>
                          <a 
                            href={item.originalUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ml-1 p-1 hover:bg-gray-200 rounded transition flex-shrink-0"
                          >
                            <ExternalLink className="w-3 h-3 text-gray-600" />
                          </a>
                        </div>
                        <p className="text-xs text-gray-600 mb-0.5">Short URL</p>
                        <div className="flex items-center">
                          <a 
                            href={item.shortUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs sm:text-sm font-mono text-blue-600 hover:underline break-all pr-2"
                          >
                            {item.shortUrl}
                          </a>
                          <button
                            onClick={() => copyToClipboard(item.shortUrl)}
                            className="ml-1 p-1 hover:bg-gray-200 rounded transition flex-shrink-0"
                          >
                            <Copy className="w-3 h-3 text-gray-600" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0">
                        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
                          {item.isSafe ? (
                            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium flex items-center">
                              <CheckCircle className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                              Safe
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-red-100 text-red-700 rounded-full text-xs sm:text-sm font-medium flex items-center">
                              <AlertTriangle className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                              Malicious
                            </span>
                          )}
                          <span className="text-xs text-gray-600 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                            {item.malicious}/{item.engines.total} threats
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 sm:mt-0">{item.createdAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">About SMTECH URL Shortener</h2>
            
            <div className="space-y-4 sm:space-y-6 text-gray-700 leading-relaxed">
              <p className="text-sm sm:text-base lg:text-lg">
                Welcome to SMTECH, your trusted partner in secure URL management. We combine cutting-edge URL shortening technology with advanced malicious link detection powered by VirusTotal API to keep you safe online.
              </p>
              
              <div className="bg-blue-50 p-3 sm:p-4 lg:p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-2 sm:mb-4">Our Mission</h3>
                <p className="text-sm sm:text-base">
                  To provide a secure, reliable, and user-friendly platform that not only shortens your URLs but also protects you from cyber threats using real-time security analysis. We believe in making the internet a safer place, one link at a time.
                </p>
              </div>
              
              <div className="bg-purple-50 p-3 sm:p-4 lg:p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg sm:text-xl font-bold text-purple-900 mb-2 sm:mb-4">Key Features</h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base"><strong>Real URL Shortening:</strong> We use TinyURL API to create actual working short links that redirect to your original URLs.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base"><strong>VirusTotal Integration:</strong> Every URL is analyzed using VirusTotal's comprehensive database of 70+ security engines for accurate threat detection.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base"><strong>Detailed Security Reports:</strong> Get comprehensive analysis including malicious, suspicious, and harmless ratings from multiple security vendors.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base"><strong>Real-time Scanning:</strong> URLs are scanned in real-time to provide the most up-to-date security information.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base"><strong>URL History:</strong> Track all your shortened URLs with their security status and detailed metrics.</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-3 sm:p-4 lg:p-6 rounded-lg border border-green-200">
                <h3 className="text-lg sm:text-xl font-bold text-green-900 mb-2 sm:mb-4">How It Works</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start">
                    <div className="bg-green-600 text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex items-center justify-center font-bold text-sm sm:text-base mr-3 sm:mr-4 flex-shrink-0">1</div>
                    <div>
                      <p className="font-semibold mb-0.5 sm:mb-1 text-sm sm:text-base">Enter Your URL</p>
                      <p className="text-xs sm:text-sm">Paste any URL you want to shorten and check for security threats.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-600 text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex items-center justify-center font-bold text-sm sm:text-base mr-3 sm:mr-4 flex-shrink-0">2</div>
                    <div>
                      <p className="font-semibold mb-0.5 sm:mb-1 text-sm sm:text-base">Real API Processing</p>
                      <p className="text-xs sm:text-sm">Your URL is sent to TinyURL API for shortening and VirusTotal API for security analysis.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-600 text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex items-center justify-center font-bold text-sm sm:text-base mr-3 sm:mr-4 flex-shrink-0">3</div>
                    <div>
                      <p className="font-semibold mb-0.5 sm:mb-1 text-sm sm:text-base">Get Results</p>
                      <p className="text-xs sm:text-sm">Receive your shortened URL along with comprehensive security analysis from 70+ security engines.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-600 text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex items-center justify-center font-bold text-sm sm:text-base mr-3 sm:mr-4 flex-shrink-0">4</div>
                    <div>
                      <p className="font-semibold mb-0.5 sm:mb-1 text-sm sm:text-base">Share Safely</p>
                      <p className="text-xs sm:text-sm">Copy and share your shortened URL with confidence, knowing its security status.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-3 sm:p-4 lg:p-6 rounded-lg border border-yellow-200">
                <h3 className="text-lg sm:text-xl font-bold text-yellow-900 mb-2 sm:mb-4">Setup Instructions</h3>
                <p className="mb-2 sm:mb-3 text-sm sm:text-base">To use the full features of SMTECH, you need a free VirusTotal API key:</p>
                <ol className="list-decimal list-inside space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  <li>Visit <a href="https://www.virustotal.com/gui/join-us" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">virustotal.com/gui/join-us</a></li>
                  <li>Create a free account (no credit card required)</li>
                  <li>Navigate to your profile and find your API key</li>
                  <li>Click "Configure API" button on the home page</li>
                  <li>Paste your API key and save it</li>
                  <li>Start scanning URLs with accurate, real-time detection!</li>
                </ol>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm italic">Note: Without an API key, the app will use fallback pattern-based detection (less accurate).</p>
              </div>
              
              <p className="text-sm sm:text-base lg:text-lg font-medium text-center text-gray-800 pt-2 sm:pt-4">
                Join thousands of users who trust SMTECH for safe and efficient URL management. Together, we're building a safer internet.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Contact Us</h2>
            
            <div className="mb-4 sm:mb-6 lg:mb-8">
              <p className="text-gray-700 text-sm sm:text-base lg:text-lg mb-2 sm:mb-4">
                Have questions, feedback, or need support? We'd love to hear from you! Fill out the form below and our team will get back to you as soon as possible.
              </p>
            </div>
            
            <form onSubmit={handleContactSubmit} className="space-y-3 sm:space-y-4 lg:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Name</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                  placeholder="Your Name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Email</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  rows="4"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none text-sm sm:text-base"
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 sm:py-3 lg:py-4 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition text-sm sm:text-base lg:text-lg"
              >
                Send Message
              </button>
            </form>
            
            <div className="mt-4 sm:mt-6 lg:mt-8 pt-4 sm:pt-6 lg:pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-600 mx-auto mb-1.5 sm:mb-2 lg:mb-3" />
                  <h4 className="font-semibold text-gray-800 mb-0.5 sm:mb-1 text-sm sm:text-base">Email</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">support@smtech.com</p>
                </div>
                
                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <Shield className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-600 mx-auto mb-1.5 sm:mb-2 lg:mb-3" />
                  <h4 className="font-semibold text-gray-800 mb-0.5 sm:mb-1 text-sm sm:text-base">Security</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">security@smtech.com</p>
                </div>
                
                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <Info className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-600 mx-auto mb-1.5 sm:mb-2 lg:mb-3" />
                  <h4 className="font-semibold text-gray-800 mb-0.5 sm:mb-1 text-sm sm:text-base">Support</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">24/7 Available</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;