import { Link } from 'expo-router'
import { Button } from 'tamagui'

export default function SomeComponent() {
  return (
    <Link href="../street" asChild>
      <Button>Go to Street</Button>
    </Link>
  )
}