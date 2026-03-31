import { Question, Answer, Perspective, PerspectiveScore } from "@/types";

function getScore(question: Question, answer: Answer): number | null {
  if (answer.notApplicable || answer.selected === null) return null;

  const optionCount = question.options.length;
  const selected = answer.selected; // "가", "나", "다"

  if (question.reverseScoring) {
    if (optionCount === 2) {
      return selected === "가" ? 1 : 0;
    }
    // 3지선다 역채점 (Q72: 가=0, 나=0.5, 다=1)
    if (selected === "가") return 0;
    if (selected === "나") return 0.5;
    return 1;
  }

  // 정상 채점
  if (optionCount === 2) {
    return selected === "가" ? 0 : 1;
  }
  // 3지선다
  if (selected === "가") return 0;
  if (selected === "나") return 0.5;
  return 1;
}

export function calculatePerspectiveScores(
  questions: Question[],
  perspectives: Perspective[],
  answers: Record<number, Answer>
): PerspectiveScore[] {
  return perspectives.map((p) => {
    let earned = 0;
    let maxPoints = 0;

    p.questionIds.forEach((qId) => {
      const question = questions.find((q) => q.id === qId);
      const answer = answers[qId];
      if (!question || !answer) return;

      const score = getScore(question, answer);
      if (score !== null) {
        earned += score;
        maxPoints += 1;
      }
    });

    const score = maxPoints > 0 ? Math.round((earned / maxPoints) * 100) : 0;

    return {
      id: p.id,
      name: p.name,
      label: p.label,
      score,
      weakTopicHint: p.weakTopicHint,
    };
  });
}

export function calculateOverallScore(perspectiveScores: PerspectiveScore[]): number {
  if (perspectiveScores.length === 0) return 0;
  const sum = perspectiveScores.reduce((acc, p) => acc + p.score, 0);
  return Math.round(sum / perspectiveScores.length);
}
