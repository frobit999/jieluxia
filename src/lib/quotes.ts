export const quotes = [
  { text: "自律是最高形式的自爱，是你能给予自己最好的礼物。", author: "每日智慧" },
  { text: "每一次克制，都是对未来自己的投资。", author: "每日智慧" },
  { text: "真正的力量不在于征服别人，而在于征服自己。", author: "每日智慧" },
  { text: "今天的坚持，是明天的自由。", author: "每日智慧" },
  { text: "自律不是束缚，而是通往自由的桥梁。", author: "每日智慧" },
  { text: "你能控制的只有自己，而这已经足够了。", author: "每日智慧" },
  { text: "每一个清晨都是一个新的开始，每一次克制都是一次胜利。", author: "每日智慧" },
  { text: "强者不是没有欲望，而是能控制欲望。", author: "每日智慧" },
  { text: "坚持不一定会成功，但放弃一定会失败。", author: "每日智慧" },
  { text: "你今天的努力，是幸运的伏笔。", author: "每日智慧" },
  { text: "自律者自由，自由者自强。", author: "每日智慧" },
  { text: "不要让昨天的失败，毁掉今天的努力。", author: "每日智慧" },
  { text: "真正的勇士，敢于直面自己的弱点。", author: "每日智慧" },
  { text: "每一次选择克制，都在重塑更好的自己。", author: "每日智慧" },
  { text: "成功不是终点，失败不是末日，重要的是继续前行的勇气。", author: "每日智慧" },
];

export function getDailyQuote(): { text: string; author: string } {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return quotes[dayOfYear % quotes.length];
}
