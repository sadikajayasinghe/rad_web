export type Role = "tourist" | "provider" | "admin"
export type User = { name: string; role: Role }

export type Activity = {
  id: number
  title: string
  location: string
  category: string
  price: number // LKR per person
  maxPeople: number
  emoji: string
  description: string
  owner: string // provider name
  approved: boolean // admin must approve
}

export type Status = "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED" | "COMPLETED"
export type Review = { rating: number; comment: string }

export type Booking = {
  id: number
  activityId: number
  tourist: string
  date: string
  people: number
  total: number
  status: Status
  review?: Review
}

export const COMMISSION = 0.1 // platform earns 10%

const a = (id: number, title: string, location: string, category: string, price: number, maxPeople: number, emoji: string, description: string): Activity =>
  ({ id, title, location, category, price, maxPeople, emoji, description, owner: "Lanka Tours", approved: true })

export const seedActivities: Activity[] = [
  a(1, "Whale Watching", "Mirissa", "Wildlife", 8000, 10, "🐋", "Early morning boat trip to see blue whales and dolphins."),
  a(2, "Yala Safari", "Yala", "Wildlife", 12000, 6, "🐆", "Jeep safari to spot leopards, elephants and birds."),
  a(3, "Surfing Lesson", "Arugam Bay", "Adventure", 5000, 8, "🏄", "Beginner-friendly surf lesson with a local instructor."),
  a(4, "Sigiriya Climb", "Sigiriya", "Culture", 6000, 15, "🏯", "Guided climb of the ancient rock fortress."),
  a(5, "Ella Hiking", "Ella", "Adventure", 3500, 12, "🥾", "Hike Little Adam's Peak and see tea plantations."),
]
