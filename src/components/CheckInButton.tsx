"use client";

import { useState } from "react";
import { PrimaryButton } from "./ui/Button";
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
        <div className="text-[44px]">✅</div>
        <div className="text-[15px] font-semibold neon-blue text-[#4dc9f6]">
          今日已签到！
        </div>
        <div className="text-xs text-[rgba(200,220,255,0.5)] text-center">
          坚持就是胜利，明天继续加油
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-3 flex-1">
        <div className="text-[44px]">🛡️</div>
        <div className="text-sm text-[rgba(200,220,255,0.6)] text-center">
          记录今天的坚守
        </div>
        <div className="hidden lg:block">
          <PrimaryButton onClick={() => setShowModal(true)}>
            今日打卡 ✓
          </PrimaryButton>
        </div>
        <button
          className="lg:hidden w-full py-3 rounded-[14px] border-none cursor-pointer font-bold text-sm text-white"
          style={{
            background: "linear-gradient(135deg, #4dc9f6, #ff6eb4)",
          }}
          onClick={() => setShowModal(true)}
        >
          今日打卡
        </button>
      </div>

      <BottomSheet open={showModal} onClose={() => setShowModal(false)}>
        <div className="text-center mb-6">
          <div className="text-[48px] mb-3">🎯</div>
          <div className="text-xl font-bold text-[#e8f4ff]">今日打卡确认</div>
          <div className="text-sm text-[rgba(200,220,255,0.55)] mt-1.5">
            恭喜你完成今天的坚守！
          </div>
        </div>
        <div className="flex gap-2.5">
          <button
            className="flex-1 py-3.5 rounded-2xl text-sm font-semibold text-[#4dc9f6] cursor-pointer"
            style={{
              border: "1px solid rgba(77, 201, 246, 0.25)",
              background: "rgba(77, 201, 246, 0.08)",
            }}
            onClick={() => setShowModal(false)}
          >
            取消
          </button>
          <button
            className="flex-[2] py-3.5 rounded-2xl border-none font-bold text-[15px] text-white cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #4dc9f6, #ff6eb4)",
              boxShadow: "0 4px 24px rgba(77, 201, 246, 0.3), 0 2px 12px rgba(255, 110, 180, 0.2)",
            }}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "打卡中..." : "确认打卡 ✓"}
          </button>
        </div>
      </BottomSheet>
    </>
  );
}
