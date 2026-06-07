# Mantenimiento del sitio CRECE

Este sitio funciona como sitio estatico para cPanel. No usa React, Vite, Next, bundlers ni procesos de compilacion.

## Archivos principales

- `index.html`: pagina de inicio.
- `nosotros.html`: informacion institucional del CRECE.
- `equipo.html`: equipo de trabajo y datos pendientes de confirmar.
- `convenios.html`: convenios y colaboracion institucional.
- `oferta-educativa.html`: cursos, diplomados y oferta formativa.
- `convocatorias.html`: convocatorias vigentes e historial.
- `conocer.html`: Proyecto CONOCER.
- `investigacion.html`: investigacion educativa.
- `red-rain.html`: Red RAIN.
- `proyectos-tecnologicos.html`: proyectos tecnologicos.
- `publicaciones.html`: publicaciones del CRECE.
- `vectores.html`: Revista Vectores.
- `galeria.html`: galeria institucional.
- `testimonios.html`: testimonios.
- `descargas.html`: materiales y documentos descargables.
- `noticias.html`: noticias y avisos.
- `contacto.html`: datos de contacto.
- `styles.css`: estilos comunes del sitio.

## Cambiar datos de contacto

Edita principalmente `contacto.html` y revisa tambien el pie de pagina comun en los HTML si cambia el correo institucional.

Dato confirmado actualmente:

- `crece@ece.edu.mx`

Dato pendiente:

- Telefono institucional.

## Cambiar fechas de convocatorias

Edita `convocatorias.html`. Busca la tarjeta o bloque de la convocatoria correspondiente y actualiza fechas, modalidad, requisitos y estado. No publiques fechas no confirmadas.

## Cambiar enlaces de inscripcion

Si hay un enlace real de inscripcion, agregalo en `convocatorias.html` dentro de la convocatoria correspondiente. Evita formularios locales si no envian datos realmente.

## Revisar enlaces rotos

Antes de subir cambios, revisa que cada enlace interno apunte a un archivo existente. Los enlaces internos deben terminar en `.html` y estar en esta misma carpeta, salvo que sean correos `mailto:` o sitios externos.

## Subir a cPanel

1. Haz respaldo de los archivos actuales del servidor.
2. Sube todos los `.html` modificados.
3. Sube tambien `styles.css`.
4. Verifica en navegador `index.html`, `contacto.html`, `convocatorias.html` y una pagina nueva como `equipo.html`.

## No tocar sin respaldo

- No cambies nombres de archivos `.html` sin actualizar todos los enlaces.
- No elimines `styles.css`.
- No elimines el encabezado, menu, pie de pagina ni los scripts simples de navegacion.
- No agregues formularios si no hay un destino real de envio.
- No agregues telefonos, correos, fechas, instituciones o descargas sin confirmacion.

## Respaldo recomendado

Antes de reemplazar archivos en cPanel, guarda una copia de la version anterior. En esta carpeta local ya existe una carpeta `respaldos` para conservar versiones anteriores.
