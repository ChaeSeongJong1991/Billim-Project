"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, User, Calendar, DollarSign } from "lucide-react";

// 계약 데이터 타입 (DTO 매핑)
interface Contract {
    id: number;
    buildingName: string;
    roomNumber: string;
    tenantName: string;
    monthlyRent: number;
    rentDay: number;
    startDate: string;
    endDate: string;
}

export default function BuildingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    // params.id가 string | string[] 일 수 있으므로 처리 필요. 보통은 string
    const buildingId = Number(params.id);

    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    // 계약 등록 폼 상태
    const [formData, setFormData] = useState({
        roomNumber: "",
        tenantName: "",
        tenantPhone: "",
        deposit: 0,
        monthlyRent: 0,
        rentDay: 1,
        startDate: "",
        endDate: ""
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/login");
            return;
        }
        // buildingId가 NaN이면 실행하지 않음 (초기 로딩 시점 등)
        if (!isNaN(buildingId)) {
            fetchContracts();
        }
    }, [buildingId, isAuthenticated]);

    const fetchContracts = async () => {
        try {
            const response = await api.get(`/contracts/building/${buildingId}`);
            setContracts(response.data);
        } catch (error) {
            console.error("계약 목록 로딩 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateContract = async () => {
        try {
            // 숫자 형변환 및 DTO 구성
            const payload = {
                buildingId: buildingId,
                roomNumber: formData.roomNumber,
                tenantName: formData.tenantName,
                tenantPhone: formData.tenantPhone,
                deposit: Number(formData.deposit),
                monthlyRent: Number(formData.monthlyRent),
                rentDay: Number(formData.rentDay),
                startDate: formData.startDate,
                endDate: formData.endDate
            };

            await api.post("/contracts", payload);
            alert("계약이 등록되었습니다.");
            setIsOpen(false);
            fetchContracts(); // 목록 갱신

            // 폼 초기화
            setFormData({
                roomNumber: "",
                tenantName: "",
                tenantPhone: "",
                deposit: 0,
                monthlyRent: 0,
                rentDay: 1,
                startDate: "",
                endDate: ""
            });
        } catch (error) {
            console.error("등록 실패:", error);
            alert("등록 실패: 입력 값을 확인해주세요.");
        }
    };

    if (loading) return <div className="p-8">데이터를 불러오는 중...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">

                {/* 상단 네비게이션 */}
                <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> 내 건물 목록으로
                </Button>

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            {contracts.length > 0 ? contracts[0].buildingName : `건물 #${buildingId}`} 관리
                        </h1>
                        <p className="text-slate-500">총 {contracts.length}세대가 입주해 있습니다.</p>
                    </div>

                    {/* 계약 등록 모달 */}
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="mr-2 h-4 w-4" /> 입주자 등록 (계약)
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
                            <DialogHeader>
                                <DialogTitle>새 임대차 계약 등록</DialogTitle>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>호수</Label>
                                        <Input placeholder="예: 101호" value={formData.roomNumber} onChange={e => setFormData({ ...formData, roomNumber: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>월세 납부일 (일)</Label>
                                        <Input type="number" placeholder="예: 25" value={formData.rentDay} onChange={e => setFormData({ ...formData, rentDay: Number(e.target.value) })} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>세입자 성명</Label>
                                        <Input placeholder="홍길동" value={formData.tenantName} onChange={e => setFormData({ ...formData, tenantName: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>연락처</Label>
                                        <Input placeholder="010-0000-0000" value={formData.tenantPhone} onChange={e => setFormData({ ...formData, tenantPhone: e.target.value })} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>보증금 (원)</Label>
                                        <Input type="number" placeholder="10000000" value={formData.deposit} onChange={e => setFormData({ ...formData, deposit: Number(e.target.value) })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>월세 (원)</Label>
                                        <Input type="number" placeholder="500000" value={formData.monthlyRent} onChange={e => setFormData({ ...formData, monthlyRent: Number(e.target.value) })} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>계약 시작일</Label>
                                        <Input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>계약 종료일</Label>
                                        <Input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button onClick={handleCreateContract}>계약 저장</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* 계약 목록 테이블 (카드형 리스트) */}
                <div className="space-y-4">
                    {contracts.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-lg border border-dashed text-slate-500">
                            아직 등록된 계약이 없습니다. 첫 번째 입주자를 등록해보세요!
                        </div>
                    ) : (
                        contracts.map((contract) => (
                            <Card key={contract.id} className="flex flex-col md:flex-row items-center p-4 gap-4 hover:shadow-md transition-shadow">
                                {/* 왼쪽: 호수 */}
                                <div className="flex-shrink-0 w-20 h-20 bg-slate-100 rounded-lg flex flex-col items-center justify-center border border-slate-200">
                                    <span className="text-xl font-bold text-slate-800">{contract.roomNumber}</span>
                                    <span className="text-xs text-slate-500">호</span>
                                </div>

                                {/* 중간: 정보 */}
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 flex items-center gap-1"><User className="w-3 h-3" /> 세입자</p>
                                        <p className="font-medium">{contract.tenantName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 flex items-center gap-1"><DollarSign className="w-3 h-3" /> 월세</p>
                                        <p className="font-medium text-blue-600">{contract.monthlyRent.toLocaleString()}원</p>
                                        <p className="text-[10px] text-slate-400">매월 {contract.rentDay}일</p>
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        <p className="text-xs text-slate-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> 계약 기간</p>
                                        <p className="text-sm">{contract.startDate} ~ {contract.endDate}</p>
                                    </div>
                                </div>

                                {/* 오른쪽: 액션 */}
                                <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                                    <Button variant="outline" size="sm" className="w-full md:w-auto">수정</Button>
                                    <Button variant="destructive" size="sm" className="w-full md:w-auto">퇴실</Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}
