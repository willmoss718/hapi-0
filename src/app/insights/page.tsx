import Link from "next/link";

export default function InsightsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      <h1 className="text-4xl md:text-5xl font-medium mb-6">
        Insights on AI in Healthcare Policy
      </h1>

      <div className="space-y-6">

        <div>
          <h2 className="text-xl font-semibold">
            <Link href="/insights/hospital-governance" className="underline">
              Hospitals Are Being Forced to Build AI Governance Themselves
            </Link>
          </h2>
          <p className="text-gray-600">
            Why responsibility for AI oversight is shifting to health systems.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            <Link href="/insights/wrong-layer" className="underline">
              AI Regulation Is Targeting the Wrong Layer
            </Link>
          </h2>
          <p className="text-gray-600">
            Why most policies focus on process instead of clinical use.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            <Link href="/insights/state-rules" className="underline">
              States Are Quietly Setting the Rules for Clinical AI
            </Link>
          </h2>
          <p className="text-gray-600">
            How state-level policy is shaping real-world deployment.
          </p>
        </div>

      </div>
    </div>
  );
}