// buscar operaciones en las cadenas.
function select_string_op(cad){
    datos = [];
    oper = [];
    pos = 0;
    result = [];
    // En caso que el primer dígito sea un signo + 0 -.
    let inicio = 0
    if (cad[0] == "+" || cad[0] == "-"){
        inicio = 1;
    }

    for (let i = inicio;i<cad.length;i++){
        // Verificamos si existe la operación de raizn.
        let op_root = "raizn";
        if (i>= op_root.length ){
            console.log(cad.slice(i+1-op_root.length,i+1)); 
            if (cad.slice(i+1-op_root.length,i+1) == op_root){
                console.log("operacion encontrada")
                oper.push(op_root);
                datos.push(Number(cad.slice(pos,i+1-op_root.length)))
                pos = i+1;

            }
            else{
                // Primero verificamos multiplicación y división.
                if (cad[i] == "+" || cad[i] == "-" || cad[i] == "*" || cad[i] == "÷" || cad[i] == "/" || cad[i] == "^" ){
                    if (cad[i+1] == "+" || cad[i+1] == "-"){
                        console.log("operacion doble encontrada")
                        oper.push(cad[i]);
                        datos.push(Number(cad.slice(pos,i)))
                        pos = i+1;
                        // Nos saltamos una posición.
                        i++;
                    }
                    else{
                        console.log("operacion encontrada")
                        oper.push(cad[i]);
                        datos.push(Number(cad.slice(pos,i)))
                        pos = i+1;

                    } 
                }

            }
            

        }
        else{
            // Primero verificamos multiplicación y división.
            if (cad[i] == "+" || cad[i] == "-" || cad[i] == "*" || cad[i] == "÷" || cad[i] == "/" || cad[i] == "^"){
                if (cad[i+1] == "+" || cad[i+1] == "-"){
                    console.log("operacion doble encontrada")
                    oper.push(cad[i]);
                    datos.push(Number(cad.slice(pos,i)))
                    pos = i+1;
                    // Nos saltamos una posición.
                    i++;
                }
                else{
                    console.log("operacion encontrada")
                    oper.push(cad[i]);
                    datos.push(Number(cad.slice(pos,i)))
                    pos = i+1;

                } 
            }

        }

        
    }

    // Añadir el último elemento.
    datos.push(Number(cad.substring(pos,cad.length)))
    result.push(datos);
    result.push(oper);
    return result;
}

function calculo(cad){
   console.log(cad);
   if (cad == "Error de sintaxis"){
       return cad;
   }
   else{
        // Modificamos las constantes.
        let val_const = {"Ans":ultimo_dato,"π":Math.PI, "exp":Math.E, "%":(1/100),"e":"10^"}
        let keys = Object.keys(val_const);
        for (let x of keys){
            cad = change_values(cad,x,val_const[x]); 
        }

        console.log(cad);

        let datos =  select_string_op(cad);
        let num = datos[0];

        let oper = datos[1];
        console.log("Cadena de operación y números")
        console.log(num);
        console.log(oper);
        
        // Realizamos las operaciones en caso que el dato sea multiplicación o división.
        datos = op_pot_mult_div(num,oper,["raizn","*","/","÷"]);
        // console.log(datos);
        // Actualizamos valores.
        num = datos[0];
        oper = datos[1];

        // En caso de que la operación sólo sea de suma o resta.
        result = op_sum_rest(num,oper);
        console.log(result);
        console.log("\n");
        return result;
    }
}

function eval_oper(a,b,symbol){
    result = 0;
    switch(symbol){
        case "+":
            result = a+b;
            break;
        case "-":
            result = a-b;
            break;
        case "*":
            result = a*b;
            break;
        case "/":
            if (a % b == 0){
                result = (a/b);
            }
            else{
                result = (a/b);
            }
            
            break;
        case "÷":
            if (a % b == 0){
                result = (a/b);
            }
            else{
                result = (a/b);
            }
            
            break;
        case "raizn":
                result = Math.pow(b,1/a);
                break;
        case "^":
            result = Math.pow(a,b);
            break;

    }
    // Redondeamos si existen más de 5 ceros luego de la coma decimal.
    result = redondear_num(result,5)
    return result;
}

