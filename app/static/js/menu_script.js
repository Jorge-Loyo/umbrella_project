/**
 * @file menu_script.js
 * @description Contiene toda la lógica de JavaScript para la página del menú principal,
 * incluyendo interacciones del sidebar, autocompletado de medicamentos, y la generación
 * de la previsualización de etiquetas con su código QR.
 */

// Se asegura de que todo el código se ejecute solo después de que el HTML de la página se haya cargado completamente.
document.addEventListener('DOMContentLoaded', () => {

    //-------------------------------------------------------------------
    // SECCIÓN 1: DECLARACIÓN DE CONSTANTES (Obtención de Elementos del DOM)
    // Se agrupan aquí todas las referencias a los elementos HTML para un acceso fácil y centralizado.
    //-------------------------------------------------------------------

    // --- Elementos Generales de la Interfaz ---
    const welcomeToast = document.getElementById('welcome-toast');
    const menuItemsWithSubmenu = document.querySelectorAll('.has-submenu');
    const enlaceGeneradorEtiquetas = document.getElementById('enlace-generador-etiquetas');
    const generadorEtiquetasContainer = document.getElementById('generador-etiquetas-container');
    const enlaceCrearMedicamento = document.getElementById('enlace-crear-medicamento');
    const crearNuevoMedicamento = document.getElementById('crear-medicamento');
    const enlaceCrearMonodroga = document.getElementById('enlace-crear-monodroga');
    const crearNuevaMonodroga = document.getElementById('crear-monodroga')
    const enlaceCrearCategoria = document.getElementById('enlace-crear-categoria');
    const crearNuevaCategoria = document.getElementById('crear-categoria');
    const enlaceCrearSubcategoria = document.getElementById('enlace-crear-subcategoria');
    const crearNuevaSubcategoria = document.getElementById('crear-subcategoria');
    const enlaceCrearUsuario = document.getElementById('enlace-crear-usuario');
    const crearUsuario = document.getElementById('crear-usuario');
    const enlaceCambiarContrasenia = document.getElementById('enlace-cambiar-contraseña');
    const crearNuevaContrasenia = document.getElementById('crear-nueva-contraseña');

    // --- Elementos del Formulario del Generador de Etiquetas ---
    const centroSelect = document.getElementById('centro');
    const medicamentoInput = document.getElementById('medicamento');
    const sugerenciasContainer = document.getElementById('sugerencias-medicamentos');
    const laboratorioInput = document.getElementById('laboratorio');
    const monodrogaInput = document.getElementById('monodroga');
    const presentacionInput = document.getElementById('presentacion');
    const codigoInput = document.getElementById('codigo');
    const loteInput = document.getElementById('lote');
    const vencimientoInput = document.getElementById('vencimiento');
    const grupo1Input = document.getElementById('grupo1'); // Campo para Categoría
    const grupo2Input = document.getElementById('grupo2'); // Campo para Subcategoría
    const trazabilidadContainer = document.getElementById('trazabilidad-container');
    const numeroSerieInput = document.getElementById('numero-serie');

    // ---Elementos de los formularios de ingreso
    const nuevoMedicamentoInput = document.getElementById('medicamentoForm')
    const nuevaMonodrogaInput = document.getElementById('monogrodaForm')
    const nuevaCategoriaInput = document.getElementById('categoriaForm')
    const nuevaSubcategoriaInput = document.getElementById('subcategoriaForm')

    // --- Elementos del formulario "Crear Usuario"
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const emailInput = document.getElementById('email');
    const areaTrabajoInput = document.getElementById('areaTrabajo');
    const usuarioInput = document.getElementById('usuario');
    const contraseniaInput = document.getElementById('contraseña');

    // --- Elementos del formulario "cambiar Contraseña"
    const usuarioBlanqueoInput = document.getElementById('usuarioBlanqueo')
    const nuevaContraseniaInput = document.getElementById('nuevaContraseña')

    // --- Botones de Acción del Formulario ---
    const botonVerVistaPrevia = document.getElementById('boton-vista-previa');
    const botonImprimir = document.getElementById('boton-imprimir');
    const botonLimpiar = document.getElementById('boton-limpiar-formulario');
    const botonCerrarEtiqueta = document.getElementById('cerrar-generador-etiquetas');
    const botonCerrarMedicamento = document.getElementById('cerrar-medicamento');
    const botonIngresarMedicamento = document.getElementById('boton-ingresar-medicamento');
    const botonCerrarMonodroga = document.getElementById('cerrar-monodroga');
    const botonIngresarMonodroga = document.getElementById('boton-ingresar-monodroga');
    const botonCerrarCategoria = document.getElementById('cerrar-categoria');
    const botonIngresarCategoria = document.getElementById('boton-ingresar-categoria');
    const botonCerrarSubcategoria = document.getElementById('cerrar-subcategoria');
    const botonIngresarSubcategoria = document.getElementById('boton-ingresar-subcategoria');
    const botonCerrarUsuario = document.getElementById('cerrar-usuario');
    const botonIngresarUsuario = document.getElementById('boton-ingresar-usuario');
    const botonCerrarContrasenia = document.getElementById('cerrar-contraseña');
    const botonIngresarContrasenia = document.getElementById('boton-ingresar-contraseña');


    // --- Elementos de la Sección de Previsualización ---
    const vistaPreviaSeccion = document.getElementById('vista-previa-etiqueta-seccion');
    const qrcodePreviewArea = document.getElementById('qrcode-preview-area'); // Div donde se dibuja el QR
    const previewCentro = document.getElementById('preview-centro');
    const previewMedicamentoNombre = document.getElementById('preview-medicamento-nombre');
    const previewMonodroga = document.getElementById('preview-monodroga');
    const previewPresentacion = document.getElementById('preview-presentacion');
    const previewLote = document.getElementById('preview-lote');
    const previewVencimiento = document.getElementById('preview-vencimiento');
    const previewCodigoProducto = document.getElementById('preview-codigo-producto');
    const previewUsuario = document.getElementById('preview-usuario');

    let formularioActivo = null;

    //-------------------------------------------------------------------
    // SECCIÓN 2: DEFINICIÓN DE FUNCIONES AUXILIARES
    //-------------------------------------------------------------------

    /**
     * Limpia todos los campos que se autocompletan y oculta la sección de previsualización.
     * También deshabilita el botón de imprimir.
     */
    function limpiarCamposAutocompletadosYPreview() {
        const camposFormularioReadonly = [laboratorioInput, monodrogaInput, presentacionInput, codigoInput, grupo1Input, grupo2Input, numeroSerieInput];
        camposFormularioReadonly.forEach(campo => { if (campo) campo.value = ''; });

        if (trazabilidadContainer) trazabilidadContainer.style.display = 'none';
        if (vistaPreviaSeccion) vistaPreviaSeccion.style.display = 'none';
        if (qrcodePreviewArea) qrcodePreviewArea.innerHTML = '';
        if (botonImprimir) botonImprimir.disabled = true;

        // Limpia también el texto de los spans de la previsualización
        const previewsTextElements = [previewCentro, previewMedicamentoNombre, previewMonodroga, previewPresentacion, previewLote, previewVencimiento, previewCodigoProducto, previewUsuario];
        previewsTextElements.forEach(span => { if (span) span.textContent = ''; });
    }

    // --- Funcion para limpiar formularios de ingreso
    function limpiarFormIngreso(input){
        if (input){
            input.value = ''
        }
    }

    // --- Aplicar funcion de limpieza de ingreso


    // -- Funcion para limpiar formulario crear usuario
    function limpiarFormCrearUsuario(){
        limpiarFormIngreso(nombreInput);
        limpiarFormIngreso(apellidoInput);
        limpiarFormIngreso(emailInput);
        limpiarFormIngreso(areaTrabajoInput);
        limpiarFormIngreso(contraseniaInput);
        limpiarFormIngreso(usuarioInput);
    }

    // --- Funcion para limpiar el formulario cambiar contraseña
    function limpiarFormCambiarContraseña(){
        limpiarFormIngreso(usuarioBlanqueoInput);
        limpiarFormIngreso(nuevaContraseniaInput)
    }


    // --- Logica para mostrar formulario
    function mostrarFormulario(enlace, creador) {
        if (enlace && creador) {
            enlace.addEventListener('click', (event) => {
                event.preventDefault();

                // Si hay un formulario actualmente activo y no es el que se intenta abrir, ciérralo y límpialo
                if (formularioActivo && formularioActivo !== creador) {
                    formularioActivo.style.display = 'none'; // Oculta el formulario anterior

                    // Llama a la función de limpieza específica del formulario que se acaba de cerrar
                    // Utiliza el ID del formulario para determinar qué función de limpieza ejecutar
                    switch (formularioActivo.id) {
                        case enlaceGeneradorEtiquetas.id:
                            limpiarCamposAutocompletadosYPreview();
                            break;
                        case crearNuevoMedicamento.id:
                            limpiarFormIngreso(nuevoMedicamentoInput);
                            break;
                        case crearNuevaMonodroga.id:
                            limpiarFormIngreso(nuevaMonodrogaInput);
                            break;
                        case crearNuevaCategoria.id:
                            limpiarFormIngreso(nuevaCategoriaInput);
                            break;
                        case crearNuevaSubcategoria.id:
                            limpiarFormIngreso(nuevaSubcategoriaInput);
                            break;
                        case crearUsuario.id:
                            limpiarFormCrearUsuario();
                            break;
                        case crearNuevaContrasenia.id:
                            limpiarFormCambiarContraseña();
                            break;
                        default:
                            console.warn(`No hay función de limpieza definida para el formulario con ID: ${formularioActivo.id}`);
                            break;
                    }
                }

                // Muestra el formulario que se acaba de hacer clic
                creador.style.display = 'block';

                // Actualiza el formulario activo para el seguimiento
                formularioActivo = creador;
                console.log(`Formulario abierto: ${creador.id}`);
            });
        }
    }

    function cerrarFormulario(boton, creador) {
        if (boton && creador) {
            boton.addEventListener('click', () => {
                creador.style.display = 'none'; // Oculta el formulario

                // Si el formulario que se está cerrando era el activo, resetea la variable
                if (formularioActivo === creador) {
                    formularioActivo = null;
                }

                // Llama a la función de limpieza específica del formulario que se está cerrando
                switch (formularioActivo.id) {
                        case enlaceGeneradorEtiquetas.id:
                            limpiarCamposAutocompletadosYPreview();
                            break;
                        case crearNuevoMedicamento.id:
                            limpiarFormIngreso(nuevoMedicamentoInput);
                            break;
                        case crearNuevaMonodroga.id:
                            limpiarFormIngreso(nuevaMonodrogaInput);
                            break;
                        case crearNuevaCategoria.id:
                            limpiarFormIngreso(nuevaCategoriaInput);
                            break;
                        case crearNuevaSubcategoria.id:
                            limpiarFormIngreso(nuevaSubcategoriaInput);
                            break;
                        case crearUsuario.id:
                            limpiarFormCrearUsuario();
                            break;
                        case crearNuevaContrasenia.id:
                            limpiarFormCambiarContraseña();
                            break;
                        default:
                            console.warn(`No hay función de limpieza definida para el formulario con ID: ${formularioActivo.id}`);
                            break;
                }
                console.log(`Formulario cerrado: ${creador.id}`);
            });
        }
    }

    //-------------------------------------------------------------------
    // SECCIÓN 3: ASIGNACIÓN DE EVENT LISTENERS Y LÓGICA DE INICIALIZACIÓN
    //-------------------------------------------------------------------

    // --- Lógica para el Mensaje de Bienvenida ---
    if (welcomeToast) {
        setTimeout(() => {
            welcomeToast.classList.add('hidden');
            // Ocultar completamente con display:none después de que termine la animación de opacidad
            setTimeout(() => {
                if (getComputedStyle(welcomeToast).opacity === '0') {
                    welcomeToast.style.display = 'none';
                }
            }, 550); // La duración de la transición CSS es 0.5s, se añade un pequeño buffer.
        }, 3000); // El mensaje es visible por 3 segundos.
    }

    // --- Lógica para el Menú Lateral Desplegable ---
    menuItemsWithSubmenu.forEach(item => {
        const submenu = item.querySelector('.submenu');
        if (submenu) {
            item.addEventListener('mouseenter', () => { submenu.style.display = 'block'; });
            item.addEventListener('mouseleave', () => { submenu.style.display = 'none'; });
        }
    });

    // Funcion para mostrar Formularios
    

    // Funcion para cerrar Formularios
    function cerrarFormulario(boton, creador){
        if (boton && creador) {
            boton.addEventListener('click', () => {
            creador.style.display = 'none';
    });
    }
    }

    // --- Lógica para Mostrar y cerrar el Generador de Etiquetas ---
    mostrarFormulario(enlaceGeneradorEtiquetas,generadorEtiquetasContainer);
    cerrarFormulario(botonCerrarEtiqueta, generadorEtiquetasContainer);


    // --- Lógica para mostrar y cerrar el formulario "Ingresar Medicamento"
    mostrarFormulario(enlaceCrearMedicamento, crearNuevoMedicamento);
    cerrarFormulario(botonCerrarMedicamento, crearNuevoMedicamento);

    // --- Lógica para mostrar y cerrar el formulario "Ingresar Monodroga"
    mostrarFormulario(enlaceCrearMonodroga, crearNuevaMonodroga);
    cerrarFormulario(botonCerrarMonodroga, crearNuevaMonodroga);

    // --- Logica para mostrar y cerrar el formulario "Ingresar Categoria"
    mostrarFormulario(enlaceCrearCategoria, crearNuevaCategoria);
    cerrarFormulario(botonCerrarCategoria, crearNuevaCategoria);

    // --- Logica para mostrar y cerrar el formulario "Ingresar Subcategoria"
    mostrarFormulario(enlaceCrearSubcategoria, crearNuevaSubcategoria);
    cerrarFormulario(botonCerrarSubcategoria, crearNuevaSubcategoria);

    // --- Logica para mostrar y cerrar el formulario "Crear nuevo Usuario"
    mostrarFormulario(enlaceCrearUsuario, crearUsuario);
    cerrarFormulario(botonCerrarUsuario, crearUsuario);

    // --- Logica para mostrar y cerrar el formulario "Blanqueo de Contraseña"
    mostrarFormulario(enlaceCambiarContrasenia, crearNuevaContrasenia);
    cerrarFormulario(botonCerrarContrasenia, crearNuevaContrasenia);

    // --- Lógica para el Botón Limpiar Formulario ---
    if (botonLimpiar) {
        botonLimpiar.addEventListener('click', () => {
            console.log("Botón Limpiar clickeado");
            // El type="reset" del botón HTML ya limpia los campos editables como lote y vencimiento.
            // La función auxiliar se encarga del resto (campos readonly, previsualización, etc.).
            limpiarCamposAutocompletadosYPreview();
            if (medicamentoInput) medicamentoInput.value = ''; // Se asegura de limpiar el campo de búsqueda
            if (sugerenciasContainer) {
                sugerenciasContainer.innerHTML = '';
                sugerenciasContainer.style.display = 'none';
            }
        });
    }

    // --- Lógica para Validación de Fecha de Vencimiento ---
    if (vencimientoInput) {
        // Establece la fecha mínima permitida (un mes a partir de hoy)
        const fechaActual = new Date();
        let unMesDespues = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, fechaActual.getDate());
        const offset = unMesDespues.getTimezoneOffset();
        const fechaMinimaLocal = new Date(unMesDespues.getTime() - (offset * 60 * 1000));
        const fechaMinimaParaInput = fechaMinimaLocal.toISOString().split('T')[0];
        vencimientoInput.setAttribute('min', fechaMinimaParaInput);

        // Añade un listener para validar la fecha cada vez que el usuario la cambia
        vencimientoInput.addEventListener('change', function () {
            const fechaSeleccionada = new Date(this.value);
            const hoyAlValidar = new Date();
            let mesSiguienteValidar = new Date(hoyAlValidar.getFullYear(), hoyAlValidar.getMonth() + 1, hoyAlValidar.getDate());

            // Normalizar ambas fechas a medianoche UTC para una comparación justa de solo la fecha
            const fechaSeleccionadaUTC = new Date(Date.UTC(fechaSeleccionada.getUTCFullYear(), fechaSeleccionada.getUTCMonth(), fechaSeleccionada.getUTCDate()));
            const mesSiguienteUTC = new Date(Date.UTC(mesSiguienteValidar.getUTCFullYear(), mesSiguienteValidar.getUTCMonth(), mesSiguienteValidar.getUTCDate()));

            if (fechaSeleccionadaUTC < mesSiguienteUTC) {
                alert("La fecha de vencimiento debe ser al menos un mes posterior a la fecha actual.");
                this.value = ''; // Limpia el valor incorrecto
            }
        });
    }

    // --- Lógica Principal: Autocompletado de Medicamentos ---
    if (medicamentoInput && sugerenciasContainer) {
        // Se activa cada vez que el usuario escribe en el campo "Medicamento"
        medicamentoInput.addEventListener('input', async () => {
            const textoBusqueda = medicamentoInput.value.trim();

            // Si el texto es muy corto, limpia todo y detiene la ejecución
            if (textoBusqueda.length < 2) {
                sugerenciasContainer.innerHTML = '';
                sugerenciasContainer.style.display = 'none';
                limpiarCamposAutocompletadosYPreview();
                return;
            }

            sugerenciasContainer.innerHTML = '<div class="sugerencia-item">Buscando...</div>';
            sugerenciasContainer.style.display = 'block';

            try {
                // Llama al backend para obtener las sugerencias
                const response = await fetch(`/buscar_medicamentos?q=${encodeURIComponent(textoBusqueda)}`);
                if (!response.ok) {
                    sugerenciasContainer.innerHTML = '<div class="sugerencia-item">Error al buscar.</div>';
                    console.error('Autocompletado - Error en respuesta del servidor:', response.status);
                    return;
                }
                const medicamentos = await response.json();
                sugerenciasContainer.innerHTML = ''; // Limpia el "Buscando..."

                // Si se encontraron medicamentos, crea y muestra las sugerencias
                if (medicamentos.length > 0) {
                    medicamentos.forEach(med => {
                        const sugerenciaDiv = document.createElement('div');
                        sugerenciaDiv.textContent = med.nombre;
                        sugerenciaDiv.classList.add('sugerencia-item');

                        // Añade un listener a cada sugerencia para autocompletar el formulario al hacer clic
                        sugerenciaDiv.addEventListener('click', () => {
                            console.log("--- Autocompletado: Sugerencia Clickeada ---");
                            console.log("Datos del medicamento seleccionado (med):", JSON.stringify(med, null, 2));

                            if (medicamentoInput) medicamentoInput.value = med.nombre;
                            if (codigoInput) codigoInput.value = med.codigo_medicamento || '';
                            if (presentacionInput) presentacionInput.value = med.presentacion_descripcion || '';
                            if (laboratorioInput) laboratorioInput.value = med.laboratorio_nombre || '';
                            if (monodrogaInput) monodrogaInput.value = med.monodroga_nombre || '';
                            if (grupo1Input) grupo1Input.value = med.categoria_principal_nombre || '';
                            if (grupo2Input) grupo2Input.value = med.subcategoria_nombre || '';

                            if (trazabilidadContainer) {
                                const esTrazable = med.trazable === true || med.trazable === 'true' || med.trazable === 1 || med.trazable === '1';
                                trazabilidadContainer.style.display = esTrazable ? 'block' : 'none';
                                if (!esTrazable && numeroSerieInput) numeroSerieInput.value = '';
                            }

                            // Oculta las sugerencias y la previsualización al seleccionar un nuevo medicamento
                            sugerenciasContainer.style.display = 'none';
                            if (vistaPreviaSeccion) vistaPreviaSeccion.style.display = 'none';
                            if (qrcodePreviewArea) qrcodePreviewArea.innerHTML = '';
                            if (botonImprimir) botonImprimir.disabled = true;
                        });
                        sugerenciasContainer.appendChild(sugerenciaDiv);
                    });
                } else {
                    sugerenciasContainer.innerHTML = '<div class="sugerencia-item">No se encontraron medicamentos.</div>';
                }
            } catch (error) {
                sugerenciasContainer.innerHTML = '<div class="sugerencia-item">Error en la búsqueda.</div>';
                console.error('Autocompletado - Error en fetch:', error);
            }
        });

        // Oculta el contenedor de sugerencias si el usuario hace clic en cualquier otra parte de la página
        document.addEventListener('click', (event) => {
            if (sugerenciasContainer && event.target !== medicamentoInput && !sugerenciasContainer.contains(event.target)) {
                sugerenciasContainer.style.display = 'none';
            }
        });
    }

    // --- Lógica para el Botón 'Ver vista previa' y Generación de QR ---
    if (botonVerVistaPrevia) {
        botonVerVistaPrevia.addEventListener('click', () => {
            console.log("Botón 'Ver vista previa' clickeado.");

            // Recopilar datos del formulario para la etiqueta
            const nombreMedicamentoForm = medicamentoInput ? medicamentoInput.value.trim() : "N/A";
            const codigoProductoForm = codigoInput ? codigoInput.value.trim() : "";
            const nombreMonodrogaForm = monodrogaInput ? monodrogaInput.value.trim() : "N/A";
            const descPresentacionForm = presentacionInput ? presentacionInput.value.trim() : "N/A";
            const numeroLoteForm = loteInput ? loteInput.value.trim() : "";
            const fechaVencimientoValueForm = vencimientoInput ? vencimientoInput.value : "";
            const centroNombreForm = (centroSelect && centroSelect.selectedIndex >= 0 && centroSelect.options[centroSelect.selectedIndex].value !== "") ? centroSelect.options[centroSelect.selectedIndex].text : "N/A";
            const nombreUsuario = document.body.dataset.username || 'N/A'; // Lee desde data-attribute

            // Validaciones
            if (!codigoProductoForm) { alert("Selecciona un medicamento para obtener el código del producto."); return; }
            if (!numeroLoteForm) { alert("Ingresa el número de lote."); loteInput.focus(); return; }
            if (!fechaVencimientoValueForm) { alert("Selecciona la fecha de vencimiento."); vencimientoInput.focus(); return; }

            // (La validación de fecha de un mes ya se hace en el 'change' del input, pero podemos repetirla aquí por seguridad)
            // ...

            // Generar el string para el QR
            const fechaVencimientoFormateadaParaQR = fechaVencimientoValueForm.replace(/-/g, '');
            const qrCodeString = `${codigoProductoForm}|${numeroLoteForm}|${fechaVencimientoFormateadaParaQR}`;
            console.log("String para el QR:", qrCodeString);

            // Generar el QR y mostrar la previsualización
            if (qrcodePreviewArea) {
                qrcodePreviewArea.innerHTML = '';
                try {
                    new QRCode(qrcodePreviewArea, {
                        text: qrCodeString,
                        width: 55, height: 55,
                        colorDark: "#000000", colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.M
                    });
                    console.log("Código QR generado.");

                    // Llenar los campos de la previsualización
                    if (previewCentro) previewCentro.textContent = centroNombreForm;
                    if (previewMedicamentoNombre) previewMedicamentoNombre.textContent = nombreMedicamentoForm;
                    if (previewMonodroga) previewMonodroga.textContent = nombreMonodrogaForm;
                    if (previewPresentacion) previewPresentacion.textContent = descPresentacionForm;
                    if (previewLote) previewLote.textContent = numeroLoteForm;
                    if (previewVencimiento) previewVencimiento.textContent = fechaVencimientoValueForm;
                    if (previewCodigoProducto) previewCodigoProducto.textContent = codigoProductoForm;
                    if (previewUsuario) previewUsuario.textContent = `Prep: ${nombreUsuario}`;

                    // Habilitar el botón de imprimir y mostrar la previsualización
                    if (botonImprimir) botonImprimir.disabled = false;
                    if (vistaPreviaSeccion) vistaPreviaSeccion.style.display = 'flex';

                } catch (error) {
                    console.error("Error al generar el código QR:", error);
                    if (qrcodePreviewArea) qrcodePreviewArea.innerHTML = 'Error QR';
                    if (botonImprimir) botonImprimir.disabled = true;
                }
            } else {
                console.error("Elemento '#qrcode-preview-area' no encontrado al generar QR.");
            }
        });
    }

    // --- Lógica para el Botón Imprimir ---
    if (botonImprimir) {
        botonImprimir.addEventListener('click', () => {
            console.log("Botón Imprimir clickeado");
            // Aquí irá la lógica futura para la impresión (ej. generar archivo para NiceLabel o window.print())
            // Por ahora, solo abre el diálogo de impresión del navegador
            window.print();
        });
    }

    //Funcionalidades del sidebar

    document.addEventListener("DOMContentLoaded", () => {
        const hamburguer = document.querySelector('#toggle-btn');
        hamburguer.addEventListener("click", function(){
            document.querySelector("#sidebar").classList.toggle("expand");
        });
    });

});