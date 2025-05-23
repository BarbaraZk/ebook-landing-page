import Stripe from "stripe";
import {json} from "@sveltejs/kit";
//NOW FROM THE BACKEND  we need to create a session withj stripe, for that we need to bring stripe library, (import Stripe from stripe), in order for us to create an instance of srtipe, we do this poutside of the fucntion so lives on the serveer, we want new Stripe witth PAI KEY

import { STRIPE_API_KEY, PRICE_ID } from "$env/static/private";
import { PUBLIC_FRONTEND_URL } from "$env/static/public";


const stripe = new Stripe(STRIPE_API_KEY);

// we name it Post because is the method we use, this fun ction is going zo handle any request that  is a post request at exyctly this route.
export async function POST (){
  try{
// here we create the session with Stripe, checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types:["card"],
    line_items:[
      {
        price:PRICE_ID,
        quantity:1,
      },
    ],
    mode:"payment",
    success_url: `${PUBLIC_FRONTEND_URL}/checkout/success`,
    cancel_url: `${PUBLIC_FRONTEND_URL}/checkout/success`,
  });
  // thats above create a session,now we return sessionId, thast being returned from Stripe, and now thats go back to fronted, fronted is waitinf for session_id(step4)

  return json({ sessionId: session.id })
  }catch (error){
    return json({ error }, {status: 500 });
  }
}

