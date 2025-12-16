import { Metadata } from 'next';

export const metadata = {
  title: 'Terms and Conditions - Vishal Car Wash',
  description: 'Terms and conditions for using Vishal Car Wash services',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Terms and Conditions</h1>
   
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700">
            By accessing and using the Vishal Car Wash services, you accept and agree to be bound by these Terms and Conditions. 
            If you do not agree with any part of these terms, you must not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
          <p className="text-gray-700 mb-4">
            Vishal Car Wash provides professional car washing and detailing services. We reserve the right to modify or 
            discontinue any service at any time without prior notice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Booking and Payments</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>All services must be paid for at the time of booking or upon completion of service.</li>
            <li>We accept various payment methods including credit/debit cards and digital wallets.</li>
            <li>Prices are subject to change without notice.</li>
            <li>Cancellations must be made at least 2 hours before the scheduled appointment.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Vehicle Condition</h2>
          <p className="text-gray-700 mb-4">
            Customers are responsible for removing all personal belongings from their vehicle before service. 
            Vishal Car Wash is not responsible for any lost, stolen, or damaged personal items left in the vehicle.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Liability</h2>
          <p className="text-gray-700 mb-4">
            While we take utmost care in providing our services, Vishal Car Wash shall not be liable for any damage to vehicles 
            that results from pre-existing conditions, normal wear and tear, or acts of nature.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
          <p className="text-gray-700">
            We reserve the right to modify these terms at any time. Any changes will be effective immediately upon posting 
            on our website. Your continued use of our services after such changes constitutes your acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about these Terms and Conditions, please contact us at:
          </p>
          <p className="mt-2 text-gray-700">
            Email: info@vishalcarwash.com<br />
            Phone: (123) 456-7890
          </p>
        </section>
      </div>
    </div>
  );
}
