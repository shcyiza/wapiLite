/* eslint-disable consistent-return,no-console */
import moment from "moment";

const required = function (value) {
    if (!value) return "required";
};

const requiredMulti = function (value) {
    if (value.length < 1) return "required";
};

const selectMultiMin = function (value, expected) {
    if (value.length < expected) return "min";
};

const selectMultiMax = function (value, expected) {
    if (value.length > expected) return "max";
};

const Validators = {
    text: {
        required,
        regEx(value, expected) {
            const regex_tester = new RegExp(expected);
            if (!regex_tester.test(value)) return "regEx";
        },
        email(value) {
            const regex_tester = new RegExp(
                /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/ig,
            );
            if (!regex_tester.test(value)) return "email";
        },
        max(value, expected) {
            if (value.length > expected) return "max";
        },
        min(value, expected) {
            if (value.length <= expected) return "min";
        },
    },
    date: {
        required(value) {
            if (!value || value === "Invalid date") return "required";
        },
        max(value, expected) {
            const max = moment(expected, "YYYYMMDD").format("YYYYMMDD");
            if (max === "Invalid date" || Number(max) < Number(value)) return "max";
        },
        min(value, expected) {
            const min = moment(expected, "YYYYMMDD").format("YYYYMMDD");
            const formatted_value = moment(value, "YYYY-MM-DD").format("YYYYMMDD");
            if (min === "Invalid date" || Number(min) > Number(formatted_value)) return "min";
        },
    },
    select: {
        required,
    },
    checkbox: {
        mustOptIn: (value) => {
            if (!value) return "mustOptIn";
        },
    },
    dropdown: {
        required,
    },
    multiSelect: {
        required: requiredMulti,
        min: selectMultiMin,
        max: selectMultiMax,
    },
    lookup: {
        required,
    },
    number: {
        required,
        max(value, expected) {
            if (Number(value) > expected) return "max";
        },
        min(value, expected) {
            if (Number(value) <= expected) return "min";
        },
        invalidNumbers(value, expected) {
            if (expected.includes(Number(value))) return "invalidNumbers";
        },
    },
};

export default function validateInput(value, type, validators_array) {
    const input_type = Validators[type];

    if (input_type) {
        const errors = [];

        validators_array.forEach((validator) => {
            const validationMethod = Validators[type][validator.validate];

            if (validationMethod) {
                const current_error = validationMethod(value, validator.expected);
                if (current_error) errors.push(current_error);
            } else {
                console.log(Error(`input type ${validator.validate} is not a valid on type ${type}. Choose one of the following: ${Object.keys(input_type)}`));
            }
        });
        return errors;
    }
    // else
    console.log(Error(`input validation type ${type} is not a valid on. Choose one of the following: ${Object.keys(Validators)}`));
}
