// components/About.jsx
import React from 'react';

const About = () => { 
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">About SMTECH URL Shortener & Detecto  r</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6 text-lg">
            Welcome to SMTECH URL Shortener - your trusted partner for secure and efficient URL management. 
            Our platform combines the convenience of URL shortening with advanced security analysis to protect 
            you from malicious websites.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">🔒 Security First</h3>
              <p className="text-blue-700">
                Every URL is automatically scanned for potential threats including phishing, malware, 
                and other security risks before shortening.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-green-800 mb-3">⚡ Lightning Fast</h3>
              <p className="text-green-700">
                Generate short, memorable URLs instantly. Perfect for social media, marketing campaigns, 
                and easy sharing.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h2>
          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <div className="bg-purple-100 text-purple-800 rounded-lg p-3 mr-4">1</div>
              <div>
                <h4 className="font-semibold text-gray-700">Paste Your URL</h4>
                <p className="text-gray-600">Enter any long URL you want to shorten</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-lg p-3 mr-4">2</div>
              <div>
                <h4 className="font-semibold text-gray-700">Security Scan</h4>
                <p className="text-gray-600">Our system automatically analyzes the URL for threats</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-100 text-green-800 rounded-lg p-3 mr-4">3</div>
              <div>
                <h4 className="font-semibold text-gray-700">Get Safe Short URL</h4>
                <p className="text-gray-600">Receive your shortened URL with security status</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            At SMTECH, we believe that internet security should be accessible to everyone. 
            Our URL shortener not only makes links more manageable but also ensures they're safe to click. 
            We're committed to creating a safer browsing experience for all users.
          </p>

          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Trust & Safety</h3>
            <p>
              Every URL processed through our system undergoes comprehensive security checks. 
              We use advanced algorithms and threat intelligence to protect our users from 
              potentially harmful websites.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;