'use client';

import React, { useState } from 'react';
import { useBuildings, useCreateBuilding, useDeleteBuilding, BuildingType } from '@/hooks/useBuildings';
import { useRooms, useCreateRoom, useUpdateRoomStatus, useDeleteRoom, PropertyType, RoomStatus, Room } from '@/hooks/useRooms';
import { useCreateContract, useContractByRoom, useUpdateContract, ContractType, ContractResponse, ContractUpdateRequest } from '@/hooks/useContracts';
import { useModal } from '@/app/context/ModalContext';

const BUILDING_TYPE_LABELS: Record<BuildingType, string> = {
    APARTMENT: '아파트', VILLA: '빌라', OFFICE: '오피스텔', SHOP: '상가', ETC: '기타'
};

const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
    ONE_ROOM: '원룸', TWO_ROOM: '투룸', THREE_ROOM: '쓰리룸',
    APT: '아파트', OFFICE: '오피스텔', SHOP: '상가', ETC: '기타'
};

const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
    MONTHLY_POST: '월세 (후불)',
    MONTHLY_PRE: '월세 (선불)',
    MONTHLY_PREPAID: '월세 (선납)',
    JEONSE: '전세',
};

function getStatusBadge(status: RoomStatus) {
    switch (status) {
        case 'OCCUPIED': return <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-xs font-bold">🟢 입주중</span>;
        case 'VACANT': return <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md text-xs font-bold border border-slate-200">⚪ 공실</span>;
        case 'MAINTENANCE': return <span className="bg-orange-100 text-orange-600 px-2.5 py-1 rounded-md text-xs font-bold">🔧 수리중</span>;
    }
}

// ─── 공통 입력 스타일 ─────────────────────────────────────────────────────────
const inputCls = "w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm";
const labelCls = "block text-sm font-bold text-slate-700 mb-1";
const sectionTitleCls = "text-xs font-bold text-slate-400 uppercase tracking-wider pt-2 pb-1";

