// Ẩn thanh navbar
const navbar = document.querySelector(".header_nav");

window.addEventListener("scroll", function () {
  let x = pageYOffset;

  if (x > 50) {
    navbar.style.display = "none";
  } else {
    navbar.style.display = "block";
  }
});

// Slider
const slides = document.querySelectorAll(".slide-wrap");
const dots = document.querySelectorAll(".navigation-dot");

function slider() {
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      const slide = slides[index];
      let dotActive = document.querySelector(".navigation-dot.active");
      let slideActive = document.querySelector(".slide-wrap.active");

      dotActive.classList.remove("active");
      slideActive.classList.remove("active");
      dot.classList.add("active");
      slide.classList.add("active");
    });
  });
}
slider();

// slider autoplay navigation
function repeat() {
  let actives = document.getElementsByClassName("active");
  let i = 1;

  function repeater() {
    setTimeout(function () {
      [...actives].forEach((active) => {
        active.classList.remove("active");
      });

      slides[i].classList.add("active");
      dots[i].classList.add("active");
      i++;

      if (slides.length == i) {
        i = 0;
      }

      return repeater();
    }, 6000);
  }
  repeater();
}

repeat();

// Xử lý phần modal form
const modalForm = document.querySelector(".modal_form");
const forms = document.querySelectorAll(".form");

// From login register
const formRegistered = document.getElementById("form-register");
const formLogin = document.getElementById("form-login");
const linkRegistered = document.querySelector(".user-register");
const linkLogin = document.querySelector(".user-login");

// Click đến form Registered
linkRegistered.addEventListener("click", () => {
  if ((modalForm.style.display = "none")) {
    modalForm.style.display = "block";
    formRegistered.style.display = "block";
    formLogin.style.display = "none";

    return validator("#form-register");
  }
});

// Click đến form Login
linkLogin.addEventListener("click", () => {
  if ((modalForm.style.display = "none")) {
    modalForm.style.display = "block";
    formRegistered.style.display = "none";
    formLogin.style.display = "block";

    return validator("#form-login");
  }
});

// Closer form
for (inputCloseForm of forms) {
  let closeForm = inputCloseForm.querySelector(".form_close");

  closeForm.onclick = function () {
    if (modalForm.style.display === "block") {
      modalForm.style.display = "none";
    }
  };
}

// Làm việc và check value form Đăng nhập, đăng ký
function validator(formSelector) {
  function getParent(element, selector) {
    let parent = element.parentElement;

    while (parent) {
      if (parent.matches(selector)) {
        return parent;
      } else {
        element = parent;
        break;
      }
    }
  }

  var formRules = {};
  var validatorRules = {
    required: function (value) {
      return value.trim() ? undefined : "Vui lòng nhập trường này";
    },
    email: function (value) {
      var regex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      return regex.test(value) ? undefined : "Vui lòng nhập email";
    },
    min: function (min) {
      return function (value) {
        return value.length >= min
          ? undefined
          : `Vui lòng nhập đủ ${min} kí tự`;
      };
    },
  };

  // Lấy ra form element có trong DOM
  var formElement = document.querySelector(formSelector);
  if (formElement) {
    // Lấy ra name và rules trong thẻ input
    var inputs = document.querySelectorAll("[name][rules]");

    // Lặp qua thẻ input và làm việc thông qua rules
    for (input of inputs) {
      var rules = input.getAttribute("rules").split("|");
      for (var rule of rules) {
        var isRuleHasValue = rule.includes(":");
        var ruleInfo;

        if (isRuleHasValue) {
          ruleInfo = rule.split(":");
          rule = ruleInfo[0];
        }

        var ruleFunc = validatorRules[rule];
        if (isRuleHasValue) {
          ruleFunc = ruleFunc(ruleInfo[1]);
        }

        if (Array.isArray(formRules[inputs.name])) {
          formRules[input.name].push(ruleFunc);
        } else {
          formRules[input.name] = [ruleFunc];
        }
      }

      // Sự kiện
      input.onblur = handleValidator;
      input.oninput = handleClearMessage;
    }

    // functon sự kiện blur
    function handleValidator(e) {
      var rules = formRules[e.target.name];
      for (rule of rules) {
        var errorMessage = rule(e.target.value);
        if (errorMessage) break;
      }

      if (errorMessage) {
        var formGroup = getParent(e.target, ".form-group");
        var formMessage = formGroup.querySelector(".form-message");

        if (formMessage) {
          formGroup.classList.add("invalid");
          formMessage.innerText = errorMessage;
        } else {
          formMessage.innerText = "";
        }
      }

      return !errorMessage;
    }

    // function Sự kiện input
    function handleClearMessage(e) {
      var formGroup = getParent(e.target, ".form-group");
      var formMessage = formGroup.querySelector(".form-message");
      if (formGroup.classList.contains("invalid")) {
        formGroup.classList.remove("invalid");
      } else {
        formMessage.innerText = "";
      }
    }

    // submit form
    formElement.onsubmit = function (e) {
      e.preventDefault();
      var isValid = true;

      for (var form of forms) {
        var inputs = form.querySelectorAll("input");

        if (handleValidator({ target: input })) {
          formElement.submit();
        }
        for (input of inputs) {
          if (!handleValidator({ target: input })) {
            isValid = false;
          }
        }
      }
    };
  }
}

