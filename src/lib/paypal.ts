import {HOST_API} from "@/lib/constants";

export const paypal = {
    capturePayment: async function capturePayment(orderId: string) {
        const res = await fetch(`${HOST_API}/identity/api/paypal/capture`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: orderId })
        });
        return handleResponse(res)
    },
}

// async function generateAccessToken() {
//     const {PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET} = process.env
//     const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_APP_SECRET).toString(
//         'base64'
//     )
//     const response = await fetch(`${base}/v1/oauth2/token`, {
//         method: 'post',
//         body: 'grant_type=client_credentials',
//         headers: {
//             Authorization: `Basic ${auth}`,
//         },
//     })
//
//     const jsonData = await handleResponse(response)
//     return jsonData.access_token
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleResponse(response: any) {
    if (response.status === 200 || response.status === 201) {
        return response.json()
    }

    const errorMessage = await response.text()
    throw new Error(errorMessage)
}