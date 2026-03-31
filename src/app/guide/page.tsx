"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuth, initUserData } from "@/lib/storage";
import { DiagnosisMode } from "@/types";
import Header from "@/components/Header";

export default function GuidePage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const auth = getAuth();
    if (!auth) {
      router.replace("/");
      return;
    }
    setUserName(auth.user);
    setAuthorized(true);
  }, [router]);

  const handleStart = (mode: DiagnosisMode) => {
    initUserData(userName, mode);
    router.push("/assessment");
  };

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <Header />
      <div className="max-w-3xl mx-auto pb-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-full">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            ESG 수준진단 가이드
          </h1>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-emerald-700 mb-3">1. 개발 목적 및 배경</h2>
            <p className="text-gray-600 leading-relaxed">
              기후변화 대응과 지속가능경영의 중요성이 높아지면서 중소기업에 대한 ESG(환경·사회·거버넌스) 관련 감독 요구가 강화되고 있습니다.
              이에 따라 중소기업의 인식과 역량 부족을 ESG 수준을 자가진단할 수 있는 Tool을 통해 진단하고 개선 방향을 모색할 수 있도록 개발하였습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-emerald-700 mb-3">2. 진단 Tool 구성 및 사용 방법</h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex-shrink-0 mt-0.5">1</span>
                <p>총 <strong>98개 문항</strong>으로 구성되어 있습니다.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex-shrink-0 mt-0.5">2</span>
                <div>
                  <p>3개 영역으로 분류됩니다:</p>
                  <div className="flex gap-3 mt-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">환경 (36문항)</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">사회 (51문항)</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">거버넌스 (11문항)</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex-shrink-0 mt-0.5">3</span>
                <p>각 문항에 대해 선지를 선택하거나, 해당 없는 경우 <strong>&quot;해당없음&quot;</strong>을 체크할 수 있습니다.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex-shrink-0 mt-0.5">4</span>
                <p>작성 중 언제든 <strong>임시저장</strong>이 가능하며, 다시 접속 시 이어서 작성할 수 있습니다.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex-shrink-0 mt-0.5">5</span>
                <p>모든 문항 응답 후 <strong>제출</strong>하면, 5개 관점별 점수와 종합 결과를 확인할 수 있습니다.</p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-semibold text-emerald-700 mb-3">3. 결과 확인</h2>
            <p className="text-gray-600 leading-relaxed">
              제출 완료 후 제품부문, 프로세스부문, 조직부문, 공급망, 지역사회 등 5개 관점에서의 ESG 수준 점수와 시사점을 확인할 수 있습니다.
              레이더 차트를 통해 각 관점별 강점과 개선이 필요한 영역을 한눈에 파악할 수 있습니다.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <button
              onClick={() => handleStart("demo")}
              className="py-5 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition shadow-lg"
            >
              <div className="text-lg">데모 버전</div>
              <div className="text-sm text-amber-100 mt-1">E·S·G 각 5문항 (총 15문항)</div>
            </button>
            <button
              onClick={() => handleStart("full")}
              className="py-5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition shadow-lg"
            >
              <div className="text-lg">풀 버전</div>
              <div className="text-sm text-emerald-100 mt-1">전체 98문항</div>
            </button>
          </div>

          <button
            onClick={() => router.push("/sample-result")}
            className="w-full py-3 bg-white border-2 border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition"
          >
            결과 화면 미리보기 (샘플 데이터)
          </button>
        </div>
      </div>
    </div>
  );
}