// Modal cart
const modalCart = document.querySelector(".modal_products");
const cartIcon = document.getElementById("cart-icon");
const cartWrap = document.querySelector(".products_cart-wrap");
const modaClose = document.querySelector(".modal_close-icon");
const openModal = document.querySelector(".cart_icon");
const box = document.querySelector(".box");

// Click đến products cart
cartIcon.onclick = function () {
  if ((modalCart.style.display = "none")) {
    modalCart.style.display = "block";
    cartWrap.style.display = "block";
  }
};
// Đóng modal
modaClose.addEventListener("click", () => {
  if ((modalCart.style.display = "block")) {
    modalCart.style.display = "none";
  }
});

// Handle Products
function handleProducts() {
  let ApiProducts =
    "https://api-json-server-bz7qly2e1-vithanhtu.vercel.app/menu";
  let productsBox = document.querySelector(".container_products-box");
  fetch(ApiProducts)
    .then((response) => {
      return response.json();
    })
    .then((products) => {
      let htmls = products.map((product) => {
        return `
                    <div class="col l-3 m-6 c-12 productsWrap" id="${product.id}">
                        <div class="container_products-item">
                            <div class="products-item-image">
                                <img src="${product.img}" alt="">
                            </div>
                        <div class="products-item-content">
                            <h3 class="products-name">${product.title}</h3>
                            <p class="products-price">${product.price}</p>
                                        
                        <div class="products-item-box">
                            <button class="products-item-btn" onclick=addToCart(${product.id})>
                                <i class="fas fa-cart-plus"></i>
                                <span>ADD TO CART</span>
                            </button>
                        </div>
                        </div>
                        </div>
                    </div>`;
      });

      productsBox.innerHTML = htmls.join("");
    });
}
handleProducts();

// Add to cart
function addToCart(id) {
  let cartId = document.getElementById(id);
  let cartImage = cartId.querySelector("img").src;
  const cartName = cartId.querySelector(".products-name").innerText;
  const cartPrice = cartId.querySelector(".products-price").innerText;

  let cartBox = document.querySelector(".cart-wrap-box");
  let products = document.createElement("div");
  products.classList.add("box-item");
  products.innerHTML = `
        <div class="cart_item">
        <div class="cart_item-img">
            <img src="${cartImage}" alt="">
        </div>
        <div class="cart_item-content">
            <span>${cartName}</span>
            <h4 class="item-price">${cartPrice}</h4>
        </div>
        <div class="cart_item_footer">
        <label for="">Number</label>
        <input type = 'number' class = 'num' value = '1'>
        <span>Total</span>
        <h4 class="total-price">${cartPrice}</h4>
        <button class="remove_btn">
            <i class="far fa-trash-alt"></i>
        </button>
        </div>
        </div>
    `;
  cartBox.appendChild(products);

  // Number cart
  function numberCarts() {
    let items = cartBox.querySelectorAll(".cart_item");
    for (var j = 0; j <= items.length; j++) {
      let cartsNum = document.querySelector(".input-cart-num");
      cartsNum.value = j;
    }
  }
  numberCarts();

  // Update cart
  const number = document.querySelectorAll(".num");
  number.forEach((num) => {
    num.addEventListener("change", updateCarts);
  });
  grandCartTotal();

  // Remove Cart
  const removeIcon = products.querySelectorAll(".remove_btn");
  removeIcon.forEach((btn) => {
    btn.addEventListener("click", removeCarts);
  });
}

// Update cart
function updateCarts(event) {
  let input = event.target;
  let inputParent = input.parentElement.parentElement;
  let cartElement = inputParent.parentElement;
  let cartPrice = cartElement
    .querySelector(".item-price")
    .innerText.replace("$", "");
  let totalPrice = cartElement.querySelector(".total-price");

  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  totalPrice.innerText = "$" + input.value * cartPrice;

  grandCartTotal();
}

