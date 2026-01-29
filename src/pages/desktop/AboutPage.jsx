import { Globe, BookOpen, Users, ArrowRight, CheckCircle2, Zap, Lightbulb, Mic, Heart } from "lucide-react";
import { FaMedium, FaFacebook, FaTwitter } from "react-icons/fa";
import { SiSubstack } from "react-icons/si";
import { Logo_Emblem_Light } from "../../assets";
import { useAuth } from "react-oidc-context";

const AboutPage = () => {

    const auth = useAuth();

    return (
        <div className="min-h-screen flex flex-col w-full bg-white overflow-x-hidden">

            {/* 1. HERO SECTION */}
            <section className="relative bg-[#FAFAFA] text-[#000A07] pt-24 pb-20 px-6 overflow-hidden rounded-2xl">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#04644C]/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-[#056B71]/5 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col gap-6 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#04644C]/20 blur-xl rounded-full scale-110"></div>
                        <img
                            src={Logo_Emblem_Light}
                            alt="MINE"
                            className="relative w-24 md:w-32 animate-[spin_20s_linear_infinite]"
                        />
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#000A07] mt-4">
                        <span className="text-brand-primary">M</span>uslim <span className="text-brand-primary">I</span>ntellectual <span className="text-brand-primary">N</span>etwork<br className="hidden md:block" /> for <span className="text-brand-primary">E</span>mpowerment
                    </h1>

                    <div className="h-1 w-20 bg-gradient-to-r from-[#04644C] to-[#056B71] rounded-full my-2"></div>

                    <p className="text-lg md:text-2xl text-[#5C6261] max-w-3xl mx-auto leading-relaxed font-medium italic">
                        "Spiritual problems have spiritual solutions. <br className="hidden md:block" /> Material problems require pragmatic knowledge."
                    </p>
                </div>
            </section>

            {/* 2. MISSION STATEMENT */}
            <section className="px-6 py-16 md:py-24">
                <div className="max-w-6xl mx-auto bg-white rounded-[2rem] p-8 md:p-12 border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    <div className="flex-1 order-2 lg:order-1">
                        <span className="text-brand-primary font-bold tracking-widest uppercase text-xs mb-2 block">Our Purpose</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#000A07] mb-6">Our Mission</h2>
                        <p className="text-[#5C6261] text-lg leading-relaxed mb-8">
                            Our mission is to cultivate a grassroots culture of intellectual empowerment among Muslims.
                            We aim to equip the Ummah with pragmatic tools to understand and address the challenges of the modern world,
                            securing a path toward global leadership.
                        </p>
                        <div className="flex flex-col gap-4">
                            <MissionPoint text="Cultivate Intellectual Empowerment" />
                            <MissionPoint text="Equip with Pragmatic Tools" />
                            <MissionPoint text="Secure Global Leadership" />
                        </div>
                    </div>

                    <div className="shrink-0 order-1 lg:order-2 perspective-1000 group">
                        <div className="relative w-full max-w-xs lg:w-80 aspect-square bg-gradient-to-br from-[#04644C] to-[#004D40] rounded-2xl shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-500 ease-out flex flex-col items-center justify-center p-8 text-center text-white border-4 border-white ring-1 ring-gray-100">
                            <Globe size={64} className="mb-6 opacity-90" />
                            <p className="font-semibold text-xl leading-snug">"Knowledge that drives empowerment."</p>
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#FFF0D6] rounded-full -z-10 group-hover:scale-110 transition-transform"></div>
                        </div>
                    </div>

                </div>
            </section>

            {/* 3. WHY WE EXIST & APPROACH */}
            <section className="px-6 py-16 bg-[#F8F9FA]">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* Why We Exist */}
                    <div className="flex flex-col gap-5">
                        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 shadow-sm border border-red-100">
                            <Users size={28} />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-[#000A07]">Why We Exist?</h3>
                        <p className="text-[#5C6261] leading-relaxed text-lg">
                            For centuries, much of the Muslim intelligentsia has been absorbed in ideological battles while neglecting the pragmatic study of knowledge that drives empowerment.
                            As a result, Muslims have fallen behind in shaping the economic, political, and cultural systems that determine global affairs.
                        </p>
                    </div>

                    {/* Our Approach */}
                    <div className="flex flex-col gap-5">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                            <BookOpen size={28} />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-[#000A07]">Our Approach</h3>
                        <p className="text-[#5C6261] leading-relaxed text-lg">
                            At MINE, intellectual empowerment means practical strength: the ability to control what matters, resist oppression, and influence systems ethically.
                            This requires mastering the liberal sciences—History, Economics, Politics, Sociology, Philosophy—as tools to solve real-world challenges.
                        </p>
                    </div>

                </div>
            </section>

            {/* 4. WHAT WE DO */}
            <section className="px-6 py-20 bg-white">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <span className="text-brand-primary font-bold tracking-widest uppercase text-xs mb-2 block">Action Plan</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#000A07]">What We Do</h2>
                    <p className="text-[#5C6261] mt-4 text-lg">Bridging the gap between theory and practice.</p>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Zap size={32} />}
                        title="Motivate"
                        desc="Encouraging Muslims to pursue pragmatic knowledge as a community and religious necessity."
                        color="bg-amber-50 text-amber-600"
                    />
                    <FeatureCard
                        icon={<Mic size={32} />}
                        title="Create Venues"
                        desc="Book clubs, webinars, blogs, and discussions for professionals to deepen their understanding of how the world works."
                        color="bg-purple-50 text-purple-600"
                    />
                    <FeatureCard
                        icon={<Lightbulb size={32} />}
                        title="Engage Academics"
                        desc="Connecting accomplished academics to share insights and produce ideas that reshape the future."
                        color="bg-teal-50 text-teal-600"
                    />
                </div>
            </section>

            {/* 5. COMMUNITY & CTA */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#04644C]/5 -skew-y-3 transform origin-top-left scale-110 z-0"></div>

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">Join the Movement</h2>
                    <p className="text-tertiary text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                        We are looking for like-minded individuals who share Islamic values and want to pursue knowledge with the intention of empowering the Muslim community.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                        {!auth.isAuthenticated ? (
                            // 1. NOT LOGGED IN: Show Join Button
                            <button
                                onClick={() => auth.signinRedirect()}
                                className="group relative px-8 py-4 bg-[#04644C] text-white font-bold rounded-full hover:bg-[#03523F] transition-all shadow-lg hover:shadow-emerald-200 hover:-translate-y-1 flex items-center justify-center gap-2 text-lg w-full sm:w-auto"
                            >
                                Join MINE Today
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            // 2. LOGGED IN: Show Thank You Message
                            <div className="px-8 py-4 bg-[#E6F0ED] text-[#04644C] font-bold rounded-full shadow-sm border border-[#04644C]/10 flex items-center justify-center gap-3 text-lg w-full sm:w-auto cursor-default animate-in fade-in zoom-in duration-500">
                                <Heart className="fill-[red] animate-pulse" color="red" size={20} />
                                <span>Thank you for being a part of MINE</span>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pt-12">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Connect & Subscribe</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <SocialLink href="https://mineglobal.substack.com/notes" icon={<SiSubstack size={20} />} label="Substack" color="hover:text-[#FF6719] hover:border-[#FF6719]" />
                            <SocialLink href="https://mineglobal.medium.com/" icon={<FaMedium size={20} />} label="Medium" color="hover:text-black hover:border-black" />
                            <SocialLink href="https://x.com/MINEGlobalLearn" icon={<FaTwitter size={20} />} label="X (Twitter)" color="hover:text-black hover:border-black" />
                            <SocialLink href="https://www.facebook.com/profile.php?id=61562130750360" icon={<FaFacebook size={20} />} label="Facebook" color="hover:text-[#1877F2] hover:border-[#1877F2]" />
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

// --- SUB-COMPONENTS ---

const MissionPoint = ({ text }) => (
    <div className="flex items-start gap-3 group">
        <div className="mt-1 bg-[#E6F0ED] p-1 rounded-full group-hover:bg-[#04644C] transition-colors duration-300">
            <CheckCircle2 size={16} className="text-brand-primary group-hover:text-white transition-colors duration-300" />
        </div>
        <span className="text-gray-700 font-medium text-lg">{text}</span>
    </div>
);

const FeatureCard = ({ title, desc, icon, color }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${color} transition-transform duration-300 group-hover:scale-110`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-[#000A07] mb-3 group-hover:text-brand-primary transition-colors">{title}</h3>
        <p className="text-[#5C6261] leading-relaxed">{desc}</p>
    </div>
);

const SocialLink = ({ href, icon, label, color }) => (
    <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-600 font-medium transition-all hover:shadow-md ${color}`}
    >
        {icon}
        <span>{label}</span>
    </a>
);

export default AboutPage;