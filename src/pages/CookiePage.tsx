import React from 'react';

const CookiePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Cookie Policy
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                What Are Cookies?
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
                  They are widely used to make websites work more efficiently and to provide information to website owners.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                How We Use Cookies
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Essential Cookies</h3>
                  <p>
                    These cookies are necessary for the website to function properly. They enable basic functions like page 
                    navigation, access to secure areas, and remembering your login status.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Cookies</h3>
                  <p>
                    These cookies help us understand how visitors interact with our website by collecting and reporting 
                    information anonymously. This helps us improve our service and user experience.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Preference Cookies</h3>
                  <p>
                    These cookies remember your preferences and settings, such as your preferred language, theme, 
                    and personalized recommendations.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Managing Cookies
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  You can control and manage cookies in various ways. Please note that removing or blocking cookies 
                  can impact your user experience and parts of our website may no longer be fully accessible.
                </p>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Browser Settings</h3>
                  <p>
                    Most browsers allow you to refuse cookies or delete them. You can usually find these settings 
                    in the "Options" or "Preferences" menu of your browser.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Cookie Consent</h3>
                  <p>
                    When you first visit our website, you'll see a cookie consent banner. You can choose which 
                    types of cookies you want to accept or reject.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Third-Party Cookies
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Some cookies on our website are set by third-party services. These may include:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Analytics services to help us understand website usage</li>
                  <li>Social media platforms for sharing content</li>
                  <li>Advertising networks for personalized ads</li>
                </ul>
                <p>
                  We do not control these third-party cookies. Please refer to their respective privacy policies 
                  for more information.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Updates to This Policy
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for 
                  other operational, legal, or regulatory reasons. We will notify you of any material changes by 
                  posting the updated policy on this page.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Contact Us
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>If you have any questions about our use of cookies, please contact us:</p>
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

export default CookiePage;
