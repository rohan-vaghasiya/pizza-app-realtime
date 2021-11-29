import { loadStripe } from '@stripe/stripe-js'
import { placeOrder } from './apiService.js'
import { CardWidget } from './CardWidget'

export async function initStripe() {
    const stripe = await loadStripe('pk_test_51K0QNcSCFBViUBjftSIHgQItqlznKLrxxVOybcd2tv55QlFyiDZhPuJB3tgTO4E2kIkbPGXqEYjBs3ZZ9Rbyth1B00sb6NgZWD');
    let card = null;

    // function mountWidget() {
    //     const elements = stripe.elements()

    //     let style = {
    //         base: {
    //             color: '#32325d',
    //             fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    //             fontSmoothing: 'antialiased',
    //             fontSize: '16px',
    //             '::placeholder': {
    //                 color: '#aab7c4'
    //             }
    //         },
    //         invalid: {
    //             color: '#fa755a',
    //             iconColor: '#fa755a'
    //         }
    //     };

    //     card = elements.create('card', { style, hidePostalCode: true })
    //     card.mount('#card-element')
    // }

    const paymentType = document.querySelector('#paymentType')
    if (!paymentType) {
        return;
    }

    paymentType.addEventListener('change', (e) => {
        console.log(e.target.value)
        if (e.target.value === 'card') {
            // Display Widget
            card = new CardWidget(stripe)
            card.mount()
        } else {
            card.destroy()
        }
    })

    //Ajax call
    const paymentForm = document.querySelector('#payment-Form')
    if (paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            let formData = new FormData(paymentForm)
            let formObject = {}
            for (let [key, value] of formData.entries()) {
                formObject[key] = value
            }
            console.log(formObject)

            if (!card) {
                console.log("Please")
                placeOrder(formObject)
                console.log("back from order")
                return;
            }
            console.log('error of cod')
            const token = await card.createToken()
            formObject.stripeToken = token.id
            placeOrder(formObject)
            //verify card
            // stripe.createToken(card).then((result) => {
            //     console.log(result)
            //     formObject.stripeToken = result.token.id
            //     placeOrder(formObject)
            // }).catch(err => {
            //     console.log(err)
            // })

        })

    }
}
