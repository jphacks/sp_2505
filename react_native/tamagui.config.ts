import { defaultConfig } from "@tamagui/config/v4"
import { createTamagui } from "tamagui"

// const config_ = createTamagui({
//   ...defaultConfig,
//   themes: {
//     ...defaultConfig.themes,

//     // ======== ライトテーマ拡張 ========
//     light: {
//       ...defaultConfig.themes.light,

//       // Gray スケール（背景・文字用）
//       gray1: "#fafafa",
//       gray2: "#f4f4f5",
//       gray3: "#e4e4e7",
//       gray4: "#d4d4d8",
//       gray5: "#a1a1aa",
//       gray6: "#71717a",
//       gray7: "#52525b",
//       gray8: "#3f3f46",
//       gray9: "#27272a",
//       gray10: "#18181b",
//       gray11: "#0f0f10",
//       gray12: "#09090b",

//       // Blue スケール（進捗バーや完了ステータス用）
//       blue1: "#eff6ff",
//       blue2: "#dbeafe",
//       blue3: "#bfdbfe",
//       blue4: "#93c5fd",
//       blue5: "#60a5fa",
//       blue6: "#3b82f6",
//       blue7: "#2563eb",
//       blue8: "#1d4ed8",
//       blue9: "#1e40af",
//       blue10: "#1e3a8a",
//       blue11: "#172554",
//     },

//     // ======== ダークテーマ（必要ならここも拡張） ========
//     dark: {
//       ...defaultConfig.themes.dark,
//       gray1: "#18181b",
//       gray2: "#27272a",
//       gray3: "#3f3f46",
//       gray4: "#52525b",
//       gray5: "#71717a",
//       gray6: "#a1a1aa",
//       gray7: "#d4d4d8",
//       gray8: "#e4e4e7",
//       gray9: "#f4f4f5",
//       gray10: "#fafafa",
//       blue1: "#172554",
//       blue2: "#1e3a8a",
//       blue3: "#1e40af",
//       blue4: "#2563eb",
//       blue5: "#3b82f6",
//       blue6: "#60a5fa",
//       blue7: "#93c5fd",
//       blue8: "#bfdbfe",
//       blue9: "#dbeafe",
//       blue10: "#eff6ff",
//     },
//   },
// })

export const config = createTamagui(defaultConfig)

export default config

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
