import Link from "next/link";

export default function InsightsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      <h1 className="text-4xl md:text-5xl font-medium mb-4">
        Insights on AI in Healthcare Policy
      </h1>

      <p className="text-lg text-gray-700 mb-10">
        Short analyses of how AI policy is translating into real-world healthcare practice.
      </p>

      <div className="space-y-8">

        <div className="border rounded-lg p-5 hover:bg-gray-50 transition">
          <h2 className="text-xl font-semibold">
            <Link href="/insights/hospital-governance" className="hover:underline">
              Hospitals Are Being Forced to Build AI Governance Themselves
            </Link>
          </h2>
          <p className="text-gray-600 mt-1">
            Why hospitals are becoming the primary site of AI oversight.
          </p>
        </div>

        <div className="border rounded-lg p-5 hover:bg-gray-50 transition">
          <h2 className="text-xl font-semibold">
            <Link href="/insights/wrong-layer" className="hover:underline">
              AI Regulation Is Targeting the Wrong Layer
            </Link>
          </h2>
          <p className="text-gray-600 mt-1">
            Why current policy focuses on process instead of clinical use.
          </p>
        </div>

        <div className="border rounded-lg p-5 hover:bg-gray-50 transition">
          <h2 className="text-xl font-semibold">
            <Link href="/insights/state-rules" className="hover:underline">
              States Are Quietly Setting the Rules for Clinical AI
            </Link>
          </h2>
          <p className="text-gray-600 mt-1">
            How state-level policy is shaping real-world deployment decisions.
          </p>
        </div>

      </div>

    </div>
  );
}