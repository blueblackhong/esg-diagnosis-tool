"use client";

import Image from "next/image";

export default function Header() {
  return (
    <div className="w-full flex justify-end px-4 py-2">
      <Image
        src="/logo-ey.png"
        alt="EY한영"
        width={60}
        height={18}
        className="opacity-70"
      />
    </div>
  );
}
