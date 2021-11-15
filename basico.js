function borrar_str(cad, index){
  let new_cad = "";
  if (index <= cad.length || index >= 0){
    for (i=0; i<cad.length; i++){
      if (i != index){
        new_cad += cad[i];
      }
    }
    return new_cad;
  }
  else{
    return cad;
  }
  
}
// Función para quitar $ del string
function modif_str(cad, symbol){
  let new_cad = ""
  for (let x of cad){
    if (x != symbol){
      new_cad += x;
    }
  }
  return new_cad;

}

function setCursorPosition(ctrl, pos) {
    if (ctrl.setSelectionRange) {
      ctrl.focus();
      ctrl.setSelectionRange(pos, pos);
    }
}      

function evento_datos(elem){
  for (let x of elem){
    
    x.addEventListener("click",function(event){
        event.preventDefault();
        // Detectar si el valor de ans, está presente.
        let num_ans = buscar_char(letrero.value,"Ans");
                
        if (num_ans.length != 0){
          resultado = letrero.value;
          console.log(cont_let);
          console.log(resultado);
          resultado = resultado.slice(0,cont_let) + x.id + resultado.slice(cont_let, resultado.length);
          
        }
        else{
          resultado = letrero.value;
          console.log(cont_let);
          console.log(resultado);
          //cont_let = letrero.value.length;
          resultado = resultado.slice(0,cont_let) + x.id + resultado.slice(cont_let,letrero.value.length);
          
        }
        
        letrero.value = resultado;
        
        cont_let++;
        console.log(cont_let)
        

        p_result.innerText = resultado;
        contenedor = document.getElementById("container")
        tabla = document.querySelector("table")
        contenedor.insertBefore(p_result,tabla);
    })
  }
}

function calcular_resultado(event){
  event.preventDefault();
  // Modificamos el texto que está dentro del letrero.
  let cad = letrero.value;

  //let result = calculo(letrero.value);
  let result = eval_signos_agrup(cad);

  p_result.innerText = result;
  console.log(isFinite(result))
  // Guardamos el dato para cuando se solicite el botón ans.
  if (result != "Error de sintaxis" && isFinite(result)){
    ultimo_dato = result;
    almacenar_sesionstorage(result);

  }
  // Guardamos los resultados en el SesionStorage.
  
  
  //contenedor = document.getElementById("container")
  //tabla = document.querySelector("table")
  //contenedor.insertBefore(p_result,tabla);

}

function mostrar_ultimo_dato(event){
  event.preventDefault();
  letrero.value += "Ans";
  p_result.innerText = ultimo_dato;
  cont_let = letrero.value.length;
}

function cursor_oper(symbol,sense){
  
  //console.log(num_esp);

  if (sense == "izq"){
    // Buscamos si delante del cursor existe alguna operación de más de 3 carácteres.
    let oper = ident_oper(letrero.value,cont_let,symbol);
    console.log(oper)
    if (oper.length == 0){
      cont_let--;
    }
    else{
      cont_let = cont_let - oper.length;
    }

  }
  if (sense == "der"){
    let oper = ident_oper_der(letrero.value,cont_let,symbol);
    console.log(oper)
    if (oper.length == 0){
      cont_let++;
    }
    else{
      cont_let = cont_let + oper.length;
    }

  }

}

function borrar_oper_largas(symbol){
  // Encontrar la operación que está delande del cursor.
  let oper = ident_oper(letrero.value,cont_let,symbol);
  if (oper.length == 0){
    letrero.value = borrar_str(letrero.value,cont_let-1);
    cont_let--;
  }
  else{
    letrero.value = letrero.value.slice(0,cont_let-oper.length) + letrero.value.slice(cont_let,letrero.value.length);
    cont_let = cont_let - oper.length;
  }
}
  
