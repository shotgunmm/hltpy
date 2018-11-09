type OpenHouse = {
  id: number
  key: string

  name: string
  address: string
  list_price: number
  mls_id: string

  date: Date
  start_time: Date
  end_time: Date

  completed: boolean
  image: string
  created_at: Date
  updated_at: Date
}