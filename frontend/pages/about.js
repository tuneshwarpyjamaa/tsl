import Meta from '@/components/Meta';

export default function AboutPage() {
  return (
    <>
      <Meta
        title="About Us - The South Line"
        description="Learn about The South Line's mission to provide in-depth, factual reporting and our commitment to journalistic integrity in India."
        url="https://yourdomain.com/about"
      />
      <div className="container mx-auto px-4 py-12 bg-white text-black">
        <main className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif font-bold border-b-4 border-black pb-4 mb-8">
            About Us
          </h1>

          <section className="mb-12">
            <h2 className="text-xl font-serif font-bold mb-4">Our Mission</h2>
            <div className="prose text-gray-800 leading-relaxed">
              <p className="mb-4">
                Welcome to <strong>The South Line</strong>, your trusted source for unbiased news, analysis, and storytelling. In an era of rapid information and misinformation, we stand firm in our commitment to <strong>journalistic integrity, factual accuracy, and depth</strong>.
              </p>
              <p>
                Our mission is to bring the stories that matter to the forefront of Indian discourse. We believe that a well-informed citizenry is the backbone of a thriving democracy. From the bustling streets of Bengaluru to the policy corridors of Delhi, we aim to cover the diverse tapestry of India with nuance and empathy.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-serif font-bold mb-4">Our Story</h2>
            <div className="prose text-gray-800 leading-relaxed">
              <p>
                Founded in [Year], The South Line began as a small collective of writers and researchers passionate about "slow journalism." We realized that the race for breaking news often left the <em>why</em> and <em>how</em> behind. We decided to slow down, dig deeper, and present the full picture. Today, we are a growing team dedicated to bringing you stories that are not just read, but understood.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-serif font-bold mb-4">Editorial Standards</h2>
            <div className="prose text-gray-800 leading-relaxed">
              <p className="mb-4">
                We adhere strictly to the norms of journalistic conduct as prescribed by the <strong>Press Council of India</strong>. Our reporting is free from commercial and political influence.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Accuracy:</strong> We verify every fact before publishing.</li>
                <li><strong>Independence:</strong> Our editorial voice is our own.</li>
                <li><strong>Fairness:</strong> We strive to represent all sides of a story.</li>
                <li><strong>Transparency:</strong> If we make a mistake, we correct it openly.</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-serif font-bold mb-4">Our Team</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Placeholder for Team Members */}
              <div className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold mb-2">Editorial Team</h3>
                <p className="text-sm text-gray-600">
                  Led by experienced editors with decades of combined experience in Indian media.
                </p>
              </div>
              <div className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold mb-2">Research Wing</h3>
                <p className="text-sm text-gray-600">
                  Dedicated data journalists and researchers who find the signal in the noise.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
