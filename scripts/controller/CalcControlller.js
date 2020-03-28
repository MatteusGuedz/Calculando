class  CalcController {
    constructor(){
       this._audio = new Audio('click.mp3');
       this._audioOnOff = false;
       this._lastOperator  =  ''; 
       this._lastNumber = '';
       this._operation = [];  
       this._locale = 'pt-BR' ;
       this._displayCalcEl = document.querySelector("#display");
       this._dateEl = document.querySelector("#data");
       this._timeEl =  document.querySelector("#hora");
        
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyBoard();
        this.pasteFromClipBird();
    }

    
   //copiar ctrl+c
    copyToClipBoard(){
        let input = document.createElement('input');
        input.value = this.displayCalc;
        document.body.appendChild(input);
        input.select();
        document.execCommand('Copy');
        input.remove();

    }

    //copiar ctrl+v
    pasteFromClipBird(){
        document.addEventListener('paste', e => {
           let text = e.clipboardData.getData('Text');
           this.displayCalc = parseFloat(text)
           
        });
    }

//eventos que começam quando a acalculadora inicia

    initialize(){
        this.setDisplayDateTime();

        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);

        this.setLasNumberToDisplay();
        this.pasteFromClipBird();

        document.querySelectorAll('.btn-ac').forEach(btn => {
            btn.addEventListener('dblclick', e => {
                this.toggleAudio();
            });
        });
    }


    toggleAudio(){

        this._audioOnOff = !this._audioOnOff;
  
        // this._audioOnOff = (this._audioOnOff) ? false : true;

        // if (this._audioOnOff){
        //     this._audioOnOff = false;
        // }else {
        //     this._audioOnOff = true;
        // }
    }

    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();

        }
    }
    
    
 
 

   

getLastOperation(){
   return  this._operation[this._operation.length-1];
    
}

setLastOperation(value){
    this._operation[this._operation.length-1] = value;

}

isOperator(value){
    return (['+','-','*','%', '/' ].indexOf(value) > -1 );
    
}   

//metodo que vai ser usado no addOperation 2x
pushOperation(value){
    this._operation.push(value);

    if (this._operation.length > 3){

        this.calc();
       
    }
}

getResult(){
  
   try {
       return eval(this._operation.join(""));

    } catch(err){

        setTimeout(() => {
            this.setError()
        },1000)
       
    }
}

calc(){

    let last = '';
    this._lastOperator = this.getLastItem();
    if(this._operation.length < 3){
        let firstItem = this._operation[0];
        this._operation = [firstItem, this._lastOperator, this._lastNumber];
    }

    if(this._operation.length > 3){
         last = this._operation.pop();
         this._lastNumber = this.getResult(); 

    } else if(this._operation.length == 3){
         this._lastNumber = this.getLastItem(false); 
    }
    

        let result = this.getResult();
    if(last == '%'){
            result /= 100;
            this._operation = [result];
    } else {
        
        this._operation = [result];
        if (last) this._operation.push(last);

    }

  
   this.setLasNumberToDisplay();
}

getLastItem(isOperator = true){
    let lastItem;
    for( let i = this._operation.length-1;  i >= 0; i-- ){

        if (this.isOperator(this._operation[i]) == isOperator){
            lastItem = this._operation[i];
            break; 
        }
        
    }
    if(!lastItem){
        lastItem = (isOperator) ? this._lastOperator: this._lastNumber;
    }
    return lastItem;
}

setLasNumberToDisplay(){
    let  lastNumber = this.getLastItem(false);
   

      if(!lastNumber)  lastNumber = 0;
    this.displayCalc = lastNumber
}


//metodo para colocar valores en un array
addOperation(value){
     
if(isNaN(this.getLastOperation())){ //se não for um numero prossegue ainda nesse if
  
    if(this.isOperator(value)){
        //trocar o operador
        this.setLastOperation(value)
    }else {
            
       
        this.pushOperation(value);
        this.setLasNumberToDisplay();
    }

}else {
  ///number = false
  if(this.isOperator(value)){

      this.pushOperation(value);

  }else {
    let newValue =   this.getLastOperation().toString() + value.toString();
    this.setLastOperation(newValue); 
 
    //atualizar display
    this.setLasNumberToDisplay();

  }
  
    
}


 
}


