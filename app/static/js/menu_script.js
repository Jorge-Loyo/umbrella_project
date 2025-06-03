document.addEventListener('DOMContentLoaded', () => {
    //-------------------------------------------------------------------
    // SECCIÓN 1: OBTENCIÓN DE ELEMENTOS DEL DOM
    //-------------------------------------------------------------------

    // --- Elementos para el Mensaje de Bienvenida ---
    const welcomeToast = document.getElementById('welcome-toast');

    // --- Elementos para el Menú Lateral ---
    const menuItemsWithSubmenu = document.querySelectorAll('.has-submenu');
    const enlaceGeneradorEtiquetas = document.getElementById('enlace-generador-etiquetas');
    const generadorEtiquetasContainer = document.getElementById('generador-etiquetas-container');

    // --- Elementos del Formulario Principal del Generador de Etiquetas ---
    const medicamentoInput = document.getElementById('medicamento');
    const sugerenciasContainer = document.getElementById('sugerencias-medicamentos');
    const laboratorioInput = document.getElementById('laboratorio');
    const monodrogaInput = document.getElementById('monodroga');
    const presentacionInput = document.getElementById('presentacion');
    const codigoInput = document.getElementById('codigo');
    const loteInput = document.getElementById('lote');
    const grupo1Input = document.getElementById('grupo1'); // Categoría
    const grupo2Input = document.getElementById('grupo2'); // Subcategoría
    const trazabilidadContainer = document.getElementById('trazabilidad-container');
    const numeroSerieInput = document.getElementById('numero-serie');
    const vencimientoInput = document.getElementById('vencimiento');
    const centroSelect = document.getElementById('centro'); // Select de Centro
    const botonLimpiar = document.getElementById('boton-limpiar-formulario');

    // --- Elementos para la Sección de Previsualización y Código QR ---
    const botonVerVistaPrevia = document.getElementById('boton-vista-previa');
    const qrcodePreviewArea = document.getElementById('qrcode-preview-area'); // Div donde se dibuja el QR
    const vistaPreviaSeccion = document.getElementById('vista-previa-etiqueta-seccion');

    // Spans dentro de la previsualización para mostrar datos
    const previewCentro = document.getElementById('preview-centro');
    const previewMedicamentoNombre = document.getElementById('preview-medicamento-nombre');
    const previewMonodroga = document.getElementById('preview-monodroga');
    const previewPresentacion = document.getElementById('preview-presentacion');
    const previewLote = document.getElementById('preview-lote');
    const previewVencimiento = document.getElementById('preview-vencimiento');
    const previewCodigoProducto = document.getElementById('preview-codigo-producto');
    const previewUsuario = document.getElementById('preview-usuario');

    //-------------------------------------------------------------------
    // SECCIÓN 2: LÓGICA DE INICIALIZACIÓN Y EVENT LISTENERS
    //-------------------------------------------------------------------

    // --- Lógica para el Mensaje de Bienvenida ---
    if (welcomeToast) {
        setTimeout(() => {
            welcomeToast.classList.add('hidden');
            // Ocultar completamente después de la transición de opacidad
            setTimeout(() => {
                if (getComputedStyle(welcomeToast).opacity === '0') {
                    welcomeToast.style.display = 'none';
                    console.log("Welcome toast ocultado con display:none");
                }
            }, 550); // Duración de la transición CSS + pequeño buffer
        }, 3000); // Visible por 3 segundos
    }

    // --- Lógica para el Menú Lateral Desplegable ---
    menuItemsWithSubmenu.forEach(item => {
        const submenu = item.querySelector('.submenu');
        if (submenu) {
            item.addEventListener('mouseenter', () => { submenu.style.display = 'block'; });
            item.addEventListener('mouseleave', () => { submenu.style.display = 'none'; });
        }
    });

    // --- Lógica para Mostrar el Contenedor del Generador de Etiquetas ---
    if (enlaceGeneradorEtiquetas && generadorEtiquetasContainer) {
        enlaceGeneradorEtiquetas.addEventListener('click', (event) => {
            event.preventDefault();
            generadorEtiquetasContainer.style.display = 'block';
        });
    }

    // --- Lógica para el Botón Limpiar Formulario ---
    function limpiarCamposAutocompletadosYPreview() {
        const camposFormularioReadonly = [laboratorioInput, monodrogaInput, presentacionInput, codigoInput, grupo1Input, grupo2Input, numeroSerieInput];
        camposFormularioReadonly.forEach(campo => { if (campo) campo.value = ''; });

        if (trazabilidadContainer) trazabilidadContainer.style.display = 'none';
        if (vistaPreviaSeccion) vistaPreviaSeccion.style.display = 'none';
        if (qrcodePreviewArea) qrcodePreviewArea.innerHTML = '';

        const previewsTextElements = [previewCentro, previewMedicamentoNombre, previewMonodroga, previewPresentacion, previewLote, previewVencimiento, previewCodigoProducto, previewUsuario];
        previewsTextElements.forEach(span => { if (span) span.textContent = ''; });
    }

    if (botonLimpiar) {
        botonLimpiar.addEventListener('click', () => {
            console.log("Botón Limpiar clickeado");
            // El type="reset" del botón HTML ya limpia los campos editables del formulario (lote, vencimiento, medicamento)
            // Aquí nos enfocamos en los campos readonly y la previsualización.
            limpiarCamposAutocompletadosYPreview();
            if (medicamentoInput) medicamentoInput.value = ''; // Adicional por si el reset no lo toma
            if (sugerenciasContainer) {
                sugerenciasContainer.innerHTML = '';
                sugerenciasContainer.style.display = 'none';
            }
        });
    }

    // --- Lógica para Validación de Fecha de Vencimiento ---
    if (vencimientoInput) {
        const fechaActual = new Date();
        let unMesDespues = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, fechaActual.getDate());
        const offset = unMesDespues.getTimezoneOffset();
        const fechaMinimaLocal = new Date(unMesDespues.getTime() - (offset * 60 * 1000));
        const fechaMinimaParaInput = fechaMinimaLocal.toISOString().split('T')[0];
        vencimientoInput.setAttribute('min', fechaMinimaParaInput);

        vencimientoInput.addEventListener('change', function () {
            const fechaSeleccionada = new Date(this.value);
            const hoyAlValidar = new Date();
            let mesSiguienteValidar = new Date(hoyAlValidar.getFullYear(), hoyAlValidar.getMonth() + 1, hoyAlValidar.getDate());

            const fechaSeleccionadaNormalizada = new Date(Date.UTC(fechaSeleccionada.getUTCFullYear(), fechaSeleccionada.getUTCMonth(), fechaSeleccionada.getUTCDate()));
            const mesSiguienteNormalizada = new Date(Date.UTC(mesSiguienteValidar.getUTCFullYear(), mesSiguienteValidar.getUTCMonth(), mesSiguienteValidar.getUTCDate()));

            if (fechaSeleccionadaNormalizada < mesSiguienteNormalizada) {
                alert("La fecha de vencimiento debe ser al menos un mes posterior a la fecha actual.");
                this.value = '';
            }
        });
    }

    // --- Lógica para el Autocompletado de Medicamentos ---
    if (medicamentoInput && sugerenciasContainer) {
        medicamentoInput.addEventListener('input', async () => {
            const textoBusqueda = medicamentoInput.value.trim();

            if (textoBusqueda.length < 2) { // O 3, según preferencia
                sugerenciasContainer.innerHTML = '';
                sugerenciasContainer.style.display = 'none';
                limpiarCamposAutocompletadosYPreview(); // Limpia campos si la búsqueda es muy corta o se borra
                return;
            }
            sugerenciasContainer.innerHTML = '<div class="sugerencia-item">Buscando...</div>';
            sugerenciasContainer.style.display = 'block';

            try {
                const response = await fetch(`/buscar_medicamentos?q=${encodeURIComponent(textoBusqueda)}`);
                if (!response.ok) {
                    sugerenciasContainer.innerHTML = '<div class="sugerencia-item">Error al buscar.</div>';
                    console.error('Autocompletado - Error en respuesta del servidor:', response.status);
                    return;
                }
                const medicamentos = await response.json();
                sugerenciasContainer.innerHTML = '';

                if (medicamentos.length > 0) {
                    medicamentos.forEach(med => {
                        const sugerenciaDiv = document.createElement('div');
                        sugerenciaDiv.textContent = med.nombre;
                        sugerenciaDiv.classList.add('sugerencia-item');

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

                            sugerenciasContainer.style.display = 'none';
                            if (vistaPreviaSeccion) vistaPreviaSeccion.style.display = 'none'; // Ocultar previsualización al seleccionar nuevo med
                            if (qrcodePreviewArea) qrcodePreviewArea.innerHTML = '';      // Limpiar QR anterior
                        });
                        sugerenciasContainer.appendChild(sugerenciaDiv);
                    });
                } else {
                    sugerenciasContainer.innerHTML = '<div class="sugerencia-item">No se encontraron medicamentos.</div>';
                }
            } catch (error) {
                sugerenciasContainer.innerHTML = '<div class="sugerencia-item">Error en la búsqueda.</div>';
                console.error('Autocompletado - Error en fetch para buscar_medicamentos:', error);
            }
        });

        // Ocultar sugerencias si se hace clic fuera del input de medicamento o del contenedor de sugerencias
        document.addEventListener('click', (event) => {
            if (sugerenciasContainer && event.target !== medicamentoInput && !sugerenciasContainer.contains(event.target)) {
                sugerenciasContainer.style.display = 'none';
            }
        });
    }

    // --- Lógica para el Botón 'Ver vista previa' y Generación de QR ---
    if (botonVerVistaPrevia && vistaPreviaSeccion && qrcodePreviewArea && codigoInput && loteInput && vencimientoInput && medicamentoInput && monodrogaInput && presentacionInput && centroSelect && previewUsuario) {
        botonVerVistaPrevia.addEventListener('click', () => {
            console.log("Botón 'Ver vista previa' clickeado.");

            // Recopilar datos del formulario para la etiqueta y el QR
            const nombreMedicamentoForm = medicamentoInput.value.trim();
            const codigoProductoForm = codigoInput.value.trim();
            const nombreMonodrogaForm = monodrogaInput.value.trim();
            const descPresentacionForm = presentacionInput.value.trim();
            const numeroLoteForm = loteInput.value.trim();
            const fechaVencimientoValueForm = vencimientoInput.value;
            const centroNombreForm = (centroSelect.selectedIndex > 0) ? centroSelect.options[centroSelect.selectedIndex].text : "N/A";

            // Obtener nombre de usuario (requiere que 'currentUserName' esté definida globalmente desde el HTML)
            // o que se extraiga de un elemento si lo pasaste de otra forma.
            // const nombreUsuario = typeof currentUserName !== 'undefined' ? currentUserName : 'Usuario Desconocido';
            let nombreUsuario = 'N/A'; // Fallback
            if (typeof currentUserName !== 'undefined' && currentUserName !== 'N/A') { // Si definiste currentUserName globalmente
                nombreUsuario = currentUserName;
            } else if (document.body.dataset.username && document.body.dataset.username !== 'N/A') { // Si usaste data-attribute en body
                nombreUsuario = document.body.dataset.username;
            }


            // Validaciones
            if (!codigoProductoForm) { alert("El campo 'Código' del medicamento es necesario para el QR."); return; }
            if (!numeroLoteForm) { alert("Ingresa el número de lote."); loteInput.focus(); return; }
            if (!fechaVencimientoValueForm) { alert("Selecciona la fecha de vencimiento."); vencimientoInput.focus(); return; }

            // Re-validar fecha de vencimiento (por si acaso)
            const fechaSeleccionada = new Date(fechaVencimientoValueForm);
            const hoyAlValidar = new Date();
            let mesSiguienteValidar = new Date(hoyAlValidar.getFullYear(), hoyAlValidar.getMonth() + 1, hoyAlValidar.getDate());
            const fechaSeleccionadaNormalizada = new Date(Date.UTC(fechaSeleccionada.getUTCFullYear(), fechaSeleccionada.getUTCMonth(), fechaSeleccionada.getUTCDate()));
            const mesSiguienteNormalizada = new Date(Date.UTC(mesSiguienteValidar.getUTCFullYear(), mesSiguienteValidar.getUTCMonth(), mesSiguienteValidar.getUTCDate()));
            if (fechaSeleccionadaNormalizada < mesSiguienteNormalizada) {
                alert("La fecha de vencimiento (para QR) debe ser al menos un mes posterior a la fecha actual.");
                if (vencimientoInput) vencimientoInput.value = '';
                return;
            }

            const fechaVencimientoFormateadaParaQR = fechaVencimientoValueForm.replace(/-/g, ''); // Formato YYYYMMDD
            const qrCodeString = `${codigoProductoForm}|${numeroLoteForm}|${fechaVencimientoFormateadaParaQR}`;
            console.log("String para el QR:", qrCodeString);

            qrcodePreviewArea.innerHTML = ''; // Limpiar QR anterior
            try {
                new QRCode(qrcodePreviewArea, {
                    text: qrCodeString,
                    width: 55, // El CSS de #qrcode-preview-area lo controla visualmente con !important
                    height: 55,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.M
                });
                console.log("Código QR generado en #qrcode-preview-area.");
            } catch (error) {
                console.error("Error al generar el código QR:", error);
                qrcodePreviewArea.innerHTML = 'Error QR';
            }

            // Llenar los spans de la previsualización
            if (previewCentro) previewCentro.textContent = centroNombreForm;
            if (previewMedicamentoNombre) previewMedicamentoNombre.textContent = nombreMedicamentoForm;
            if (previewMonodroga) previewMonodroga.textContent = nombreMonodrogaForm;
            if (previewPresentacion) previewPresentacion.textContent = descPresentacionForm;
            if (previewLote) previewLote.textContent = numeroLoteForm;
            if (previewVencimiento) previewVencimiento.textContent = fechaVencimientoValueForm; // Muestra YYYY-MM-DD
            if (previewCodigoProducto) previewCodigoProducto.textContent = codigoProductoForm;
            if (previewUsuario) previewUsuario.textContent = `Prep: ${nombreUsuario}`;

            vistaPreviaSeccion.style.display = 'flex'; // Mostrar la sección de previsualización

        });
    } else {
        // Logs si algún elemento esencial para la previsualización no se encuentra
        if (!botonVerVistaPrevia) console.warn("Botón 'Ver vista previa' (ID: boton-vista-previa) no encontrado.");
        if (!qrcodePreviewArea) console.warn("Contenedor '#qrcode-preview-area' no encontrado.");
        if (!codigoInput) console.warn("Elemento 'codigoInput' no encontrado para la lógica de QR/Previsualización.");
        if (!loteInput) console.warn("Elemento 'loteInput' no encontrado para la lógica de QR/Previsualización.");
        if (!vencimientoInput) console.warn("Elemento 'vencimientoInput' no encontrado para la lógica de QR/Previsualización.");
        if (!vistaPreviaSeccion) console.warn("Elemento 'vistaPreviaSeccion' no encontrado.");
    }
}); // Fin de DOMContentLoaded