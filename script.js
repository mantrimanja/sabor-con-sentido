"use strict";

document.addEventListener("DOMContentLoaded", function () {
  function crearMascota() {
    var contenedor = document.getElementById("mascota");
    if (!contenedor) return { alCambiar: function () {} };

    var globo = document.getElementById("globo");
    var texto = document.getElementById("consejo");
    var boton = document.getElementById("mascota-btn");
    var otro = document.getElementById("otro-consejo");
    var cerrar = document.getElementById("cerrar-globo");

    var porSeccion = {
      inicio: "¡Hola! Soy Senti. Te acompaño en el recorrido con consejos para no desperdiciar comida.",
      problematica: "Cuando el refrigerio se abandona, además de desperdiciarse, puede generar problemas de insalubridad en el colegio.",
      sondeo: "Tu opinión cuenta: responder el sondeo nos ayuda a entender por qué se desperdicia el refrigerio.",
      resultados: "Esta sección es solo para docentes.",
      pae: "Dale play al video para conocer de dónde vienen los alimentos que recibes en el colegio.",
      creditos: "Gracias por llegar hasta aquí. ¡Senti te invita a cuidar la comida!"
    };

    var generales = [
      "Si hoy no te provoca algo del refrigerio, no lo botes: ofrécelo a un compañero que sí lo quiera.",
      "Guarda en tu mochila lo que no alcances a comer y consúmelo más tarde o en casa.",
      "Prueba combinar los alimentos del refrigerio: una fruta con cereal o un lácteo con pan pueden cambiar el sabor.",
      "Antes de desechar algo, pregúntate: ¿alguien en casa lo aprovecharía?",
      "Botar comida en pasillos y ventanas ensucia el colegio y puede atraer plagas. Usa siempre las canecas.",
      "Cuéntanos en el sondeo qué alimento no te gusta y por qué: tu opinión ayuda a mejorar.",
      "Pregunta en casa cómo transformar un alimento que no te gusta en una receta diferente.",
      "Comparte lo que aprendes aquí con tu familia y tus compañeros."
    ];

    var indice = Math.floor(Math.random() * generales.length) - 1;
    var primera = true;

    function decir(mensaje) {
      texto.textContent = mensaje;
      globo.hidden = false;
    }

    function consejoGeneral() {
      indice = (indice + 1) % generales.length;
      decir(generales[indice]);
    }

    function saltar() {
      contenedor.classList.remove("salta");
      void contenedor.offsetWidth;
      contenedor.classList.add("salta");
    }

    boton.addEventListener("click", function () {
      saltar();
      consejoGeneral();
    });
    otro.addEventListener("click", consejoGeneral);
    cerrar.addEventListener("click", function () {
      globo.hidden = true;
      boton.focus();
    });

    contenedor.hidden = false;

    return {
      alCambiar: function (id) {
        if (!primera) contenedor.classList.toggle("izquierda");
        primera = false;
        saltar();
        decir(porSeccion[id] || generales[0]);
      }
    };
  }

  var mascota = crearMascota();

  var vistas = Array.prototype.slice.call(document.querySelectorAll(".vista"));
  var enlaces = document.querySelectorAll(".menu a");
  var ids = vistas.map(function (v) { return v.id; });

  function crearPaginacion() {
    vistas.forEach(function (vista, i) {
      var contenido = vista.querySelector(".contenido");
      if (!contenido || i === 0) return;

      var nav = document.createElement("div");
      nav.className = "paginacion";

      var anterior = document.createElement("a");
      anterior.href = "#" + ids[i - 1];
      anterior.textContent = "← Anterior";
      nav.appendChild(anterior);

      if (i < vistas.length - 1) {
        var siguiente = document.createElement("a");
        siguiente.href = "#" + ids[i + 1];
        siguiente.textContent = "Siguiente →";
        nav.appendChild(siguiente);
      }

      contenido.appendChild(nav);
    });
  }

  function mostrar(idSolicitado, moverFoco) {
    var id = ids.indexOf(idSolicitado) !== -1 ? idSolicitado : ids[0];

    vistas.forEach(function (vista) {
      vista.hidden = vista.id !== id;
    });

    enlaces.forEach(function (enlace) {
      if (enlace.getAttribute("href") === "#" + id) {
        enlace.setAttribute("aria-current", "page");
      } else {
        enlace.removeAttribute("aria-current");
      }
    });

    var actual = document.getElementById(id);
    var titulo = actual.querySelector("h1, h2");
    document.title = (titulo ? titulo.textContent + " | " : "") + "Sabor con Sentido";

    document.body.setAttribute("data-vista", id);
    mascota.alCambiar(id);
    window.scrollTo(0, 0);
    if (moverFoco && titulo) titulo.focus({ preventScroll: true });
  }

  function idDesdeHash() {
    return window.location.hash.replace("#", "");
  }

  crearPaginacion();
  mostrar(idDesdeHash(), false);

  window.addEventListener("hashchange", function () {
    mostrar(idDesdeHash(), true);
  });
});