// ─── 건물 추가 모달 ───────────────────────────────────────────────────────────
function AddBuildingModal({ onClose }: { onClose: () => void }) {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [type, setType] = useState<BuildingType>('VILLA');
    const { mutate: createBuilding, isPending } = useCreateBuilding();
    const { showAlert } = useModal();

    const handleSubmit = () => {
        if (!name.trim() || !address.trim()) {
            showAlert({ title: '입력 오류', message: '건물 이름과 주소를 입력해주세요.', variant: 'DANGER' });
            return;
        }
        createBuilding({ name, address, type }, {
            onSuccess: () => { showAlert({ title: '등록 완료', message: '건물이 등록되었습니다.', variant: 'SUCCESS' }); onClose(); },
            onError: () => showAlert({ title: '오류', message: '건물 등록에 실패했습니다.', variant: 'DANGER' }),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">새 건물 등록</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className={labelCls}>건물 이름</label>
                        <input type="text" placeholder="예: 빌림빌라 A동" value={name} onChange={e => setName(e.target.value)} maxLength={50} className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>주소</label>
                        <input type="text" placeholder="도로명 주소" value={address} onChange={e => setAddress(e.target.value)} maxLength={100} className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>건물 유형</label>
                        <select value={type} onChange={e => setType(e.target.value as BuildingType)} className={inputCls}>
                            {(Object.keys(BUILDING_TYPE_LABELS) as BuildingType[]).map(t => (
                                <option key={t} value={t}>{BUILDING_TYPE_LABELS[t]}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50">취소</button>
                    <button onClick={handleSubmit} disabled={isPending}
                        className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 disabled:opacity-50">
                        {isPending ? '등록 중...' : '등록하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── 호실 추가 모달 ───────────────────────────────────────────────────────────
function AddRoomModal({ buildingId, onClose }: { buildingId: number; onClose: () => void }) {
    const [roomNumber, setRoomNumber] = useState('');
    const [floor, setFloor] = useState(1);
    const [propertyType, setPropertyType] = useState<PropertyType>('ONE_ROOM');
    const [managementNumber, setManagementNumber] = useState('');
    const { mutate: createRoom, isPending } = useCreateRoom(buildingId);
    const { showAlert } = useModal();

    const handleSubmit = () => {
        if (!roomNumber.trim()) {
            showAlert({ title: '입력 오류', message: '호수를 입력해주세요.', variant: 'DANGER' });
            return;
        }
        createRoom({ roomNumber, floor, propertyType, managementNumber: managementNumber || undefined }, {
            onSuccess: () => { showAlert({ title: '등록 완료', message: '호실이 등록되었습니다.', variant: 'SUCCESS' }); onClose(); },
            onError: (err: unknown) => {
                const errorMessage = err && typeof err === 'object' && 'response' in err
                    ? (err.response as { data?: { message?: string } })?.data?.message
                    : '호실 등록에 실패했습니다.';
                showAlert({ title: '오류', message: errorMessage || '호실 등록에 실패했습니다.', variant: 'DANGER' });
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">새 호실 등록</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>호수</label>
                            <input type="text" placeholder="예: 101호" value={roomNumber} onChange={e => setRoomNumber(e.target.value)} maxLength={10} className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>층수</label>
                            <input type="number" min={-10} max={200} value={floor} onChange={e => setFloor(Number(e.target.value))}
                                placeholder="지하: -1, -2" className={inputCls} />
                        </div>
                    </div>
                    <div>
                        <label className={labelCls}>부동산 유형</label>
                        <select value={propertyType} onChange={e => setPropertyType(e.target.value as PropertyType)} className={inputCls}>
                            {(Object.keys(PROPERTY_TYPE_LABELS) as PropertyType[]).map(t => (
                                <option key={t} value={t}>{PROPERTY_TYPE_LABELS[t]}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>관리번호 (선택)</label>
                        <input type="text" placeholder="한전/수도 고객번호" value={managementNumber} onChange={e => setManagementNumber(e.target.value)} maxLength={30} className={inputCls} />
                    </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50">취소</button>
                    <button onClick={handleSubmit} disabled={isPending}
                        className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 disabled:opacity-50">
                        {isPending ? '등록 중...' : '등록하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── 계약 폼 필드 (등록/수정 공용) ────────────────────────────────────────────
interface ContractFormState {
    contractType: ContractType;
    tenantName: string;
    tenantPhone: string;
    deposit: string;
    monthlyRent: string;
    maintenanceFee: string;
    rentDay: number;
    startDate: string;
    endDate: string;
    householdCount: string;
    memo: string;
}

function ContractFormFields({
    form,
    onChange,
}: {
    form: ContractFormState;
    onChange: (patch: Partial<ContractFormState>) => void;
}) {
    const isJeonse = form.contractType === 'JEONSE';

    return (
        <div className="space-y-3">
            {/* 계약 유형 탭 */}
            <div>
                <p className={sectionTitleCls}>계약 유형</p>
                <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl">
                    {(Object.keys(CONTRACT_TYPE_LABELS) as ContractType[]).map(ct => (
                        <button key={ct} type="button"
                            onClick={() => onChange({ contractType: ct })}
                            className={`py-2 rounded-lg text-xs font-bold transition ${form.contractType === ct ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                            {ct === 'MONTHLY_POST' ? '월세(후불)' : ct === 'MONTHLY_PRE' ? '월세(선불)' : ct === 'MONTHLY_PREPAID' ? '월세(선납)' : '전세'}
                        </button>
                    ))}
                </div>
            </div>

            {/* 임차인 정보 */}
            <p className={sectionTitleCls}>임차인 정보</p>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelCls}>임차인 이름 *</label>
                    <input type="text" placeholder="홍길동" value={form.tenantName}
                        onChange={e => onChange({ tenantName: e.target.value })} maxLength={20} className={inputCls} />
                </div>
                <div>
                    <label className={labelCls}>연락처 *</label>
                    <input type="tel" placeholder="010-0000-0000" value={form.tenantPhone}
                        onChange={e => onChange({ tenantPhone: e.target.value })} maxLength={13} className={inputCls} />
                </div>
                <div>
                    <label className={labelCls}>세대원수</label>
                    <input type="number" placeholder="1" value={form.householdCount} min={1} max={20}
                        onChange={e => onChange({ householdCount: e.target.value })} className={inputCls} />
                </div>
            </div>

            {/* 금액 정보 */}
            <p className={sectionTitleCls}>금액 정보</p>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelCls}>보증금 (원) *</label>
                    <input type="number" placeholder="예: 10000000" value={form.deposit} min={0}
                        onChange={e => onChange({ deposit: e.target.value })} className={inputCls} />
                </div>
                {!isJeonse && (
                    <div>
                        <label className={labelCls}>월세 (원) *</label>
                        <input type="number" placeholder="예: 500000" value={form.monthlyRent} min={0}
                            onChange={e => onChange({ monthlyRent: e.target.value })} className={inputCls} />
                    </div>
                )}
                <div>
                    <label className={labelCls}>관리비 (원)</label>
                    <input type="number" placeholder="예: 50000" value={form.maintenanceFee} min={0}
                        onChange={e => onChange({ maintenanceFee: e.target.value })} className={inputCls} />
                </div>
                {!isJeonse && (
                    <div>
                        <label className={labelCls}>월세 납부일</label>
                        <select value={form.rentDay} onChange={e => onChange({ rentDay: Number(e.target.value) })} className={inputCls}>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                <option key={d} value={d}>매월 {d}일</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* 계약 기간 */}
            <p className={sectionTitleCls}>계약 기간</p>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelCls}>계약 시작일 *</label>
                    <input type="date" value={form.startDate} onChange={e => onChange({ startDate: e.target.value })} className={inputCls} />
                </div>
                <div>
                    <label className={labelCls}>계약 종료일 *</label>
                    <input type="date" value={form.endDate} onChange={e => onChange({ endDate: e.target.value })} className={inputCls} />
                </div>
            </div>

            {/* 비고 */}
            <div>
                <label className={labelCls}>비고</label>
                <textarea placeholder="특이사항을 입력하세요" value={form.memo} rows={2}
                    onChange={e => onChange({ memo: e.target.value })} maxLength={500}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none" />
            </div>
        </div>
    );
}

// ─── 계약 등록 모달 ───────────────────────────────────────────────────────────
function ContractModal({ room, buildingId, onClose }: { room: Room; buildingId: number; onClose: () => void }) {
    const today = new Date().toISOString().split('T')[0];
    const oneYearLater = (() => { const d = new Date(); d.setFullYear(d.getFullYear() + 1); return d.toISOString().split("T")[0]; })();

    const [form, setForm] = useState<ContractFormState>({
        contractType: 'MONTHLY_POST',
        tenantName: '',
        tenantPhone: '',
        deposit: '',
        monthlyRent: '',
        maintenanceFee: '0',
        rentDay: 1,
        startDate: today,
        endDate: oneYearLater,
        householdCount: '1',
        memo: '',
    });

    const { mutate: createContract, isPending } = useCreateContract();
    const { mutate: updateStatus } = useUpdateRoomStatus(buildingId);
    const { showAlert } = useModal();

    const handleChange = (patch: Partial<ContractFormState>) => {
        setForm(prev => ({ ...prev, ...patch }));
    };

    const handleSubmit = () => {
        if (!form.tenantName.trim() || !form.tenantPhone.trim() || !form.deposit) {
            showAlert({ title: '입력 오류', message: '임차인 정보와 보증금을 입력해주세요.', variant: 'DANGER' });
            return;
        }
        if (form.contractType !== 'JEONSE' && !form.monthlyRent) {
            showAlert({ title: '입력 오류', message: '월세 금액을 입력해주세요.', variant: 'DANGER' });
            return;
        }
        createContract({
            buildingId,
            roomNumber: room.roomNumber,
            contractType: form.contractType,
            tenantName: form.tenantName,
            tenantPhone: form.tenantPhone,
            deposit: Number(form.deposit),
            monthlyRent: form.contractType === 'JEONSE' ? 0 : Number(form.monthlyRent),
            maintenanceFee: Number(form.maintenanceFee) || 0,
            rentDay: form.contractType === 'JEONSE' ? 1 : form.rentDay,
            startDate: form.startDate,
            endDate: form.endDate,
            householdCount: Number(form.householdCount) || 1,
            memo: form.memo || undefined,
        }, {
            onSuccess: () => {
                updateStatus({ roomId: room.id, status: 'OCCUPIED' }, {
                    onSuccess: () => {
                        showAlert({ title: '등록 완료', message: `${room.roomNumber} 계약이 등록되었습니다.`, variant: 'SUCCESS' });
                        onClose();
                    },
                });
            },
            onError: () => showAlert({ title: '오류', message: '계약 등록에 실패했습니다.', variant: 'DANGER' }),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">계약 등록</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{room.roomNumber} · {PROPERTY_TYPE_LABELS[room.propertyType]}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <ContractFormFields form={form} onChange={handleChange} />
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50">취소</button>
                    <button onClick={handleSubmit} disabled={isPending}
                        className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 disabled:opacity-50">
                        {isPending ? '등록 중...' : '계약 등록 + 입주 처리'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── 계약 상세/수정 모달 ─────────────────────────────────────────────────────
function initFormFromContract(contract: ContractResponse): ContractFormState {
    return {
        contractType: contract.contractType,
        tenantName: contract.tenantName,
        tenantPhone: contract.tenantPhone,
        deposit: String(contract.deposit),
        monthlyRent: String(contract.monthlyRent),
        maintenanceFee: String(contract.maintenanceFee),
        rentDay: contract.rentDay,
        startDate: contract.startDate,
        endDate: contract.endDate,
        householdCount: String(contract.householdCount),
        memo: contract.memo ?? '',
    };
}

function ContractDetailModal({ room, buildingId, onClose }: { room: Room; buildingId: number; onClose: () => void }) {
    const { data: contract, isLoading } = useContractByRoom(buildingId, room.roomNumber);
    const { mutate: updateContract, isPending } = useUpdateContract();
    const { showAlert } = useModal();
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<ContractFormState | null>(null);

    React.useEffect(() => {
        if (contract) {
            setForm(initFormFromContract(contract));
        }
    }, [contract]);

    const handleChange = (patch: Partial<ContractFormState>) => {
        setForm(prev => prev ? { ...prev, ...patch } : prev);
    };

    const handleUpdate = () => {
        if (!contract || !form) return;
        const req: ContractUpdateRequest = {
            contractType: form.contractType,
            tenantName: form.tenantName,
            tenantPhone: form.tenantPhone,
            deposit: Number(form.deposit),
            monthlyRent: form.contractType === 'JEONSE' ? 0 : Number(form.monthlyRent),
            maintenanceFee: Number(form.maintenanceFee) || 0,
            rentDay: form.contractType === 'JEONSE' ? 1 : form.rentDay,
            startDate: form.startDate,
            endDate: form.endDate,
            householdCount: Number(form.householdCount) || 1,
            memo: form.memo || undefined,
        };
        updateContract({ contractId: contract.id, req }, {
            onSuccess: () => {
                showAlert({ title: '수정 완료', message: '계약 정보가 수정되었습니다.', variant: 'SUCCESS' });
                setIsEditing(false);
            },
            onError: () => showAlert({ title: '오류', message: '계약 수정에 실패했습니다.', variant: 'DANGER' }),
        });
    };

    const fmt = (n: number) => n.toLocaleString('ko-KR');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">계약 상세</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{room.roomNumber} · {PROPERTY_TYPE_LABELS[room.propertyType]}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isEditing && !isLoading && contract && (
                            <button onClick={() => setIsEditing(true)}
                                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg font-bold hover:bg-blue-700">
                                수정
                            </button>
                        )}
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
                    </div>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {isLoading ? (
                        <div className="space-y-3">
                            {[1,2,3].map(i => <div key={i} className="animate-pulse h-10 bg-slate-100 rounded-xl" />)}
                        </div>
                    ) : !contract ? (
                        <p className="text-center text-slate-400 py-8">계약 정보를 찾을 수 없습니다.</p>
                    ) : isEditing && form ? (
                        <ContractFormFields form={form} onChange={handleChange} />
                    ) : (
                        <div className="space-y-4">
                            {/* 계약 유형 배지 */}
                            <div className="flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold">
                                    {CONTRACT_TYPE_LABELS[contract.contractType]}
                                </span>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                                <p className={sectionTitleCls}>임차인 정보</p>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div><span className="text-slate-500">이름</span><p className="font-bold text-slate-800 mt-0.5">{contract.tenantName}</p></div>
                                    <div><span className="text-slate-500">연락처</span><p className="font-bold text-slate-800 mt-0.5">{contract.tenantPhone}</p></div>
                                    <div><span className="text-slate-500">세대원수</span><p className="font-bold text-slate-800 mt-0.5">{contract.householdCount}명</p></div>
                                </div>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                                <p className={sectionTitleCls}>금액 정보</p>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div><span className="text-slate-500">보증금</span><p className="font-bold text-slate-800 mt-0.5">{fmt(contract.deposit)}원</p></div>
                                    {contract.contractType !== 'JEONSE' && (
                                        <>
                                            <div><span className="text-slate-500">월세</span><p className="font-bold text-slate-800 mt-0.5">{fmt(contract.monthlyRent)}원</p></div>
                                            <div><span className="text-slate-500">납부일</span><p className="font-bold text-slate-800 mt-0.5">매월 {contract.rentDay}일</p></div>
                                        </>
                                    )}
                                    <div><span className="text-slate-500">관리비</span><p className="font-bold text-slate-800 mt-0.5">{fmt(contract.maintenanceFee)}원</p></div>
                                </div>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                                <p className={sectionTitleCls}>계약 기간</p>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div><span className="text-slate-500">시작일</span><p className="font-bold text-slate-800 mt-0.5">{contract.startDate}</p></div>
                                    <div><span className="text-slate-500">종료일</span><p className="font-bold text-slate-800 mt-0.5">{contract.endDate}</p></div>
                                </div>
                            </div>
                            {contract.memo && (
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className={sectionTitleCls}>비고</p>
                                    <p className="text-sm text-slate-700 mt-1">{contract.memo}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                    {isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50">취소</button>
                            <button onClick={handleUpdate} disabled={isPending}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50">
                                {isPending ? '저장 중...' : '저장'}
                            </button>
                        </>
                    ) : (
                        <button onClick={onClose} className="flex-1 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50">닫기</button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── 호실 카드 ────────────────────────────────────────────────────────────────
function RoomCard({ room, buildingId }: { room: Room; buildingId: number }) {
    const { mutate: updateStatus } = useUpdateRoomStatus(buildingId);
    const { mutate: deleteRoom } = useDeleteRoom(buildingId);
    const { showConfirm, showAlert } = useModal();
    const [isContractModalOpen, setIsContractModalOpen] = useState(false);
    const [isContractDetailOpen, setIsContractDetailOpen] = useState(false);

    const handleDelete = () => {
        showConfirm({
            title: '호실 삭제',
            message: `${room.roomNumber}을(를) 삭제하시겠습니까?`,
            variant: 'DANGER',
            confirmLabel: '삭제',
            onConfirm: () => deleteRoom(room.id, {
                onError: () => showAlert({ title: '오류', message: '삭제에 실패했습니다.', variant: 'DANGER' }),
            }),
        });
    };

    const STATUS_LABELS: Record<RoomStatus, string> = {
        OCCUPIED: '입주 처리',
        VACANT: '퇴실 처리',
        MAINTENANCE: '수리중 변경',
    };

    const handleStatusChange = (status: RoomStatus) => {
        showConfirm({
            title: '상태 변경',
            message: `${room.roomNumber}을(를) "${STATUS_LABELS[status]}" 하시겠습니까?`,
            confirmLabel: STATUS_LABELS[status],
            onConfirm: () => updateStatus({ roomId: room.id, status }, {
                onSuccess: () => showAlert({ title: '완료', message: `${room.roomNumber} ${STATUS_LABELS[status]} 완료`, variant: 'SUCCESS' }),
                onError: () => showAlert({ title: '오류', message: '상태 변경에 실패했습니다.', variant: 'DANGER' }),
            }),
        });
    };

    return (
        <>
        <div className={`relative bg-white rounded-2xl p-6 shadow-sm border transition hover:shadow-md ${room.status === 'MAINTENANCE' ? 'border-orange-200' : 'border-slate-200'}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-slate-800">{room.roomNumber}</span>
                        <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{PROPERTY_TYPE_LABELS[room.propertyType]}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{room.floor}층</div>
                </div>
                {getStatusBadge(room.status)}
            </div>

            <div className="space-y-2 min-h-[60px]">
                {room.managementNumber && (
                    <div className="text-xs text-slate-500">관리번호: {room.managementNumber}</div>
                )}
                {room.status === 'VACANT' && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 py-2">
                        <span className="text-3xl opacity-30">🏚️</span>
                        <span className="text-sm mt-1">현재 비어있는 방입니다.</span>
                    </div>
                )}
                {room.status === 'OCCUPIED' && (
                    <button onClick={() => setIsContractDetailOpen(true)}
                        className="w-full text-left px-3 py-2.5 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-100 transition">
                        <span className="text-xs text-blue-500 font-bold">📋 계약 상세 보기</span>
                    </button>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                {room.status === 'VACANT' && (
                    <button onClick={() => setIsContractModalOpen(true)}
                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition">
                        입주 처리
                    </button>
                )}
                {room.status === 'OCCUPIED' && (
                    <button onClick={() => handleStatusChange('VACANT')}
                        className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-sm font-bold border border-slate-200">
                        퇴실 처리
                    </button>
                )}
                {room.status === 'MAINTENANCE' && (
                    <button onClick={() => handleStatusChange('VACANT')}
                        className="flex-1 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl text-sm font-bold border border-orange-200">
                        수리 완료
                    </button>
                )}
                <button onClick={() => handleStatusChange('MAINTENANCE')} title="수리중으로 변경"
                    className="px-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl text-sm border border-slate-200">
                    🔧
                </button>
                <button onClick={handleDelete}
                    className="px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl text-sm border border-red-100">
                    🗑
                </button>
            </div>
        </div>
        {isContractModalOpen && (
            <ContractModal room={room} buildingId={buildingId} onClose={() => setIsContractModalOpen(false)} />
        )}
        {isContractDetailOpen && (
            <ContractDetailModal room={room} buildingId={buildingId} onClose={() => setIsContractDetailOpen(false)} />
        )}
        </>
    );
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────
export default function UnitsPage() {
    const { data: buildings = [], isLoading: isBuildingsLoading } = useBuildings();
    const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
    const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const { mutate: deleteBuilding } = useDeleteBuilding();
    const { showConfirm, showAlert } = useModal();

    // 건물이 없을 때 자동으로 등록 모달 표시
    React.useEffect(() => {
        if (buildings.length === 0 && !isBuildingsLoading) {
            setIsBuildingModalOpen(true);
        }
    }, [buildings.length, isBuildingsLoading]);

    const activeBuildingId = selectedBuildingId ?? buildings[0]?.id ?? null;
    const { data: rooms = [], isLoading: isRoomsLoading } = useRooms(activeBuildingId);
    const activeBuilding = buildings.find(b => b.id === activeBuildingId);

    const stats = {
        total: rooms.length,
        occupied: rooms.filter(r => r.status === 'OCCUPIED').length,
        vacant: rooms.filter(r => r.status === 'VACANT').length,
    };

    const handleDeleteBuilding = () => {
        if (!activeBuildingId) return;
        showConfirm({
            title: '건물 삭제',
            message: `${activeBuilding?.name}을(를) 삭제하시겠습니까?\n등록된 모든 호실도 함께 삭제됩니다.`,
            variant: 'DANGER',
            confirmLabel: '삭제',
            onConfirm: () => deleteBuilding(activeBuildingId, {
                onSuccess: () => { setSelectedBuildingId(null); },
                onError: () => showAlert({ title: '오류', message: '건물 삭제에 실패했습니다.', variant: 'DANGER' }),
            }),
        });
    };

    return (
        <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-screen relative">

            {/* 헤더 */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">내 건물 관리</h1>
                    <p className="text-slate-500 text-sm mt-1">호실 상태를 확인하고 계약을 등록합니다.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex gap-2">
                        {isBuildingsLoading ? (
                            <div className="animate-pulse h-11 w-48 bg-white rounded-xl border border-slate-300" />
                        ) : (
                            <select
                                value={activeBuildingId ?? ''}
                                onChange={e => setSelectedBuildingId(Number(e.target.value))}
                                className="flex-1 bg-white border border-slate-300 text-slate-700 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-sm"
                            >
                                {buildings.length === 0 ? (
                                    <option value="">건물 없음</option>
                                ) : (
                                    buildings.map(b => (
                                        <option key={b.id} value={b.id}>🏢 {b.name}</option>
                                    ))
                                )}
                            </select>
                        )}
                        <button onClick={() => setIsBuildingModalOpen(true)} title="새 건물 추가"
                            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 px-3 rounded-xl shadow-sm">
                            🏢+
                        </button>
                        {buildings.length > 0 && (
                            <button onClick={handleDeleteBuilding} title="현재 건물 삭제"
                                className="bg-white border border-red-200 hover:bg-red-50 text-red-400 px-3 rounded-xl shadow-sm">
                                🗑
                            </button>
                        )}
                    </div>
                    <button onClick={() => setIsRoomModalOpen(true)} disabled={!activeBuildingId}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-blue-500/20 transition disabled:opacity-40">
                        + 호실 추가
                    </button>
                </div>
            </div>

            {/* 요약 통계 */}
            <div className="flex gap-4 overflow-x-auto pb-2">
                <div className="flex-shrink-0 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                    <span className="text-slate-500 text-sm font-medium">총 호실</span>
                    <span className="text-xl font-bold text-slate-800">{stats.total}개</span>
                </div>
                <div className="flex-shrink-0 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                    <span className="text-slate-500 text-sm font-medium">입주율</span>
                    <span className="text-xl font-bold text-blue-600">
                        {stats.total > 0 ? Math.round((stats.occupied / stats.total) * 100) : 0}%
                    </span>
                </div>
                <div className="flex-shrink-0 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                    <span className="text-slate-500 text-sm font-medium">공실</span>
                    <span className="text-xl font-bold text-slate-400">{stats.vacant}개</span>
                </div>
            </div>

            {/* 호실 리스트 */}
            {isRoomsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse h-56 bg-white rounded-2xl border border-slate-200" />
                    ))}
                </div>
            ) : rooms.length === 0 && activeBuildingId ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                    <p className="text-slate-400 text-lg">아직 등록된 호실이 없습니다.</p>
                    <button onClick={() => setIsRoomModalOpen(true)}
                        className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                        + 첫 번째 호실 등록하기
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {rooms.map(room => (
                        <RoomCard key={room.id} room={room} buildingId={activeBuildingId!} />
                    ))}
                    <div onClick={() => setIsRoomModalOpen(true)}
                        className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition cursor-pointer min-h-[250px]">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl mb-3">+</div>
                        <span className="font-bold">새 호실 등록</span>
                    </div>
                </div>
            )}

            {/* 모달 */}
            {isBuildingModalOpen && <AddBuildingModal onClose={() => setIsBuildingModalOpen(false)} />}
            {isRoomModalOpen && activeBuildingId && (
                <AddRoomModal buildingId={activeBuildingId} onClose={() => setIsRoomModalOpen(false)} />
            )}
        </div>
    );
}
