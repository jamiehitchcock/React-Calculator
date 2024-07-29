import { useReducer, useEffect } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import classes from './styles/Root.module.scss';

// set actions to change state
export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

// declare reducer to manage state of calculations, {actions that are broken into type and payload}, to be passes into useReducer
function reducer(state, { type, payload }) {

  // console.log("STATE =", state);
  // console.log("TYPE =", type);
  // console.log("PAYLOAD = ", payload);

  // read through actions object by type to return a new state object
  switch (type) {
    case ACTIONS.ADD_DIGIT:

      // change the current operant to the current digit to overwrite after evaluation
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }

      // if minusNext then change number to negative and reset minusNext to false
      if (state.minusNext) {
        return {
          ...state,
          currentOperand: `-${payload.digit}`,
          minusNext: false,
        }
      }

      // prevent more than one zero at start
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }

      // prevent adding more than one decimal
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }
      // pass through current state using spread, return current operand with payload digit on the end
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }

    case ACTIONS.CHOOSE_OPERATION:
      // do nothing when first choosing operand with no previous operand
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }

      // if you have a number and operation, then select minus operation it will apply minus to following digit
      if (state.currentOperand == null && payload.operation === "-") {
        return {
          ...state,
          minusNext: true,
        }
      }

      // if you have a number and operation, then select another operation it will overwrite operation only
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          minusNext: false,
        }
      }

      // if we have a current operand but no previous operand, change current to previous operand
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }

      // default action if we have a previous operand and a current operand, then we choose another operand, it should carry out the calculation
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }

    case ACTIONS.CLEAR:
      // return empty state on clear
      return {
        ...state,
        currentOperand: "0",
        previousOperand: null,
        operation: null,
        minusNext: null,
      }

    case ACTIONS.DELETE_DIGIT:
      // reset if overwrite
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: "0",
          minusNext: null
        }
      }

      // do nothing if nothing to delete
      if (state.currentOperand == null || state.currentOperand == "0") return state;

      // if only one digit length then remove current operand rather than leave as empty string
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: "null",
          minusNext: null
        }
      }

      // as default remove last digit from current operand
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }

    case ACTIONS.EVALUATE:
      // if missing operation or an operand then do nothing
      if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
        return state
      }

      // as default return evalation only and set overwrite to true
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }
  }
}

// main calculation function
function evaluate({ currentOperand, previousOperand, operation }) {
  // set current and previous as numbers
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  // no calculation required
  if (isNaN(prev) || isNaN(current)) return "";

  let computation = "";

  switch (operation) {
    case "+":
      computation = prev + current;
      break
    case "-":
      computation = prev - current;
      break
    case "*":
      computation = prev * current;
      break
    case "÷":
      computation = prev / current;
      break
  }
  return computation.toString();
}

// format integer only with no fractions
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0
})

function formatOperand(operand) {
  if (operand == null) return;
  // split operand into integer and decimal for formatting
  const [integer, decimal] = operand.split('.');
  if (decimal == null) {
    return INTEGER_FORMATTER.format(integer)
  }
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  //state variables for rendering, reducer function, {} = default state
  const [{ currentOperand, previousOperand, operation, minusNext }, dispatch] = useReducer(reducer, {
    // set to zero on load
    currentOperand: "0",
    previousOperand: null,
    operation: null,
    minusNext: null,
  });

  // keyboard functionality that listens to key press and clicks the relevant button
  useEffect(() => {
    function handleKeyDown(e) {
      // console.log(e.key);

      switch (e.key) {
        case "1":
          document.getElementById("one").click();
          break
        case "2":
          document.getElementById("two").click();
          break
        case "3":
          document.getElementById("three").click();
          break
        case "4":
          document.getElementById("four").click();
          break
        case "5":
          document.getElementById("five").click();
          break
        case "6":
          document.getElementById("six").click();
          break
        case "7":
          document.getElementById("seven").click();
          break
        case "8":
          document.getElementById("eight").click();
          break
        case "9":
          document.getElementById("nine").click();
          break
        case "0":
          document.getElementById("zero").click();
          break
        case "+":
          document.getElementById("add").click();
          break
        case "-":
          document.getElementById("subtract").click();
          break
        case "*":
          document.getElementById("multiply").click();
          break
        case "/":
          document.getElementById("divide").click();
          break
        case "Enter":
          document.getElementById("equals").click();
          break
        case "Backspace":
          document.getElementById("del").click();
          break
        case "Delete":
          document.getElementById("clear").click();
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className={classes.container}>
        <div className={classes.calculator}>
          <div id="display" className={classes.calculator__display}>
            <div className={classes.calculator__display__previousOperand}>{formatOperand(previousOperand)} {operation}</div>
            <div className={classes.calculator__display__currentOperand}>{minusNext ? "-" : ""}{formatOperand(currentOperand)}</div>
          </div>
          <button id='clear' className={`${classes.spanTwo} ${classes.ac}`} onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
          <button id='del' className={classes.del} onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
          <OperationButton id="divide" operation="÷" dispatch={dispatch} />
          <DigitButton id="one" digit="1" dispatch={dispatch} />
          <DigitButton id="two" digit="2" dispatch={dispatch} />
          <DigitButton id="three" digit="3" dispatch={dispatch} />
          <OperationButton id="multiply" operation="*" dispatch={dispatch} />
          <DigitButton id="four" digit="4" dispatch={dispatch} />
          <DigitButton id="five" digit="5" dispatch={dispatch} />
          <DigitButton id="six" digit="6" dispatch={dispatch} />
          <OperationButton id="add" operation="+" dispatch={dispatch} />
          <DigitButton id="seven" digit="7" dispatch={dispatch} />
          <DigitButton id="eight" digit="8" dispatch={dispatch} />
          <DigitButton id="nine" digit="9" dispatch={dispatch} />
          <OperationButton id="subtract" operation="-" dispatch={dispatch} />
          <DigitButton id="decimal" digit="." dispatch={dispatch} />
          <DigitButton id="zero" digit="0" dispatch={dispatch} />
          <button id='equals' className={`${classes.spanTwo} ${classes.equals}`} onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
        </div>
      </div>
    </>
  )
}

export default App