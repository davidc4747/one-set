import moment from "moment";
import {
    EXERCISE_DEFAULT,
    Exercise,
    addExercise,
} from "../../src/utils/exerciseService";
import { clearHistory } from "../../src/utils/historyService";

/* ======================== *\
    #Full History
\* ======================== */

beforeEach(function () {
    cy.visit("/history");
    clearHistory();
});

it("Should Display a message for Empty History", function () {
    cy.findAllByTestId("history-item").should("not.exist");
    cy.findByTestId("history-not-found").should("exist");
});

it("Should group exercise of the same name together", function () {
    const ex = EXERCISE_DEFAULT["Squat"];
    const history: Exercise[] = [
        { ...ex, datetime: moment().toDate() },
        { ...ex, datetime: moment().toDate() },
        { ...ex, datetime: moment().toDate() },
        { ...ex, datetime: moment().toDate() },
    ];
    addExercise(history);
    cy.findAllByTestId("history-item").should("have.length", 1);
    cy.findAllByTestId("history-item").invoke("text").should("include", 4);
});

it("Should display full history", function () {
    const ex = EXERCISE_DEFAULT["Squat"];
    const history: Exercise[] = [
        { ...ex, datetime: moment().toDate() },
        { ...ex, datetime: moment().toDate() },
        { ...ex, datetime: moment().toDate() },
        { ...ex, datetime: moment().toDate() },
        { ...ex, datetime: moment().subtract(1, "day").toDate() },
        { ...ex, datetime: moment().subtract(2, "day").toDate() },
        { ...ex, datetime: moment().subtract(2, "day").toDate() },
        { ...ex, datetime: moment().subtract(14, "day").toDate() },
        { ...ex, datetime: moment().subtract(21, "day").toDate() },
        { ...ex, datetime: moment().subtract(24, "day").toDate() },
        { ...ex, datetime: moment().subtract(1, "month").toDate() },
        { ...ex, datetime: moment().subtract(2, "month").toDate() },
        { ...ex, datetime: moment().subtract(1, "year").toDate() },
        { ...ex, datetime: moment().subtract(2, "year").toDate() },
    ];
    addExercise(history);
    cy.findAllByTestId("history-item").should("have.length", 10);
});

it("Should sort history in descending order", function () {
    const history: Exercise[] = [
        {
            ...EXERCISE_DEFAULT["OHP"],
            datetime: moment().subtract(2, "day").toDate(),
        },
        { ...EXERCISE_DEFAULT["Squat"], datetime: moment().toDate() },
        {
            ...EXERCISE_DEFAULT["Row"],
            datetime: moment().subtract(1, "day").toDate(),
        },
    ];
    addExercise(history);

    cy.findAllByTestId("history-group").should("have.length", 3);
    cy.findAllByTestId("history-item").should("have.length", history.length);
});

it("Should allow user to remove individual Items form history", function () {
    const ex = EXERCISE_DEFAULT["Squat"];
    const history: Exercise[] = [
        { ...ex, datetime: moment().toDate() },
        { ...ex, datetime: moment().toDate() },
        { ...ex, datetime: moment().toDate() },
        { ...ex, datetime: moment().toDate() },
    ];
    addExercise(history);
    cy.findByTestId("remove").click();
    cy.findAllByTestId("history-item").should("have.length", 1);
    cy.findAllByTestId("history-item").invoke("text").should("include", "3x");
});
