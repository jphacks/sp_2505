import { useState } from "react"
import { Pressable } from "react-native"
import { YStack, XStack, Text, Card, Progress, H3 } from "tamagui"
import {
  Coins,
  CircleCheckBig,
  LibraryBig,
  AlarmClock,
  KeyRound,
  Leaf
} from "@tamagui/lucide-icons"
import { LinearGradient } from "tamagui/linear-gradient"

// Missionの型定義
interface Mission {
  id: number
  title: string
  completed: boolean
}

// ミッションカードコンポーネント
const MissionCard = ({
  mission,
  onComplete
}: {
  mission: Mission
  onComplete: (id: number) => void
}) => {
  // ミッションごとのアイコン切り替え
  const getIcon = () => {
    switch (mission.id) {
      case 1:
        return <LibraryBig size={48} color={mission.completed ? "#4caf50" : "#6b7280"} />
      case 2:
        return <AlarmClock size={48} color={mission.completed ? "#4caf50" : "#6b7280"} />
      case 3:
        return <KeyRound size={48} color={mission.completed ? "#4caf50" : "#6b7280"} />
      case 4:
        return <Leaf size={48} color={mission.completed ? "#4caf50" : "#6b7280"} />
      default:
        return <CircleCheckBig size={48} color={mission.completed ? "#4caf50" : "#6b7280"} />
    }
  }

  return (
    <Pressable
      key={mission.id}
      onPress={() => onComplete(mission.id)}
      disabled={mission.completed}
    >
      <Card p="$4" backgroundColor={mission.completed ? "$green4" : "$gray2"}>
        <XStack alignItems="center" gap="$4">
          {/* 左：大きなアイコン */}
          {getIcon()}

          {/* 右：ミッション名と達成状況 */}
          <YStack flex={1}>
            <Text fontSize="$5" color={mission.completed ? "$green11" : "$gray11"}>
              {mission.title}
            </Text>

            <XStack alignItems="center" gap="$2" mt="$2">
              {mission.completed && <CircleCheckBig size={20} color="$green10" />}
              <Text fontSize="$3" color={mission.completed ? "$green11" : "$gray9"}>
                {mission.completed ? "達成済み" : "未達成"}
              </Text>
            </XStack>
          </YStack>
        </XStack>
      </Card>
    </Pressable>
  )
}

export default function MissionScreen() {
  const [missions, setMissions] = useState<Mission[]>([
    { id: 1, title: "3日連続でログインしよう", completed: false },
    { id: 2, title: "午前中に15分以上歩こう", completed: false },
    { id: 3, title: "未踏のエリアを開錠しよう", completed: false },
    { id: 4, title: "札幌市内を3km移動しよう", completed: false }
  ])

  const totalMissions = missions.length
  const completedMissions = missions.filter((m) => m.completed).length

  const completeMission = (id: number) => {
    const missionToComplete = missions.find((m) => m.id === id)
    if (missionToComplete && !missionToComplete.completed) {
      setMissions((prev) =>
        prev.map((m) => (m.id === id ? { ...m, completed: true } : m))
      )
    }
  }

  return (
    <LinearGradient
      flex={1}
      colors={["#66aaff", "#b3d4ff"]} // ← 青みを増したグラデーション
      start={[0, 0]}
      end={[0, 1]}
    >
      <YStack flex={1} px="$4" pt="$6">
        {/* タイトル */}
        <H3 mb="$4">今日のミッション</H3>

        {/* コイン表示 */}
        <XStack alignItems="center" justifyContent="space-between" mb="$4">
          <XStack alignItems="center" gap="$2">
            <Coins size={28} color="$blue10" />
            <Text color="$blue10" fontSize="$6">
              {completedMissions} / {totalMissions}
            </Text>
          </XStack>
        </XStack>

        {/* 全体進捗バー */}
        <Text color="$gray10" mb="$2">
          全体進捗
        </Text>
        <Progress
          value={(completedMissions / totalMissions) * 100}
          bg="$gray5"
          mb="$6"
        >
          <Progress.Indicator animation="bouncy" bg="$blue10" />
        </Progress>

        {/* ミッション一覧 */}
        <YStack space="$4">
          {missions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onComplete={completeMission}
            />
          ))}
        </YStack>
      </YStack>
    </LinearGradient>
  )
}