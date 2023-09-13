const catID = localStorage.getItem("catID"); //usar el ID de las categorias
const CARS_URL = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`; /*hicimos la constante con la url*/

function sortCategories(criteria, array) { 
    let result = [];
    const precioMin = parseFloat(document.getElementById("rangeFilterCountMin").value);
    const precioMax = parseFloat(document.getElementById("rangeFilterCountMax").value);
    if (criteria === "priceDes") {
        result = array.slice().sort((a, b) => a.cost - b.cost);
    } else if (criteria === "priceAsc") {
        result = array.slice().sort((a, b) => b.cost - a.cost);
    } else if (criteria === "relevancy") {
        result = array.slice().sort((a, b) => b.soldCount - a.soldCount);
    } else if (criteria === "rangePrice") {
        if (!isNaN(precioMin) && isNaN(precioMax)) {
            result = array.filter(product => product.cost >= precioMin);
        } else if (isNaN(precioMin) && !isNaN(precioMax)) {
            result = array.filter(product => product.cost <= precioMax);
        } else if (!isNaN(precioMin) && !isNaN(precioMax)) {
            result = array.filter(product => product.cost >= precioMin && product.cost <= precioMax);
        } else {
            result = array; 
        }
    }
    return result;
}

function showCategoriesList(name, array) { /* funcion para mostrar los items con imagen, precio, nombre, currency y cantidad vendidos*/
    
    let title = `
    <div id="titulo-cat" class="text-center p-4">
        <h2>${name}</h2>
        <h5 class="lead">Los mejores productos, a los mejores precios.</h5>
    </div>`; //agrega el titulo de la categoria

    let htmlContentToAppend = ""
    
    for (let i = 0; i < array.length; i++) {
        let product = array[i]; 
        htmlContentToAppend += `
        <div class="list-group-item list-group-item-action" id="${i}">
            <div class="row">
                <div class="col-3">
                    <img src="${product.image}" alt="product image" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <div class="mb-1"> 
                            <h4>${product.name} - ${product.currency}  ${product.cost}</h4>  
                            <p>${product.description}</p> 
                        </div>
                        <small class="text-muted">${product.soldCount} vendidos </small> 
                    </div>
                </div>
            </div>
        </div>`;
    }

    document.getElementById("products-cat").innerHTML = htmlContentToAppend;
    document.getElementById("title").innerHTML = title;
}

function setProductId(productId) {
  localStorage.setItem("prodId", productId);
  console.log("ID del producto seleccionado:", productId);
  window.location.href = "product-info.html";
}
  
function sortAndShow (criteria, array, name){
  currentArray = sortCategories(criteria, array)
  showCategoriesList(name, currentArray)
} 

fetch(CARS_URL)
  .then(response => response.json())
  .then(data => {
    const catName = data.catName;
    let productsArray = data.products;
    showCategoriesList(catName, productsArray);

    
      // Muestra los botones de productos
    for (let i = 0; i < productsArray.length; i++){
      console.log(document.getElementById(i))
      document.getElementById(i).addEventListener("click", function(){
        let product = productsArray[i];
        setProductId(product.id)
      });
    }
 
    document.getElementById("rangeFilterCount").addEventListener("click", function() {
      if (rangeFilterCountMin.value.trim() !== '' || rangeFilterCountMax.value.trim() !== '') {
        sortAndShow("rangePrice", productsArray, catName);
      } else {
        showCategoriesList(catName, productsArray);
      }
    });


    document.getElementById("sortAsc").addEventListener("click", function() {
      sortAndShow("priceAsc", productsArray, catName);
    });

    document.getElementById("sortDesc").addEventListener("click", function() {
      sortAndShow("priceDes", productsArray, catName);
    });

    document.getElementById("sortByCount").addEventListener("click", function() {
      sortAndShow("relevancy", productsArray, catName);
    });

    
    document.getElementById("clearRangeFilter").addEventListener("click", function() {
      rangeFilterCountMin.value = ''; // campo precio min
      rangeFilterCountMax.value = ''; // campo precio max 
      showCategoriesList(catName, productsArray);
    });


    document.getElementById("query").addEventListener("input", function(e) {
        let value = e.target.value.trim().toLowerCase();
        if (value.length > 0) {
            const searched = productsArray.filter(product => (product.name.toLowerCase().includes(value)) || (product.description.toLowerCase().includes(value)) );
            showCategoriesList(catName, searched);
        } else {
            showCategoriesList(catName, productsArray);
        }
    });


  })

  .catch(error => {
    console.error("Error al cargar los datos", error);
  });

const savedUsername = localStorage.getItem("savedUsername");

// Mostrar usuario en barra de navegacion de la pagina 
const userInfoElement = document.getElementById("user-info");
userInfoElement.textContent = ` ${savedUsername}`;

// Función para cerrar sesión y borrar el usuario
function cerrarSesion() {
    // Borrar el nombre de usuario y la contraseña almacenado en el almacenamiento local
  localStorage.removeItem("savedUsername");
  localStorage.removeItem("savedPassword");
    

    // Redirigir a la página de inicio de sesión 
    window.location.href = "login.html"; 
  }
  
  // Agregar evento al enlace de Cerrar Sesión
  document.getElementById("logout").addEventListener("click", cerrarSesion)