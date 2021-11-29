import axios from 'axios';
import Noty from 'noty';
import { initAdmin } from './admin.js'
import { initProduct } from './home.js'
import { initStripe } from './stripe.js'
import moment from 'moment'


let cartCounter = document.querySelector('#cartCounter')

$(document).on("click", ".add-to-cart", function () {
    let pizza = JSON.parse($(this).attr('data-pizza'))
    updatecart(pizza)
});
function updatecart(pizza) {
    axios.post('/update-cart', pizza).then(res => {
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 1000,
            progressBar: false,
            text: 'Item added to cart'
        }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000,
            progressBar: false,
            text: 'Somethin want wrong'
        }).show();
    })
}

// Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert')
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}

//change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })

    let stepCompleted = true;
    statuses.forEach((status) => {
        let dataProp = status.dataset.status
        if (stepCompleted) {
            status.classList.add('step-completed')
        }
        if (dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)

            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }
        }
    })
}
updateStatus(order)




//socket 
let socket = io()

//join for order status 
if (order) {
    socket.emit('join', `order_${order._id}`)
}

//join for order update
let adminAreaPath = window.location.pathname
if (adminAreaPath.includes('admin')) {
    socket.emit('join', 'adminRoom')
    initAdmin(socket)
}

// join for item add, update, delete
socket.emit('join', 'productRoom')
initProduct(socket)

socket.on('orderUpdated', (data) => {
    const updateOrder = { ...order }
    updateOrder.updatedAt = moment().format()
    updateOrder.status = data.status
    updateStatus(updateOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        progressBar: false,
        text: 'Order updated'
    }).show();
})

//stripe call
initStripe()
