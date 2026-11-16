
// ======================================
// SCIENTIFIC CALCULATOR
// JavaScript ES6
// ======================================

const display = document.getElementById("display");
const historyDisplay = document.getElementById("history");
const angleButton = document.getElementById("angleMode");

let expression = "";
let isDegree = true;

// ======================================
// APPEND VALUE
// ======================================

const appendValue = (value) => {

    if (display.value === "Error") {
        expression = "";
    }

    expression += value;
    display.value = expression || "0";
};

// ======================================
// CLEAR DISPLAY
// ======================================

const clearDisplay = () => {

    expression = "";
    display.value = "0";
    historyDisplay.textContent = "";

};

// ======================================
// DELETE LAST CHARACTER
// ======================================

const deleteLast = () => {

    expression = expression.slice(0, -1);
    display.value = expression || "0";

};

// ======================================
// ANGLE MODE
// ======================================

const toggleAngleMode = () => {

    isDegree = !isDegree;

    angleButton.textContent = isDegree ? "DEG" : "RAD";

};

// ======================================
// FACTORIAL
// ======================================

const factorial = (number) => {

    if (!Number.isInteger(number) || number < 0 || number > 170) {
        throw new Error("Invalid factorial");
    }

    let result = 1;

    for (let i = 2; i <= number; i++) {
        result *= i;
    }

    return result;

};

// ======================================
// SCIENTIFIC FUNCTIONS
// ======================================

const scientific = (type) => {

    try {

        const value = Number(expression);

        if (!expression || !Number.isFinite(value)) {
            throw new Error("Invalid input");
        }

        let result;

        switch (type) {

            case "sin":
                result = Math.sin(
                    isDegree ? value * Math.PI / 180 : value
                );
                break;

            case "cos":
                result = Math.cos(
                    isDegree ? value * Math.PI / 180 : value
                );
                break;

            case "tan": {
                const angle = isDegree
                    ? value * Math.PI / 180
                    : value;

                if (Math.abs(Math.cos(angle)) < 1e-12) {
                    throw new Error("Undefined");
                }

                result = Math.tan(angle);
                break;
            }

            case "sqrt":
                result = Math.sqrt(value);
                break;

            case "log":
                result = Math.log10(value);
                break;

            case "ln":
                result = Math.log(value);
                break;

            case "factorial":
                result = factorial(value);
                break;

            case "inverse":
                result = 1 / value;
                break;

            case "percent":
                result = value / 100;
                break;

            case "abs":
                result = Math.abs(value);
                break;

            default:
                throw new Error("Unknown operation");

        }

        if (!Number.isFinite(result)) {
            throw new Error("Math error");
        }

        historyDisplay.textContent = expression + " =";

        expression = String(Number(result.toPrecision(12)));

        display.value = expression;

    } catch (error) {

        display.value = "Error";
        expression = "";

    }

};

// ======================================
// CALCULATE EXPRESSION
// ======================================

const calculate = () => {

    try {

        if (!expression) return;

        const originalExpression = expression;

        // Replace scientific constants
        let safeExpression = expression
            .replace(/pi/g, "Math.PI")
            .replace(/\be\b/g, "Math.E")
            .replace(/\^/g, "**");

        // Allow only calculator syntax
        if (!/^[0-9+\-*/().\sA-Za-z]*$/.test(safeExpression)) {
            throw new Error("Invalid expression");
        }

        // Evaluate expression
        const result = Function(
            `"use strict"; return (${safeExpression})`
        )();

        if (typeof result !== "number" || !Number.isFinite(result)) {
            throw new Error("Math error");
        }

        historyDisplay.textContent = originalExpression + " =";

        expression = String(Number(result.toPrecision(12)));

        display.value = expression;

    } catch (error) {

        display.value = "Error";
        expression = "";

    }

};

// ======================================
// KEYBOARD SUPPORT
// ======================================

document.addEventListener("keydown", (event) => {

    const key = event.key;

    if (/^[0-9.]$/.test(key)) {
        appendValue(key);
    }

    else if (["+", "-", "*", "/", "(", ")", "^"].includes(key)) {
        appendValue(key);
    }

    else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    }

    else if (key === "Backspace") {
        deleteLast();
    }

    else if (key === "Escape") {
        clearDisplay();
    }

});

