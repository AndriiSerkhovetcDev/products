export interface ProductPayload {
  name: string,
  price: string,
  description: string,
  image: string | File
}

export interface ProductResponse {
  _id: string,
  name: string,
  price: string,
  description: string,
  imagePath: string,
  __v: number
}
