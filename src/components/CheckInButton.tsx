"use client";

import { useState } from "react";
import { PrimaryButton, SecondaryButton } from "./ui/Button";
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
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", flex: 1 }}>
        <div style={{ fontSize: "32px" }}>✅</div>
        <div style={{ fontSize: "15px", fontWeight: 500, color: "var(--color-obsidian)" }}>
          今日已签到
        </div>
        <div style={{ fontSize: "13px", color: "var(--color-gravel)", textAlign: "center" }}>
          坚持就是胜利，明天继续
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", flex: 1 }}>
        <div style={{ fontSize: "14px", color: "var(--color-gravel)" }}>
          记录今天的坚守
        </div>
        <PrimaryButton onClick={() => setShowModal(true)}>
          今日打卡
        </PrimaryButton>
      </div>

      <BottomSheet open={showModal} onClose={() => setShowModal(false)}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              fontSize: "24px",
              letterSpacing: "-0.48px",
              color: "var(--color-obsidian)",
              margin: "0 0 8px",
            }}
          >
            确认打卡
          </h3>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--color-gravel)" }}>
            恭喜你完成今天的坚守！
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
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
