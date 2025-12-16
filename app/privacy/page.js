import { Metadata } from 'next';

export const metadata = {
  title: 'Privacy Policy - Vishal Car Wash',
  description: 'Privacy policy for Vishal Car Wash services',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="text-gray-700 mb-4">
            We collect information that you provide directly to us when you use our services, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Personal information (name, email, phone number)</li>
            <li>Vehicle information</li>
            <li>Payment and billing information</li>
            <li>Service preferences and history</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send service-related communications</li>
            <li>Respond to your comments and questions</li>
            <li>Monitor and analyze usage and trends</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
          <p className="text-gray-700">
            We do not share your personal information with third parties except as described in this Privacy Policy.
            We may share information with service providers who perform services on our behalf.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <p className="text-gray-700">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
          <p className="text-gray-700 mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Access your personal information</li>
            <li>Request correction or deletion of your information</li>
            <li>Object to or restrict processing of your information</li>
            <li>Request data portability</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Changes to This Policy</h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mt-2 text-gray-700">
            Email: privacy@vishalcarwash.com<br />
            Phone: +91 XXXXX XXXXX
          </p>
        </section>

        <p className="text-gray-500 text-sm mt-8">
          Last updated: December 16, 2025
        </p>
      </div>
    </div>
  );
}
