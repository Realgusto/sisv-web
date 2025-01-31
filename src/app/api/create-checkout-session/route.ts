import stripe from "@/lib/stripe"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const { testId } = await req.json()
    
    const price = process.env.STRIPE_PRICE_ID

    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            payment_method_types: ['card', 'boleto'],
            success_url: `${req.headers.get('origin')}/movements/purchases/order`,
            cancel_url: `${req.headers.get('origin')}/movements/purchases/order`,
            metadata: {
                testId,
            },
        })

        return NextResponse.json({ sessionId: session.id })
    } catch (err) {
        console.error(err)
        NextResponse.error()
    }
}