// Función para buscar el índice de un elemento.
function buscar_char(cad,symbol){
    let index = [];
    if (typeof(symbol) == "string"){
        let num = cad.indexOf(symbol);
        
        while (num != -1){
            // guardamos el dato en el array index.
            index.push(num);
            // actualizamos datos.
            num = cad.indexOf(symbol, num+symbol.length);
        }

    }

    if (typeof(symbol) == "object"){
        for (let j= 0; j < symbol.length; j++){
            // Buscamos el primer elemento.
            let num = cad.indexOf(symbol[j]);
            
            while (num != -1){
                // guardamos el dato en el array index.
                index.push(num);
                // actualizamos datos.
                num = cad.indexOf(symbol[j], num+symbol.length);
                console.log(num)
            }
        }
    }

    return index;
  
}

// Función para modificar el array de números.
function op_pot_mult_div(num,oper,symbol){
    // Buscamos los operandos que tengan la potencia (^)
    let index_pot = buscar_char(oper,"^");
    let result = 0;
    let data = [];

    while(index_pot !=0){
        // realizamos la operación.
        result = eval_oper(num[index_pot[0]], num[index_pot[0]+1], oper[index_pot[0]])
        // Borramos 2 datos a partir de la posición index[i].
        // Borramos 1 operación a partir de la posición index[i].
        num.splice(index_pot[0],2);
        oper.splice(index_pot[0],1);
        // Añadimos el resultado al vector num.
        num.splice(index_pot[0],0,result);
        // Actualizamos indices.
        index_pot = buscar_char(oper,symbol);
        index_pot.sort();
    }

    // Realizamos la operación de multiplicación y división.
    // Buscamos el índice de las operaciones.
    let index = buscar_char(oper,symbol);
    // ordenamos el index.
    index.sort();
    console.log(index);
    // Se evalua primero las potencias.



    while(index.length !=0){
        // realizamos la operación.
        result = eval_oper(num[index[0]], num[index[0]+1], oper[index[0]])
        // Borramos 2 datos a partir de la posición index[i]
        num.splice(index[0],2);
        oper.splice(index[0],1);
        // Añadimos el resultado al vector num.
        num.splice(index[0],0,result);
        // Actualizamos indices.
        index = buscar_char(oper,symbol);
        index.sort();
    }
    data.push(num);
    data.push(oper);
    return data;
}

function op_sum_rest(num,oper){
    result = num[0];
    for (let i=1;i< num.length;i++){
       result = eval_oper(result,num[i],oper[i-1]);
       console.log(result);
    }
    return result;
}

function change_values(cad,cad_busq,value){
    // Verificamos que la opción de ans está habilitada.
   let num_ans = buscar_char(cad,cad_busq);
   
    // modificamos el valor de ans por el último valor.
    // slice a diferencia de substring, crea un nuevo string sin alterar el original.
    let i = 0;
    while (num_ans.length != 0){
        // Actualizamos el valor del array. 
        // 1. Que esté en primera posición.
        // 2. Que esté antes de un (.
        // 3. Que el símbolo anterior sea un número.
        //console.log(num_ans[0])
        if (num_ans[0]+cad_busq.length < cad.length && !isNaN(Number(cad[num_ans[0]+cad_busq.length]))){
            return "Error de sintaxis"
        }

        if (num_ans[0] == 0 || cad[num_ans[0]-1]=="(" || isNaN(Number(cad[num_ans[0]-1]))){
            cad = cad.slice(0,num_ans[0]) + value.toString() + cad.slice(num_ans[0] + cad_busq.length);
        }
        else{
            cad = cad.slice(0,num_ans[0]) + "*" + value.toString() + cad.slice(num_ans[0]+cad_busq.length);
        }
        
        // actualizamos datos.
        num_ans = buscar_char(cad,cad_busq);
        //console.log(cad);
        //console.log(num_ans);
        
    }
    return cad;
}

