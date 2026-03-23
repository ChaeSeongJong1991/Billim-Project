"use client";

import { useState } from "react";
import {
  ExpiringContractResponse,
  useExpiringContracts,
} from "@/hooks/useContracts";
import RenewalModal from "./RenewalModal";

function UrgencyBadge({ daysLeft }: { daysLeft: number }) {
  const color =
    daysLeft <= 7
      ? "bg-red-100 text-red-700 border-red-200"
      : daysLeft <= 14
      ? "bg-orange-100 text-orange-700 border-orange-200"
      : "bg-amber-100 text-amber-700 border-amber-200";

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
      D-{daysLeft}
    </span>
  );
}

function ContractRow({
  contract,
  onAction,
}: {
  contract: ExpiringContractResponse;
  onAction: (c: ExpiringContractResponse) => void;
}) {
  const urgencyBg =
    contract.daysLeft <= 7
      ? "border-l-4 border-l-red-500"
      : contract.daysLeft <= 14
      ? "border-l-4 border-l-orange-400"
      : "border-l-4 border-l-amber-400";

  return (
    <>
      {/* Desktop row */}
      <tr className={`hidden md:table-row hover:bg-zinc-50 transition ${urgencyBg.replace("border-l-4 border-l-", "border-l-4 border-l-")}`}>
        <td className={`px-4 py-3 ${urgencyBg}`}>
          <div className="font-medium text-zinc-800">{contract.buildingName}</div>
          <div className="text-xs text-zinc-500">{contract.roomNumber}호</div>
        </td>
        <td className="px-4 py-3">
          <div className="text-sm text-zinc-800">{contract.tenantName}</div>
          <div className="text-xs text-zinc-500">{contract.tenantPhone}</div>
        </td>
        <td className="px-4 py-3 text-sm text-zinc-700">{contract.endDate}</td>
        <td className="px-4 py-3">
          <UrgencyBadge daysLeft={contract.daysLeft} />
        </td>
        <td className="px-4 py-3 text-sm text-zinc-700">
          ₩{contract.monthlyRent.toLocaleString()}
        </td>
        <td className="px-4 py-3">
          <button
            onClick={() => onAction(contract)}
            className="px-3 py-1.5 text-xs font-medium bg-[#0F3460] text-white rounded-lg hover:bg-[#1a4a7a] transition"
          >
            처리하기
          </button>
        </td>
      </tr>

      {/* Mobile card */}
      <tr className="md:hidden">
        <td colSpan={6} className="px-0 py-1">
          <div className={`bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden ${urgencyBg}`}>
            <div className="px-4 py-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium text-zinc-800">
                    {contract.buildingName} {contract.roomNumber}호
                  </div>
                  <div className="text-sm text-zinc-500">
                    {contract.tenantName} · {contract.tenantPhone}
                  </div>
                </div>
                <UrgencyBadge daysLeft={contract.daysLeft} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">만료 {contract.endDate}</span>
                <span className="text-zinc-700 font-medium">
                  ₩{contract.monthlyRent.toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => onAction(contract)}
                className="mt-3 w-full py-2 text-sm font-medium bg-[#0F3460] text-white rounded-lg hover:bg-[#1a4a7a] transition"
              >
                처리하기
              </button>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}

export default function RenewalsPage() {
  const { data: contracts = [], isLoading } = useExpiringContracts(30);
  const [selected, setSelected] = useState<ExpiringContractResponse | null>(null);

  const sorted = [...contracts].sort((a, b) => a.daysLeft - b.daysLeft);

  const urgent = sorted.filter((c) => c.daysLeft <= 7).length;
  const warning = sorted.filter((c) => c.daysLeft > 7 && c.daysLeft <= 14).length;
  const upcoming = sorted.filter((c) => c.daysLeft > 14).length;

  return (
    <div className="flex-1 min-h-screen bg-zinc-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">계약 갱신 관리</h1>
          <p className="text-sm text-zinc-500 mt-1">
            30일 이내 만료 예정 계약을 확인하고 처리하세요.
          </p>
        </div>

        {/* 요약 카드 */}
        {!isLoading && contracts.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-xl border border-zinc-200 px-4 py-3 shadow-sm">
              <div className="text-xs text-zinc-500 mb-1">7일 이내 긴급</div>
              <div className="text-2xl font-bold text-red-600">{urgent}</div>
            </div>
            <div className="bg-white rounded-xl border border-zinc-200 px-4 py-3 shadow-sm">
              <div className="text-xs text-zinc-500 mb-1">14일 이내 주의</div>
              <div className="text-2xl font-bold text-orange-500">{warning}</div>
            </div>
            <div className="bg-white rounded-xl border border-zinc-200 px-4 py-3 shadow-sm">
              <div className="text-xs text-zinc-500 mb-1">30일 이내 예정</div>
              <div className="text-2xl font-bold text-amber-500">{upcoming}</div>
            </div>
          </div>
        )}

        {/* 컨텐츠 */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0F3460] border-t-transparent" />
          </div>
        ) : contracts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center justify-center py-24 text-center">
            <span className="text-5xl mb-4">🎉</span>
            <h2 className="text-lg font-semibold text-zinc-700 mb-1">
              만료 예정 계약이 없습니다
            </h2>
            <p className="text-sm text-zinc-400">
              30일 이내 만료 예정인 계약이 없어요.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            {/* Desktop table */}
            <table className="w-full hidden md:table">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                    건물 / 호실
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                    임차인
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                    만료일
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                    D-day
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                    월세
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                    처리
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {sorted.map((contract) => (
                  <ContractRow
                    key={contract.id}
                    contract={contract}
                    onAction={setSelected}
                  />
                ))}
              </tbody>
            </table>

            {/* Mobile list */}
            <table className="w-full md:hidden">
              <tbody className="space-y-2 block p-3">
                {sorted.map((contract) => (
                  <ContractRow
                    key={contract.id}
                    contract={contract}
                    onAction={setSelected}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 갱신 모달 */}
      {selected && (
        <RenewalModal
          contract={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
