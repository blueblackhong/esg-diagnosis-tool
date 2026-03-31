"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Question, Answer } from "@/types";
import { getAuth, getUserData, saveUserData } from "@/lib/storage";
import questionsData from "@/data/questions.json";

const questions = questionsData as Question[];

export default function ConfirmPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});

  useEffect(() => {
    const auth = getAuth();
    if (!auth) {
      router.replace("/");
      return;
    }
    const data = getUserData();
    if (data?.answers) {
      setAnswers(data.answers);
    }
    setAuthorized(true);
  }, [router]);

  if (!authorized) return null;

  const answered = questions.filter(
    (q) => (answers[q.id]?.selected !== null && answers[q.id]?.selected !== undefined)
  );
  const notApplicable = questions.filter(
    (q) => answers[q.id]?.notApplicable
  );
  const unanswered = questions.filter(
    (q) => !answers[q.id] || (answers[q.id]?.selected === null && !answers[q.id]?.notApplicable) || (answers[q.id]?.selected === undefined && !answers[q.id]?.notApplicable)
  );

  const handleSubmit = () => {
    const data = getUserData();
    if (data) {
      data.status = "submitted";
      data.submittedAt = new Date().toISOString();
      saveUserData(data);
    }
    router.push("/result");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">제출 전 확인</h1>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl">
              <span className="text-2xl">&#9989;</span>
              <div>
                <p className="font-semibold text-emerald-700">응답 완료</p>
                <p className="text-sm text-emerald-600">{answered.length}문항</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <span className="text-2xl">&#11036;</span>
              <div>
                <p className="font-semibold text-gray-700">해당없음</p>
                <p className="text-sm text-gray-500">{notApplicable.length}문항</p>
              </div>
            </div>

            {unanswered.length > 0 && (
              <div className="p-4 bg-amber-50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">&#9888;&#65039;</span>
                  <div>
                    <p className="font-semibold text-amber-700">미응답</p>
                    <p className="text-sm text-amber-600">{unanswered.length}문항</p>
                  </div>
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {unanswered.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => router.push("/assessment")}
                      className="block w-full text-left text-sm text-amber-700 hover:text-amber-900 py-1 px-2 rounded hover:bg-amber-100 transition"
                    >
                      Q{q.id}. {q.question.slice(0, 40)}...
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="text-sm text-gray-500 mb-6">
            총 {questions.length}문항 중 {answered.length + notApplicable.length}문항 처리 완료
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/assessment")}
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
            >
              &larr; 돌아가서 수정
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition shadow-md"
            >
              최종 제출
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
