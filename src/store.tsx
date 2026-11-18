import { createContext, useContext, useState, type ReactNode } from "react"
import { seedActivities, type Activity, type Booking, type Review, type Status, type User } from "./data"

type Store = {
  page: string
  go: (p: string) => void
  selected: Activity | null
  select: (a: Activity) => void
  user: User | null
  login: (u: User) => void
  logout: () => void
  activities: Activity[]
  bookings: Booking[]
  addActivity: (a: Omit<Activity, "id" | "owner" | "approved">) => void
  approveActivity: (id: number) => void
  deleteActivity: (id: number) => void
  book: (activity: Activity, date: string, people: number) => string | null // returns error text
  setStatus: (id: number, s: Status) => void
  addReview: (id: number, r: Review) => void
}

const Ctx = createContext<Store>(null as unknown as Store)
export const useStore = () => useContext(Ctx)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [page, go] = useState("home")
  const [selected, select] = useState<Activity | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [activities, setActivities] = useState<Activity[]>(seedActivities)
  const [bookings, setBookings] = useState<Booking[]>([])

  const store: Store = {
    page, go, selected,
    select: (a) => { select(a); go("details") },
    user,
    login: (u) => { setUser(u); go(u.role === "provider" ? "provider" : u.role === "admin" ? "admin" : "home") },
    logout: () => { setUser(null); go("home") },
    activities, bookings,
    addActivity: (a) =>
      setActivities([...activities, { ...a, id: Date.now(), owner: user?.name ?? "", approved: false }]),
    approveActivity: (id) => setActivities(activities.map((x) => (x.id === id ? { ...x, approved: true } : x))),
    deleteActivity: (id) => setActivities(activities.filter((x) => x.id !== id)),
    book: (activity, date, people) => {
      // overbooking check: people already booked on that date
      const taken = bookings
        .filter((b) => b.activityId === activity.id && b.date === date && (b.status === "PENDING" || b.status === "CONFIRMED"))
        .reduce((sum, b) => sum + b.people, 0)
      const left = activity.maxPeople - taken
      if (people > left) return `Only ${left} place(s) left on ${date}. Try another date.`
      setBookings([...bookings, {
        id: Date.now(), activityId: activity.id, tourist: user?.name ?? "",
        date, people, total: people * activity.price, status: "PENDING",
      }])
      go("bookings")
      return null
    },
    setStatus: (id, s) => setBookings(bookings.map((b) => (b.id === id ? { ...b, status: s } : b))),
    addReview: (id, r) => setBookings(bookings.map((b) => (b.id === id ? { ...b, review: r } : b))),
  }

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}
