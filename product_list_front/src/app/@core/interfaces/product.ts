export interface IProductPayload {
  name: string,
  price: string,
  description: string,
  image: string | File
}

export interface IProductResponse {
  _id: string,
  name: string,
  price: string,
  description: string,
  imagePath: string,
}
