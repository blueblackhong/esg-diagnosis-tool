const ACCOUNTS = [
  { id: "user", password: "user1234", role: "user" as const },
  { id: "admin", password: "admin1234", role: "admin" as const },
];

export function authenticate(
  id: string,
  password: string
): { success: true; role: "user" | "admin" } | { success: false; message: string } {
  const account = ACCOUNTS.find((a) => a.id === id && a.password === password);
  if (!account) {
    return { success: false, message: "아이디 또는 비밀번호가 올바르지 않습니다." };
  }
  return { success: true, role: account.role };
}
