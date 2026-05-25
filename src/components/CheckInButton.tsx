"use client";

import { useState } from "react";
import { PrimaryButton } from "./ui/Button";
import { SecondaryButton } from "./ui/Button";
import { BottomSheet } from "./ui/BottomSheet";

export function CheckInButton({
  checkedIn,
  onCheckIn,
}: {
  checkedIn: boolean;
  onCheckIn: () => Promise<void>;
}) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onCheckIn();
    setLoading(false);
    setShowModal(false);
  };

  if (checkedIn) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 flex-1">
        <div className="text-[36px]">✅</div>
        <div className="text-[15px] font-medium" style={{ color: "var(--color-obsidian)" }}>
          今日已签到！
        </div>
        <div className="text-[13px]" style={{ color: "var(--color-gravel)" }}>
          坚持就是胜利，明天继续加油
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-3 flex-1">
        <div className="text-[36px]">🛡️</div>
        <div className="text-[14px]" style={{ color: "var(--color-gravel)" }}>
          记录今天的坚守
        </div>
        <PrimaryButton onClick={() => setShowModal(true)}>
          今日打卡
        </PrimaryButton>
      </div>

      <BottomSheet open={showModal} onClose={() => setShowModal(false)}>
        <div className="text-center mb-6">
          <div className="text-[36px] mb-3">🎯</div>
          <div className="text-xl font-medium" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: "var(--color-obsidian)" }}>今日打卡确认</div>
          <div className="text-[14px] mt-1.5" style={{ color: "var(--color-gravel)" }}>
            恭喜你完成今天的坚守！
          </div>
        </div>
        <div className="flex gap-2.5">
          <SecondaryButton
            className="flex-1"
            onClick={() => setShowModal(false)}
          >
            取消
          </SecondaryButton>
          <PrimaryButton
            className="flex-[2]"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "打卡中..." : "确认打卡"}
          </PrimaryButton>
        </div>
      </BottomSheet>
    </>
  );
}
