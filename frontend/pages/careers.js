import Head from 'next/head';
import Link from 'next/link';

export default function Careers() {
    return (
        <>
            <Head>
                <title>Careers - The South Line</title>
                <meta name="description" content="Join our team at The South Line. We are looking for passionate individuals to help us tell stories that matter." />
            </Head>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-8 text-gray-900 dark:text-white">
                        Join Our Team
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        We're looking for passionate storytellers, journalists, and developers to help us build the future of digital news.
                    </p>
                </div>

                <div className="space-y-20">
                    {/* Culture Section */}
                    <section className="bg-white dark:bg-gray-800 rounded-3xl p-10 md:p-16 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-3xl font-serif font-bold mb-8 text-gray-900 dark:text-white text-center">Why Work With Us?</h2>
                        <div className="grid md:grid-cols-3 gap-12 mt-12">
                            <div className="text-center">
                                <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">Impactful Work</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Tell stories that matter and shape public discourse on critical issues.</p>
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">Remote First</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Work from anywhere. We believe in output over hours and trust our team.</p>
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">Growth</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Continuous learning opportunities and a supportive environment for career advancement.</p>
                            </div>
                        </div>
                    </section>

                    {/* Open Positions */}
                    <section>
                        <h2 className="text-4xl font-serif font-bold mb-12 text-center text-gray-900 dark:text-white">Open Positions</h2>
                        <div className="space-y-6">
                            {/* Job Card 1 */}
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row justify-between items-center group">
                                <div className="mb-6 md:mb-0 text-center md:text-left">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Senior Political Correspondent</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Remote • Full-time</p>
                                </div>
                                <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors w-full md:w-auto text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                    Apply Now
                                </button>
                            </div>

                            {/* Job Card 2 */}
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row justify-between items-center group">
                                <div className="mb-6 md:mb-0 text-center md:text-left">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Frontend Developer</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Remote • Contract</p>
                                </div>
                                <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors w-full md:w-auto text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                    Apply Now
                                </button>
                            </div>

                            {/* Job Card 3 */}
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row justify-between items-center group">
                                <div className="mb-6 md:mb-0 text-center md:text-left">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Social Media Manager</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Hybrid • Part-time</p>
                                </div>
                                <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors w-full md:w-auto text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* No Openings / Contact */}
                    <div className="text-center pt-12 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">Don't see a role that fits? We're always looking for talent.</p>
                        <a href="mailto:careers@thesouthline.in" className="text-primary font-bold hover:underline text-2xl">
                            careers@thesouthline.in
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