// Total price
function grandCartTotal() {
  let total = 0;
  let grandTotal = document.querySelector(".grand-total");
  let totalPrice = document.querySelectorAll(".total-price");

  totalPrice.forEach((totals) => {
    let priceContent = Number(totals.innerText.replace("$", ""));
    total += priceContent;
  });

  grandTotal.innerText = "$" + total;
  grandTotal.style.fontWeight = "bold";
}

// Remove cart
function removeCarts(e) {
  let btn = e.target.parentElement.parentElement;
  let btnParent = btn.parentElement;
  btnParent.remove();

  grandCartTotal();

  // Number cart
  let cartBox = document.querySelector(".cart-wrap-box");
  let items = cartBox.querySelectorAll(".cart_item");
  for (var j = 0; j <= items.length; j++) {
    let cartsNum = document.querySelector(".input-cart-num");
    cartsNum.value = j;
  }
}

// Page products
const pages = document.querySelectorAll(".container_page-content-btn");
pages.forEach((page) => {
  page.addEventListener("click", renderProducts);
});

function renderProducts(e) {
  let btn = e.target.innerText;
  let pageActive = document.querySelector(
    ".container_page-content-btn.active_btn"
  );
  pageActive.classList.remove("active_btn");
  this.classList.add("active_btn");

  // poducts page 1
  if (btn == 2) {
    let Api = "https://vithanhtu.herokuapp.com/carts2";
    let productsBox = document.querySelector(".container_products-box");

    fetch(Api)
      .then((response) => {
        return response.json();
      })
      .then((carts) => {
        let htmls = carts.map((cart) => {
          return `
                        <div class="col l-3 m-6 c-12 productsWrap" id="${cart.id}">
                        <div class="container_products-item">
                            <div class="products-item-image">
                                <img src="${cart.image}" alt="">
                            </div>
                            <div class="products-item-content">
                                <h3 class="products-name">${cart.name}</h3>
                                <p class="products-price">${cart.price}</p>
                                
                            <div class="products-item-box">
                                <button class="products-item-btn"  onclick=addToCart(${cart.id})>
                                    <i class="fas fa-cart-plus"></i>
                                    <span>ADD TO CART</span>
                                </button>
                            </div>
                            </div>
                            </div>
                        </div>`;
        });

        productsBox.innerHTML = htmls.join("");
      });

    // products page 2
  } else if (btn == 1) {
    return handleProducts();
  }
}

// Search bar
let productsBox = document.querySelector(".container_products-box");
const searchBar = document.querySelector(".search-bar");

searchBar.addEventListener("keyup", (e) => {
  let searchString = e.target.value.toLowerCase();
  let liCharacter = productsBox.querySelectorAll(".productsWrap");

  liCharacter.forEach((search) => {
    let name = search.querySelector(".products-name").parentElement;
    let productItem = name.parentElement;
    let nameText = search.querySelector(".products-name").innerText;

    if (nameText.toLowerCase().indexOf(searchString) > -1) {
      productItem.parentElement.style.display = "";
    } else {
      productItem.parentElement.style.display = "none";
    }
  });
});

// Contact form
formContact("#contact_form");
function formContact(formSelector) {
  const formElement = document.querySelector(formSelector);
  let inputs = formElement.querySelectorAll("[name]");
  inputs.forEach((input) => {
    let formElement = document.querySelector(formSelector);
    let formGroup = input.parentElement;
    let email = input.classList.contains("email");
    let formMessage = formGroup.querySelector(".form-message");

    function formBlur() {
      input.onblur = (e) => {
        const value = e.target.value;

        if (!value) {
          formMessage.innerText = "Vui lòng nhập trường này";
          input.parentElement.classList.add("invalid");
        } else {
          formMessage.innerText = "";
          input.parentElement.classList.remove("invalid");
        }

        if (email) {
          const regex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
          if (!regex.test(value)) {
            formMessage.innerText = "Vui lòng nhập email";
            input.parentElement.classList.add("invalid");
          } else {
            formMessage.innerHTML = "";
            input.parentElement.classList.remove("invalid");
            return true;
          }
        }
      };
    }

    formBlur();

    // Form input - clear
    input.oninput = function () {
      if (formMessage) {
        formMessage.innerHTML = "";
        input.parentElement.classList.remove("invalid");
      }
    };

    // Form submit
    formElement.onsubmit = (e) => {
      e.preventDefault();

      if (input.value) {
        alert("Success");
      } else {
        inputs.forEach((inputErr) => {
          let inputParen = inputErr.parentElement;
          let formMessageErr = inputParen.querySelectorAll(".form-message");
          inputErr.parentElement.classList.add("invalid");

          for (let err of formMessageErr) {
            err.innerText = "Vui lòng nhập trường này";
          }
        });
      }
    };
  });
}
