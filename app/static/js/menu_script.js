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
    const enlaceCrearLaboratorio = document.getElementById('enlace-crear-laboratorio');
    const crearNuevoLaboratorio = document.getElementById('crear-laboratorio');
    const derechosDeUsuarios = document.getElementById('derechos-de-usuarios');
    const enlaceDerechosDeUsuarios = document.getElementById('enlace-derechos-de-usuarios');
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


    // ---Elementos de los formularios de ingreso de Medicamentos
    const nombreMedicamento = document.getElementById('nombreMedicamento')
    const codigoMedicamento = document.getElementById('codigoMedicamento')
    const laboratorioMedicamento = document.getElementById('laboratorioMedicamento')
    const monodrogaMedicamento = document.getElementById('monodrogaMedicamento')
    const monodCodMedicamento = document.getElementById('monodCodigoMedicamento')
    const presentacionMonodroga = document.getElementById('presentacionMonodroga')
    const categoriaMedicamento = document.getElementById('categoriaMedicamento')
    const subcategoriaMedicamento = document.getElementById('subcategoriaMedicamento')

    const nuevoMedicamentoInput = document.getElementById('medicamentoForm')
    const nuevaMonodrogaInput = document.getElementById('monodrogaForm')
    const nuevaMonodrodaInputDos = document.getElementById('monodrogaFormCod')
    const nuevaCategoriaInput = document.getElementById('categoriaForm')
    const nuevaSubcategoriaInput = document.getElementById('subcategoriaForm')

    // --- Elementos del formulario "Crear Usuario"
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const emailInput = document.getElementById('email');
    const areaTrabajoInput = document.getElementById('areaTrabajo');
    const usuarioInput = document.getElementById('usuario');
    const contraseniaInput = document.getElementById('contraseña');
    const rolInput = document.getElementById('rol');
    const activoInput = document.getElementById('activo');

    // --- Elementos del formulario "cambiar Contraseña"
    const usuarioBlanqueoInput = document.getElementById('usuarioBlanqueo')
    const nuevaContraseniaInput = document.getElementById('nuevaContraseña')

    // --- Elementos del formulario "derechos de usuarios"
    const usuarioActivoInput = document.getElementById('usuarioActivo')
    const activo_inactivoInput = document.getElementById('activo_inactivo')


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
    const botonCerrarDerechos = document.getElementById('cerrar-derechos');
    const botonIngresarDerechos = document.getElementById('boton-ingresar-derechos');
    const videoBackground = document.getElementById('video-background');
    const botonCerrarLaboratorio = document.getElementById('cerrar-laboratorio');

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

    const modalVistaPreviaEtiqueta = new bootstrap.Modal(document.getElementById('modalVistaPreviaEtiqueta'));
    const qrcodePreviewAreaModal = document.getElementById('qrcode-preview-area-modal');
    const botonImprimirModal = document.getElementById('boton-imprimir-modal'); // Botón de imprimir dentro del modal

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
    function limpiarFormIngreso(input) {
        if (input) {
            input.value = ''
        }
    }

    // --- Aplicar funcion de limpieza de ingreso


    // -- Funcion para limpiar formulario crear usuario
    function limpiarFormCrearUsuario() {
        limpiarFormIngreso(nombreInput);
        limpiarFormIngreso(apellidoInput);
        limpiarFormIngreso(emailInput);
        limpiarFormIngreso(areaTrabajoInput);
        limpiarFormIngreso(contraseniaInput);
        limpiarFormIngreso(usuarioInput);
        limpiarFormIngreso(rolInput);
        limpiarFormIngreso(activoInput);
    }

    // --- Funcion para limpiar el formulario cambiar contraseña
    function limpiarFormCambiarContraseña() {
        limpiarFormIngreso(usuarioBlanqueoInput);
        limpiarFormIngreso(nuevaContraseniaInput);
    }

    // --- Funcion para limpiar el formulario derechos de usuarios
    function limpiarFormDerechosDeUsuarios() {
        limpiarFormIngreso(usuarioActivoInput);
        limpiarFormIngreso(activo_inactivoInput);
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
                        case derechosDeUsuarios.id:
                            limpiarFormDerechosDeUsuarios();
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
                    case derechosDeUsuarios.id:
                        limpiarFormDerechosDeUsuarios();
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
    function cerrarFormulario(boton, creador) {
        if (boton && creador) {
            boton.addEventListener('click', () => {
                creador.style.display = 'none';
            });
        }
    }

    // --- Lógica para Mostrar y cerrar el Generador de Etiquetas ---
    mostrarFormulario(enlaceGeneradorEtiquetas, generadorEtiquetasContainer);
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

    // --- Logica para mostrar y cerrar el formulario "Ingresar Laboratorio"
    mostrarFormulario(enlaceCrearLaboratorio, crearNuevoLaboratorio);
    cerrarFormulario(botonCerrarLaboratorio, crearNuevoLaboratorio);

    // --- Logica para mostrar y cerrar el formulario "Crear nuevo Usuario"
    mostrarFormulario(enlaceCrearUsuario, crearUsuario);
    cerrarFormulario(botonCerrarUsuario, crearUsuario);

    // --- Logica para mostrar y cerrar el formulario "Blanqueo de Contraseña"
    mostrarFormulario(enlaceCambiarContrasenia, crearNuevaContrasenia);
    cerrarFormulario(botonCerrarContrasenia, crearNuevaContrasenia);

    // --- Logica para mostrar y cerrar el formulario "Derechos de Usuarios"
    mostrarFormulario(enlaceDerechosDeUsuarios, derechosDeUsuarios);
    cerrarFormulario(botonCerrarDerechos, derechosDeUsuarios);

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

            // Validaciones (estas ya las tenías, ¡genial!)
            if (!codigoProductoForm) { alert("Selecciona un medicamento para obtener el código del producto."); return; }
            if (!numeroLoteForm) { alert("Ingresa el número de lote."); loteInput.focus(); return; }
            if (!fechaVencimientoValueForm) { alert("Selecciona la fecha de vencimiento."); vencimientoInput.focus(); return; }

            // Generar el string para el QR
            const fechaVencimientoFormateadaParaQR = fechaVencimientoValueForm.replace(/-/g, '');
            const qrCodeString = `<span class="math-inline">\{codigoProductoForm\}\|</span>{numeroLoteForm}|${fechaVencimientoFormateadaParaQR}`;
            console.log("String para el QR:", qrCodeString);

            // --- Llenar los campos de la previsualización DENTRO DEL MODAL ---
            // Asegúrate de que los IDs aquí (previewCentro, previewMedicamentoNombre, etc.)
            // existan en el HTML de tu MODAL.
            if (previewCentro) previewCentro.textContent = centroNombreForm;
            if (previewMedicamentoNombre) previewMedicamentoNombre.textContent = nombreMedicamentoForm;
            if (previewMonodroga) previewMonodroga.textContent = nombreMonodrogaForm;
            if (previewPresentacion) previewPresentacion.textContent = descPresentacionForm;
            if (previewLote) previewLote.textContent = numeroLoteForm;
            if (previewVencimiento) previewVencimiento.textContent = fechaVencimientoValueForm;
            if (previewCodigoProducto) previewCodigoProducto.textContent = codigoProductoForm;
            if (previewUsuario) previewUsuario.textContent = `Prep: ${nombreUsuario}`;


            // --- Generar el QR DENTRO DEL MODAL ---
            // Usa 'qrcodePreviewAreaModal' que es el div dentro del modal
            if (qrcodePreviewAreaModal) {
                qrcodePreviewAreaModal.innerHTML = ''; // Limpiar el div antes de generar
                try {
                    new QRCode(qrcodePreviewAreaModal, { // <-- ¡Aquí usamos el nuevo ID!
                        text: qrCodeString,
                        width: 60,
                        height: 60,
                        colorDark: "#000000", colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.M
                    });
                    console.log("Código QR generado en el modal.");

                    // Ya no necesitas manipular 'botonImprimir' (el del formulario principal)
                    // El botón de imprimir estará en el modal.

                    // --- ¡NUEVO! Muestra el Modal de Bootstrap ---
                    modalVistaPreviaEtiqueta.show(); // <-- ¡Así se muestra el modal!

                } catch (error) {
                    console.error("Error al generar el código QR en el modal:", error);
                    if (qrcodePreviewAreaModal) qrcodePreviewAreaModal.innerHTML = 'Error QR';
                    // Si tienes un botón de imprimir en el modal, podrías deshabilitarlo aquí
                    if (botonImprimirModal) botonImprimirModal.disabled = true;
                }
            } else {
                console.error("Elemento '#qrcode-preview-area-modal' no encontrado al generar QR.");
            }
        });
    }
    // ... (el resto de tu script, incluyendo el listener para botonImprimir, que ahora será el del modal) ...

    // --- Lógica para el Botón Imprimir ---
    if (botonImprimir) {
        botonImprimir.addEventListener('click', () => {
            console.log("Botón Imprimir clickeado");
            // Aquí irá la lógica futura para la impresión (ej. generar archivo para NiceLabel o window.print())
            // Por ahora, solo abre el diálogo de impresión del navegador
            window.print();
        });
    }

    // --- Lógica para el Botón Imprimir DENTRO DEL MODAL ---
    if (botonImprimirModal) { // <-- Ahora nos referimos al botón del modal
        botonImprimirModal.addEventListener('click', () => {
            console.log("Botón Imprimir del modal clickeado");
            // Aquí iría tu lógica de impresión específica para la etiqueta
            // Por ejemplo, puedes abrir una ventana nueva e imprimir solo el contenido de la etiqueta:
            const contenidoEtiqueta = document.getElementById('etiqueta-para-imprimir').innerHTML;
            const ventanaImpresion = window.open('', '', 'height=600,width=800');
            ventanaImpresion.document.write('<html><head><title>Imprimir Etiqueta</title>');
            // **IMPORTANTE**: Asegúrate de incluir tus estilos CSS para la etiqueta aquí para que se imprima bien
            ventanaImpresion.document.write('<link rel="stylesheet" href="{{ url_for(\'static\', filename=\'css/base.css\') }}">');
            ventanaImpresion.document.write('<style>');
            ventanaImpresion.document.write(`
                /* Aquí pega los estilos relevantes de tu .label-content, .label-header, etc.
                para que la etiqueta se vea bien al imprimirse. */
                body { margin: 0; padding: 10mm; font-family: sans-serif; }
                .label-preview-container { margin: 0 auto; }
                .label-content { border: 1px solid #ccc; padding: 5mm; width: 60mm; height: 30mm; display: flex; flex-direction: column; justify-content: space-between; font-size: 8pt; box-sizing: border-box; }
                .label-header { text-align: center; font-weight: bold; font-size: 9pt; margin-bottom: 2mm; }
                .label-body { display: flex; justify-content: space-between; align-items: flex-start; }
                .label-details { flex-grow: 1; margin-right: 5mm; }
                .medicamento-nombre { font-size: 10pt; font-weight: bold; margin-bottom: 1mm; }
                .lote-vencimiento { display: flex; justify-content: space-between; font-size: 7pt; margin-top: 1mm; }
                .label-qr-code { text-align: center; }
                .label-qr-code canvas { display: block; margin: 0 auto; }
                .codigo-producto { font-size: 7pt; margin-top: 1mm; }
                .label-footer { text-align: right; font-size: 6pt; margin-top: 2mm; }
            `);
            ventanaImpresion.document.write('</style>');
            ventanaImpresion.document.write('</head><body>');
            ventanaImpresion.document.write(contenidoEtiqueta);
            ventanaImpresion.document.write('</body></html>');
            ventanaImpresion.document.close();
            ventanaImpresion.print();
            // Puedes cerrar el modal después de imprimir si lo deseas
            // modalVistaPreviaEtiqueta.hide();
        });
    }

    const modalElement = document.getElementById('modalVistaPreviaEtiqueta');
    if (modalElement) {
        modalElement.addEventListener('hidden.bs.modal', event => {
            // Cuando el modal se oculta, vuelve a mostrar el video de fondo
            if (videoBackground) {
                videoBackground.style.display = 'block';
            }
            // Opcional: si quieres que el formulario del generador de etiquetas se muestre de nuevo
            // document.getElementById('generador-etiquetas-container').style.display = 'block';
        });
    }

    //Funcionalidades del sidebar

    document.addEventListener("DOMContentLoaded", () => {
        const hamburguer = document.querySelector('#toggle-btn');
        hamburguer.addEventListener("click", function () {
            document.querySelector("#sidebar").classList.toggle("expand");
        });
    });



    // --- CRUD para Subcategoría ---
    document.getElementById("boton-ingresar-subcategoria").addEventListener("click", async () => {
        const nombreSubcat = document.getElementById("subcategoriaForm").value.trim();
        if (!nombreSubcat) {
            alert("Debes ingresar un nombre para la subcategoría.");
            return;
        }
        try {
            const response = await fetch("/guardar_subcategoria", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subcategoriaForm: nombreSubcat })
            });
            const result = await response.json();
            if (response.ok) {
                alert("Subcategoría guardada correctamente");
                console.log(result);
            } else {
                alert(result.mensaje || "Error al guardar");
            }
        } catch (error) {
            console.error("Error al enviar la solicitud:", error);
            alert("Error inesperado");
        }
    });

    // --- CRUD para Categoría ---
    document.getElementById("boton-ingresar-categoria").addEventListener("click", async () => {
        const nombreCategoria = document.getElementById("categoriaForm").value.trim();
        if (!nombreCategoria) {
            alert("Debes ingresar un nombre para la categoría.");
            return;
        }
        try {
            const response = await fetch("/guardar_categoria", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ categoriaForm: nombreCategoria })
            });
            const result = await response.json();
            if (response.ok) {
                alert("Categoría guardada correctamente.");
                console.log(result);
            } else {
                alert(result.mensaje || "Error al guardar categoría.");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Error inesperado.");
        }
    });

    // --- CRUD para Monodroga ---
    document.getElementById("boton-ingresar-monodroga").addEventListener("click", async () => {
        const nombre = document.getElementById("monodrogaForm").value.trim();
        const codigo = document.getElementById("monodrogaFormCod").value.trim();
        if (!nombre || !codigo) {
            alert("Debes ingresar nombre y código para la monodroga.");
            return;
        }
        try {
            const response = await fetch("/guardar_monodroga", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombreMonodroga: nombre,
                    codigoMonodroga: codigo
                })
            });
            const resultado = await response.json();
            alert(resultado.mensaje);
        } catch (error) {
            console.error("Error al guardar monodroga:", error);
            alert("Error inesperado");
        }
    });

    // --- CRUD para Laboratorio ---
    document.getElementById("boton-ingresar-laboratorio").addEventListener("click", async () => {
        const nombre = document.getElementById("laboratorioForm").value.trim();
        if (!nombre) {
            alert("El campo nombre es obligatorio.");
            return;
        }
        try {
            const response = await fetch("/guardar_laboratorio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombreLaboratorio: nombre })
            });
            const resultado = await response.json();
            alert(resultado.mensaje);
            if (response.ok && resultado.status === "ok") {
                document.getElementById("laboratorioForm").value = "";
            }
        } catch (error) {
            console.error("Error al guardar laboratorio:", error);
            alert("Error inesperado");
        }
    });



    function poblarSelect(url, selectId, valueKey, textKey, callback) {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                const select = document.getElementById(selectId);
                if (!select) return;
                select.innerHTML = '<option value="">Seleccione...</option>';
                data.forEach(item => {
                    select.innerHTML += `<option value="${item[valueKey]}">${item[textKey]}</option>`;
                });
                if (callback) callback(); // Llama al callback después de poblar el select
            })
            .catch(error => console.error(`Error al obtener datos para ${selectId}:`, error));
    }

    function asignarListenerMonodroga() {
        const selectMonodroga = document.getElementById('monodrogaMedicamento');
        const inputCodigo = document.getElementById('monodCodigoMedicamento');
        if (selectMonodroga && inputCodigo) {
            selectMonodroga.addEventListener('change', function () {
                inputCodigo.value = selectMonodroga.value || '';
                console.log("ID seleccionado:", selectMonodroga.value, "Nombre mostrado:", selectMonodroga.options[selectMonodroga.selectedIndex].text);
            });
        }
    }

    // Llama a esta función cada vez que muestres el formulario de medicamento
    function poblarCombosMedicamento() {
        poblarSelect('/api/monodrogas', 'monodrogaMedicamento', 'id_monodroga_original', 'nombre', asignarListenerMonodroga);
        poblarSelect('/api/categorias', 'categoriaMedicamento', 'id_categoria_original', 'nombre');
        poblarSelect('/api/subcategorias', 'subcategoriaMedicamento', 'id_subcategoria_original', 'nombre');
        poblarSelect('/api/laboratorios', 'laboratorioMedicamento', 'id_laboratorio_original', 'nombre');
    }

    // Cuando se abre el formulario de medicamento
    document.getElementById('enlace-crear-medicamento')?.addEventListener('click', poblarCombosMedicamento);

    // Si el formulario puede mostrarse de otra forma, llama a poblarCombosMedicamento() en ese momento.

    document.addEventListener('DOMContentLoaded', function () {
        const selectMonodroga = document.getElementById('monodrogaMedicamento');
        const inputCodigo = document.getElementById('monodCodigoMedicamento');
        if (selectMonodroga && inputCodigo) {
            selectMonodroga.addEventListener('change', function () {
                inputCodigo.value = selectMonodroga.value || '';
            });
        }
    });

    function asignarListenerMonodroga() {
        const selectMonodroga = document.getElementById('monodrogaMedicamento');
        const inputCodigo = document.getElementById('monodCodigoMedicamento');
        if (selectMonodroga && inputCodigo) {
            selectMonodroga.addEventListener('change', function () {
                inputCodigo.value = selectMonodroga.value || '';
                console.log("ID seleccionado:", selectMonodroga.value, "Nombre mostrado:", selectMonodroga.options[selectMonodroga.selectedIndex].text);
            });
        }
    }


    // --- FUNCIÓN UNIFICADA PARA ENVIAR EL FORMULARIO DE MEDICAMENTO ---
    async function enviarMedicamento(e) {
        if (e) e.preventDefault();

        // Obtención de valores de los campos
        const nombre = document.getElementById("nombreMedicamento").value.trim();
        const codigo = document.getElementById("codigoMedicamento").value.trim();

        // Laboratorio
        const selectLaboratorio = document.getElementById("laboratorioMedicamento");
        const laboratorioId = selectLaboratorio.value.trim();
        const laboratorioNombre = selectLaboratorio.options[selectLaboratorio.selectedIndex].text.trim();

        // Monodroga
        const selectMonodroga = document.getElementById("monodrogaMedicamento");
        const monodrogaCodigo = selectMonodroga.value.trim();
        const monodrogaNombre = selectMonodroga.options[selectMonodroga.selectedIndex].text.trim();

        // Categoría
        const selectCategoria = document.getElementById("categoriaMedicamento");
        const categoriaId = selectCategoria.value.trim();
        const categoriaNombre = selectCategoria.options[selectCategoria.selectedIndex].text.trim();

        // Subcategoría
        const selectSubcategoria = document.getElementById("subcategoriaMedicamento");
        const subcategoriaId = selectSubcategoria.value.trim();
        const subcategoriaNombre = selectSubcategoria.options[selectSubcategoria.selectedIndex].text.trim();

        const presentacion = document.getElementById("presentacionMonodroga").value.trim();
        const trazable = document.getElementById("trazableMedicamento").checked;

        // Validación básica
        if (
            !nombre || !codigo || !laboratorioId || !laboratorioNombre ||
            !monodrogaCodigo || !monodrogaNombre || !presentacion ||
            !categoriaId || !categoriaNombre || !subcategoriaId || !subcategoriaNombre
        ) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        // Construcción del payload
        const payload = {
            nombreMedicamento: nombre,
            codigoMedicamento: codigo,
            laboratorioMedicamento: laboratorioNombre,
            monodrogaMedicamento: monodrogaNombre,
            monodCodigoMedicamento: monodrogaCodigo,
            presentacionMonodroga: presentacion,
            categoriaMedicamento: categoriaNombre,
            idCategoria: categoriaId,
            subcategoriaMedicamento: subcategoriaNombre,
            idSubcategoria: subcategoriaId,
            trazable: trazable
        };

        try {
            const response = await fetch("/guardar_medicamento", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const resultado = await response.json();
            alert(resultado.mensaje);
            if (response.ok && resultado.status === "ok") {
                document.getElementById("formMedicamento").reset();
            }
        } catch (error) {
            console.error("Error al guardar medicamento:", error);
            alert("Error inesperado");
        }
    }

    // --- ASIGNAR LA FUNCIÓN UNIFICADA AL BOTÓN Y AL FORMULARIO ---
    if (botonIngresarMedicamento) {
        botonIngresarMedicamento.addEventListener("click", enviarMedicamento);
    }

    const formMedicamento = document.getElementById("formMedicamento");
    if (formMedicamento) {
        formMedicamento.addEventListener("submit", enviarMedicamento);
    }
});