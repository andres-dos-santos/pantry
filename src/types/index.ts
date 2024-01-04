export interface Product {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  expirated_at: string
  name: string
  link: string
  quantity: number
  usage: number
  price: number
  brand: string
  fixed: boolean
  suffix: 'KG' | 'GR' | 'PC' | 'UN' | 'LT'
  tags: string[]
}
