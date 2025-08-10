import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-background font-serif">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="text-primary hover:text-primary/80 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-primary mb-4">Privacy Policy</h1>
          <p className="text-accent">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-8 text-accent">
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to 12 Weeks of Asceticism. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and safeguard your information when you use our service.
            </p>
            <p>
              This policy complies with the General Data Protection Regulation (GDPR) and other applicable EU data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">2. Data Controller</h2>
            <p className="mb-4">
              For the purposes of GDPR, we are the data controller of your personal data.
            </p>
            <p>
              <strong>Contact Information:</strong><br />           
              Email: privacy@12weeksofasceticism.com<br />
            
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">3. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-primary mb-2">3.1 Personal Data</h3>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li><strong>Email Address:</strong> Used for authentication and account management</li>
              <li><strong>Account Data:</strong> Your progress, journal entries, and preferences</li>
              <li><strong>Usage Data:</strong> How you interact with our application</li>
            </ul>

            <h3 className="text-xl font-semibold text-primary mb-2">3.2 Technical Data</h3>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li><strong>IP Address:</strong> For security and analytics purposes</li>
              <li><strong>Browser Information:</strong> To ensure compatibility</li>
              <li><strong>Device Information:</strong> To optimize your experience</li>
            </ul>

            <h3 className="text-xl font-semibold text-primary mb-2">3.3 Cookies</h3>
            <p className="mb-2">We use the following types of cookies:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Necessary Cookies:</strong> Required for basic site functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand site usage (only with consent)</li>
              <li><strong>Marketing Cookies:</strong> Used for personalized content (only with consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">4. How We Use Your Data</h2>
            <p className="mb-4">We use your personal data for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide and maintain our service</li>
              <li>To authenticate and manage your account</li>
              <li>To save and display your progress and journal entries</li>
              <li>To improve our service and user experience</li>
              <li>To communicate with you about your account</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">5. Legal Basis for Processing</h2>
            <p className="mb-4">We process your personal data based on the following legal grounds:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Consent:</strong> For analytics and marketing cookies</li>
              <li><strong>Contract:</strong> To provide our service to you</li>
              <li><strong>Legitimate Interest:</strong> To improve our service and ensure security</li>
              <li><strong>Legal Obligation:</strong> To comply with applicable laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">6. Data Sharing and Transfers</h2>
            <p className="mb-4">
              We do not sell your personal data. We may share your data with:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Service Providers:</strong> Supabase (our hosting provider) for data storage and authentication</li>
              <li><strong>Legal Authorities:</strong> When required by law</li>
            </ul>
            <p className="mt-4">
              All data transfers outside the EU are made in compliance with GDPR requirements and appropriate safeguards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">7. Data Retention</h2>
            <p className="mb-4">We retain your personal data for as long as necessary to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide our services to you</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce our agreements</li>
            </ul>
            <p className="mt-4">
              Account data is retained until you delete your account or request deletion. 
              We will delete your data within 30 days of receiving a deletion request.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">8. Your Rights Under GDPR</h2>
            <p className="mb-4">You have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Right of Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for cookie-based processing</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, contact us at privacy@12weeksofasceticism.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">9. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your personal data against:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Unauthorized access</li>
              <li>Accidental loss</li>
              <li>Destruction or damage</li>
              <li>Unauthorized alteration</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">10. Children's Privacy</h2>
            <p>
              Our service is not intended for children under 16. We do not knowingly collect personal data from children under 16. 
              If you are a parent or guardian and believe your child has provided us with personal data, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">11. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page 
              and updating the "Last updated" date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">12. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this privacy policy or our data practices, please contact us:
            </p>
            <p>
              <strong>Email:</strong> privacy@12weeksofasceticism.com<br />
              <strong>Address:</strong> [Your EU Address]
            </p>
            <p className="mt-4">
              You also have the right to lodge a complaint with your local data protection authority if you believe 
              we have not addressed your concerns adequately.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage; 