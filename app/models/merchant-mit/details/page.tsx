'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';

export default function MerchantMITDetailsPage() {
  const [activeFlow, setActiveFlow] = useState<'cit' | 'mit' | null>('cit');
  const [animationStep, setAnimationStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnimatedFlow, setShowAnimatedFlow] = useState(true);
  const [isScribbleExpanded, setIsScribbleExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <div className="border-b border-gray-200 sticky top-0 z-40 bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link
            href="/models/merchant-mit"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Demo</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Title Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">
            Merchant Financed MIT Instalments
          </h1>
          <p className="text-lg text-gray-600">
            Complete system architecture and payment flow from Test Airlines business perspective
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Applicability: Guest & Account Customers</h3>
            <p className="text-sm text-blue-800">
              <strong>MIT instalments work for BOTH scenarios:</strong>
            </p>
            <ul className="mt-2 space-y-1 text-sm text-blue-800">
              <li>• <strong>Guest Customers (One-off Booking):</strong> No account required. Card tokens saved against booking reference (PNR). Customer provides MIT consent during checkout.</li>
              <li>• <strong>Account Customers (Saved Card):</strong> Logged-in customers with saved payment methods. Tokens linked to customer profile + booking reference.</li>
              <li>• <strong>Key Requirement:</strong> MIT always requires card tokenization and storage (via PCI-Proxy) - guest status only means "no customer account", NOT "no stored tokens".</li>
            </ul>
          </div>
        </div>

        {/* Animated End-to-End Sequence Flow */}
        <AnimatedSequenceFlow
          animationStep={animationStep}
          setAnimationStep={setAnimationStep}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          showAnimatedFlow={showAnimatedFlow}
          setShowAnimatedFlow={setShowAnimatedFlow}
        />

        {/* Flow Controls */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => setActiveFlow('cit')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeFlow === 'cit'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Initial Payment (CIT)
          </button>
          <button
            onClick={() => setActiveFlow('mit')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeFlow === 'mit'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Recurring Payment (MIT)
          </button>
        </div>

        {/* Interactive System Architecture Diagram */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            System Architecture & Payment Flow
          </h2>

          {activeFlow === 'cit' && <CITFlowDiagram />}
          {activeFlow === 'mit' && <MITFlowDiagram />}
        </div>

        {/* System Components Detail */}
        <div className="space-y-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900">System Components</h2>

          <SystemComponentDetail
            title="Test Airlines Payment Page"
            color="blue"
            description="Customer-facing payment interface for both guest and account customers"
            responsibilities={[
              'Display available instalment plans based on booking amount',
              'Show monthly payment breakdown and schedule',
              'Present terms and conditions for MIT agreement',
              'Collect payment method details (works for guest/one-off bookings)',
              'Display message: "Your payment will be debited according to the selected instalment schedule"',
              'Initiate 3DS2 authentication flow',
              'Securely transmit card data to PCI-Proxy for tokenization'
            ]}
            technicalDetails={[
              'Built with Next.js/React',
              'Integrated with NPP via REST API',
              'PCI-Proxy SDK for secure card data handling',
              'Real-time plan calculation',
              'SCA compliance built-in',
              'Supports guest checkout (no account required)'
            ]}
          />

          <SystemComponentDetail
            title="PCI-Proxy - Token Service Provider"
            color="green"
            description="Secure tokenization platform within Test Airlines estate"
            responsibilities={[
              'Tokenize raw card data into PCI-Proxy proprietary tokens',
              'Provision network tokens (Visa/Mastercard) via card schemes',
              'Secure token vault storage within airline infrastructure',
              'Token lifecycle management (expiry, updates, deletion)',
              'Provide tokens to NPP/XPP for payment processing',
              'PCI DSS Level 1 compliance for card data security',
              'Handle Token Requestor ID for network tokenization',
              'Support both CIT and MIT token operations'
            ]}
            technicalDetails={[
              'PCI-Proxy REST API v3',
              'Proprietary tokenization engine',
              'Network Token Service integration',
              'AES-256 encrypted token vault',
              'HSM (Hardware Security Module) storage',
              'Token mapping: PCI-Proxy token ↔ Network token',
              'Webhook notifications for token updates',
              'API endpoints for token CRUD operations'
            ]}
            businessRules={[
              'All card data flows through PCI-Proxy (never stored by airline)',
              'Proprietary tokens used within Test Airlines systems',
              'Network tokens used for payment authorization',
              'Tokens valid for duration of instalment plan + 90 days',
              'Automatic token updates from card schemes',
              'Token deletion on plan completion or cancellation'
            ]}
          />

          <SystemComponentDetail
            title="NPP (New Payment Platform) - Instalment Engine"
            color="purple"
            description="Core instalment management system within Test Airlines"
            responsibilities={[
              'Business Rules Engine: Determine eligible instalment options',
              'Calculate deposit amount (10-25% of total)',
              'Generate payment schedule (monthly instalments)',
              'Store instalment plan configuration (linked to PCI-Proxy tokens)',
              'Trigger MIT on due dates via scheduler',
              'Retrieve tokens from PCI-Proxy vault for MIT processing',
              'Manage payment state machine (Pending → Active → Completed)',
              'Handle failed payment retries and notifications',
              'Revenue recognition and accounting integration'
            ]}
            technicalDetails={[
              'Node.js/Java microservices',
              'PostgreSQL for plan storage (stores token references, NOT card data)',
              'Redis for caching and distributed locks',
              'Cron scheduler for MIT triggering',
              'PCI-Proxy API integration for token operations',
              'Event-driven architecture',
              'API endpoints for XPP integration',
              'Webhook handlers for PCI-Proxy token updates'
            ]}
            businessRules={[
              'Minimum booking: £500',
              'Maximum booking: £10,000',
              'Deposit: 10-25% of total',
              'Instalments: 2-12 months',
              'Final payment: 7 days before departure',
              'Retry logic: 3 attempts over 5 days',
              'Guest customers: tokens linked to booking reference',
              'Account customers: tokens linked to customer ID'
            ]}
          />

          <SystemComponentDetail
            title="XPP (Payment Orchestrator)"
            color="indigo"
            description="Intelligent payment routing and orchestration layer"
            responsibilities={[
              'Route payment requests to appropriate PSP (CyberSource)',
              'Abstract PSP-specific logic from NPP',
              'Handle PSP failover and redundancy',
              'Normalize payment responses across PSPs',
              'Manage payment method routing rules',
              'Transaction logging and monitoring',
              'Retry orchestration for failed payments',
              'Webhook management from PSPs'
            ]}
            technicalDetails={[
              'API Gateway pattern',
              'Multi-PSP support',
              'Circuit breaker implementation',
              'Real-time monitoring dashboard',
              'Webhook receiver and router',
              'Transaction reconciliation',
              'Idempotency key management'
            ]}
          />

          <SystemComponentDetail
            title="CyberSource PSP"
            color="orange"
            description="Payment Service Provider for transaction processing"
            responsibilities={[
              'Process CIT with 3DS2 authentication',
              'Execute MIT transactions using network tokens from PCI-Proxy',
              'Fraud screening via Decision Manager',
              'Authorization and capture processing',
              'Send payment status webhooks to XPP',
              'Transaction reporting and reconciliation',
              'Chargeback and dispute management',
              'PCI DSS Level 1 compliance'
            ]}
            technicalDetails={[
              'CyberSource REST API v2',
              'Accepts network tokens for payment processing',
              '3DS2 authentication server',
              'Decision Manager for fraud',
              'Secure Acceptance integration',
              'Webhook notifications',
              'Real-time transaction status updates'
            ]}
            apiExamples={[
              {
                type: 'CIT Request',
                code: `{
  "processingInformation": {
    "commerceIndicator": "internet",
    "authorizationOptions": {
      "initiator": {
        "type": "customer",
        "credentialStoredOnFile": "true"
      }
    }
  },
  "orderInformation": {
    "amountDetails": {
      "totalAmount": "120.00",
      "currency": "GBP"
    }
  }
}`
              },
              {
                type: 'MIT Request',
                code: `{
  "processingInformation": {
    "commerceIndicator": "recurring",
    "authorizationOptions": {
      "initiator": {
        "type": "merchant",
        "merchantInitiatedTransaction": {
          "reason": "instalment"
        }
      }
    }
  },
  "paymentInformation": {
    "customer": {
      "customerId": "network_token_id"
    }
  }
}`
              }
            ]}
          />

          <SystemComponentDetail
            title="Amadeus GDS"
            color="teal"
            description="Global Distribution System for reservations"
            responsibilities={[
              'Create PNR with instalment payment flag',
              'Track payment schedule against booking',
              'Validate payment timeline vs departure date',
              'Manage ticket issuance timing',
              'Handle booking amendments with instalment impact',
              'Queue management for payment follow-ups',
              'Cancellation and refund coordination'
            ]}
            technicalDetails={[
              'Amadeus SOAP/REST APIs',
              'PNR remarks for instalment tracking',
              'Queue category management',
              'Cryptic command integration',
              'Real-time availability checks'
            ]}
          />
        </div>

        {/* CIT vs MIT Comparison */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">CIT vs MIT: Key Differences</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <ComparisonCard
              title="CIT (Customer-Initiated Transaction)"
              badge="Initial Payment"
              color="green"
              items={[
                { label: 'Trigger', value: 'Customer action on payment page (guest or account)' },
                { label: 'Authentication', value: 'SCA Required (3DS2)' },
                { label: 'Customer Message', value: '"Future payments will be debited automatically"' },
                { label: 'Flow', value: 'Payment Page → PCI-Proxy (tokenize) → NPP → XPP → CyberSource' },
                { label: 'Purpose', value: 'Initial deposit + create PCI-Proxy & network tokens' },
                { label: 'Consent', value: 'Explicit MIT agreement required' },
                { label: 'Token Storage', value: 'PCI-Proxy vault (linked to booking ref or customer ID)' }
              ]}
            />

            <ComparisonCard
              title="MIT (Merchant-Initiated Transaction)"
              badge="Recurring Payment"
              color="blue"
              items={[
                { label: 'Trigger', value: 'NPP scheduler on due date' },
                { label: 'Authentication', value: 'No SCA Required' },
                { label: 'Customer Message', value: 'Email: "Payment processed successfully"' },
                { label: 'Flow', value: 'NPP → PCI-Proxy (retrieve token) → XPP → CyberSource' },
                { label: 'Purpose', value: 'Monthly instalment collection using stored token' },
                { label: 'Consent', value: 'Uses existing MIT agreement from CIT' },
                { label: 'Token Usage', value: 'Network token retrieved from PCI-Proxy vault' }
              ]}
            />
          </div>
        </div>

        {/* Technical Implementation Notes */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-4">Critical Implementation Notes</h3>
          <ul className="space-y-2 text-sm text-amber-800">
            <li>• <strong>Idempotency:</strong> All payment requests must include unique transaction IDs to prevent duplicate charges</li>
            <li>• <strong>Token Security:</strong> All card data flows through PCI-Proxy (PCI DSS Level 1). Proprietary and network tokens stored in PCI-Proxy encrypted vault with HSM. Never store raw card data or tokens in application database.</li>
            <li>• <strong>Guest Customers:</strong> MIT works for both guest and account customers. Tokens linked to booking reference (PNR) for guests, customer ID for account holders.</li>
            <li>• <strong>State Management:</strong> Use distributed locks (Redis) when processing instalments to avoid race conditions</li>
            <li>• <strong>Retry Logic:</strong> Exponential backoff with maximum 3 attempts over 5 days</li>
            <li>• <strong>Reconciliation:</strong> Daily reconciliation between NPP, XPP, CyberSource, and PCI-Proxy transaction logs</li>
            <li>• <strong>Monitoring:</strong> Real-time alerts for failed MITs, token expiry, token updates, and system errors</li>
            <li>• <strong>Token Lifecycle:</strong> PCI-Proxy automatically handles network token updates from card schemes (expiry, card replacement)</li>
          </ul>
        </div>

        {/* Technical Scribble: Amadeus Hybrid Architecture Analysis - Collapsible */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 overflow-hidden">
          <button
            onClick={() => setIsScribbleExpanded(!isScribbleExpanded)}
            className="w-full p-6 flex items-center justify-between hover:bg-amber-100/50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                📝
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-bold text-amber-900 mb-1">Technical Scribble: Hybrid Architecture Analysis</h3>
                <p className="text-sm text-amber-700">Can Amadeus Instalment Engine be used as standalone decision layer within BA's Merchant-Financed MIT solution?</p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 text-amber-600 transition-transform ${isScribbleExpanded ? 'rotate-90' : ''}`} />
          </button>

          {isScribbleExpanded && (
            <div className="px-6 pb-6 space-y-4">
              {/* Proposed Architecture */}
              <div className="bg-white rounded-xl p-4 border border-amber-200">
                <div className="font-semibold text-gray-900 mb-2 text-sm">💡 Proposed Hybrid Architecture</div>
                <div className="text-xs text-gray-700 space-y-1">
                  <div><strong>Amadeus Instalment Engine:</strong> Decision/rules layer only (eligibility, risk, criteria, instalment count)</div>
                  <div><strong>BA's NPP:</strong> Execution layer (actual MIT payments, notifications, tokenization)</div>
                  <div className="mt-2 pt-2 border-t border-gray-200 text-gray-600">
                    <strong>Rationale:</strong> Leverage Amadeus risk expertise while maintaining control over payment execution
                  </div>
                </div>
              </div>

              {/* Critical Challenges */}
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <div className="font-semibold text-red-900 mb-2 text-sm">⚠️ Critical Challenges Identified</div>
                <div className="text-xs text-gray-700 space-y-2">
                  <div className="flex gap-2">
                    <span className="text-red-600 font-bold">1.</span>
                    <div>
                      <strong>Product Architecture Mismatch:</strong> Amadeus instalment engine is typically tightly coupled with their payment processing (XPP). Risk assessment and eligibility rules designed to work with their own settlement flows.
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-red-600 font-bold">2.</span>
                    <div>
                      <strong>Risk Assessment Disconnect:</strong> If Amadeus approves "6 instalments" but BA's NPP executes MITs, who bears risk if payments fail? Amadeus risk models calibrated based on their own payment success rates and recovery mechanisms. Using eligibility decision without payment execution creates liability gap.
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-red-600 font-bold">3.</span>
                    <div>
                      <strong>Commercial Model Conflict:</strong> Payment platforms monetize through transaction processing fees, not software licensing. No financial incentive for Amadeus without processing fees. Why would they expose risk IP while processing happens elsewhere?
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-red-600 font-bold">4.</span>
                    <div>
                      <strong>API Availability:</strong> Amadeus would need standalone eligibility API (unlikely to exist). Their products are bundled payment solutions, not decision APIs.
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Flow Analysis */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="font-semibold text-blue-900 mb-2 text-sm">🔄 Theoretical Integration Flow</div>
                <div className="text-xs text-gray-700 font-mono bg-white p-3 rounded border border-blue-100 space-y-1">
                  <div>Customer checkout →</div>
                  <div className="ml-4">Amadeus API (eligibility check) →</div>
                  <div className="ml-4">Amadeus returns: "Approved for 3 instalments" →</div>
                  <div className="ml-4">BA's NPP stores decision →</div>
                  <div className="ml-4">BA's NPP does initial CIT (with SCA) →</div>
                  <div className="ml-4">BA's NPP schedules MIT transactions →</div>
                  <div className="ml-4">BA's NPP sends notifications</div>
                </div>
                <div className="mt-2 text-xs text-blue-800">
                  <strong>Issue:</strong> Integration complexity outweighs benefits - BA would build most logic in NPP anyway
                </div>
              </div>

              {/* Recommended Alternatives */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="font-semibold text-green-900 mb-2 text-sm">✅ Recommended Alternatives</div>
                <div className="text-xs text-gray-700 space-y-2">
                  <div className="flex gap-2">
                    <span className="text-green-600 font-bold">A.</span>
                    <div>
                      <strong>Use Amadeus end-to-end for acquirer-driven:</strong> Let Amadeus handle full flow for their instalment products (eligibility + execution)
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-green-600 font-bold">B.</span>
                    <div>
                      <strong>Use Amadeus end-to-end for FlexPay VCC:</strong> Full orchestration through XPP, FlexPay, DAPI, UATP
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-green-600 font-bold">C.</span>
                    <div>
                      <strong>Build BA's own rules engine in NPP for merchant-financed MIT:</strong> Own the customer experience fully, control data and risk models, no external dependencies for core payment capability. Eligibility rules aren't complex: country lists, amount thresholds, channel configs.
                    </div>
                  </div>
                </div>
              </div>

              {/* Conclusion */}
              <div className="bg-gray-100 rounded-xl p-4 border border-gray-300">
                <div className="font-semibold text-gray-900 mb-2 text-sm">📊 Assessment Conclusion</div>
                <div className="text-xs text-gray-700 space-y-1">
                  <div><strong>Feasibility:</strong> <span className="text-red-600 font-bold">NOT FEASIBLE</span> as proposed</div>
                  <div><strong>Reason:</strong> Amadeus doesn't sell instalment engine as standalone decision service. Commercial model doesn't align. Risk ownership becomes unclear.</div>
                  <div className="mt-2 pt-2 border-t border-gray-300">
                    <strong className="text-green-700">Recommended Path:</strong> Keep solutions separate and clean - no half-and-half hybrids. Use Amadeus end-to-end where appropriate (acquirer-driven, FlexPay). Build BA's own rules engine in NPP for merchant-financed MIT with full control and ownership.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// CIT Flow Diagram Component
function CITFlowDiagram() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-green-700 mb-2">Initial Payment Flow (CIT)</h3>
        <p className="text-sm text-gray-600">Customer initiates first payment with Strong Customer Authentication</p>
      </div>

      <div className="space-y-4">
        {/* Step 1: Customer on Payment Page */}
        <FlowStep
          number="1"
          system="Payment Page"
          color="blue"
          title="Customer Selects Instalment Plan"
          details={[
            'Customer views booking total: £480',
            'NPP calculates available plans: 3, 6, or 12 months',
            'Customer selects 6-month plan',
            'Display: Deposit £120 today, then £60/month × 5',
            'Message shown: "Your card will be charged £60 on the 15th of each month for 5 months"'
          ]}
          dataFlow="POST /npp/api/calculate-plans → Returns: [{months: 3, deposit: 160}, {months: 6, deposit: 120}, ...]"
        />

        {/* Step 2: Business Rules Check */}
        <FlowStep
          number="2"
          system="NPP - Business Rules Engine"
          color="purple"
          title="Eligibility Check & Plan Generation"
          details={[
            'Check booking amount: £480 ✓ (Min £500 ✗ - adjust rules or show error)',
            'Check departure date: 45 days ahead ✓',
            'Check customer location: UK ✓',
            'Check card type: Visa ✓',
            'Generate instalment schedule with due dates',
            'Create instalment plan record in database'
          ]}
          dataFlow="Internal rules engine → Plan ID: INS-2025-001"
        />

        {/* Step 3: Customer Enters Payment Details */}
        <FlowStep
          number="3"
          system="Payment Page"
          color="blue"
          title="Payment Method Collection"
          details={[
            'Customer enters card details: 4242 4242 4242 4242',
            'Accept MIT agreement checkbox',
            'Terms: "I authorize Test Airlines to charge my card according to the instalment schedule"',
            'Guest customer: No account login required',
            'Click "Pay Deposit" button',
            'Card data securely transmitted to PCI-Proxy'
          ]}
          dataFlow="POST /pci-proxy/tokenize → Secure card data transmission"
        />

        {/* Step 3.5: PCI-Proxy Tokenization */}
        <FlowStep
          number="3.5"
          system="PCI-Proxy"
          color="green"
          title="Card Tokenization & Network Token Provisioning"
          details={[
            'Receive raw card data (PCI-Proxy is PCI DSS Level 1)',
            'Create proprietary PCI-Proxy token: 4A2B4C2D4E2F4G2H',
            'Request network token from Visa via Token Requestor ID',
            'Visa provisions network token: 4V5S6A7T8K9N0P1Q',
            'Store token mapping in encrypted vault',
            'Return both tokens to NPP',
            'Link tokens to booking reference (for guest) or customer ID'
          ]}
          dataFlow="PCI-Proxy Token: 4A2B4C2D4E2F4G2H | Network Token: 4V5S6A7T8K9N0P1Q"
        />

        {/* Step 4: 3DS2 Authentication */}
        <FlowStep
          number="4"
          system="CyberSource - 3DS2"
          color="orange"
          title="Strong Customer Authentication"
          details={[
            'Customer redirected to bank 3DS2 page',
            'Enter OTP or biometric authentication',
            '3DS2 authentication successful',
            'Authentication result returned to payment page',
            'Network token (from PCI-Proxy) validated for use'
          ]}
          dataFlow="3DS2 auth → ECI: 05 (fully authenticated) → Ready for CIT"
        />

        {/* Step 5: CIT Authorization */}
        <FlowStep
          number="5"
          system="NPP → XPP → CyberSource"
          color="purple"
          title="Process CIT Authorization"
          details={[
            'NPP retrieves network token from PCI-Proxy: 4V5S6A7T8K9N0P1Q',
            'NPP sends payment request to XPP with network token',
            'XPP routes to CyberSource with CIT parameters',
            'CyberSource processes authorization using network token (£120)',
            'Authorization approved by Visa',
            'Transaction linked to PCI-Proxy tokens in NPP database',
            'Booking reference linked to token for future MIT retrieval'
          ]}
          dataFlow="POST /xpp/api/authorize → Transaction ID: TXN-CIT-001 → Status: APPROVED"
        />

        {/* Step 6: Capture & Booking */}
        <FlowStep
          number="6"
          system="NPP + Amadeus"
          color="purple"
          title="Capture Payment & Create Booking"
          details={[
            'Capture £120 from authorization',
            'Update instalment plan status: ACTIVE',
            'Create PNR in Amadeus with instalment flag',
            'Schedule next MIT for 30 days later',
            'Send confirmation email to customer',
            'Display booking reference: ABC123'
          ]}
          dataFlow="PNR: ABC123 | Instalment Plan: INS-2025-001 | Next MIT: 2025-12-01"
        />
      </div>
    </div>
  );
}

// MIT Flow Diagram Component
function MITFlowDiagram() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-blue-700 mb-2">Recurring Payment Flow (MIT)</h3>
        <p className="text-sm text-gray-600">Automated monthly payment without customer interaction</p>
      </div>

      <div className="space-y-4">
        {/* Step 1: Scheduler Trigger */}
        <FlowStep
          number="1"
          system="NPP - MIT Scheduler"
          color="purple"
          title="Identify Due Instalments & Retrieve Tokens"
          details={[
            'Cron job runs daily at 02:00 UTC',
            'Query database for instalments due today',
            'Find plan INS-2025-001: £60 due on 2025-12-01',
            'Verify booking still active in Amadeus',
            'Retrieve tokens from PCI-Proxy vault using booking reference (PNR: ABC123)',
            'PCI-Proxy returns: 4A2B4C2D4E2F4G2H and 4V5S6A7T8K9N0P1Q',
            'Prepare MIT payment request with network token'
          ]}
          dataFlow="SELECT * FROM instalments WHERE due_date = CURRENT_DATE AND status = 'PENDING' → GET /pci-proxy/vault/tokens/{booking_ref}"
        />

        {/* Step 2: Pre-notification */}
        <FlowStep
          number="2"
          system="NPP - Notifications"
          color="purple"
          title="Customer Pre-Notification"
          details={[
            'Send reminder email 3 days before: "Upcoming payment on Dec 1"',
            'SMS notification (if enabled): "£60 will be charged in 3 days"',
            'Allow customer to update payment method if needed',
            'Check for sufficient funds (optional pre-auth check)'
          ]}
          dataFlow="Email sent via SendGrid | SMS via Twilio"
        />

        {/* Step 3: MIT Execution */}
        <FlowStep
          number="3"
          system="NPP → XPP → CyberSource"
          color="indigo"
          title="Execute MIT Transaction"
          details={[
            'NPP sends MIT request to XPP with network token: 4V5S6A7T8K9N0P1Q',
            'XPP adds routing logic and idempotency key',
            'XPP forwards to CyberSource with MIT parameters',
            'commerceIndicator: "recurring"',
            'initiator: "merchant"',
            'reason: "instalment"',
            'previousTransactionId: TXN-CIT-001 (original CIT)',
            'Token source: PCI-Proxy vault (retrieved in Step 1)'
          ]}
          dataFlow="POST /xpp/api/charge → MIT Transaction ID: TXN-MIT-002"
        />

        {/* Step 4: Authorization */}
        <FlowStep
          number="4"
          system="CyberSource → Card Network"
          color="orange"
          title="Process MIT Authorization"
          details={[
            'CyberSource sends MIT auth to Visa network',
            'No 3DS2 required (MIT exemption)',
            'Card issuer approves transaction',
            'Authorization code received: 123456',
            'Webhook sent to XPP: Payment successful'
          ]}
          dataFlow="Authorization successful | Amount: £60.00 | Auth Code: 123456"
        />

        {/* Step 5: Success Handling */}
        <FlowStep
          number="5"
          system="NPP - Payment Processing"
          color="purple"
          title="Update Records & Notify"
          details={[
            'Update instalment record: status = PAID',
            'Update plan: payments_completed = 2/6',
            'Capture funds (if not auto-captured)',
            'Update PNR in Amadeus with payment',
            'Send success email: "Payment processed: £60"',
            'Schedule next MIT for January 1'
          ]}
          dataFlow="Instalment 2/6 completed | Next MIT scheduled: 2026-01-01"
        />

        {/* Step 6: Failure Handling (if applicable) */}
        <FlowStep
          number="6"
          system="NPP - Retry Logic"
          color="red"
          title="Handle Failed Payment (If Occurs)"
          details={[
            'If MIT fails: Log failure reason',
            'Schedule retry #1 in 24 hours',
            'Send failed payment email to customer',
            'After 3 failed attempts: Escalate to manual review',
            'Cancel booking if payment not received after 5 days',
            'Process refund for previously paid instalments'
          ]}
          dataFlow="Retry attempt 1/3 | Next retry: 2025-12-02 02:00"
        />
      </div>
    </div>
  );
}

// Flow Step Component
function FlowStep({
  number,
  system,
  color,
  title,
  details,
  dataFlow
}: {
  number: string;
  system: string;
  color: string;
  title: string;
  details: string[];
  dataFlow: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
    indigo: 'bg-indigo-50 border-indigo-200',
    orange: 'bg-orange-50 border-orange-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    teal: 'bg-teal-50 border-teal-200',
  }[color];

  return (
    <div className={`${colorClasses} border-2 rounded-xl p-5`}>
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-${color}-200 flex items-center justify-center font-bold text-${color}-900`}>
          {number}
        </div>
        <div className="flex-1">
          <div className="mb-2">
            <span className={`px-2 py-1 bg-${color}-200 text-${color}-900 text-xs rounded-full font-semibold`}>
              {system}
            </span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>
          <ul className="space-y-1.5 mb-3">
            {details.map((detail, idx) => (
              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
          <div className="bg-white/60 rounded p-3 border border-gray-200">
            <div className="text-xs font-mono text-gray-600">{dataFlow}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// System Component Detail Component
function SystemComponentDetail({
  title,
  color,
  description,
  responsibilities,
  technicalDetails,
  businessRules,
  apiExamples
}: {
  title: string;
  color: string;
  description: string;
  responsibilities: string[];
  technicalDetails: string[];
  businessRules?: string[];
  apiExamples?: Array<{ type: string; code: string }>;
}) {
  const colorClasses = {
    blue: 'border-blue-300',
    purple: 'border-purple-300',
    indigo: 'border-indigo-300',
    orange: 'border-orange-300',
    teal: 'border-teal-300',
    green: 'border-green-300',
  }[color];

  return (
    <div className={`border-l-4 ${colorClasses} bg-white rounded-r-xl p-6 shadow-sm`}>
      <div className="mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Responsibilities</h4>
          <ul className="space-y-1.5">
            {responsibilities.map((item, idx) => (
              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-blue-500 mt-1">▸</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Technical Details</h4>
          <ul className="space-y-1.5">
            {technicalDetails.map((item, idx) => (
              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-purple-500 mt-1">▸</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {businessRules && (
        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Business Rules</h4>
          <div className="grid md:grid-cols-2 gap-2">
            {businessRules.map((rule, idx) => (
              <div key={idx} className="text-sm text-gray-700">
                • {rule}
              </div>
            ))}
          </div>
        </div>
      )}

      {apiExamples && (
        <div className="mt-4 space-y-3">
          {apiExamples.map((example, idx) => (
            <div key={idx}>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">{example.type}</h4>
              <pre className="bg-gray-50 rounded p-3 overflow-x-auto text-xs font-mono text-gray-700 border border-gray-200">
                {example.code}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Animated Sequence Flow Component
function AnimatedSequenceFlow({
  animationStep,
  setAnimationStep,
  isPlaying,
  setIsPlaying,
  showAnimatedFlow,
  setShowAnimatedFlow
}: {
  animationStep: number;
  setAnimationStep: (step: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  showAnimatedFlow: boolean;
  setShowAnimatedFlow: (show: boolean) => void;
}) {
  // Define all animation sequence steps
  const sequenceSteps = [
    {
      step: 1,
      title: "Customer Arrives at Payment Page",
      system: "Test Airlines Payment Page",
      color: "blue",
      description: "Customer completes booking and reaches checkout",
      details: [
        "Booking: London to New York - £480",
        "Customer clicks 'Proceed to Payment'",
        "Payment page loads with available payment options"
      ],
      customerMessage: null,
      dataFlow: null
    },
    {
      step: 2,
      title: "Instalment Engine Calculates Available Plans",
      system: "NPP Instalment Engine",
      color: "purple",
      description: "Business rules engine evaluates eligibility and calculates instalment options",
      details: [
        "Check booking amount: £480 ≥ £500 minimum ❌",
        "Adjusted example: £600 booking amount ✓",
        "Check departure date: 45 days ahead ✓",
        "Check customer location: UK ✓",
        "Calculate deposit: 20% = £120",
        "Generate plans: 3, 6, 12 months options"
      ],
      customerMessage: "Spread the cost with flexible payment plans",
      dataFlow: "POST /npp/api/calculate-plans → [{months: 3, deposit: 200}, {months: 6, deposit: 120}, {months: 12, deposit: 60}]"
    },
    {
      step: 3,
      title: "Customer Views Instalment Options",
      system: "Test Airlines Payment Page",
      color: "blue",
      description: "Available instalment plans displayed to customer",
      details: [
        "Option 1: Pay in 3 months - £200 deposit, then £200/month × 2",
        "Option 2: Pay in 6 months - £120 deposit, then £80/month × 5",
        "Option 3: Pay in 12 months - £60 deposit, then £45/month × 11",
        "Each option shows: total cost, monthly amount, payment dates",
        "Terms: 'Card details will be securely saved for future payments'"
      ],
      customerMessage: "Choose your payment plan - No interest on 6-month option!",
      dataFlow: null
    },
    {
      step: 4,
      title: "Customer Selects 6-Month Plan",
      system: "Test Airlines Payment Page",
      color: "blue",
      description: "Customer chooses preferred instalment plan",
      details: [
        "Customer selects: 6-month plan",
        "Payment schedule displayed:",
        "  Today: £120 deposit",
        "  Month 2-6: £80/month on the 15th",
        "Customer enters card details: 4242 4242 4242 4242",
        "Customer accepts MIT agreement checkbox"
      ],
      customerMessage: "Your card will be charged £80 on the 15th of each month for 5 months starting next month",
      dataFlow: "Selected plan: {id: 'PLAN-6M', deposit: 120, instalments: 5, amount: 80}"
    },
    {
      step: 5,
      title: "Card Data Sent to PCI-Proxy for Tokenization",
      system: "PCI-Proxy",
      color: "green",
      description: "Secure tokenization of customer card details",
      details: [
        "Raw card data transmitted securely (TLS 1.3)",
        "PCI-Proxy receives: 4242 4242 4242 4242, exp: 12/26",
        "Create proprietary token: 4A2B4C2D4E2F4G2H",
        "Request network token from Visa Token Service",
        "Visa provisions network token: 4V5S6A7T8K9N0P1Q",
        "Store token mapping in HSM-encrypted vault",
        "Link tokens to booking reference: PNR-ABC123 (guest customer)"
      ],
      customerMessage: "Your payment details are being securely processed...",
      dataFlow: "POST /pci-proxy/tokenize → {pci_token: '4A2B4C2D4E2F4G2H', network_token: '4V5S6A7T8K9N0P1Q'}"
    },
    {
      step: 6,
      title: "3DS2 Strong Customer Authentication",
      system: "CyberSource 3DS2",
      color: "orange",
      description: "Customer completes authentication for initial payment",
      details: [
        "Customer redirected to bank's 3DS2 page",
        "Bank sends OTP to customer's phone: 123456",
        "Customer enters OTP in authentication page",
        "Bank verifies OTP ✓",
        "Authentication successful: ECI 05 (fully authenticated)",
        "Customer returned to payment page"
      ],
      customerMessage: "Enter the code sent to your phone ending in ****5678",
      dataFlow: "3DS2 Auth → {authenticationTransactionId: '3ds-txn-001', eci: '05', cavv: 'base64string'}"
    },
    {
      step: 7,
      title: "Process Initial Payment (CIT)",
      system: "NPP → XPP → CyberSource",
      color: "purple",
      description: "First instalment payment authorization and capture",
      details: [
        "NPP creates instalment plan record: INS-2025-001",
        "NPP retrieves network token from PCI-Proxy: 4V5S6A7T8K9N0P1Q",
        "NPP sends CIT request to XPP with 3DS2 auth data",
        "XPP routes to CyberSource with parameters:",
        "  commerceIndicator: 'internet'",
        "  initiator.type: 'customer'",
        "  credentialStoredOnFile: 'true'",
        "CyberSource authorizes £120 deposit",
        "Authorization approved: Auth Code 654321"
      ],
      customerMessage: "Processing your deposit payment of £120...",
      dataFlow: "POST /xpp/api/authorize → {transactionId: 'TXN-CIT-001', status: 'APPROVED', authCode: '654321'}"
    },
    {
      step: 8,
      title: "Capture Payment & Create Booking",
      system: "NPP + Amadeus",
      color: "purple",
      description: "Finalize payment and create reservation",
      details: [
        "Capture £120 from authorization",
        "Update instalment plan status: ACTIVE",
        "Schedule next MIT payment: 2025-12-01 (30 days)",
        "Create PNR in Amadeus: ABC123",
        "Add remark: 'INSTALMENT PLAN INS-2025-001'",
        "Issue ticket or hold based on policy",
        "Send confirmation email to customer"
      ],
      customerMessage: "Payment successful! Your booking is confirmed. Reference: ABC123",
      dataFlow: "PNR: ABC123 | Plan: INS-2025-001 | Next payment: 2025-12-01 | Amount: £80"
    },
    {
      step: 9,
      title: "30 Days Later: MIT Scheduler Triggers",
      system: "NPP MIT Scheduler",
      color: "purple",
      description: "Automated monthly payment processing begins",
      details: [
        "Cron job runs daily at 02:00 UTC",
        "Query: SELECT * FROM instalments WHERE due_date = '2025-12-01'",
        "Found: Plan INS-2025-001, £80 due today",
        "Verify booking status in Amadeus: ACTIVE ✓",
        "Retrieve tokens from PCI-Proxy using PNR: ABC123",
        "PCI-Proxy returns: 4V5S6A7T8K9N0P1Q",
        "Prepare MIT payment request"
      ],
      customerMessage: null,
      dataFlow: "GET /pci-proxy/vault/tokens/PNR-ABC123 → {network_token: '4V5S6A7T8K9N0P1Q'}"
    },
    {
      step: 10,
      title: "Customer Pre-Notification (3 Days Before)",
      system: "NPP Notifications",
      color: "purple",
      description: "Reminder sent to customer before payment",
      details: [
        "Send email 3 days before due date",
        "Subject: 'Upcoming payment for booking ABC123'",
        "Body: '£80 will be charged on Dec 1'",
        "Provide link to update payment method if needed",
        "Optional SMS notification sent",
        "Allow customer 3 days to update card if needed"
      ],
      customerMessage: "Upcoming Payment: £80 will be charged to your card ending in 4242 on Dec 1, 2025. Need to update? Click here.",
      dataFlow: "Email sent via SendGrid | SMS via Twilio"
    },
    {
      step: 11,
      title: "Execute MIT Transaction",
      system: "NPP → XPP → CyberSource",
      color: "indigo",
      description: "Automated recurring payment processing",
      details: [
        "NPP sends MIT request to XPP with network token",
        "XPP adds idempotency key: MIT-001-20240215",
        "XPP routes to CyberSource with MIT parameters:",
        "  commerceIndicator: 'recurring'",
        "  initiator.type: 'merchant'",
        "  merchantInitiatedTransaction.reason: 'instalment'",
        "  previousTransactionId: 'TXN-CIT-001'",
        "CyberSource sends to Visa for authorization",
        "No 3DS2 required (MIT exemption)"
      ],
      customerMessage: null,
      dataFlow: "POST /xpp/api/charge → {transactionId: 'TXN-MIT-002', idempotencyKey: 'MIT-001-20240215'}"
    },
    {
      step: 12,
      title: "MIT Authorization Successful",
      system: "CyberSource → Visa",
      color: "orange",
      description: "Card network approves recurring payment",
      details: [
        "Visa receives MIT authorization request",
        "Card issuer checks: available balance, fraud rules",
        "Issuer approves transaction ✓",
        "Authorization code: 789012",
        "Amount captured: £80.00",
        "Webhook sent to XPP: Payment successful",
        "XPP forwards notification to NPP"
      ],
      customerMessage: null,
      dataFlow: "Auth successful | Amount: £80.00 | Auth Code: 789012 | Status: CAPTURED"
    },
    {
      step: 13,
      title: "Update Records & Notify Customer",
      system: "NPP",
      color: "purple",
      description: "Record payment and inform customer",
      details: [
        "Update instalment record: status = PAID, paid_at = '2025-12-01'",
        "Update plan: payments_completed = 2/6",
        "Update Amadeus PNR with payment confirmation",
        "Schedule next MIT: 2026-01-01",
        "Send success email to customer",
        "Update accounting system for revenue recognition"
      ],
      customerMessage: "Payment Successful! £80 has been charged to your card ending in 4242. Next payment: Jan 1, 2026 (£80)",
      dataFlow: "Instalment 2/6 completed | Remaining: 4 × £80 | Next: 2026-01-01"
    },
    {
      step: 14,
      title: "Payment Failure Scenario (If Occurs)",
      system: "NPP - Retry Logic",
      color: "red",
      description: "Handling declined MIT payment",
      details: [
        "MIT authorization declined by issuer",
        "Decline reason: 'Insufficient funds'",
        "Log failure: attempt 1/3",
        "Schedule retry #1: 24 hours later",
        "Send payment failed email to customer (Using Pay-by-link (PBL))",
        "Email includes: decline reason, retry schedule",
        "Provide link to update payment method immediately"
      ],
      customerMessage: "Payment Unsuccessful: We were unable to process your payment of £80. We will retry in 24 hours. Update payment method now to avoid disruption.",
      dataFlow: "Status: DECLINED | Reason: Insufficient funds | Retry scheduled: 2025-12-02 02:00 UTC"
    },
    {
      step: 15,
      title: "Customer Updates Payment Method",
      system: "Test Airlines Payment Portal",
      color: "blue",
      description: "Customer provides new card details",
      details: [
        "Customer clicks 'Update Payment Method' link in email",
        "Redirected to secure payment portal",
        "Enter booking reference: ABC123",
        "Enter new card: 5555 5555 5555 4444",
        "Submit new payment method",
        "Card sent to PCI-Proxy for tokenization",
        "New tokens generated and linked to booking"
      ],
      customerMessage: "Update your payment method to continue your instalment plan",
      dataFlow: "POST /pci-proxy/tokenize → New tokens: {5M2N4P6Q8R0S2T4U, 5M6C7D8E9F0G1H2J}"
    },
    {
      step: 16,
      title: "Retry MIT with New Payment Method",
      system: "NPP → XPP → CyberSource",
      color: "purple",
      description: "Automated retry with updated card",
      details: [
        "NPP retrieves new network token: 5M6C7D8E9F0G1H2J",
        "Retry MIT transaction with new token",
        "Send to CyberSource via XPP",
        "Authorization successful ✓",
        "Update instalment plan with new token reference",
        "Reset retry counter",
        "Send success confirmation to customer"
      ],
      customerMessage: "Payment Successful! Your instalment plan has been updated with the new payment method.",
      dataFlow: "Retry successful | New auth code: 456789 | Plan updated with new token"
    },
    {
      step: 17,
      title: "Ongoing MIT Payments Continue",
      system: "NPP Scheduler",
      color: "purple",
      description: "Monthly payments process automatically",
      details: [
        "Month 3: £80 charged successfully",
        "Month 4: £80 charged successfully",
        "Month 5: £80 charged successfully",
        "Month 6: £80 charged successfully (final payment)",
        "All 6 payments completed",
        "Total paid: £520 (£120 + 5 × £80)",
        "Instalment plan status: COMPLETED"
      ],
      customerMessage: "Final Payment Complete! Your instalment plan is now fully paid. Thank you for choosing Test Airlines.",
      dataFlow: "Plan INS-2025-001: COMPLETED | Total payments: 6/6 | Total paid: £520"
    },
    {
      step: 18,
      title: "Plan Completion & Token Cleanup",
      system: "NPP + PCI-Proxy",
      color: "green",
      description: "Finalize instalment plan and clean up stored data",
      details: [
        "Mark instalment plan as COMPLETED",
        "Send completion email to customer",
        "Update accounting for final revenue recognition",
        "Close Amadeus PNR or mark as fully paid",
        "Request token deletion from PCI-Proxy (after 90-day retention)",
        "Archive plan data for compliance (7 years)",
        "Generate completion report for finance"
      ],
      customerMessage: "Your instalment plan is complete! We look forward to welcoming you on board your flight on May 1, 2026.",
      dataFlow: "DELETE /pci-proxy/vault/tokens/PNR-ABC123 (scheduled after 90 days)"
    }
  ];

  // Auto-play effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && animationStep < sequenceSteps.length - 1) {
      interval = setInterval(() => {
        setAnimationStep(prev => prev + 1);
      }, 4000); // 4 seconds per step
    } else if (animationStep >= sequenceSteps.length - 1) {
      setIsPlaying(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, animationStep, sequenceSteps.length, setAnimationStep, setIsPlaying]);

  const currentStep = sequenceSteps[animationStep];

  const handlePlay = () => {
    if (animationStep >= sequenceSteps.length - 1) {
      setAnimationStep(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setAnimationStep(0);
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (animationStep < sequenceSteps.length - 1) {
      setAnimationStep(animationStep + 1);
    }
  };

  const handlePrevious = () => {
    if (animationStep > 0) {
      setAnimationStep(animationStep - 1);
    }
  };

  if (!showAnimatedFlow) {
    return (
      <div className="mb-12">
        <button
          onClick={() => setShowAnimatedFlow(true)}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          Show Animated End-to-End Flow
        </button>
      </div>
    );
  }

  const systemColors = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', badge: 'bg-blue-600' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-700', badge: 'bg-purple-600' },
    green: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700', badge: 'bg-green-600' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700', badge: 'bg-orange-600' },
    indigo: { bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-700', badge: 'bg-indigo-600' },
    red: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', badge: 'bg-red-600' }
  };

  const colors = systemColors[currentStep.color as keyof typeof systemColors];

  return (
    <div className="mb-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-gray-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Complete End-to-End Sequence Flow
          </h2>
          <p className="text-sm text-gray-600">
            Animated walkthrough from customer checkout to final payment
          </p>
        </div>
        <button
          onClick={() => setShowAnimatedFlow(false)}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          Hide
        </button>
      </div>

      {/* Animation Controls */}
      <div className="flex items-center gap-3 mb-6 bg-white rounded-lg p-4 shadow-sm">
        <button
          onClick={handleReset}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          title="Reset to beginning"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={handlePrevious}
          disabled={animationStep === 0}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Previous step"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>

        {isPlaying ? (
          <button
            onClick={handlePause}
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            title="Pause"
          >
            <Pause className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handlePlay}
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            title="Play"
          >
            <Play className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={handleNext}
          disabled={animationStep === sequenceSteps.length - 1}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Next step"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="flex-1 ml-4">
          <div className="text-sm font-medium text-gray-700 mb-1">
            Step {animationStep + 1} of {sequenceSteps.length}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((animationStep + 1) / sequenceSteps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Current Step Display */}
      <div className={`${colors.bg} ${colors.border} border-2 rounded-xl p-6 shadow-lg transition-all duration-500`}>
        {/* Step Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className={`inline-block ${colors.badge} text-white px-3 py-1 rounded-full text-xs font-semibold mb-3`}>
              {currentStep.system}
            </div>
            <h3 className="text-2xl font-semibold text-gray-900">
              {currentStep.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {currentStep.description}
            </p>
          </div>
          <div className={`${colors.badge} text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold`}>
            {currentStep.step}
          </div>
        </div>

        {/* Customer Message (if present) */}
        {currentStep.customerMessage && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
            <div className="font-semibold text-yellow-900 text-sm mb-1">Customer sees:</div>
            <div className="text-yellow-800 text-sm italic">"{currentStep.customerMessage}"</div>
          </div>
        )}

        {/* Technical Details */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">What's Happening:</h4>
          <ul className="space-y-2">
            {currentStep.details.map((detail, idx) => (
              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                <span className={`${colors.text} mt-0.5`}>▸</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Data Flow (if present) */}
        {currentStep.dataFlow && (
          <div className="bg-gray-800 rounded-lg p-4 font-mono text-xs text-green-400">
            <div className="text-gray-400 mb-2">Data Flow:</div>
            <div className="whitespace-pre-wrap break-all">{currentStep.dataFlow}</div>
          </div>
        )}
      </div>

      {/* Step Timeline */}
      <div className="mt-6 bg-white rounded-lg p-4">
        <h4 className="font-semibold text-gray-700 mb-3 text-sm">Timeline:</h4>
        <div className="grid grid-cols-6 gap-2">
          {sequenceSteps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setAnimationStep(idx)}
              className={`p-2 rounded text-xs transition ${
                idx === animationStep
                  ? 'bg-blue-600 text-white font-semibold'
                  : idx < animationStep
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={step.title}
            >
              {step.step}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Comparison Card Component
function ComparisonCard({
  title,
  badge,
  color,
  items
}: {
  title: string;
  badge: string;
  color: string;
  items: Array<{ label: string; value: string }>;
}) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200',
    blue: 'bg-blue-50 border-blue-200',
  }[color];

  return (
    <div className={`${colorClasses} border-2 rounded-xl p-5`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className={`px-3 py-1 bg-${color}-100 text-${color}-700 text-xs rounded-full font-semibold`}>
          {badge}
        </span>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="border-b border-gray-200 pb-2 last:border-0">
            <div className="text-xs font-semibold text-gray-600 mb-1">{item.label}</div>
            <div className="text-sm text-gray-900">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
