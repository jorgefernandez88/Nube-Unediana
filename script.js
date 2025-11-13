// Función para contraer todos los grupos al cargar la página
function contraerTodosLosGrupos() {
  const grupos = document.querySelectorAll('.grupo');
  grupos.forEach(grupo => {
    const contenidoGrupo = grupo.querySelector('.contenido-grupo');
    const botonExpansion = grupo.querySelector('.boton-expansion');
    grupo.classList.remove('expandido');
    if (contenidoGrupo) {
      contenidoGrupo.style.display = 'none';
    }
    if (botonExpansion) {
      botonExpansion.textContent = 'Ver grupos';
    }
  });
}

// Función para expandir o contraer un grupo
function toggle(button) {
  var grupo = button.closest('.grupo');
  var contenidoGrupo = grupo.querySelector('.contenido-grupo');

  if (grupo.classList.contains('expandido')) {
    grupo.classList.remove('expandido');
    button.textContent = 'Ver grupos';
    if (contenidoGrupo) {
      contenidoGrupo.style.display = 'none';
    }
  } else {
    grupo.classList.add('expandido');
    button.textContent = 'Ver menos';
    if (contenidoGrupo) {
      contenidoGrupo.style.display = 'block';
    }
  }
}

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', function () {
    inicializarBuscador();
    contraerTodosLosGrupos();
});

  

//Caluladora principal  
// Ocultar el resultText inicialmente
  const resultText = document.getElementById('resultText');
  if (resultText) {
      resultText.style.display = 'none';
  }
 
  
  // Configurar el botón de agregar actividad
  const addButton = document.getElementById('addButton');
  if (addButton) {
      addButton.addEventListener('click', addRow);
  }  
   
  
  // Configurar el botón de calcular
  const calcularButton = document.getElementById('calcularButton');
  if (calcularButton) {
      calcularButton.addEventListener('click', () => {
          calcularNota();
          mostrarResultText();
      });
  }
  updateAddRowButton();

// Una linea 
let rowCount = 1;

// Función principal de cálculo
function calcularNota() {
    let totalValor = 0;
    let totalNota = 0;
    let camposCompletos = true;
    let hayValorValido = false;

    // Recolectar datos de todas las filas
    for (let i = 1; i <= rowCount; i++) {
        const valorInput = document.getElementById(`valor${i}`);
        const notaInput = document.getElementById(`nota${i}`);
        
        if (!valorInput || !notaInput) continue;

        const valor = parseFloat(valorInput.value || 0);
        const nota = parseFloat(notaInput.value || 0);

        if (valorInput.value === "" || notaInput.value === "") {
            camposCompletos = false;
            continue;
        }

        if (valor > 0) {
            hayValorValido = true;
        }

        // Normalizar nota si es necesario
        const notaNormalizada = nota > 10 ? nota / 10 : nota;
        
        totalValor += valor;
        totalNota += (valor * notaNormalizada) / 10;
    }

    // Validaciones
    if (!camposCompletos || !hayValorValido) {
        mostrarResultadosVacios();
        return;
    }

    if (totalValor > 10) {
        alert('El total de los porcentajes no puede exceder 10.');
        mostrarResultadosVacios();
        return;
    }

    // Cálculos finales
    const valorObtenido = totalNota;
    const faltaParaMinima = Math.max(0, 7 - valorObtenido);
    const faltaParaMaxima = Math.max(0, 10 - valorObtenido);

    // Actualizar los resultados
    document.getElementById('totalGanado').textContent = valorObtenido.toFixed(2);
    document.getElementById('faltaMinimo').textContent = faltaParaMinima.toFixed(2);
    document.getElementById('faltaMaximo').textContent = faltaParaMaxima.toFixed(2);
}

// Función para mostrar resultados vacíos
function mostrarResultadosVacios() {
    document.getElementById('totalGanado').textContent = "";
    document.getElementById('faltaMinimo').textContent = "";
    document.getElementById('faltaMaximo').textContent = "";
}

