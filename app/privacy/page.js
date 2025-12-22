import { ShieldCheck, Lock, User, CreditCard, History, Mail, Phone } from 'lucide-react';
import { Metadata } from 'next';

export const metadata = {
  title: 'Privacy Policy - Vishal Car Wash',
  description: 'Privacy policy for Vishal Car Wash services',
}

const Section = ({ title, icon: Icon, children }) => (
  <section className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center mb-4">
      <div className="bg-blue-50 p-2 rounded-lg mr-4">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    </div>
    <div className="pl-12">
      {children}
    </div>
  </section>
);

const ListItem = ({ children }) => (
  <li className="flex items-start mb-2">
    <span className="text-blue-500 mr-2">•</span>
    <span className="text-gray-700">{children}</span>
  </li>
);

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Privacy Policy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>

        <div className="space-y-6">
          <Section title="1. Information We Collect" icon={User}>
            <p className="text-gray-700 mb-4">
              We collect information that you provide directly to us when you use our services, including:
            </p>
            <ul className="space-y-2">
              <ListItem>Personal information (name, email, phone number)</ListItem>
              <ListItem>Vehicle information</ListItem>
              <ListItem>Payment and billing information</ListItem>
              <ListItem>Service preferences and history</ListItem>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information" icon={CreditCard}>
            <p className="text-gray-700 mb-4">
              We use the information we collect to:
            </p>
            <ul className="space-y-2">
              <ListItem>Provide, maintain, and improve our services</ListItem>
              <ListItem>Process transactions and send related information</ListItem>
              <ListItem>Send service-related communications</ListItem>
              <ListItem>Respond to your comments and questions</ListItem>
              <ListItem>Monitor and analyze usage and trends</ListItem>
            </ul>
          </Section>

          <Section title="3. Information Sharing" icon={User}>
            <p className="text-gray-700">
              We do not share your personal information with third parties except as described in this Privacy Policy.
              We may share information with service providers who perform services on our behalf.
            </p>
          </Section>

          <Section title="4. Data Security" icon={Lock}>
            <p className="text-gray-700">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </Section>

          <Section title="5. Your Rights" icon={ShieldCheck}>
            <p className="text-gray-700 mb-4">
              You have the right to:
            </p>
            <ul className="space-y-2">
              <ListItem>Access your personal information</ListItem>
              <ListItem>Request correction or deletion of your information</ListItem>
              <ListItem>Object to or restrict processing of your information</ListItem>
              <ListItem>Request data portability</ListItem>
            </ul>
          </Section>

          <Section title="6. Changes to This Policy" icon={History}>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
          </Section>

          <Section title="7. Contact Us" icon={Mail}>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-500 mr-2" />
                <a href="mailto:privacy@vishalcarwash.com" className="text-blue-600 hover:underline">mr.vishalsingh1309@gmail.com</a>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-500 mr-2" />
                <a href="tel:+919956414364" className="text-blue-600 hover:underline">+91 9956414364</a>
              </div>
            </div>
          </Section>

          <div className="text-center text-sm text-gray-500 mt-12 pt-6 border-t border-gray-200">
            <p>Last updated: December 16, 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}
