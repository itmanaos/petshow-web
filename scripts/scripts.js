const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const addressInput = document.getElementById("address");
const customerInput = document.getElementById("customer");
const telefoneInput = document.getElementById("telefone");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// Abrir Modal do Carrinho
cartBtn.addEventListener("click", function () {
  updateCart();
  cartModal.style.display = "flex";
});

// Fechar o Modal clicando fora
cartModal.addEventListener("click", function (e) {
  if (e.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// Fechar o Modal clicando BtnFechar
closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

// Adicionar itens ao carrinho
menu.addEventListener("click", (e) => {
  let parentButton = e.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    addToCart(name, price);
  }
});

// Funcao para Adicionar no Carrinho
function addToCart(name, price) {
  const existentItem = cart.find((item) => item.name === name);
  if (existentItem) {
    existentItem.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  updateCart();
}

//Atualiza Carrinho
function updateCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("flex", "justify-between", "mb-4", "flex-col");

    cartItem.innerHTML = `
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">${item.name}</p>
            <p>Quantidade: ${item.quantity}</p>
            <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
          </div>
            <button class="remove-item-btn" data-name="${
              item.name
            }">Remover</button>

        </div>
      `;
    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItem);
    //cartItem.classList.add("cart-item");
  });
  cartTotal.innerHTML = `R$ ${total.toFixed(2)}`;
  cartCount.innerHTML = cart.length;
}

//Funcao para Remover Item do Carrinho
cartItemsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-item-btn")) {
    //const name = e.target.dataset.name;
    const name = e.target.getAttribute("data-name");

    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);
  if (index !== -1) {
    const item = cart[index];
    if (item.quantity > 1) {
      item.quantity--;
      updateCart();
      return;
    }
    cart.splice(index, 1);
    updateCart();
  }
}

addressInput.addEventListener("input", (e) => {
  let value = e.target.value;
  if (value.length !== "") {
    addressInput.classList.remove("error");
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

customerInput.addEventListener("input", (e) => {
  let value = e.target.value;
  if (value.length !== "") {
    customerInput.classList.remove("error");
    customerInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

telefoneInput.addEventListener("input", (e) => {
  let value = e.target.value;
  if (value.length !== "") {
    telefoneInput.classList.remove("error");
    telefoneInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

checkoutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const isOpen = checkStoreOpen();
  if (!isOpen) {
    Toastify({
      text: "LOJA FECHADA - Horario de Funcionamento Seg a Sab das 08:00 as 20:00 e Dom 08:00 as 13:00",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #ef4444, #ef4455)",
      },
    }).showToast();

    return;
  }

  if (cart.length === 0) return;
  if (
    addressInput.value === "" ||
    customerInput.value === "" ||
    telefoneInput.value === ""
  ) {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("error");
    addressInput.classList.add("border-red-500");
    customerInput.classList.add("error");
    customerInput.classList.add("border-red-500");
    telefoneInput.classList.add("error");
    telefoneInput.classList.add("border-red-500");
    return;
  }

  // Enviar o Pedido para a API
  const cartItems = cart
    .map((item) => {
      return (
        "|Item: " +
        item.name +
        " Quant: (" +
        item.quantity +
        ") Preço R$ " +
        item.price +
        "|"
      );
    })
    .join("");

  const message = encodeURIComponent(cartItems);
  const phone = "+5592981597235"; // Telefone da Loja

  window.open(
    "https://wa.me/" +
      phone +
      "?text=" +
      message +
      " | Total: " +
      cartTotal.innerHTML +
      " | Nome do Cliente: " +
      customerInput.value +
      " Contato:  " +
      telefoneInput.value +
      " -- Endereço: " +
      addressInput.value,
    "_blank"
  );

  //cart.length = 0;
  cart = [];
  updateCart();
  addressInput.value = "";
  addressInput.focus();
  cartModal.style.display = "none";
  Toastify({
    text: "Pedido Enviado com Sucesso!!",
    duration: 6000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, green, green)",
    },
  }).showToast();
});

function checkStoreOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 8 && hora < 20;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkStoreOpen();
if (isOpen) {
  spanItem.classList.add("text-green-500");
  spanItem.classList.remove("bg-red-500");
} else {
  spanItem.classList.remove("text-green-500");
  spanItem.classList.add("bg-red-500");
}
