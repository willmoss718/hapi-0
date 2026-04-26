export default function Page() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      <h1 className="text-4xl md:text-5xl font-medium mb-4">
        AI Regulation Is Targeting the Wrong Layer
      </h1>

      <p className="text-sm text-gray-500 mb-8">
        By Will Moss · April 2026
      </p>

      <div className="space-y-6 text-base leading-relaxed">

        <p>
          There is a growing push to regulate AI in healthcare. New laws, guidance, and standards are being introduced across states, federal agencies, and industry bodies. On the surface, this looks like a system that is becoming more controlled and more defined.
        </p>

        <p>
          In reality, most of this activity is focused on the wrong layer.
        </p>

        <p>
          Instead of directly regulating how AI is used in clinical settings, most policies focus on surrounding processes. They require disclosure, documentation, and internal governance. Organizations are increasingly expected to explain how systems work, track their performance, and put oversight structures in place. What they are usually not told is when a given AI tool should or should not be used in practice.
        </p>

        <p>
          This creates a mismatch. The core risk in healthcare AI is how tools affect clinical decisions. But the policies addressing those tools are often focused on how they are described, documented, or reviewed. The result is a system where the most important questions are left open, while the surrounding requirements continue to expand.
        </p>

        <p>
          There are reasons for this. Process-based regulation is easier to implement across different healthcare environments. It allows regulators to act without defining strict clinical rules, which are harder to write and enforce. It also aligns with existing authority, since many agencies already oversee areas like disclosure, safety, and risk management. But these advantages come with tradeoffs.
        </p>

        <p>
          The main tradeoff is that responsibility shifts to the organizations using the technology. If policies do not define acceptable use, hospitals and health systems have to make those decisions themselves. That includes determining which tools are appropriate, how they should be evaluated, and how their outputs should be used in clinical workflows. In effect, the most consequential decisions are being made at the organizational level, not the regulatory one.
        </p>

        <p>
          This is already shaping how AI is deployed. Health systems are building governance processes to fill the gap, and vendors are adapting their products to meet documentation and oversight expectations. But the underlying issue remains. The policies in place are influencing behavior, without directly addressing the point where that behavior matters most.
        </p>

        <p>
          This does not mean process-based regulation is useless. Requirements around transparency and documentation do create accountability, and they can improve how systems are developed and monitored. But they are not a substitute for clarity around use. Without that clarity, organizations are left to interpret what responsible deployment looks like on their own.
        </p>

        <p>
          The result is a regulatory environment that feels active, but is still incomplete. AI in healthcare is being shaped by rules that operate around the edges of clinical use, rather than at its center. Until that changes, the burden of translating policy into practice will continue to fall on the institutions actually using these systems.
        </p>

      </div>

    </div>
  );
}