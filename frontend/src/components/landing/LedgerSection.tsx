export default function LedgerSection() {
    return (
        <section className="bg-white py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900">
                        통장 볼 필요 없는 간편 수납 장부
                    </h2>
                </div>

                <div className="bg-slate-50 rounded-3xl p-6 md:p-10 shadow-inner border border-slate-200">
                    {/* Mobile View: Card List */}
                    <div className="block md:hidden space-y-4">
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-lg font-bold text-slate-800">
                                        101호 박민수
                                    </span>
                                    <div className="text-sm text-slate-400">
                                        청구액: 550,000원
                                    </div>
                                </div>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-xs font-bold">
                                    완납
                                </span>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-md border border-red-200 relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-lg font-bold text-slate-800">
                                        102호 최유리
                                    </span>
                                    <div className="text-sm text-slate-400">
                                        청구액: 500,000원
                                    </div>
                                </div>
                                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-md text-xs font-bold">
                                    미납
                                </span>
                            </div>
                            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 flex justify-center items-center gap-2">
                                <span>💳 수납 처리하기</span>
                            </button>
                        </div>
                    </div>

                    {/* Desktop View: Table */}
                    <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-100 text-slate-500 text-sm uppercase tracking-wider">
                                    <th className="p-4 font-medium">호실</th>
                                    <th className="p-4 font-medium">세입자</th>
                                    <th className="p-4 font-medium">청구 금액</th>
                                    <th className="p-4 font-medium">상태</th>
                                    <th className="p-4 font-medium text-right">관리</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="hover:bg-slate-50">
                                    <td className="p-4 font-bold text-slate-700">101호</td>
                                    <td className="p-4 text-slate-600">박민수</td>
                                    <td className="p-4 text-slate-600">550,000원</td>
                                    <td className="p-4">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                            완납
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-slate-400 hover:text-blue-600">
                                            수정
                                        </button>
                                    </td>
                                </tr>
                                <tr className="bg-red-50/30">
                                    <td className="p-4 font-bold text-slate-700">102호</td>
                                    <td className="p-4 text-slate-600">최유리</td>
                                    <td className="p-4 text-slate-800 font-bold">500,000원</td>
                                    <td className="p-4">
                                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">
                                            미납
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-bold hover:bg-blue-700">
                                            수납 처리
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}
