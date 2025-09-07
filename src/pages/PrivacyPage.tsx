import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Information We Collect
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
                  <p>When you create an account, we collect:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Name and email address</li>
                    <li>Password (encrypted and securely stored)</li>
                    <li>Reading preferences and book ratings</li>
                    <li>Reviews and comments you post</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Usage Information</h3>
                  <p>We automatically collect:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Pages you visit and time spent on our site</li>
                    <li>Books you view, search for, and interact with</li>
                    <li>Device information and browser type</li>
                    <li>IP address and general location data</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. How We Use Your Information
              </h2>
              <div className="space-y-4 text-gray-700">
                <ul className="list-disc list-inside space-y-2">
                  <li>Provide personalized book recommendations</li>
                  <li>Display your reviews and ratings to other users</li>
                  <li>Improve our service and develop new features</li>
                  <li>Send you important updates about your account</li>
                  <li>Analyze usage patterns to enhance user experience</li>
                  <li>Prevent fraud and ensure platform security</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Information Sharing
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>We do not sell, trade, or rent your personal information to third parties. We may share information only in these circumstances:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Public Reviews:</strong> Your book reviews and ratings are visible to other users</li>
                  <li><strong>Service Providers:</strong> Trusted third parties who help us operate our platform</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Data Security
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>We implement industry-standard security measures to protect your information:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Encryption of sensitive data in transit and at rest</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication systems</li>
                  <li>Secure hosting infrastructure</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Your Rights
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Access and download your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Export your reading data and reviews</li>
                </ul>
                <p>To exercise these rights, please contact us at privacy@wordwise.com</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Cookies and Tracking
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Remember your login status and preferences</li>
                  <li>Analyze site usage and improve performance</li>
                  <li>Provide personalized content and recommendations</li>
                </ul>
                <p>You can control cookie settings through your browser preferences.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Children's Privacy
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Our service is not intended for children under 13. We do not knowingly collect 
                  personal information from children under 13. If we become aware that we have 
                  collected such information, we will take steps to delete it promptly.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Changes to This Policy
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any 
                  material changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Contact Us
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>If you have any questions about this Privacy Policy, please contact us:</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Email:</strong> privacy@wordwise.com</p>
                  <p><strong>Address:</strong> WordWise Privacy Team, 123 Book Street, Reading City, RC 12345</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
