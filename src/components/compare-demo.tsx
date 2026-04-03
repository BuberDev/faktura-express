import React from "react";

import { Compare } from "@/components/ui/compare";

export default function CompareDemo() {
  return (
    <div className="rounded-3xl border border-gold-subtle bg-gradient-to-b from-white to-[#F9F9F9] p-4 px-4 dark:bg-dark-surface">
      <Compare
        firstImage="/invoice-empty-state.svg"
        secondImage="/invoice-filled-state.svg"
        firstImageClassName="object-cover object-left-top"
        secondImageClassname="object-cover object-left-top"
        className="h-[250px] w-[200px] md:h-[500px] md:w-[500px]"
        slideMode="hover"
      />
    </div>
  );
}
