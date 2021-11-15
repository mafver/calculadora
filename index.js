// Creamos el contador de resultados que se almacenará en el SesionStorage.
let cont_result = 0; 
sessionStorage.clear();
// Creamos la etiqueta p para mostrar resultados.
let p_result = document.createElement("p");
p_result.id = "resultado";
let resultado = ""

let letrero = document.getElementById("tablero");
// Creamos la variable que calcula el puntero.
let cont_let = 0;

// Seleccionamos los números.
let numeros = document.getElementsByClassName("num");
// Añadimos eventos.
evento_datos(numeros);

// Seleccionamos las operaciones.
let operadores = document.getElementsByClassName("oper")
evento_datos(operadores);

// Seleccionamos las agrupaciones.
let parentesis = document.getElementsByClassName("agrup")
evento_datos(parentesis);

// Seleccionamos las constantes.
let constante = document.getElementsByClassName("constante")
// console.log(constante);
evento_datos(constante);

// Borrar todo
let clear = document.getElementById("clear")
clear.addEventListener("click",function(event){
    event.preventDefault();
    letrero.value = "";
    resultado = "";
    p_result.innerText = "";
    cont_let = 0;
}) 

// Borrar elemento.
let borrar = document.getElementById("backspace")
borrar.addEventListener("click",function(event){
    event.preventDefault();
    // añadimos las operaciones largas.
    let operaciones_calc = ["Ans","sin(","cos(","tan(","log(","ln(","sinh(","sinh(","cosh(","tanh(","asin(","acos(","atan(","exp","exp(","abs(","raiz2(","raiz3(","raizn("];
    // Detectar si el valor del puntero tiene que borrar elementos como ans y otros.
    borrar_oper_largas(operaciones_calc);

    
    resultado = letrero.value;
    p_result.innerText = resultado;
    if (cont_let <= 0){
        cont_let = 0;
    }
}) 

// Boton de derecha, izquierda.
let izq = document.getElementById("izquierda");
let der = document.getElementById("derecha");
console.log(izq);
console.log(der);
izq.addEventListener("click",function(event){
    event.preventDefault();
    let operaciones_calc = ["Ans","sin(","cos(","tan(","log(","ln(","sinh(","sinh(","cosh(","tanh(","asin(","acos(","atan(","exp","exp(","abs("];
    if (cont_let <= 0){
        cont_let = 0;
    }
    else{
        // verificar si la operación que precede la flecha tiene una operación que tiene más de dos espacios.
            cursor_oper(operaciones_calc,"izq")       
    }
    console.log(cont_let)
    setCursorPosition(letrero,cont_let);
})

der.addEventListener("click",function(event){
    event.preventDefault();
    let operaciones_calc = ["Ans","sin(","cos(","tan(","log(","ln(","sinh(","sinh(","cosh(","tanh(","asin(","acos(","atan(","exp","exp(","abs("];
    if (cont_let >= letrero.value.length){
            cont_let = letrero.value.length;
    }
    else{
        // verificar si la operación que precede la flecha tiene una operación que tiene más de dos espacios.
        cursor_oper(operaciones_calc,"der")
    }
    
    console.log(cont_let)
    setCursorPosition(letrero,cont_let);
})

// Boton de igualdad.
let igual = document.getElementById("igual");
let ultimo_dato = 0;
igual.addEventListener("click", calcular_resultado);

// Botón de ans.
let ans = document.getElementById("ans");
ans.addEventListener("click", mostrar_ultimo_dato);

// Botones de funciones trigonométricas.
let bot_trigon = document.getElementsByClassName("oper_trig");
console.log(bot_trigon);
evento_operaciones(bot_trigon);

// Botones de funciones exponenciales.
let bot_exp = document.getElementsByClassName("oper_exp");
console.log(bot_exp);

evento_operaciones(bot_exp);

// Selector de resultados.
let result_anteriores = document.getElementById("datos_alm");
result_anteriores.addEventListener("change",function(){
    // Revisamos que existe la opción option.
    let options = document.getElementsByTagName("option");
    if (options.length != 0 ){
        letrero.value = result_anteriores.value;
        cont_let = letrero.value.length;
    }

})

// Botón de porcentaje.
let porcent = document.getElementsByClassName("porcent")[0];
porcent.addEventListener("click",function(evento){
    evento.preventDefault();
    // Detectar si el valor de ans, está presente.
    let num_ans = buscar_char(letrero.value,"Ans");
        
    if (num_ans.length != 0){
        // existe el valor de ans.
        resultado = letrero.value;
        console.log(cont_let);
        resultado = resultado.substring(0,cont_let) + porcent.id + resultado.substring(cont_let, resultado.length);
        cont_let++;
    }
    else{
        // Verificamos si el letrero no está vacío.
        console.log(letrero.value[letrero.value.length-1]);

        if (letrero.value.length != 0 && !isNaN(Number(letrero.value[letrero.value.length-1]))){
            resultado = letrero.value;
            cont_let = letrero.value.length;
            resultado = resultado.slice(0,cont_let) + porcent.id + resultado.slice(cont_let,letrero.value.length);
            cont_let++;
        }
        
    }
    
    letrero.value = resultado;
    console.log(cont_let)
    
    p_result.innerText = resultado;
    contenedor = document.getElementById("container")
    tabla = document.querySelector("table")
    contenedor.insertBefore(p_result,tabla);
})


