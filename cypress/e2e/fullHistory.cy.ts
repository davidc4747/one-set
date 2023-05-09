import moment from "moment";
import {
    EXERCISE_DEFAULT,
    Exercise,
    getNextExercise,
} from "../../src/utils/exerciseService";
import { addExercise, clearHistory } from "../../src/utils/historyService";

/* ======================== *\
    #Full History
\* ======================== */

beforeEach(function () {
    cy.visit("/history");
    clearHistory();
});

it("Should Display a message for Empty History", function () {
    cy.findByTestId("full-history").children().should("have.length", 1);
    cy.findByTestId("full-history").invoke("text").should("not.be.undefined");
});

it.skip("Should display full history", async function () {
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
    await addExercise(history);
});

it("Should clear exercise history", function () {
    const history: Exercise[] = [
        EXERCISE_DEFAULT["Squat"],
        EXERCISE_DEFAULT["Squat"],
    ];
    addExercise(history);

    cy.findByTestId("full-history")
        .children()
        .should("have.length.greaterThan", 1);
    cy.contains(/clear/gi).click();
    cy.findByTestId("full-history").children().should("have.length", 1);
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

    cy.findByTestId("full-history").invoke("text").should("not.be.undefined");
    cy.findByTestId("full-history")
        .children()
        .should("have.length", history.length);
    cy.findByTestId("full-history")
        .children()
        .eq(0)
        .invoke("text")
        .should("include", "OHP");
});