// Función para agregar fila
function addRow() {
  rowCount++;
  const newRow = document.createElement('div');
  newRow.id = `row${rowCount}`;
  newRow.classList.add('input-group', 'row');

  newRow.innerHTML = `
      <div class="input-group">
          <label for="actividad${rowCount}">Actividad:</label>
          <input type="text" id="actividad${rowCount}" name="actividad${rowCount}" class="full-width" placeholder="Actividad">
      </div>
      <div class="input-group">
          <label for="valor${rowCount}">Valor:</label>
          <input type="number" id="valor${rowCount}" name="valor${rowCount}" class="half-width" placeholder="%" step="0.1">
      </div>
      <div class="input-group">
          <label for="nota${rowCount}">Nota Obtenida:</label>
          <input type="number" id="nota${rowCount}" name="nota${rowCount}" class="half-width" placeholder="Nota" step="0.1">
      </div>
      <div class="input-group">
          <button type="button" class="delete-button" onclick="removeRow(this)">Eliminar</button>
      </div>`;

  const gradeForm = document.getElementById('gradeForm');
  gradeForm.insertBefore(newRow, gradeForm.querySelector('.button-group'));
  updateAddRowButton();
}


function removeRow(button) {
  const row = button.closest('.input-group.row');
  if (row && row.id !== 'row1') { 
      row.remove();
      rowCount--;
      updateAddRowButton();
      calcularNota(); 
  }
}

// Función para actualizar el botón de agregar
function updateAddRowButton() {
    const form = document.getElementById('gradeForm');
    const rows = form.querySelectorAll('.input-group.row');
    let totalValor = 0;

    rows.forEach(row => {
        const valorInput = row.querySelector('input[name^="valor"]');
        const valor = parseFloat(valorInput ? valorInput.value : 0) || 0;
        totalValor += valor;
    });

    const addButton = document.getElementById('addButton');
    if (addButton) {
        addButton.disabled = totalValor >= 10;
    }
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.getElementById('addButton');
    if (addButton) {
        addButton.addEventListener('click', addRow);
    }
    
    document.getElementById('gradeForm').addEventListener('input', calcularNota);
    mostrarResultadosVacios();
});

//Calculadoras secundarias
// Calculadora margen
function calcularGanarMateria() {
  const porcentajeGanado = parseFloat(document.getElementById('porcentajeGanado').value);
  const porcentajeRestante = parseFloat(document.getElementById('porcentajeRestante').value);
  const resultado = document.getElementById('resultMargen');

  // Limpiamos el resultado de errores anteriores
  resultado.textContent = '';

  // Validación para inputs vacíos
  if (isNaN(porcentajeGanado) || isNaN(porcentajeRestante)) {
    resultado.textContent = 'Por favor ingrese ambos valores para calcular el margen.';
    return;
  }

  // Validación para el rango 0.0 a 10.0
  if (porcentajeGanado < 0 || porcentajeGanado > 10 || porcentajeRestante < 0 || porcentajeRestante > 10) {
    resultado.textContent = 'Por favor ingrese valores válidos entre 0.0 y 10.0 para ambos campos.';
    return;
  }

  // Calculamos el porcentaje máximo posible si se completan todas las actividades restantes
  const porcentajeMaximoPosible = porcentajeGanado + porcentajeRestante;

  // Asumiendo que 7.0 es el mínimo para aprobar
  const porcentajeNecesario = 7.0;

  // Limpiar contenido y clases de resultados previos
  resultado.textContent = '';
  resultado.className = ''; // Elimina todas las clases anteriores

  if (porcentajeMaximoPosible >= porcentajeNecesario) {
    resultado.textContent = `¡Excelente! Aún puedes aprobar la asignatura. El porcentaje que te queda de las actividades restantes (${porcentajeRestante.toFixed(2)}) más lo que ya tienes aprobado (${porcentajeGanado.toFixed(2)}) te da un total de ${porcentajeMaximoPosible.toFixed(2)}. ¡Ten presente que esto es asumiendo que obtendrás el total del porcentaje que te queda!`;
    resultado.classList.add('aprobado'); // Fondo verde
  } else {
    resultado.textContent = `Lo sentimos, no tienes margen para aprobar la materia. El porcentaje obtenido (${porcentajeGanado.toFixed(2)}) más el porcentaje que te queda pendiente (${porcentajeRestante.toFixed(2)}) suma un total de ${porcentajeMaximoPosible.toFixed(2)}, que no llega al mínimo de ${porcentajeNecesario.toFixed(2)}. ¡Consulta a tu profesor para más orientación!`;
    resultado.classList.add('no-aprobado'); // Fondo rojo
  }
}

