import axios from 'axios'
import Noty from 'noty'

export function initProduct(socket) {
    const orderTableBody = document.querySelector('#productDivBody')
    let pizzas = []
    let markup
    let role

    axios.get('/', {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res => {
        const data = res.data
        pizzas = data.pizzas
        let user = data.user
        if (user) {
            role = user.role
        }

        markup = generateMarkup(pizzas)
        if (orderTableBody) {
            orderTableBody.innerHTML = markup
        }
    }).catch(err => {
        console.log(err)
    })
    function generateMarkup(pizzas) {
        return pizzas.map(pizza => {
            return `
            <div class="w-full md:w-64">
    <img class="h-40 mb-4 mx-auto" src="/img/${pizza.image}" alt="">
    <div class="text-center">
        <h2 class="mb-4 text-lg">
            ${pizza.name}
        </h2>
        <span class="size py-1 px-4 rounded-full uppercase text-xs">
            ${pizza.size}
        </span>
        <div class="flex items-center justify-around mt-6">
            <span class="font-bold text-lg">
                ${pizza.price}
            </span>
            ${role == 'admin' ? ` <a href="/admin/product/update/${pizza._id}">
            <button class="admin add-to-cart py-1 px-6 rounded-full flex items-center font-bold">
                <span>Update</span>
            </button>
        </a>
        <a href="/admin/product/delete/${pizza._id}">
        <button class="add-to-cart py-1 px-6 rounded-full flex items-center font-bold">
            <span>Delete</span>
        </button>
    </a>
      ` : ` <button data-pizza='${JSON.stringify(pizza)}' 
                class="add-to-cart py-1 px-6 rounded-full flex items-center font-bold ">
                <span>+</span>
                <span class="ml-4">Add</span>
            </button>`}
                   
           

        </div>
    </div>
</div>
        `
        }).join('')
    }

    // Socket

    //Added item
    socket.on('itemAdded', (pizza) => {
        pizzas.push(pizza)
        orderTableBody.innerHTML = ''
        orderTableBody.innerHTML = generateMarkup(pizzas)
    })
    //Updated item
    socket.on('itemUpdated', (pizza) => {
        pizzas.forEach((element, index) => {
            if (element._id == pizza._id) {
                pizzas[index] = pizza;
            }
        });
        orderTableBody.innerHTML = ''
        orderTableBody.innerHTML = generateMarkup(pizzas)
    })
    //Deleted item
    socket.on('itemDeleted', (pizza) => {
        // new Noty({
        //     type: 'success',
        //     timeout: 1000,
        //     progressBar: false,
        //     text: 'Item deleted'
        // }).show();
        pizzas.forEach((element, index) => {
            if (element._id == pizza._id) {
                element.name = 'deleted'
                pizzas.splice(index, 1)
                return true;
            }
        });
        orderTableBody.innerHTML = ''
        orderTableBody.innerHTML = generateMarkup(pizzas)
    })

}