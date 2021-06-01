
class Criptos {
  /*Obtiene las criptos de un archivo .json y devuelve un array de objetos*/
  obtenerDatos() {
    let datos = []
    $.ajax({
      'async': false,
      'global': false,
      'url': "criptos.json",
      'dataType': "json",
      'success': function (data) {
        datos = data;
      }
    });
    return datos
  }
}


class Ui {
  constructor(criptos) {
    this.listaDeCriptos = document.getElementById("list")

    this.criptos = criptos
  }
  start() {
    let menuIsOpen = false

    $('#menuButton').click(() => openAndCloseMenu())
    $('#searchInput').change(() => this.buscarCripto(this.criptos))
    this.mostrarCriptos(this.criptos)

    /** Menu Responsive */
    function openAndCloseMenu() {
      let menuButton = document.getElementById("menuButton")
      let menu = document.getElementById("menu")
      if (!menuIsOpen) {
        menuButton.classList.add("closedMenu")
        menu.classList.add("responsive")
        $('body').addClass('stop-scrolling')
        $('body').bind('touchmove', function (e) { e.preventDefault() })

      } else {
        menuButton.classList.remove("closedMenu")
        menu.classList.remove("responsive")
        $('body').removeClass('stop-scrolling')
        $('body').unbind('touchmove')

      }
      menuIsOpen = !menuIsOpen
    }

  }
  /** Requiere un array de objetos y devuelve un array filtrando los elementos que coinciden con la busqueda*/
  buscarCripto(arrayDeCriptos) {
    let input = document.querySelector('#searchInput')
    console.log(arrayDeCriptos)
    let newArray = []
    const ui = new Ui()

    arrayDeCriptos.forEach(el => {
      if (el.nombre.toLocaleLowerCase().includes(input.value.toLocaleLowerCase())) {
        newArray.push(el)
      }
    })


    ui.mostrarCriptos(newArray)

  }

  /** Recibe un nombre de la criptonmoneda en la que se hizo click en fav y lo guarda en el localStorage. Si la moneda ya estaba la elimina*/
  addOrRemoveAsFav(cripto, arrayDeCriptos) {
    let $this = this
    console.log(localStorage.getItem("criptosFav"))
    let criptosFav = []

    if (localStorage.getItem("criptosFav")) {
      criptosFav = JSON.parse(localStorage.getItem("criptosFav"))

    }

    if (criptosFav.indexOf(cripto) == -1) {

      criptosFav.push(cripto)
      localStorage.removeItem("criptosFav")
      localStorage.setItem("criptosFav", JSON.stringify(criptosFav));
    } else {
      let newFav = []
      for (let i = 0; i < criptosFav.length; i++) {
        if (cripto !== criptosFav[i]) {
          console.log(criptosFav[i])
          newFav.push(criptosFav[i])
        }
      }
      console.log(newFav)
      localStorage.removeItem("criptosFav")
      localStorage.setItem("criptosFav", JSON.stringify(newFav));
    }








    console.log(localStorage.getItem("criptosFav"))
    setTimeout(() => {
      this.buscarCripto(arrayDeCriptos)
    }, 500)
  }
  /** Recibe un array con las criptomonedas y renderiza en un div html */
  mostrarCriptos(arrayDeCriptos) {
    let $this = this
    console.log(arrayDeCriptos)
    this.listaDeCriptos.innerHTML = ""
    arrayDeCriptos.sort(function (e1, e2) {
      if (e1.precio > e2.precio) {
        return 1;
      } else if (e1.precio < e2.precio) {
        return -1;
      }
      return 0;
    })
    console.log(arrayDeCriptos)

    arrayDeCriptos.forEach(el => {
      this.listaDeCriptos.innerHTML += ` <div class="card">
      <img src="./img/icons/bitcoin.svg" alt="">
      <h3>${el.nombre}</h3>
      </p>$${el.precio}</p>
      <div id=${'fav' + el.nombre.toLocaleLowerCase()} class=${localStorage.getItem("criptosFav").indexOf(el.nombre) == -1 ? 'no-fav' : 'fav'}> </div>
    </div>
`
      setTimeout(function () {
        document.getElementById('fav' + el.nombre.toLocaleLowerCase()).addEventListener('click', () => $this.addOrRemoveAsFav(el.nombre, arrayDeCriptos))
      }, 500)
    })
    if (arrayDeCriptos.length <= 0) {
      this.listaDeCriptos.innerHTML = `<p>No se encontraron criptos<p/>`
    }

  }


}
let criptos = new Criptos()
let ui = new Ui(criptos.obtenerDatos())
ui.start()