function toggleGanarMateria(button) {
  const content = button.nextElementSibling; // Obtiene el siguiente elemento hermano (el div contenido)
  
  if (content.classList.contains('oculto')) {
      content.classList.remove('oculto');
      button.textContent = "Ocultar";
  } else {
      content.classList.add('oculto');
      button.innerHTML = '<i class="fas fa-calculator"></i> Calculadora margen';
  }
}

// Caculadora de redondeo
function calcularRedondeoNota() {
  const notaInput = document.getElementById('notaParaRedondear').value;
  const resultadoRedondeo = document.getElementById('resultRedondeo');

  // Limpiar mensaje de resultados previos
  resultadoRedondeo.textContent = '';

  // Validación de input vacío
  if (notaInput === '') {
      resultadoRedondeo.textContent = 'Por favor ingrese una nota para calcular el redondeo.';
      return;
  }

  const nota = parseFloat(notaInput);

  // Validación de valores no numéricos o fuera del rango
  if (isNaN(nota) || nota < 0 || nota > 10) {
      resultadoRedondeo.textContent = 'Por favor, ingresa una nota válida entre 0 y 10.';
      return;
  }

  let notaRedondeada;

  if (nota >= 9.75) {
      notaRedondeada = 10.0;
  } else if (nota >= 9.25) {
      notaRedondeada = 9.5;
  } else if (nota >= 8.75) {
      notaRedondeada = 9.0;
  } else if (nota >= 8.25) {
      notaRedondeada = 8.5;
  } else if (nota >= 7.75) {
      notaRedondeada = 8.0;
  } else if (nota >= 7.25) {
      notaRedondeada = 7.5;
  } else if (nota >= 6.75) {
      notaRedondeada = 7.0;
  } else if (nota >= 6.25) {
      notaRedondeada = 6.5;
  } else if (nota >= 5.75) {
      notaRedondeada = 6.0;
  } else if (nota >= 5.25) {
      notaRedondeada = 5.5;
  } else if (nota >= 4.75) {
      notaRedondeada = 5.0;
  } else {
      notaRedondeada = Math.round(nota); // Redondeo para notas menores a 4.75
  }

  resultadoRedondeo.textContent = `La nota redondeada es: ${notaRedondeada.toFixed(1)}`;
}

function toggleRedondeoNota(button) {
  const content = button.nextElementSibling; // Obtiene el siguiente elemento hermano (el div contenido)
  
  if (content.classList.contains('oculto')) {
      content.classList.remove('oculto');
      button.textContent = "Ocultar";
  } else {
      content.classList.add('oculto');
      button.innerHTML = '<i class="fas fa-calculator"></i> Calculadora redondeo';
  }
}


// --- NUEVO: Lógica para la Calculadora de Aranceles ---

let arancelesData = null; // Variable para almacenar los datos cargados
let itemsSeleccionados = []; // Array para mantener los items seleccionados

