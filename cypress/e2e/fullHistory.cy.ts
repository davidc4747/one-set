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
    for (const exercise of history) {
        await addExercise(exercise);
    }
    // for (let i = 0; i < 4; i++) {
    //     const exercise = { ...(await getNextExercise()) };
    //     history.push(exercise);
    //     await addExercise(exercise);
    // }

    cy.visit("/history");
    cy.findByTestId("full-history")
        .children()
        .should("have.length", history.length);
    cy.findByTestId("full-history").invoke("text").should("not.be.undefined");

    // Date format should be
});

it("Should clear exercise history", function () {
    cy.visit("/");
    cy.findByTestId("complete-set").click();
    cy.findByTestId("complete-set").click();
    cy.findByTestId("complete-set").click();
    cy.contains(/full history/gi).click();

    cy.findByTestId("full-history")
        .children()
        .should("have.length.greaterThan", 1);
    cy.contains(/clear/gi).click();
    cy.findByTestId("full-history").children().should("have.length", 1);
});
