/**
 * @file menu_script.js
 * @description Contiene toda la lógica de JavaScript para la página del menú principal.
 * Versión final y refactorizada para asegurar la correcta ejecución y funcionalidad de todos los botones.
 */

// ÚNICO Event Listener que se asegura de que todo el código se ejecute solo después de que el HTML se haya cargado.
document.addEventListener('DOMContentLoaded', () => {

    //-------------------------------------------------------------------
    // SECCIÓN 1: OBTENCIÓN DE ELEMENTOS DEL DOM
    //-------------------------------------------------------------------

    // --- Elementos Generales ---
    const sidebar = document.querySelector("#sidebar");
    const hamburguer = document.querySelector('#toggle-btn');

    // --- Enlaces para abrir formularios ---
    const enlaces = {
        generadorEtiquetas: document.getElementById('enlace-generador-etiquetas'),
        crearMedicamento: document.getElementById('enlace-crear-medicamento'),
        crearMonodroga: document.getElementById('enlace-crear-monodroga'),
        crearCategoria: document.getElementById('enlace-crear-categoria'),
        crearSubcategoria: document.getElementById('enlace-crear-subcategoria'),
        crearLaboratorio: document.getElementById('enlace-crear-laboratorio'),
        crearUsuario: document.getElementById('enlace-crear-usuario'),
        cambiarContrasenia: document.getElementById('enlace-cambiar-contraseña'),
        derechosDeUsuarios: document.getElementById('enlace-derechos-de-usuarios'),
    };

    // --- Contenedores de Formularios ---
    const formularios = {
        generadorEtiquetas: document.getElementById('generador-etiquetas-container'),
        crearMedicamento: document.getElementById('crear-medicamento'),
        crearMonodroga: document.getElementById('crear-monodroga'),
        crearCategoria: document.getElementById('crear-categoria'),
        crearSubcategoria: document.getElementById('crear-subcategoria'),
        crearLaboratorio: document.getElementById('crear-laboratorio'),
        crearUsuario: document.getElementById('crear-usuario'),
        crearNuevaContrasenia: document.getElementById('crear-nueva-contraseña'),
        derechosDeUsuarios: document.getElementById('derechos-de-usuarios'),
    };

    // --- Botones de Cierre ---
    const botonesCerrar = {
        generadorEtiquetas: document.getElementById('cerrar-generador-etiquetas'),
        crearMedicamento: document.getElementById('cerrar-medicamento'),
        crearMonodroga: document.getElementById('cerrar-monodroga'),
        crearCategoria: document.getElementById('cerrar-categoria'),
        crearSubcategoria: document.getElementById('cerrar-subcategoria'),
        crearLaboratorio: document.getElementById('cerrar-laboratorio'),
        crearUsuario: document.getElementById('cerrar-usuario'),
        cambiarContrasenia: document.getElementById('cerrar-contraseña'),
        derechosDeUsuarios: document.getElementById('cerrar-derechos'),
    };

    // --- Botones de Acción (Guardar/Ingresar) ---
    const botonesGuardar = {
        subcategoria: document.getElementById("boton-ingresar-subcategoria"),
        categoria: document.getElementById("boton-ingresar-categoria"),
        monodroga: document.getElementById("boton-ingresar-monodroga"),
        laboratorio: document.getElementById("boton-ingresar-laboratorio"),
        medicamento: document.getElementById('boton-ingresar-medicamento'),
    };

    // --- Formulario Generador de Etiquetas ---
    const {
        centroSelect,
        medicamentoInput,
        sugerenciasContainer,
        laboratorioInput,
        monodrogaInput,
        presentacionInput,
        codigoInput,
        loteInput,
        vencimientoInput,
        grupo1Input,
        grupo2Input,
        trazabilidadContainer,
        botonVerVistaPrevia,
        botonGenerarExcel,
        botonLimpiar
    } = {
        centroSelect: document.getElementById('centro'),
        medicamentoInput: document.getElementById('medicamento'),
        sugerenciasContainer: document.getElementById('sugerencias-medicamentos'),
        laboratorioInput: document.getElementById('laboratorio'),
        monodrogaInput: document.getElementById('monodroga'),
        presentacionInput: document.getElementById('presentacion'),
        codigoInput: document.getElementById('codigo'),
        loteInput: document.getElementById('lote'),
        vencimientoInput: document.getElementById('vencimiento'),
        grupo1Input: document.getElementById('grupo1'),
        grupo2Input: document.getElementById('grupo2'),
        trazabilidadContainer: document.getElementById('trazabilidad-container'),
        botonVerVistaPrevia: document.getElementById('boton-vista-previa'),
        botonGenerarExcel: document.getElementById('boton-generar-excel'),
        botonLimpiar: document.getElementById('boton-limpiar-formulario'),
    };

    // --- Modal de Previsualización ---
    const modalVistaPreviaEl = document.getElementById('modalVistaPreviaEtiqueta');
    const modalVistaPreviaEtiqueta = modalVistaPreviaEl ? new bootstrap.Modal(modalVistaPreviaEl) : null;
    const qrcodePreviewAreaModal = document.getElementById('qrcode-preview-area-modal');
    const botonImprimirModal = document.getElementById('boton-imprimir-modal');
    const preview = {
        centro: document.getElementById('preview-centro'),
        medicamentoNombre: document.getElementById('preview-medicamento-nombre'),
        monodroga: document.getElementById('preview-monodroga'),
        presentacion: document.getElementById('preview-presentacion'),
        lote: document.getElementById('preview-lote'),
        vencimiento: document.getElementById('preview-vencimiento'),
        usuario: document.getElementById('preview-usuario'),
    };

    let formularioActivo = null;

    //-------------------------------------------------------------------
    // SECCIÓN 2: DEFINICIÓN DE FUNCIONES
    //-------------------------------------------------------------------

    function gestionarVisibilidadFormulario(enlace, contenedor) {
        if (enlace && contenedor) {
            enlace.addEventListener('click', (e) => {
                e.preventDefault();
                if (formularioActivo && formularioActivo !== contenedor) {
                    formularioActivo.style.display = 'none';
                }
                contenedor.style.display = 'block';
                formularioActivo = contenedor;
            });

            const key = Object.keys(formularios).find(k => formularios[k] === contenedor);
            const botonCerrar = botonesCerrar[key];
            if (botonCerrar) {
                botonCerrar.addEventListener('click', () => {
                    contenedor.style.display = 'none';
                    if (formularioActivo === contenedor) formularioActivo = null;
                });
            }
        }
    }

    function poblarSelect(url, selectId, valueKey, textKey, callback) {
        fetch(url)
            .then(res => res.ok ? res.json() : Promise.reject(`Error ${res.status} en ${url}`))
            .then(data => {
                const select = document.getElementById(selectId);
                if (!select) return;
                select.innerHTML = '<option value="">Seleccione...</option>';
                data.forEach(item => {
                    select.innerHTML += `<option value="${item[valueKey]}">${item[textKey]}</option>`;
                });
                if (callback) callback();
            })
            .catch(error => console.error(`Error al obtener datos para ${selectId}:`, error));
    }

    //-------------------------------------------------------------------
    // SECCIÓN 3: INICIALIZACIÓN Y ASIGNACIÓN DE EVENTOS
    //-------------------------------------------------------------------

    if (hamburguer && sidebar) {
        hamburguer.addEventListener("click", () => sidebar.classList.toggle("expand"));
    }

    // --- Asignar eventos para abrir y cerrar todos los formularios ---
    Object.keys(enlaces).forEach(key => {
        const formKey = key === 'cambiarContrasenia' ? 'crearNuevaContrasenia' : key;
        gestionarVisibilidadFormulario(enlaces[key], formularios[formKey]);
    });


    // --- Lógica del Generador de Etiquetas ---
    if (medicamentoInput) {
        medicamentoInput.addEventListener('input', async () => {
            const textoBusqueda = medicamentoInput.value.trim();
            if (!sugerenciasContainer) return;
            if (textoBusqueda.length < 2) {
                sugerenciasContainer.style.display = 'none';
                return;
            }
            sugerenciasContainer.innerHTML = '<div class="sugerencia-item">Buscando...</div>';
            sugerenciasContainer.style.display = 'block';
            try {
                const response = await fetch(`/buscar_medicamentos?q=${encodeURIComponent(textoBusqueda)}`);
                const medicamentos = await response.json();
                sugerenciasContainer.innerHTML = '';
                if (medicamentos.length > 0) {
                    medicamentos.forEach(med => {
                        const div = document.createElement('div');
                        div.textContent = med.nombre;
                        div.className = 'sugerencia-item';
                        div.onclick = () => {
                            medicamentoInput.value = med.nombre;
                            if (codigoInput) codigoInput.value = med.codigo_medicamento || '';
                            if (presentacionInput) presentacionInput.value = med.presentacion_descripcion || '';
                            if (laboratorioInput) laboratorioInput.value = med.laboratorio_nombre || '';
                            if (monodrogaInput) monodrogaInput.value = med.monodroga_nombre || '';
                            if (grupo1Input) grupo1Input.value = med.categoria_principal_nombre || '';
                            if (grupo2Input) grupo2Input.value = med.subcategoria_nombre || '';
                            if (trazabilidadContainer) trazabilidadContainer.style.display = med.trazable ? 'block' : 'none';
                            sugerenciasContainer.style.display = 'none';
                        };
                        sugerenciasContainer.appendChild(div);
                    });
                } else {
                    sugerenciasContainer.innerHTML = '<div class="sugerencia-item">No se encontraron medicamentos.</div>';
                }
            } catch (error) {
                sugerenciasContainer.innerHTML = '<div class="sugerencia-item">Error en la búsqueda.</div>';
            }
        });
    }

    if (botonVerVistaPrevia) {
        botonVerVistaPrevia.addEventListener('click', () => {
            if (!medicamentoInput.value || !loteInput.value || !vencimientoInput.value) return alert("Por favor, completa los campos de Medicamento, Lote y Vencimiento.");
            const qrString = `${codigoInput.value}|${loteInput.value}|${vencimientoInput.value.replace(/-/g, '')}`;

            if (preview.centro) preview.centro.textContent = (centroSelect.selectedIndex > 0) ? centroSelect.options[centroSelect.selectedIndex].text : "N/A";
            if (preview.medicamentoNombre) preview.medicamentoNombre.textContent = medicamentoInput.value;
            if (preview.monodroga) preview.monodroga.textContent = monodrogaInput.value;
            if (preview.presentacion) preview.presentacion.textContent = presentacionInput.value;
            if (preview.lote) preview.lote.textContent = loteInput.value;
            if (preview.vencimiento) preview.vencimiento.textContent = vencimientoInput.value;
            if (preview.usuario) preview.usuario.textContent = `Prep: ${document.body.dataset.username || 'N/A'}`;

            if (qrcodePreviewAreaModal) {
                qrcodePreviewAreaModal.innerHTML = '';
                new QRCode(qrcodePreviewAreaModal, { text: qrString, width: 80, height: 80, correctLevel: QRCode.CorrectLevel.H });
            }
            if (modalVistaPreviaEtiqueta) modalVistaPreviaEtiqueta.show();
        });
    }

    if (botonImprimirModal) {
        botonImprimirModal.addEventListener('click', () => {
            const el = document.getElementById('etiqueta-para-imprimir');
            if (!el) return;
            const win = window.open('', '_blank');
            win.document.write(`<html><head><title>Imprimir</title><link rel="stylesheet" href="/static/css/base.css"></head><body>${el.outerHTML}</body></html>`);
            setTimeout(() => { win.document.close(); win.focus(); win.print(); }, 500);
        });
    }

    if (botonGenerarExcel) {
        botonGenerarExcel.addEventListener('click', () => {
            if (!medicamentoInput.value || !loteInput.value || !vencimientoInput.value) return alert("Completa Medicamento, Lote y Vencimiento.");
            const data = [{
                "Centro": (centroSelect.selectedIndex > 0) ? centroSelect.options[centroSelect.selectedIndex].text : "N/A",
                "Medicamento": medicamentoInput.value, "Laboratorio": laboratorioInput.value, "Monodroga": monodrogaInput.value,
                "Presentación": presentacionInput.value, "Código": codigoInput.value, "Lote": loteInput.value, "Vencimiento": vencimientoInput.value,
                "Categoría": grupo1Input.value, "Subcategoría": grupo2Input.value,
                "Usuario Generador": document.body.dataset.username || 'N/A', "Rol del Usuario": document.body.dataset.userRole || 'N/A',
                "Texto del QR": `${codigoInput.value}|${loteInput.value}|${vencimientoInput.value.replace(/-/g, '')}`
            }];
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Datos Etiqueta");
            XLSX.writeFile(wb, "DatosEtiqueta.xlsx");
        });
    }

    // --- Lógica para los formularios de creación (CRUD) ---
    if (enlaces.crearMedicamento) {
        enlaces.crearMedicamento.addEventListener('click', () => {
            poblarSelect('/api/monodrogas', 'monodrogaMedicamento', 'id_monodroga_original', 'nombre', () => {
                const sel = document.getElementById('monodrogaMedicamento');
                const inp = document.getElementById('monodCodigoMedicamento');
                if (sel && inp) sel.onchange = () => { inp.value = sel.value || ''; };
            });
            poblarSelect('/api/categorias', 'categoriaMedicamento', 'id_categoria_original', 'nombre');
            poblarSelect('/api/subcategorias', 'subcategoriaMedicamento', 'id_subcategoria_original', 'nombre');
            poblarSelect('/api/laboratorios', 'laboratorioMedicamento', 'id_laboratorio_original', 'nombre');
        });
    }

    // --- Lógica para los botones de guardar ---
    // NOTA: Estas funciones asumen que tienes rutas de backend en Flask para '/guardar_...',
    // que actualmente no hemos localizado, por lo que podrían fallar.

     async function guardarDatos(url, payload) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const resultado = await response.json();
            alert(resultado.mensaje || (response.ok ? "Guardado con éxito" : "Ocurrió un error."));
            return response.ok;
        } catch (error) {
            console.error(`Error al guardar en ${url}:`, error);
            alert("Error de conexión al intentar guardar.");
            return false;
        }
    }


    if (botonesGuardar.subcategoria) {
        botonesGuardar.subcategoria.addEventListener("click", async () => {
            const input = document.getElementById("subcategoriaForm");
            if (!input.value.trim()) return alert("El nombre es obligatorio.");
            const ok = await guardarDatos("/guardar_subcategoria", { subcategoriaForm: input.value.trim() });
            if (ok) input.value = '';
        });
    }

    if (botonesGuardar.categoria) {
        botonesGuardar.categoria.addEventListener("click", async () => {
            const input = document.getElementById("categoriaForm");
            if (!input.value.trim()) return alert("El nombre es obligatorio.");
            const ok = await guardarDatos("/guardar_categoria", { categoriaForm: input.value.trim() });
            if (ok) input.value = '';
        });
    }

    if (botonesGuardar.laboratorio) {
        botonesGuardar.laboratorio.addEventListener("click", async () => {
            const input = document.getElementById("laboratorioForm");
            if (!input.value.trim()) return alert("El nombre es obligatorio.");
            const ok = await guardarDatos("/guardar_laboratorio", { nombreLaboratorio: input.value.trim() });
            if (ok) input.value = '';
        });
    }

    if (botonesGuardar.monodroga) {
        botonesGuardar.monodroga.addEventListener("click", async () => {
            const nombreInput = document.getElementById("monodrogaForm");
            const codigoInput = document.getElementById("monodrogaFormCod");
            if (!nombreInput.value.trim() || !codigoInput.value.trim()) return alert("Nombre y Código son obligatorios.");
            const ok = await guardarDatos("/guardar_monodroga", {
                nombreMonodroga: nombreInput.value.trim(),
                codigoMonodroga: codigoInput.value.trim()
            });
            if (ok) {
                nombreInput.value = '';
                codigoInput.value = '';
            }
        });
    }

    if (botonesGuardar.medicamento) {
        const formMedicamento = document.getElementById("formMedicamento");
        const enviarMedicamento = async (e) => {
            e.preventDefault();
            const payload = {
                nombreMedicamento: document.getElementById("nombreMedicamento").value,
                codigoMedicamento: document.getElementById("codigoMedicamento").value,
                laboratorioMedicamento: document.getElementById("laboratorioMedicamento").options[document.getElementById("laboratorioMedicamento").selectedIndex].text,
                monodrogaMedicamento: document.getElementById("monodrogaMedicamento").options[document.getElementById("monodrogaMedicamento").selectedIndex].text,
                monodCodigoMedicamento: document.getElementById("monodrogaMedicamento").value,
                presentacionMonodroga: document.getElementById("presentacionMonodroga").value,
                categoriaMedicamento: document.getElementById("categoriaMedicamento").options[document.getElementById("categoriaMedicamento").selectedIndex].text,
                idCategoria: document.getElementById("categoriaMedicamento").value,
                subcategoriaMedicamento: document.getElementById("subcategoriaMedicamento").options[document.getElementById("subcategoriaMedicamento").selectedIndex].text,
                idSubcategoria: document.getElementById("subcategoriaMedicamento").value,
                trazable: document.getElementById("trazableMedicamento").checked
            };
            if (!payload.nombreMedicamento || !payload.codigoMedicamento) return alert("Nombre y código son obligatorios.");

            const ok = await guardarDatos("/guardar_medicamento", payload);
            if (ok) formMedicamento.reset();
        };

        botonesGuardar.medicamento.addEventListener("click", enviarMedicamento);
        if (formMedicamento) formMedicamento.addEventListener("submit", enviarMedicamento);
    }

     // -------------------------------------------------------------------
    // SECCIÓN EXTRA: LÓGICA DE RESTRICCIÓN DE ROLES
    // -------------------------------------------------------------------
    const userRole = document.body.dataset.userRole;

    if (userRole === 'Operario') {
        console.log("Rol detectado: Operario. Aplicando restricciones de menú.");

        // Ocultar el menú "Medicamentos" completo
        const menuMedicamentos = document.getElementById('medicamentosMenu');
        if (menuMedicamentos && menuMedicamentos.parentElement) {
            menuMedicamentos.parentElement.style.display = 'none';
        }

        // Ocultar el enlace "Informes"
        // Buscamos el enlace por su texto, ya que no tiene un ID único.
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(link => {
            const span = link.querySelector('span');
            if (span && span.textContent.trim() === 'Informes') {
                if(link.parentElement) {
                   link.parentElement.style.display = 'none';
                }
            }
        });

        // Ocultar opciones específicas del menú "Administración"
        const enlaceCrearUsuario = document.getElementById('enlace-crear-usuario');
        if (enlaceCrearUsuario && enlaceCrearUsuario.parentElement) {
            enlaceCrearUsuario.parentElement.style.display = 'none';
        }

        const enlaceDerechos = document.getElementById('enlace-derechos-de-usuarios');
        if (enlaceDerechos && enlaceDerechos.parentElement) {
            enlaceDerechos.parentElement.style.display = 'none';
        }
    }

    // --- FUNCIONALIDAD PARA TOAST ---
    const toastContainer = document.querySelector('.toast-container');
    const toastMessagesContainer = document.getElementById('toast-messages-container');
    
    if (toastMessagesContainer) {
      const toasts = toastMessagesContainer.querySelectorAll('.toast');
      toasts.forEach(toastEl => {
        const newToastEl = toastEl.cloneNode(true);
        toastContainer.appendChild(newToastEl);
        const toast = new bootstrap.Toast(newToastEl);
        toast.show();
      });
      toastMessagesContainer.remove();
    }


}); // --- FIN DEL SCRIPT ---