// Función para cargar los aranceles desde el archivo .json
async function cargarAranceles() {
    try {
        const response = await fetch('aranceles.json');
        if (!response.ok) {
            throw new Error(`Error al cargar aranceles.json: ${response.status} ${response.statusText}`);
        }
        arancelesData = await response.json();
        console.log('✅ Aranceles cargados correctamente:', arancelesData);
    } catch (error) {
        console.error('❌ Error cargando los aranceles:', error);
        // Mostrar un mensaje de error visible al usuario
        const mainContent = document.querySelector('main');
        if (mainContent) {
            const errorMessage = document.createElement('div');
            errorMessage.style.cssText = `
                background-color: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
                padding: 15px;
                margin: 20px auto;
                max-width: 800px;
                border-radius: 8px;
                text-align: center;
                font-family: 'Open Sans', serif;
            `;
            errorMessage.innerHTML = `
                <h3 style="color: #721c24; margin-top: 0;">⚠️ Error Crítico</h3>
                <p>${error.message}</p>
                <p>Por favor, verifique que el archivo <strong>aranceles.json</strong> exista en la raíz del proyecto y tenga un formato JSON válido.</p>
                <p><strong>Solución:</strong> Abra el archivo <code>aranceles.json</code> y asegúrese de que sea un JSON válido.</p>
            `;
            mainContent.insertBefore(errorMessage, mainContent.firstChild);
        }
        alert(`Error al cargar los aranceles: ${error.message}\n\nPor favor, verifique el archivo aranceles.json.`);
    }
}

// Función para inicializar la calculadora de aranceles
async function inicializarCalculadoraAranceles() {
    //await cargarAranceles(); // Espera a que los datos se carguen
    if (!arancelesData) return; // Si no se pudieron cargar, no hacer nada

    const tablaBody = document.getElementById('tabla-aranceles-body');
    if (!tablaBody) return; // Verificar que el contenedor exista

    // Crear las categorías y filas de la tabla dinámicamente
    const categorias = {
        "Asignaturas nuevas": ["asignatura_regular", "asignatura_laboratorio", "asignatura_gira", "asignatura_laboratorio_gira"],
        "Asignaturas repetidas": ["asignatura_repetida", "repetida_laboratorio"],
        "Prácticas y proyectos": ["practica_tesis", "laboratorio_independiente"]
    };

    for (const [categoriaNombre, ids] of Object.entries(categorias)) {
        const categoriaRow = document.createElement('tr');
        categoriaRow.className = 'categoria';
        categoriaRow.innerHTML = `<td colspan="4">${categoriaNombre}</td>`;
        tablaBody.appendChild(categoriaRow);

        ids.forEach(id => {
            const item = arancelesData.aranceles.find(a => a.id === id);
            if (item) {
                const row = document.createElement('tr');
                row.id = `fila-${id}`; // Añadir ID para facilitar manipulación
                row.innerHTML = `
                    <td><input type="checkbox" class="seleccionar-item" data-id="${id}"></td>
                    <td>${item.nombre}</td>
                    <td class="precio" data-id="${id}">₡0</td>
                    <td><input type="number" class="cantidad" data-id="${id}" min="1" placeholder="0"></td>
                `;
                tablaBody.appendChild(row);
            }
        });
    }

    // Inicializar eventos y estado
    inicializarEventosAranceles();
    actualizarPrecios();
    mostrarMensajeBeca();
    recalcularTotal();
}

