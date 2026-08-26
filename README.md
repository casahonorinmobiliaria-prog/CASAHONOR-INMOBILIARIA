# CasaHonor Inmobiliaria

Sitio web de CasaHonor Inmobiliaria — compra, venta y arriendo de vivienda en Neiva y el Huila.

Sitio estático (HTML/CSS/JS), sin dependencias ni build. Listo para desplegar en Render.

## Estructura

- `index.html` — home page
- `css/styles.css` — estilos
- `js/main.js` — interacciones (menú móvil, buscador, formulario, animaciones)
- `img/` — logo y fotos de propiedades
- `render.yaml` — configuración de despliegue en Render

## Ver en local

Al ser estático, basta abrir `index.html` en el navegador. Para que el JS y las rutas
funcionen igual que en producción, sírvelo con cualquier servidor estático, por ejemplo:

```bash
npx serve .
```

## Desplegar en Render

1. En Render: **New → Static Site**.
2. Conecta el repositorio `casahonorinmobiliaria-prog/CASAHONOR-INMOBILIARIA`.
3. Render detecta `render.yaml` automáticamente (Publish directory: raíz, sin build).
4. Deploy. Cada push a `main` vuelve a desplegar.

## Pendiente antes de producción

- Verificar que cada foto corresponda a la propiedad correcta.
- Añadir el resto de propiedades / enlazar a las fichas reales.
- Confirmar datos legales (matrícula inmobiliaria / registro) para la sección de confianza.
