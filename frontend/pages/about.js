import Meta from '@/components/Meta';

export default function AboutPage() {
  return (
    <>
      <Meta
        title="About Us - The South Line"
        description="The South Line is an independent, analytical news website dedicated to providing rigorous, non-reactive analysis of policy, economics, and power dynamics."
        url="https://yourdomain.com/about"
      />
      <div className="container mx-auto px-4 bg-white text-black">
        <main className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif font-bold border-b-4 border-black pb-4 mb-8">
            About Us
          </h1>

          <section className="mb-12">
            <h2 className="text-xl font-serif font-bold mb-4">Mission Statement</h2>
            <div className="prose text-gray-800 leading-relaxed">
              <p>
                <strong>The South Line</strong> is an independent, analytical news website dedicated to providing rigorous, non-reactive analysis of policy, economics, and power dynamics. Our mission is to serve as the essential research resource for individuals—including professionals, academics, and dedicated citizens—who require deep, structural clarity on the events shaping the global environment.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-serif font-bold mb-4">The Problem Statement</h2>
            <div className="prose text-gray-800 leading-relaxed">
              <p>
                The dominant media ecosystem prioritizes speed and volume, often resulting in superficial reporting and reactive commentary. This creates a critical deficiency in public discourse: a lack of structural analysis that connects immediate events to long-term systemic consequences. As a result, audiences are often left with fragmented information, inhibiting informed decision-making.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-serif font-bold mb-4">Our Solution and Value Proposition</h2>
            <div className="prose text-gray-800 leading-relaxed">
              <p className="mb-4">
                The South Line addresses this deficiency by focusing exclusively on <strong>depth over speed</strong> and <strong>clarity over complexity</strong>. Our commitment is to move beyond the daily news cycle to deliver foundational research that informs the world.
              </p>
              <p>
                Our value is defined by three core analytical pillars:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Rigor:</strong> Reliance on primary sources, academic papers, and official data over secondary opinion.</li>
                <li><strong>Structural Focus:</strong> Analysis dedicated to the systemic causes and effects of policy, not just the symptoms.</li>
                <li><strong>Independence:</strong> Unwavering commitment to objective analysis, free from political or institutional constraints.</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-serif font-bold mb-4">Our Core Content Architecture</h2>
            <div className="prose text-gray-800 leading-relaxed">
              <p className="mb-4">
                The publication is structured around three primary content sections, designed to facilitate deep user exploration and research:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  <strong>Core Analysis:</strong>
                  <em>Purpose:</em> The primary source for rigorous, non-reactive dissection of contemporary governing systems, including policy implementation, macroeconomic trends, and underlying geopolitical power structures.
                </li>
                <li>
                  <strong>The Long View:</strong>
                  <em>Purpose:</em> Dedicated foresight analysis examining breakthrough technologies and environmental/social systems to project their long-term ethical, social, and governmental policy implications.
                </li>
                <li>
                  <strong>The Archive:</strong>
                  <em>Purpose:</em> A curated, permanent research library containing foundational papers, essential reading lists, and transparent documentation of our analytical methodologies and data sources.
                </li>
              </ol>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-serif font-bold mb-4">Our Commitment to the Reader</h2>
            <div className="prose text-gray-800 leading-relaxed">
              <p>
                The South Line pledges continuous analytical rigor, transparency in sourcing, and intellectual independence. Our ultimate success is measured by the quality of engagement and the extent to which our readers rely on our content as a foundation for their own research and understanding.
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