//do meu switch case clique default
setError(){
    this.displayCalc = "error"
}

 //do meu switch case clique 'ac'
 clearAll(){
    this._operation = [];
    this._lastNumber = '';
    this._lastOperator = '';

    this.setLasNumberToDisplay();
 }

 //do meu switch case clique ce
 clearEntry(){
     this._operation.pop();
     this.setLasNumberToDisplay();
 }
addDot(){   
    let lastOperation  = this.getLastOperation();

    if(typeof lastOperation === 'string' &&  lastOperation.split('').indexOf('.') > -1) return;
    

    if (this.isOperator(lastOperation) || !lastOperation){
        this.pushOperation('0.');
    } else {
        this.setLastOperation(lastOperation.toString() + '.');
    }
    this.setLasNumberToDisplay();
}
    //switch do execBTN abaixo
execBtn(value){
    this.playAudio();
    switch(value){
        case 'ac':
                this.clearAll();
            break;
         
        case 'ce':
            this.clearEntry();
            break;

         case 'soma':
            this.addOperation('+');
            break;

         case 'igual':
                this.calc();
            break;


         case 'multiplicacao':
            this.addOperation('*');
            break;


         case 'divisao':
            this.addOperation('/');
            break;


         case 'subtracao':
            this.addOperation('-');
            break;

         case 'porcento':  
         this.addOperation('%');
         break;  
         
         case 'ponto':
            this.addDot('.');
             break;
         
         case '0':
         case '1':
         case '2':
         case '3':
         case '4':
         case '5':
         case '6':
         case '7':
         case '8':
         case '9':
            this.addOperation(parseInt(value))
         break;
         
        default:
            this.setError();
            break;
            
            
    }
}

//teclas do teclado evnetos
initKeyBoard(){
    
    document.addEventListener('keyup', (e) => {
       this.playAudio(); 
            
            switch(e.key){
                case 'Escape':
                        this.clearAll();
                    break;
                 
                case 'Backspace':
                    this.clearEntry();
                    break;
        
                 case '+':
                 case '-':
                 case '*':
                 case '/':
                 case '%':            
                    this.addOperation(e.key);
                    break;
        
                 case 'Enter':
                 case '=':    
                        this.calc();
                    break;

                 case '.':
                 case ',':    
                    this.addDot('.');
                     break;
                 
                 case '0':
                 case '1':
                 case '2':
                 case '3':
                 case '4':
                 case '5':
                 case '6':
                 case '7':
                 case '8':
                 case '9':
                    this.addOperation(parseInt(e.key))
                 break;

                 case 'c':
                 if( e.ctrlKey) this.copyToClipBoard();
                     
                     break;    
                 
               
                    
                    
            }
    });
    
}


//criação do meu evento para usar nos eventos da calculadora
addEventListenerAll(element, events,fn ){
    events.split(' ').forEach(event => {
        element.addEventListener(event, fn, false);
    })
}

//eveentos da calculadora
    initButtonsEvents(){
       let buttons = document.querySelectorAll('#buttons > g, #parts > g');
            
       buttons.forEach((btn , index)=> {
           this.addEventListenerAll(btn,'click drag',e => {
            let textBtn = btn.className.baseVal.replace("btn-", "");
            this.execBtn(textBtn);

        });

        this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
            btn.style.cursor = "pointer";
        })


       })
    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day:"2-digit",
            month: "long",
            year: "numeric"
        })
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale)
    }


  //  metodos da hora
    get displayTime(){
        this._timeEl.innerHTML;
    }
    set displayTime(value){
        this._timeEl.innerHTML = value;
    }


//metodos dA DATA
    get displayDate(){
        return this._dateEl.innerHTML;
    }
    set displayDate(value){
        return this._dateEl.innerHTML = value;
    }


//METODOS DO VALOR DO DISPLAY DA CALCULARDIA
    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){
        if(value.toString().length > 10){
            this.setError();
            return false;
        }

        this._displayCalcEl.innerHTML = value;

    }

//METODO QUE PEGA A HORA ATUAL E JGA PRI DISPLAY DTAA
    get currentDate(){
        return new Date();
    }

    set currentDate(value){
        this._currentDate = value;
    }
};