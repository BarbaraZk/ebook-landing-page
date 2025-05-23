<script>
	import { loadStripe } from '@stripe/stripe-js';
	import { PUBLIC_STRIPE_KEY } from '$env/static/public';
  import { goto } from '$app/navigation';

	//we are using children prperty, so we need to use props, props maike it accessible for us to get any props that are passed to the button compotent.we get children of this props object;
	// additionaly passing ...props -
	let { children, ...props } = $props();

	//i would like to create some checkout session; why do we have to wait? Because to identify ourselves with Stripe and that it will take a moment, we have to reach out to stripe serves.
	async function onclick() {
		try {
			const stripe = await loadStripe(PUBLIC_STRIPE_KEY);
			// we need to infrom backedn that someone want to make the purchase, we are using fetch librbary, we do checkout request
			const response = await fetch('/api/checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			//step 5; after getting session_id; now frontend needs to get the uses to stripe;
			const { sessionId } = await response.json();

			// now we need to redirect the user to checkout page

			await stripe.redirectToCheckout({ sessionId });
		} catch (err) {
        goto("/checkout/failure")
    }
	}
</script>
<button {...props} {onclick}>{@render children()}</button>

<style>
	button {
		background-color: black;
		color: white;
		padding: 20px 24px;
		font-weight: normal;
		font-size: 22px;
		text-transform: uppercase;
		transition: all 0.3s;
		border: 1px solid white;
	}

	button:hover {
		background-color: white;
		color: black;
	}
</style>
