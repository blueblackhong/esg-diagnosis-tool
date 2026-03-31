import { PerspectiveScore } from "@/types";

export function getInsight(ps: PerspectiveScore): string {
  const { score, label, weakTopicHint } = ps;

  if (score >= 90) {
    return `귀사는 ${label}에서 우수한 수준을 보이고 있습니다. 현 수준을 유지하면서 선도적 역할을 강화하시기를 권장합니다.`;
  }
  if (score >= 70) {
    return `귀사는 선진사 대비 ${weakTopicHint} 부문의 보완 및 투자가 필요합니다.`;
  }
  if (score >= 50) {
    return `귀사는 선진사 대비 ${weakTopicHint} 부문의 체계적인 개선 전략 수립이 시급합니다.`;
  }
  return `귀사는 선진사 대비 ${weakTopicHint} 부문의 즉각적인 개선 조치 및 집중 투자가 필요합니다.`;
}
