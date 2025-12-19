"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Building2, MapPin } from "lucide-react"; // 아이콘 (lucide-react는 nextjs 기본 포함)

// 건물 데이터 타입 정의
interface Building {
    id: number;
    name: string;
    address: string;
    type: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [loading, setLoading] = useState(true);

    // 건물 등록 폼 상태
    const [isOpen, setIsOpen] = useState(false);
    const [newBuilding, setNewBuilding] = useState({ name: "", address: "", type: "VILLA" });

    // 1. 초기 데이터 로딩
    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/login");
            return;
        }
        fetchBuildings();
    }, [isAuthenticated, router]);

    const fetchBuildings = async () => {
        try {
            const response = await api.get("/buildings");
            setBuildings(response.data);
        } catch (error) {
            console.error("건물 목록 로딩 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    // 2. 건물 등록 핸들러
    const handleCreateBuilding = async () => {
        try {
            await api.post("/buildings", newBuilding);
            alert("건물이 등록되었습니다!");
            setIsOpen(false); // 모달 닫기
            setNewBuilding({ name: "", address: "", type: "VILLA" }); // 초기화
            fetchBuildings(); // 목록 갱신
        } catch (error) {
            alert("등록 실패: 입력 정보를 확인해주세요.");
        }
    };

    // 로그아웃 핸들러
    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    if (!isAuthenticated || loading) return <div className="p-8">로딩중...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* 상단 헤더 */}
            <div className="max-w-5xl mx-auto flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">내 건물 현황</h1>
                    <p className="text-gray-500 mt-1">안녕하세요, {user?.name || "투자자"}님. 자산을 관리해보세요.</p>
                </div>
                <Button variant="outline" onClick={handleLogout}>로그아웃</Button>
            </div>

            {/* 메인 컨텐츠 */}
            <div className="max-w-5xl mx-auto">
                {/* 건물 리스트 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* 1. 건물 추가 카드 (항상 맨 앞에) */}
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Card className="flex flex-col items-center justify-center h-[200px] border-dashed border-2 cursor-pointer hover:bg-gray-50 transition-colors">
                                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                    <Plus className="h-6 w-6 text-slate-600" />
                                </div>
                                <span className="font-semibold text-slate-900">새 건물 등록하기</span>
                            </Card>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>건물 등록</DialogTitle>
                                <DialogDescription>
                                    관리할 건물의 기본 정보를 입력해주세요.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">건물명</Label>
                                    <Input
                                        id="name"
                                        value={newBuilding.name}
                                        onChange={(e) => setNewBuilding({ ...newBuilding, name: e.target.value })}
                                        className="col-span-3"
                                        placeholder="예: 강남 1호점"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="address" className="text-right">주소</Label>
                                    <Input
                                        id="address"
                                        value={newBuilding.address}
                                        onChange={(e) => setNewBuilding({ ...newBuilding, address: e.target.value })}
                                        className="col-span-3"
                                        placeholder="서울시..."
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateBuilding}>등록하기</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* 2. 실제 건물 리스트 매핑 */}
                    {buildings.map((building) => (
                        <Card key={building.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <Building2 className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <Badge variant="secondary">{building.type}</Badge>
                                </div>
                                <CardTitle className="mt-4 text-xl">{building.name}</CardTitle>
                                <CardDescription className="flex items-center gap-1 mt-1">
                                    <MapPin className="h-3 w-3" /> {building.address}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-gray-500">
                                    <p>총 세대수: - 세대</p> {/* 추후 Contract 연결 시 구현 */}
                                    <p>공실 현황: - / -</p>
                                </div>
                                <Button
                                    className="w-full mt-4 bg-slate-900 hover:bg-slate-800"
                                    variant="default"
                                    onClick={() => router.push(`/buildings/${building.id}`)}
                                >
                                    관리하기
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
