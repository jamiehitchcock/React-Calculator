import { ACTIONS } from "./App"

export default function DigitButton({dispatch, digit, id}) {
    return (
        <button
            id={id} onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}>
            {digit}
        </button>
    )
}