function evento_operaciones(elem){
  for (let x of elem){
    
    x.addEventListener("click",function(event){
        event.preventDefault();

        // Detectar si el valor de ans, está presente.
        let num_ans = buscar_char(letrero.value,"Ans");
        let valor = x.id;
        // Detectar si se pone el botón de potencia.
        if(valor == "^2" || valor == "^3" || valor == "^" || valor == "*10^"){
          if (num_ans.length != 0){
            console.log("Existe ans")
            resultado = letrero.value;
            
            console.log(cont_let);
            resultado = resultado.substring(0,cont_let) + x.id + resultado.substring(cont_let, resultado.length);
            console.log(resultado);
          }
          else{
            resultado = resultado.slice(0,cont_let) + x.id +resultado.slice(cont_let,letrero.value.length);
          }

        }
        else{
          if (num_ans.length != 0){
            console.log("Existe ans")
            resultado = letrero.value;
            
            console.log(cont_let);
            resultado = resultado.substring(0,cont_let) + x.id + "(" + resultado.substring(cont_let, resultado.length);
            console.log(resultado);
          }
          else{
            resultado = resultado.slice(0,cont_let) + x.id + "("+resultado.slice(cont_let,letrero.value.length);
          }

        }
        
        
        letrero.value = resultado;
        introducir_text_letrero(x);
        cont_let = letrero.value.length;
        console.log(cont_let)
        

        p_result.innerText = resultado;
        contenedor = document.getElementById("container")
        tabla = document.querySelector("table")
        contenedor.insertBefore(p_result,tabla);
    })
  }
}

function redondear(numero, digitos){
  let base = Math.pow(10, digitos);
  let entero = Math.round(numero * base);
  return entero / base;
}

function revisar_grados(num,oper){
  let oper_trigon = ["sin","cos","tan"];
  // revisar si el radio button está en modo degrade o radianes.
  let deg = document.getElementById("deg");
  for (let x of oper_trigon){
    if (oper == x && deg.checked){
      num = num * (Math.PI/180)
    }
  }
  return num;
}

function revisar_grados_inv(num,oper){
  let oper_trigon_inv = ["asin","acos","atan"];
  // revisar si el radio button está en modo degrade o radianes.
  let deg = document.getElementById("deg");
  for (let x of oper_trigon_inv){
    if (oper == x && deg.checked){
      num = num * (180/Math.PI)
    }
  }
  return num;
}

// redondear un número cuando el primer decimal está lejos del punto decimal.
function redondear_num(num, limit){
  // Convertimos el número a un string.
  let str =  num.toString();
  let punto = false;
  let cont = 0;
  for (let i=0;i<str.length-1;i++){
    // verificamos que exista un punto decimal.
    if (str[i] == "."){
      console.log("es numero decimal")
      punto = true;
    }
    // en caso que exista un número decimal, revisamos los ceros.
    if (punto && str[i] == "0" && str[i+1] == "0"){
      cont++;
      if (cont == limit){
        let num1 = str.substring(0,i-limit+1);
        return Number(num1)
        
      }
    }

  }
  return num;

}

function almacenar_sesionstorage(num){
  // Revisamos si el valor está almacenado.
  let cond_alm = false;
  for (let i=0;i<sessionStorage.length;i++){
    let dato_result = sessionStorage.getItem(i);
    
    if (dato_result == num){
      cond_alm = true;
      console.log("dato repetido");
    }
  }
  
  if (!cond_alm){
    console.log("guardar dato");
    sessionStorage.setItem(cont_result,num);
    cont_result++;
  }
  
  // Mostrar datos almacenados.
  for(let i=sessionStorage.length-1;i>=0;i--){
    
    let dato_result = sessionStorage.getItem(i);
    
    let opt_val = document.getElementsByClassName(dato_result.toString())[0];
    console.log(opt_val);
    if (opt_val == null){
      let opt = document.createElement("option");
      opt.className = dato_result.toString(); 
      opt.value = dato_result;
      opt.innerText = dato_result.toString();
      opt.selected = "selected";
      
      let select = document.getElementById("datos_alm");
      if (i==sessionStorage.length-1){
        console.log(opt_val);
        select.appendChild(opt);
      }
      else{
        let opt_prev = document.querySelector("option");
        select.insertBefore(opt,opt_prev);
      }
    }
  }
}

// Función para introducir texto en el letrero
function introducir_text_letrero(elem){
  let tit_oper = {"raizn":"formato: n raizn(x)","raiz2":"formato: raiz2(x)","raiz3":"formato: raiz3(x)","log":"formato: log(x)"}
  for (let i in tit_oper){
      if (i==elem.id){
          letrero.setAttribute("placeholder",tit_oper[i])
      }
  }
}
