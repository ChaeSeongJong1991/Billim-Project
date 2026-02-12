export default function UnitManagementSection() {
    return (
        <section className="bg-slate-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-bold tracking-wide uppercase text-sm">
                        Unit Management
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
                        내 건물의 모든 것을 한눈에
                    </h2>
                    <p className="text-slate-500 mt-4 text-lg">
                        모바일에서는 리스트로, PC에서는 그리드로. 최적의 뷰를 제공합니다.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition cursor-pointer">
                        <div>
                            <div className="text-2xl font-bold text-slate-800 mb-1">
                                101호
                            </div>
                            <div className="text-slate-500">세입자: 박민수</div>
                        </div>
                        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-sm">
                            🟢 입주중
                        </span>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-red-500 flex items-center justify-between hover:shadow-lg transition cursor-pointer">
                        <div>
                            <div className="text-2xl font-bold text-slate-800 mb-1">
                                102호
                            </div>
                            <div className="text-red-500 font-medium">
                                -500,000원 (미납)
                            </div>
                        </div>
                        <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold text-sm">
                            🔴 체납중
                        </span>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition cursor-pointer opacity-80">
                        <div>
                            <div className="text-2xl font-bold text-slate-800 mb-1">
                                201호
                            </div>
                            <div className="text-slate-400">공실 상태</div>
                        </div>
                        <button className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-200">
                            입주 등록
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition cursor-pointer">
                        <div>
                            <div className="text-2xl font-bold text-slate-800 mb-1">
                                202호
                            </div>
                            <div className="text-orange-500">도배/장판 수리중</div>
                        </div>
                        <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-bold text-sm">
                            🔧 수리중
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
