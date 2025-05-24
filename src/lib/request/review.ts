export interface ReviewAddRequest {
    orderId: string,
    productId: string,
    ratingScore: number,
    content: string,
    images: string[],
}