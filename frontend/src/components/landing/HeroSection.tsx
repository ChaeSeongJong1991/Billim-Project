import Image from "next/image";

export default function HeroSection() {
    return (
        <section className="bg-white pt-16 pb-20 md:pt-32 md:pb-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="w-full md:w-1/2 text-center md:text-left z-10">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                            임대 관리가<br />
                            이렇게 쉬웠나요?<br />
                            <span className="text-blue-600">엑셀을 넘어선 디지털 비서</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 mb-8 leading-relaxed">
                            복잡한 수기 장부, 놓치는 연체 관리 이제 그만.<br />
                            건물주를 위한 가장 쉽고 확실한 파트너, 빌림.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                            <input
                                type="email"
                                placeholder="이메일 주소를 입력하세요"
                                className="px-6 py-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-80 text-black"
                            />
                            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition w-full sm:w-auto">
                                무료로 시작하기
                            </button>
                        </div>
                        <p className="mt-4 text-sm text-slate-400">
                            * 신용카드 정보 없이 바로 시작하세요.
                        </p>
                    </div>

                    <div className="w-full md:w-1/2 relative mt-8 md:mt-0">
                        <div className="relative mx-auto border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-[200px] md:h-[350px] w-full max-w-[600px] shadow-2xl overflow-hidden">
                            <div className="rounded-lg overflow-hidden h-full bg-white flex items-center justify-center relative">
                                <Image
                                    src="/assets/dashboard-mockup.svg"
                                    alt="Billim Dashboard UI"
                                    layout="fill"
                                    objectFit="cover"
                                />
                                {/* Fallback text if image doesn't load/cover properly, though layout fill handles it */}
                            </div>
                        </div>
                        <div className="relative mx-auto bg-gray-900 rounded-b-xl h-[20px] max-w-[700px] md:h-[30px] w-full"></div>
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
