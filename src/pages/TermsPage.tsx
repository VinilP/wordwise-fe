import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Terms of Use
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  By accessing and using WordWise ("the Service"), you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Description of Service
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  WordWise is a book recommendation and review platform that allows users to:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Browse and search for books</li>
                  <li>Read and write book reviews</li>
                  <li>Rate books and receive personalized recommendations</li>
                  <li>Connect with other book lovers</li>
                  <li>Track their reading progress</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. User Accounts
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Account Creation</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>You must provide accurate and complete information when creating an account</li>
                    <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                    <li>You must be at least 13 years old to create an account</li>
                    <li>One person may not maintain multiple accounts</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Account Security</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>You are responsible for all activities that occur under your account</li>
                    <li>Notify us immediately of any unauthorized use of your account</li>
                    <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. User Content and Conduct
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Acceptable Use</h3>
                  <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Post false, misleading, or fraudulent content</li>
                    <li>Harass, abuse, or harm other users</li>
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe on intellectual property rights</li>
                    <li>Spam or post repetitive content</li>
                    <li>Attempt to gain unauthorized access to the Service</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Content Standards</h3>
                  <p>All reviews, comments, and other content must:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Be respectful and constructive</li>
                    <li>Be relevant to the book being reviewed</li>
                    <li>Not contain hate speech, profanity, or offensive material</li>
                    <li>Not include personal attacks or harassment</li>
                    <li>Be your original work or properly attributed</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Intellectual Property
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Our Content</h3>
                  <p>
                    The Service and its original content, features, and functionality are owned by WordWise and are 
                    protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your Content</h3>
                  <p>
                    You retain ownership of the content you post, but grant us a license to use, display, and distribute 
                    your content in connection with the Service. You represent that you have the right to grant this license.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Privacy and Data Protection
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, 
                  to understand our practices regarding the collection and use of your information.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Disclaimers and Limitations
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Service Availability</h3>
                  <p>
                    The Service is provided "as is" and "as available." We do not guarantee that the Service will be 
                    uninterrupted, error-free, or free of viruses or other harmful components.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Content Accuracy</h3>
                  <p>
                    We do not guarantee the accuracy, completeness, or reliability of any content on the Service, 
                    including book information, reviews, and recommendations.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Limitation of Liability</h3>
                  <p>
                    To the maximum extent permitted by law, WordWise shall not be liable for any indirect, incidental, 
                    special, consequential, or punitive damages resulting from your use of the Service.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Termination
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We may terminate or suspend your account and access to the Service immediately, without prior notice, 
                  for any reason, including if you breach these Terms. Upon termination, your right to use the Service 
                  will cease immediately.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Changes to Terms
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We reserve the right to modify these Terms at any time. We will notify users of any material changes 
                  by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the 
                  Service after such modifications constitutes acceptance of the updated Terms.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Governing Law
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in 
                  which WordWise operates, without regard to conflict of law principles.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Contact Information
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>If you have any questions about these Terms of Use, please contact us:</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Email:</strong> legal@wordwise.com</p>
                  <p><strong>Address:</strong> WordWise Legal Team, 123 Book Street, Reading City, RC 12345</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
