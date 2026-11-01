(() => {
  'use strict';

  const scriptURL = document.currentScript.src;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const formato = new Intl.NumberFormat('es-MX');
  const dia = 86400000;
  const todos = (selector) => document.querySelectorAll(selector);

  todos('.top').forEach((encabezado) => {
    const boton = encabezado.querySelector('.menu-toggle');
    const menu = boton && document.getElementById(boton.getAttribute('aria-controls'));
    if (!menu) return;
    const movil = window.matchMedia('(max-width: 899px)');
    const cerrar = (devolverFoco = false) => {
      if (devolverFoco) boton.focus();
      boton.setAttribute('aria-expanded', 'false');
      boton.setAttribute('aria-label', 'Abrir menú');
      menu.hidden = movil.matches;
    };
    boton.hidden = false;
    encabezado.classList.add('menu-ready');
    cerrar();
    boton.addEventListener('click', () => {
      const abierto = boton.getAttribute('aria-expanded') !== 'true';
      boton.setAttribute('aria-expanded', String(abierto));
      boton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
      menu.hidden = !abierto;
    });
    encabezado.addEventListener('keydown', (evento) => {
      if (evento.key === 'Escape' && boton.getAttribute('aria-expanded') === 'true') {
        evento.preventDefault();
        cerrar(true);
      }
    });
    menu.addEventListener('click', (evento) => {
      if (movil.matches && evento.target.closest('a')) cerrar();
    });
    movil.addEventListener('change', () => cerrar(menu.contains(document.activeElement) && movil.matches));
  });

  if (todos('.dep-area').length && !motion.matches && 'IntersectionObserver' in window) {
    const revelar = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.remove('area-pendiente');
        revelar.unobserve(entrada.target);
      });
    }, { threshold: 0.12 });
    todos('.dep-area').forEach((area) => {
      area.classList.add('area-pendiente');
      revelar.observe(area);
    });
    motion.addEventListener('change', () => {
      if (motion.matches) {
        todos('.area-pendiente').forEach((area) => area.classList.remove('area-pendiente'));
        revelar.disconnect();
      }
    });
  }

  if (!motion.matches && 'IntersectionObserver' in window && todos('[data-trayectoria]').length) {
    const trayectoria = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('animada');
        trayectoria.unobserve(entrada.target);
      });
    }, { threshold: 0.08 });
    todos('[data-trayectoria]').forEach((linea) => {
      linea.querySelectorAll('.v-trayectoria-hito').forEach((hito, i) => hito.style.setProperty('--hito', String(i)));
      trayectoria.observe(linea);
    });
    motion.addEventListener('change', () => {
      if (!motion.matches) return;
      trayectoria.disconnect();
      todos('[data-trayectoria]').forEach((linea) => linea.classList.remove('animada'));
    });
  }

  if (!motion.matches && 'IntersectionObserver' in window && todos('[data-revelar-foto]').length) {
    const fotos = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.remove('foto-pendiente');
        fotos.unobserve(entrada.target);
      });
    }, { threshold: 0.08 });
    todos('[data-revelar-foto]').forEach((foto) => {
      foto.classList.add('foto-pendiente');
      fotos.observe(foto);
      // A keyboard user can always see the image that receives focus.
      foto.addEventListener('focus', () => foto.classList.remove('foto-pendiente'));
    });
    motion.addEventListener('change', () => {
      if (!motion.matches) return;
      fotos.disconnect();
      todos('[data-revelar-foto]').forEach((foto) => foto.classList.remove('foto-pendiente'));
    });
  }

  todos('[data-copiar]').forEach((boton) => {
    boton.hidden = false;
    boton.addEventListener('click', async () => {
      const texto = boton.dataset.copiar;
      const estado = document.querySelector('[data-copia-estado]');
      if (estado) estado.textContent = '';
      let copiado = false;
      try {
        await navigator.clipboard.writeText(texto);
        copiado = true;
      } catch {
        const campo = document.createElement('textarea');
        campo.value = texto;
        campo.readOnly = true;
        campo.setAttribute('aria-label', 'Dato de contacto para copiar');
        campo.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;opacity:0';
        document.body.append(campo);
        campo.select();
        try { copiado = document.execCommand('copy'); } catch { copiado = false; }
        campo.remove();
        boton.focus({ preventScroll: true });
      }
      if (estado) estado.textContent = copiado
        ? `Copiado: ${texto}`
        : `No se pudo copiar automáticamente. Selecciona y copia este dato: ${texto}`;
    });
  });

  todos('[data-fachada]').forEach((figura) => {
    const repetir = () => {
      const siguiente = figura.classList.contains('c1') ? 'c2' : 'c1';
      figura.classList.remove('c1', 'c2');
      figura.classList.add(siguiente);
    };
    figura.addEventListener('mouseenter', repetir);
    figura.querySelectorAll('[data-repetir-fachada]').forEach((boton) => {
      boton.addEventListener('click', repetir);
    });
  });

  todos('[role="tablist"]').forEach((lista) => {
    const tabs = Array.from(lista.querySelectorAll('[role="tab"]'));
    const activar = (tab, enfocar = false) => {
      tabs.forEach((actual) => {
        const seleccionado = actual === tab;
        actual.setAttribute('aria-selected', String(seleccionado));
        actual.tabIndex = seleccionado ? 0 : -1;
        const panel = document.getElementById(actual.getAttribute('aria-controls'));
        if (panel) panel.hidden = !seleccionado;
      });
      if (enfocar) tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activar(tab));
      tab.addEventListener('keydown', (evento) => {
        const destinos = {
          ArrowLeft: (i - 1 + tabs.length) % tabs.length,
          ArrowRight: (i + 1) % tabs.length,
          Home: 0,
          End: tabs.length - 1
        };
        if (!Object.prototype.hasOwnProperty.call(destinos, evento.key)) return;
        evento.preventDefault();
        activar(tabs[destinos[evento.key]], true);
      });
    });
  });

  // Calendar days in the visitor's local date, unaffected by daylight saving.
  function fechaCivil(fecha) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) throw new Error('Fecha inválida');
    const [anio, mes, fechaDia] = fecha.split('-').map(Number);
    const valor = Date.UTC(anio, mes - 1, fechaDia);
    if (new Date(valor).toISOString().slice(0, 10) !== fecha) throw new Error('Fecha inválida');
    return valor;
  }

  function aplicar(datos) {
    const crece = datos.crece;
    const vectores = datos.vectores;
    const ahora = new Date();
    const hoy = Date.UTC(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    const fundacion = fechaCivil(crece.fundacion);
    const inicio = fechaCivil(vectores.inicioRecepcion);
    const cierre = fechaCivil(vectores.cierre);
    // Reception includes the entire closing day, as in the original mockup.
    const fin = cierre + dia;
    const diasCrece = Math.max(0, Math.floor((hoy - fundacion) / dia));
    const diasVectores = Math.max(0, Math.ceil((fin - hoy) / dia));
    const avance = Math.min(100, Math.max(0, ((hoy - inicio) / (fin - inicio)) * 100));
    const campos = [
      ['[data-crece-dias]', diasCrece, ''],
      ['[data-crece-grupos]', crece.grupos, ''],
      ['[data-crece-alumnos]', crece.alumnos, ''],
      ['[data-crece-convocatorias]', crece.convocatorias, ''],
      ['[data-crece-horas-formacion]', crece.horasFormacion, '+']
    ];
    // Validate before changing the fallback HTML.
    if (fin <= inicio || campos.some(([, valor]) => !Number.isSafeInteger(valor) || valor < 0)) {
      throw new Error('Datos inválidos');
    }

    const contadores = new Map();
    campos.forEach(([selector, valor, sufijo]) => {
      todos(selector).forEach((elemento) => {
        const pintar = (numero) => { elemento.textContent = formato.format(numero) + sufijo; };
        pintar(valor);
        contadores.set(elemento, { valor, pintar, frame: null });
      });
    });

    todos('[data-contador]').forEach((elemento) => {
      const valor = Number(elemento.dataset.contador);
      if (!Number.isSafeInteger(valor) || valor < 0) return;
      const pintar = (numero) => { elemento.textContent = formato.format(numero); };
      pintar(valor);
      contadores.set(elemento, { valor, pintar, frame: null });
    });

    todos('[data-vectores-dias]').forEach((elemento) => {
      elemento.textContent = formato.format(diasVectores);
    });
    todos('[data-convocatorias-abiertas]').forEach((elemento) => {
      elemento.textContent = formato.format(diasVectores > 0 ? 2 : 1);
    });
    todos('[data-vectores-estado]').forEach((elemento) => {
      const abierta = diasVectores > 0;
      elemento.classList.toggle('abierta', abierta);
      elemento.classList.toggle('cerrada', !abierta);
      const punto = document.createElement('span');
      punto.className = 'punto';
      elemento.replaceChildren(punto, document.createTextNode(abierta ? 'Abierta' : 'Cerrada'));
    });
    todos('[data-vectores-barra]').forEach((elemento) => {
      elemento.style.width = `${avance}%`;
      const barra = elemento.closest('[role="progressbar"], .barra') || elemento;
      barra.setAttribute('aria-label', `Avance del periodo de recepción: ${Math.round(avance)} %`);
      if (barra.getAttribute('role') === 'progressbar') {
        barra.setAttribute('aria-valuemin', '0');
        barra.setAttribute('aria-valuemax', '100');
        barra.setAttribute('aria-valuenow', String(Math.round(avance)));
      }
    });

    if (motion.matches || !('IntersectionObserver' in window)) return;
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        observador.unobserve(entrada.target);
        const contador = contadores.get(entrada.target);
        const inicioAnimacion = performance.now();
        contador.pintar(0);
        const contar = (tiempo) => {
          const progreso = Math.min(1, (tiempo - inicioAnimacion) / 1800);
          contador.pintar(Math.round(contador.valor * (1 - (1 - progreso) ** 3)));
          contador.frame = progreso < 1 ? requestAnimationFrame(contar) : null;
        };
        contador.frame = requestAnimationFrame(contar);
      });
    }, { threshold: 0.15 });
    contadores.forEach((_, elemento) => observador.observe(elemento));
    motion.addEventListener('change', () => {
      if (!motion.matches) return;
      observador.disconnect();
      contadores.forEach((contador) => {
        if (contador.frame !== null) cancelAnimationFrame(contador.frame);
        contador.pintar(contador.valor);
      });
    });
  }

  todos('[data-cartel-visor]').forEach((visor) => {
    const imagen = visor.querySelector('[data-cartel-imagen]');
    const descripcion = visor.querySelector('[data-cartel-descripcion]');
    const cerrar = visor.querySelector('.cartel-cerrar');
    let origen = null;
    // Delegation also handles archive cards rebuilt by the program filters.
    document.addEventListener('click', (evento) => {
      const enlace = evento.target.closest('[data-cartel]');
      if (!enlace || evento.defaultPrevented || evento.button !== 0 || evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey) return;
      if (typeof visor.showModal !== 'function') return;
      evento.preventDefault();
      origen = enlace;
      imagen.src = enlace.href;
      imagen.alt = enlace.querySelector('img').alt;
      descripcion.textContent = imagen.alt;
      visor.showModal();
      document.body.classList.add('cartel-abierto');
      cerrar.focus();
    });
    cerrar.addEventListener('click', () => visor.close());
    visor.addEventListener('click', (evento) => {
      if (evento.target === visor) {
        const caja = visor.getBoundingClientRect();
        if (evento.clientX < caja.left || evento.clientX > caja.right || evento.clientY < caja.top || evento.clientY > caja.bottom) visor.close();
      }
    });
    // Native dialog contains keyboard focus and closes on Escape (cancel).
    visor.addEventListener('close', () => {
      document.body.classList.remove('cartel-abierto');
      imagen.removeAttribute('src');
      if (origen && origen.isConnected) origen.focus({ preventScroll: true });
    });
  });

  function iniciarArchivo(datos) {
    const archivo = document.querySelector('[data-archivo]');
    const filtros = document.querySelector('[data-archivo-filtros]');
    if (!archivo || !filtros || !Array.isArray(datos.convocatoriasArchivo)) return;
    const lista = datos.convocatoriasArchivo;
    if (lista.some((c) => !c || ['k', 'fecha', 'prog', 'titulo', 'desc', 'estado'].some((k) => typeof c[k] !== 'string') || !Array.isArray(c.tags))) return;
    const crear = (tag, clase, texto) => {
      const nodo = document.createElement(tag);
      nodo.className = clase;
      if (texto !== undefined) nodo.textContent = texto;
      return nodo;
    };
    const botones = filtros.querySelectorAll('[data-archivo-filtro]');
    const mostrar = (filtro) => {
      const seleccion = lista.filter((c) => filtro === 'todas' || c.k === filtro);
      const fragmento = document.createDocumentFragment();
      seleccion.forEach((c, i) => {
        const ficha = crear('article', 'ficha');
        ficha.style.setProperty('--i', String(i));
        if (c.id) ficha.id = c.id;
        if (typeof c.cartel === 'string' && /^assets\/[a-zA-Z0-9_./-]+\.(?:jpe?g|png|webp)$/i.test(c.cartel)) {
          const enlace = crear('a', 'cartel-miniatura');
          enlace.href = c.cartel;
          enlace.setAttribute('data-cartel', '');
          enlace.setAttribute('aria-haspopup', 'dialog');
          enlace.setAttribute('aria-controls', 'imageLightbox');
          enlace.setAttribute('aria-label', `Ampliar cartel: ${c.titulo}`);
          const imagen = crear('img', '');
          imagen.src = c.cartel;
          imagen.alt = c.titulo;
          imagen.loading = 'lazy';
          imagen.decoding = 'async';
          enlace.append(imagen, crear('span', '', 'Ampliar cartel'));
          ficha.append(enlace);
        }
        const fecha = crear('div', 'ficha-f');
        fecha.append(crear('b', '', c.fecha), crear('span', '', c.prog));
        const etiquetas = crear('div', 'etiquetas');
        [c.estado, ...c.tags].forEach((tag) => etiquetas.append(crear('span', 'etq', tag)));
        ficha.append(fecha, crear('h3', 'ficha-t', c.titulo), crear('p', 'ficha-d', c.desc), etiquetas);
        if (Array.isArray(c.enlaces)) c.enlaces.forEach((dato) => {
          if (!dato || typeof dato.texto !== 'string' || typeof dato.url !== 'string' || !/^(https:\/\/|mailto:|tel:)/.test(dato.url)) return;
          const enlace = crear('a', 'enlace', dato.texto);
          enlace.href = dato.url;
          ficha.append(enlace);
        });
        fragmento.append(ficha);
      });
      if (!seleccion.length) fragmento.append(crear('p', 'vacio', 'No hay convocatorias en este programa.'));
      archivo.replaceChildren(fragmento);
      botones.forEach((boton) => boton.setAttribute('aria-pressed', String(boton.dataset.archivoFiltro === filtro)));
      todos('[data-archivo-conteo]').forEach((nodo) => {
        nodo.textContent = `${formato.format(seleccion.length)} convocatorias`;
      });
    };
    botones.forEach((boton) => {
      const filtro = boton.dataset.archivoFiltro;
      const cantidad = filtro === 'todas' ? lista.length : lista.filter((c) => c.k === filtro).length;
      const cuenta = boton.querySelector('.chip-n');
      if (cuenta) cuenta.textContent = formato.format(cantidad);
      boton.addEventListener('click', () => mostrar(filtro));
    });
    todos('[data-archivo-total]').forEach((nodo) => { nodo.textContent = formato.format(lista.length); });
    mostrar('todas');
    // Keep incoming links to archive cards valid after the async replacement.
    const irAlAncla = () => {
      const hash = window.location?.hash;
      const convocatoria = lista.find((c) => c.id && `#${c.id}` === hash);
      if (!convocatoria) return;
      mostrar('todas');
      document.getElementById(convocatoria.id)?.scrollIntoView({ block: 'start' });
    };
    irAlAncla();
    window.addEventListener?.('hashchange', irAlAncla);
  }

  function iniciarPublicaciones(datos) {
    const lista = document.querySelector('[data-publicaciones]');
    if (!lista || !Array.isArray(datos.publicaciones)) return;
    const publicaciones = datos.publicaciones;
    const campos = ['anio', 'tipo', 'titulo', 'ref', 'id', 'ficha', 'pdf'];
    const enlaceSeguro = (url) => {
      try { return ['https:', 'http:'].includes(new URL(url).protocol); }
      catch { return false; }
    };
    if (publicaciones.some((p) => !p || campos.some((c) => typeof p[c] !== 'string') || !enlaceSeguro(p.ficha) || (p.pdf && !enlaceSeguro(p.pdf)))) return;
    const crear = (tag, clase, texto) => {
      const nodo = document.createElement(tag);
      nodo.className = clase;
      if (texto !== undefined) nodo.textContent = texto;
      return nodo;
    };
    const fragmento = document.createDocumentFragment();
    publicaciones.forEach((p, i) => {
      const item = crear('li', 'pub');
      item.style.setProperty('--i', String(i));
      const cuerpo = crear('div', '');
      cuerpo.append(crear('div', 'tipo', p.tipo), crear('h3', 'pub-t', p.titulo), crear('p', 'pub-r', p.ref), crear('span', 'pub-id', p.id));
      const enlaces = crear('div', 'pub-l');
      [['Ficha →', p.ficha], ['PDF →', p.pdf]].forEach(([texto, url]) => {
        if (!url) return;
        const enlace = crear('a', '', texto);
        enlace.href = url;
        enlaces.append(enlace);
      });
      item.append(crear('div', 'pub-a', p.anio), cuerpo, enlaces);
      fragmento.append(item);
    });
    lista.replaceChildren(fragmento);
  }

  fetch(new URL('datos.json', scriptURL))
    .then((respuesta) => {
      if (!respuesta.ok) throw new Error('No se pudieron cargar los datos');
      return respuesta.json();
    })
    .then((datos) => {
      aplicar(datos);
      iniciarArchivo(datos);
      iniciarPublicaciones(datos);
    })
    .catch(() => {
      // Keep the complete static page when data is unavailable or invalid.
    });
})();