// Función para inicializar eventos de la calculadora de aranceles
function inicializarEventosAranceles() {
    // Elementos del DOM
    const becaOptions = document.querySelectorAll('input[name="tipo-beca"]');
    const programaSelect = document.getElementById('programa-academico');
    const checkboxes = document.querySelectorAll('.seleccionar-item');
    const cantidades = document.querySelectorAll('.cantidad');

    // Manejar cambio de tipo de beca
    becaOptions.forEach(option => {
        option.addEventListener('change', function() {
            actualizarPrecios();
            mostrarMensajeBeca();
            recalcularTotal();
        });
    });

    // Manejar cambio de programa académico
    programaSelect.addEventListener('change', function() {
        actualizarPrecios();
        recalcularTotal();
    });

    // Manejar selección de items
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const id = this.getAttribute('data-id');
            const cantidadInput = document.querySelector(`.cantidad[data-id="${id}"]`);
            const cantidad = parseInt(cantidadInput.value) || 0;
            const precioUnitario = getPrecioActual(id);
            const precioTotal = precioUnitario * cantidad;

            if (this.checked && cantidad > 0) {
                // Actualizar o agregar item
                const itemIndex = itemsSeleccionados.findIndex(item => item.id === id);
                if (itemIndex !== -1) {
                    itemsSeleccionados[itemIndex] = {
                        id: id,
                        nombre: this.closest('tr').querySelector('td:nth-child(2)').textContent,
                        precioUnitario: precioUnitario,
                        cantidad: cantidad,
                        total: precioTotal
                    };
                } else {
                    itemsSeleccionados.push({
                        id: id,
                        nombre: this.closest('tr').querySelector('td:nth-child(2)').textContent,
                        precioUnitario: precioUnitario,
                        cantidad: cantidad,
                        total: precioTotal
                    });
                }
            } else {
                // Eliminar item de la selección
                itemsSeleccionados = itemsSeleccionados.filter(item => item.id !== id);
                if (!this.checked && cantidad === 0) {
                    cantidadInput.value = '';
                }
            }
            actualizarResumen();
            recalcularTotal();
        });
    });

    // Manejar cambio de cantidad
    cantidades.forEach(cantidad => {
        cantidad.addEventListener('change', function() {
            const id = this.getAttribute('data-id');
            const checkbox = document.querySelector(`.seleccionar-item[data-id="${id}"]`);
            const nuevaCantidad = parseInt(this.value) || 0;

            if (checkbox.checked || nuevaCantidad > 0) {
                const precioUnitario = getPrecioActual(id);
                const nuevoTotal = precioUnitario * nuevaCantidad;

                const itemIndex = itemsSeleccionados.findIndex(item => item.id === id);
                if (itemIndex !== -1) {
                    if (nuevaCantidad > 0) {
                        itemsSeleccionados[itemIndex] = {
                            id: id,
                            nombre: checkbox.closest('tr').querySelector('td:nth-child(2)').textContent,
                            precioUnitario: precioUnitario,
                            cantidad: nuevaCantidad,
                            total: nuevoTotal
                        };
                    } else {
                        itemsSeleccionados.splice(itemIndex, 1);
                        checkbox.checked = false;
                        this.value = '';
                    }
                } else if (nuevaCantidad > 0) {
                    itemsSeleccionados.push({
                        id: id,
                        nombre: checkbox.closest('tr').querySelector('td:nth-child(2)').textContent,
                        precioUnitario: precioUnitario,
                        cantidad: nuevaCantidad,
                        total: nuevoTotal
                    });
                    checkbox.checked = true;
                }
                actualizarResumen();
                recalcularTotal();
            }
        });
    });
}

// Función para obtener el precio actual según beca y programa
function getPrecioActual(id) {
    if (!arancelesData) return 0;
    const tipoBeca = document.querySelector('input[name="tipo-beca"]:checked').value;
    const programaAcademico = document.getElementById('programa-academico').value;
    const item = arancelesData.aranceles.find(a => a.id === id);

    if (!item) return 0;

    // Las becas A y B son exentas
    if (arancelesData.becas_exentas.includes(tipoBeca)) {
        return 0;
    }

    // Buscar el precio correspondiente
    const categoriaPrograma = item.categorias[programaAcademico];
    if (categoriaPrograma) {
        // Buscar precio específico para la beca
        const precio = categoriaPrograma[tipoBeca];
        if (precio !== undefined) {
            return precio;
        }
        // Si no hay precio específico, usar el de sin beca
        return categoriaPrograma["sin-beca"] || 0;
    }
    return 0;
}

// Función para actualizar precios en la tabla
function actualizarPrecios() {
    if (!arancelesData) return;
    const precios = document.querySelectorAll('.precio');
    precios.forEach(precioElemento => {
        const id = precioElemento.getAttribute('data-id');
        const precioActual = getPrecioActual(id);
        precioElemento.textContent = `₡${precioActual.toLocaleString('es-CR')}`;
    });
    // Actualizar también los precios de los items seleccionados si cambian
    itemsSeleccionados.forEach(item => {
        const precioUnitario = getPrecioActual(item.id);
        const nuevaCantidad = item.cantidad;
        item.precioUnitario = precioUnitario;
        item.total = precioUnitario * nuevaCantidad;
    });
    actualizarResumen();
    recalcularTotal();
}

