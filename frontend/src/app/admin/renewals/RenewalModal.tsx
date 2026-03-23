"use client";

import { useState } from "react";
import {
  ExpiringContractResponse,
  ContractRenewRequest,
  RenewType,
  useRenewContract,
  useTerminateContract,
} from "@/hooks/useContracts";
import { formatMoneyInput, parseMoneyInput } from "@/lib/utils";

interface RenewalModalProps {
  contract: ExpiringContractResponse;
  onClose: () => void;
}

function formatDate(date: Date): string {
  // Use local date components (not toISOString) to avoid UTC midnight off-by-one in west-of-UTC timezones
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addYears(dateStr: string, years: number): string {
  const d = new Date(dateStr);
  d.setFullYear(d.getFullYear() + years);
  return formatDate(d);
}

export default function RenewalModal({ contract, onClose }: RenewalModalProps) {
  const [mode, setMode] = useState<"select" | RenewType | "terminate">("select");
  const [newEndDate, setNewEndDate] = useState(addYears(contract.endDate, 1));
  const [newStartDate, setNewStartDate] = useState(
    formatDate(new Date(new Date(contract.endDate).getTime() + 86400000))
  );
  const [monthlyRent, setMonthlyRent] = useState(contract.monthlyRent);
  const [deposit, setDeposit] = useState(contract.deposit);
  const [displayMonthlyRent, setDisplayMonthlyRent] = useState(formatMoneyInput(contract.monthlyRent));
  const [displayDeposit, setDisplayDeposit] = useState(formatMoneyInput(contract.deposit));
  const [memo, setMemo] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutate: renew, isPending: isRenewing } = useRenewContract();
  const { mutate: terminate, isPending: isTerminating } = useTerminateContract();

  const handleRenew = () => {
    setError(null);
    if (mode !== "KEEP" && mode !== "MODIFY") return; // guard against unexpected mode state
    if (!newEndDate) { setError("새 종료일을 입력해주세요."); return; }

    const req: ContractRenewRequest = {
      renewType: mode as RenewType,
      newEndDate,
      ...(mode === "MODIFY" && {
        newStartDate,
        monthlyRent,
        deposit,
        memo: memo || undefined,
      }),
    };

    renew(
      { contractId: contract.id, req },
      {
        onSuccess: () => onClose(),
        onError: (e: unknown) => {
          const msg = e instanceof Error ? e.message : "갱신 처리 중 오류가 발생했습니다.";
          setError(msg);
        },
      }
    );
  };

  const handleTerminate = () => {
    terminate(contract.id, {
      onSuccess: () => onClose(),
      onError: (e: unknown) => {
        const msg = e instanceof Error ? e.message : "계약 종료 처리 중 오류가 발생했습니다.";
        setError(msg);
      },
    });
  };

  const urgencyColor =
    contract.daysLeft <= 7
      ? "text-red-600 bg-red-50"
      : contract.daysLeft <= 14
      ? "text-orange-600 bg-orange-50"
      : "text-amber-600 bg-amber-50";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={isRenewing || isTerminating ? undefined : onClose}
      />

      {/* 모달 */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-[480px] mx-4 overflow-hidden">
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-zinc-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-800">
                계약 갱신 — {contract.buildingName} {contract.roomNumber}호
              </h2>
              <p className="text-sm text-zinc-500 mt-0.5">{contract.tenantName} · {contract.tenantPhone}</p>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-600 transition text-xl leading-none"
            >
              ×
            </button>
          </div>

          {/* 만료 정보 */}
          <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${urgencyColor}`}>
            <span>만료 D-{contract.daysLeft}</span>
            <span className="text-zinc-400">·</span>
            <span>{contract.endDate} 만료</span>
          </div>
        </div>

        {/* 바디 */}
        <div className="px-6 py-5">
          {/* 현재 계약 조건 요약 */}
          <div className="grid grid-cols-2 gap-3 text-sm mb-5 bg-zinc-50 rounded-lg p-3">
            <div>
              <span className="text-zinc-500">월세</span>
              <span className="ml-2 font-medium text-zinc-800">
                ₩{contract.monthlyRent.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-zinc-500">보증금</span>
              <span className="ml-2 font-medium text-zinc-800">
                ₩{contract.deposit.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-zinc-500">계약 기간</span>
              <span className="ml-2 font-medium text-zinc-800">
                {contract.startDate} ~ {contract.endDate}
              </span>
            </div>
          </div>

          {/* 모드 선택 */}
          {mode === "select" && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-700 mb-3">처리 방법을 선택하세요</p>
              <button
                onClick={() => setMode("KEEP")}
                className="w-full text-left px-4 py-3 rounded-lg border border-zinc-200 hover:border-blue-400 hover:bg-blue-50 transition group"
              >
                <div className="font-medium text-zinc-800 group-hover:text-blue-700">조건 유지 갱신</div>
                <div className="text-sm text-zinc-500 mt-0.5">현재 조건 그대로, 계약 기간만 연장합니다</div>
              </button>
              <button
                onClick={() => setMode("MODIFY")}
                className="w-full text-left px-4 py-3 rounded-lg border border-zinc-200 hover:border-blue-400 hover:bg-blue-50 transition group"
              >
                <div className="font-medium text-zinc-800 group-hover:text-blue-700">조건 변경 갱신</div>
                <div className="text-sm text-zinc-500 mt-0.5">월세, 보증금 등을 변경하여 새 계약을 생성합니다</div>
              </button>
              <button
                onClick={() => setMode("terminate")}
                className="w-full text-left px-4 py-3 rounded-lg border border-zinc-200 hover:border-red-300 hover:bg-red-50 transition group"
              >
                <div className="font-medium text-zinc-800 group-hover:text-red-600">계약 종료</div>
                <div className="text-sm text-zinc-500 mt-0.5">계약을 종료 처리합니다 (복구 불가)</div>
              </button>
            </div>
          )}

          {/* KEEP 모드 */}
          {mode === "KEEP" && (
            <div className="space-y-4">
              <button onClick={() => setMode("select")} className="text-sm text-zinc-500 hover:text-zinc-700 transition">
                ← 뒤로
              </button>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">새 종료일 *</label>
                <input
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-zinc-400 mt-1">기본값: 현재 종료일 기준 1년 연장</p>
              </div>
            </div>
          )}

          {/* MODIFY 모드 */}
          {mode === "MODIFY" && (
            <div className="space-y-4">
              <button onClick={() => setMode("select")} className="text-sm text-zinc-500 hover:text-zinc-700 transition">
                ← 뒤로
              </button>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">새 시작일</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">새 종료일 *</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">월세 (원)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={displayMonthlyRent}
                    onChange={(e) => {
                      const formatted = formatMoneyInput(e.target.value);
                      setDisplayMonthlyRent(formatted);
                      setMonthlyRent(parseMoneyInput(formatted));
                    }}
                    className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">보증금 (원)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={displayDeposit}
                    onChange={(e) => {
                      const formatted = formatMoneyInput(e.target.value);
                      setDisplayDeposit(formatted);
                      setDeposit(parseMoneyInput(formatted));
                    }}
                    className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">메모</label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="갱신 관련 메모 (선택)"
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* 종료 확인 */}
          {mode === "terminate" && (
            <div className="space-y-4">
              <button onClick={() => setMode("select")} className="text-sm text-zinc-500 hover:text-zinc-700 transition">
                ← 뒤로
              </button>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                <p className="font-medium mb-1">⚠ 계약 종료 확인</p>
                <p>{contract.tenantName}님과의 계약을 종료 처리합니다. 이 작업은 되돌릴 수 없습니다.</p>
              </div>
            </div>
          )}

          {/* 에러 */}
          {error && (
            <p className="mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}
        </div>

        {/* 푸터 */}
        {mode !== "select" && (
          <div className="px-6 py-4 border-t border-zinc-200 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-zinc-700 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition"
            >
              취소
            </button>
            {mode === "terminate" ? (
              <button
                onClick={handleTerminate}
                disabled={isTerminating}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isTerminating ? "처리 중..." : "계약 종료"}
              </button>
            ) : (
              <button
                onClick={handleRenew}
                disabled={isRenewing}
                className="px-4 py-2 text-sm bg-[#0F3460] text-white rounded-lg hover:bg-[#1a4a7a] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isRenewing ? "처리 중..." : "갱신 완료"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
