class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
  }

  clear() {
    this.currentOperand = "";
    this.previousOperand = "";
    this.operation = undefined;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (!this.computed) {
      if (number === "." && this.currentOperand.includes(".")) return;
      this.currentOperand = this.currentOperand.toString() + number.toString();
    } else if (this.computed && this.operation == undefined) {
      this.clear();
      this.computed = false;
      if (number === "." && this.currentOperand.includes(".")) return;
      this.currentOperand = this.currentOperand.toString() + number.toString();
    } else if (this.computed && this.operation != undefined) {
      this.computed = false;
      if (number === "." && this.currentOperand.includes(".")) return;
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
  }

  chooseOperation(operation) {
    if (this.currentOperand === "") return;
    if (this.previousOperand !== "") {
      this.compute();
      this.computed = false;
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch(this.operation) {
      case '+':
        computation = prev+current;
        break;
      case '-':
        computation = prev-current;
        break;
      case '*':
        computation = prev*current;
        break;
      case '÷':
        computation = prev/current;
        break;
      default:
        return;
    }
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = '';
    this.computed = true;
  }
  
  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }
  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplayNumber(
      this.currentOperand
    );
    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = "";
    }
  }
}

const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-all-clear]");
const previousOperandTextElement = document.querySelector(
  "[data-previous-operand]"
);
const currentOperandTextElement = document.querySelector(
  "[data-current-operand]"
);

const calculator = new Calculator(
  previousOperandTextElement,
  currentOperandTextElement
);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

allClearButton.addEventListener("click", () => {
  calculator.clear();
  calculator.updateDisplay();
});

equalsButton.addEventListener("click", () => {
  calculator.compute();
  calculator.updateDisplay();
});

deleteButton.addEventListener("click", () => {
  calculator.delete();
  calculator.updateDisplay();
});

//Keyboard support

document.addEventListener("keydown", (keyPressed) => {
  if (
    (keyPressed.keyCode >= 48 && keyPressed.keyCode <= 57) ||
    (keyPressed.keyCode >= 96 && keyPressed.keyCode <= 105) ||
    keyPressed.keyCode === 190 ||
    keyPressed.keyCode === 110
  ) {
    calculator.appendNumber(keyPressed.key);
    calculator.updateDisplay();
  } else if (
    keyPressed.keyCode === 106 ||
    keyPressed.keyCode === 109 ||
    keyPressed.keyCode === 107
  ) {
    calculator.chooseOperation(keyPressed.key);
    calculator.updateDisplay();
  } else if (keyPressed.keyCode === 111) {
    calculator.chooseOperation("÷");
    calculator.updateDisplay();
  } else if (keyPressed.keyCode === 27) {
    calculator.clear();
    calculator.updateDisplay();
  } else if (keyPressed.keyCode === 13) {
    calculator.compute();
    calculator.updateDisplay();
  } else if (keyPressed.keyCode === 8) {
    calculator.delete();
    calculator.updateDisplay();
  }
});
