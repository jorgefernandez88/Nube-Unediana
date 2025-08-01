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
