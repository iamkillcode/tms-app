import { Link } from "react-router-dom";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact FDA Procurement</h4>
            <p className="text-sm">Phone: +233 30 295 5570</p>
            <p className="text-sm">Email: procurement@fda.gov.gh</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/tenders" className="hover:text-indigo-300">Active Tenders</Link></li>
              <li><Link to="/iso" className="hover:text-indigo-300">ISO Numbers</Link></li>
              <li><Link to="/guidelines" className="hover:text-indigo-300">Procurement Guidelines</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:text-indigo-300">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-indigo-300">Terms of Service</Link></li>
              <li><Link to="/accessibility" className="hover:text-indigo-300">Accessibility</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