function eval_signos_agrup(cad){
    // Buscamos los índices de signos de agrupación.
    let ind_op = buscar_char(cad,"(");
    let operaciones_calc = ["sin","cos","tan","log","ln","sinh","sinh","cosh","tanh","asin","acos","atan","exp","abs","raiz2","raiz3"];
    console.log(ind_op);
    
    while (ind_op.length != 0){
        // Seleccionamos la posición del último "("
        let i = ind_op[ind_op.length-1];
        let j = i;
        console.log("Calculando parentesis")

        while (cad[j] != ")"){
            j++;
            
            // En caso que no encuentre la operación.
            if (j >= cad.length){
                break;
            }
        }
        // Calculamos el valor dentro del paréntesis.
        let op1 = cad.slice(i+1,j)
        let num1 = calculo(op1);
        let oper = ident_oper(cad,i,operaciones_calc);
        
        console.log(oper);
        let num2 = oper_especiales(num1,oper);
        // console.log("dato anterior");
        // console.log(cad[i-oper.length-1]);
        console.log(num2);

        if (cad[i-oper.length-1] == ")" || !(isNaN(Number(cad[i-oper.length-1]))) ){
            cad = cad.slice(0,i-oper.length) + "*" + num2 + cad.slice(j+1,cad.length);
        console.log(cad);
        }

        else{
            cad = cad.slice(0,i-oper.length) + num2 + cad.slice(j+1,cad.length);
        }
        
        console.log(cad);
        // Actualizamos la posición de ind_op
        ind_op = buscar_char(cad,"(");
        console.log(ind_op);
    }
    // Evaluamos el resultado final.
    cad = calculo(cad);
    if (isNaN(cad)){
        return "Error Matemático."
    }
    else{
        return cad;    
    }
    
}
function ident_oper(cad, pos,operacion){
    // función para identificar si detras de "(" hay una operación.
    let oper = "";
    for (let x of operacion){
        if (cad.slice(pos-x.length,pos) == x){
            oper = x;
        }
    }
    return oper;
}

function ident_oper_der(cad, pos,operacion){
    // función para identificar si delante del puntero pos hay una operación.
    let oper = "";
    for (let x of operacion){
        if (cad.slice(pos,pos+x.length) == x){
            oper = x;
        }
    }
    return oper;
}


function oper_especiales(num, oper){
    result = 0;
    // Revisamos si la opción de deg está activada.
    num = revisar_grados(num,oper);

    switch(oper){
        case "sin":
            result = Math.sin(num);
            if (num%Math.PI==0){
                result = 0;
            }
            break;
        case "cos":
            result = Math.cos(num);
            console.log(num%(Math.PI)) 
            if (num%(Math.PI) == Math.PI/2){
                result = 0;
            }
            break;
        case "tan":
            result = Math.tan(num);
            // Condicional de múltiplos de pi
            if (num%Math.PI==0){
                result = 0;
            }
            if (num%(Math.PI) == Math.PI/2){
                result = Infinity;
            }

            break;
        case "log":
            result = Math.log10(num);
            break;
        case "ln":
            result = Math.log(num);
            break;
        case "sinh":
            result = Math.sinh(num);
            break;
        case "cosh":
            result = Math.cosh(num);
            break;
        case "tanh":
            result = Math.tanh(num);
            break;
        case "asin":
            result = Math.asin(num);
            break;
        case "acos":
            result = Math.acos(num);
            break;
        case "atan":
            result = Math.atan(num);
            break;
        case "exp":
            result = Math.exp(num);
            break;
        case "abs":
            result = Math.abs(num);
            break;
        case "raiz2":
            result = Math.sqrt(num);
            break;
        case "raiz3":
            result = Math.pow(num,1/3);
            break;
        default:
            result = num;
            break;
    }
    
    // Revisamos si existen las operaciones trigonométricas inversas.
    result = revisar_grados_inv(result,oper);
    // Redondeamos si existen más de 5 ceros luego de la coma decimal.
    result = redondear_num(result,5)
    return result;

}