// Función para mostrar mensaje especial según beca
function mostrarMensajeBeca() {
    const tipoBeca = document.querySelector('input[name="tipo-beca"]:checked').value;
    const becaMensaje = document.getElementById('beca-mensaje');
    let mensaje = '';
    let clase = '';

    if (arancelesData && arancelesData.becas_exentas.includes(tipoBeca)) {
        mensaje = `Los estudiantes con beca ${tipoBeca.toUpperCase()} tienen exención del 100% en todos los aranceles de materias`;
        clase = 'beca-mensaje-especial';
    }

    becaMensaje.innerHTML = mensaje ? `<div class="${clase}">${mensaje}</div>` : '';
}

// Función para pluralizar conceptos
function pluralizarConcepto(concepto, cantidad) {
    if (cantidad === 1) return concepto;
    const plurales = {
        'Asignatura regular': 'Asignaturas regulares',
        'Asignatura con laboratorio': 'Asignaturas con laboratorio',
        'Asignatura con gira de campo': 'Asignaturas con gira de campo',
        'Asignatura con lab. y gira': 'Asignaturas con lab. y gira',
        'Asignatura repetida': 'Asignaturas repetidas',
        'Repetida con laboratorio': 'Repetidas con laboratorio',
        'Práctica/Proyecto/Tesis': 'Prácticas/Proyectos/Tesis',
        'Laboratorios (independientes)': 'Laboratorios (independientes)'
    };
    return plurales[concepto] || concepto;
}

// Función para actualizar resumen de selección
function actualizarResumen() {
    const listaSeleccion = document.getElementById('lista-seleccion');
    if (!listaSeleccion) return;

    listaSeleccion.innerHTML = '';
    if (itemsSeleccionados.length === 0) {
        listaSeleccion.innerHTML = '<p>No hay items seleccionados</p>';
        return;
    }

    const ul = document.createElement('ul');
    itemsSeleccionados.forEach(item => {
        const li = document.createElement('li');
        const conceptoPluralizado = pluralizarConcepto(item.nombre, item.cantidad);
        const precioFormateado = item.precioUnitario.toLocaleString('es-CR');
        const totalFormateado = item.total.toLocaleString('es-CR');

        if (item.cantidad > 1) {
            li.textContent = `${item.cantidad} ${conceptoPluralizado}: ₡${precioFormateado} × ${item.cantidad} = ₡${totalFormateado}`;
        } else {
            li.textContent = `${item.cantidad} ${conceptoPluralizado}: ₡${totalFormateado}`;
        }
        ul.appendChild(li);
    });
    listaSeleccion.appendChild(ul);
}

// Función para recalcular total a pagar
function recalcularTotal() {
    const tipoBeca = document.querySelector('input[name="tipo-beca"]:checked').value;
    const totalPagar = document.getElementById('total-pagar');
    if (!totalPagar) return;

    let total = 0;

    if (arancelesData && arancelesData.becas_exentas.includes(tipoBeca)) {
        total = 0;
    } else {
        itemsSeleccionados.forEach(item => {
            total += item.total;
        });
    }

    totalPagar.textContent = `₡${total.toLocaleString('es-CR')}`;
}

// --- Fin NUEVO ---

// Función para inicializar el buscador (ejemplo de cómo integrar nuevas funcionalidades)
function inicializarBuscador() {
    // ... (lógica del buscador si aplica)
}

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar funcionalidades existentes si es necesario aquí
    // contraerTodosLosGrupos(); // Si se necesita en todas las páginas
    // inicializarBuscador(); // Si se necesita en todas las páginas
});

// ===== MODO OSCURO =====
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Actualizar el estado del checkbox
    const checkbox = document.getElementById('checkbox');
    if (checkbox) {
        checkbox.checked = newTheme === 'dark';
    }
}

// Cargar tema guardado al iniciar
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const checkbox = document.getElementById('checkbox');
    if (checkbox) {
        checkbox.checked = savedTheme === 'dark';
    }
}

// Inicializar tema cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
});
