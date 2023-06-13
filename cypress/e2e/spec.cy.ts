import moment from "moment";
import {
    Exercise,
    EXERCISE_DEFAULT,
    addExercise,
} from "../../src/utils/exerciseService";
import { clearHistory } from "../../src/utils/historyService";

beforeEach(function () {
    cy.visit("/");

    // NOTE: This IndexedDB is specific to the Cypress Browser
    //      so clearing the full DB won't have any effect any user's actual data
    clearHistory();
});

it("Should Add completed exercises to history", () => {
    cy.findByTestId("complete-set").click();
    cy.findByTestId("exercise-history")
        .children()
        .should("have.length.above", 0);
});

it("Should Increment & Decrement Exercise Weight", function () {
    // Wait for React to finish Rendering
    cy.findByTestId("exercise").contains(/\w/);

    function getWeightValue() {
        return cy
            .findByTestId("weight")
            .invoke("text")
            .then(function parseWeightValue(str: string): number {
                const val = str.replaceAll(/\D/g, "").trim();
                return val ? Number(val) : 0;
            });
    }

    getWeightValue().then(function (initialValue) {
        // Increase
        cy.findByTestId("increase").click();
        getWeightValue().should("be.above", initialValue);

        // Decrease
        cy.findByTestId("decrease").click();
        cy.findByTestId("decrease").click();
        getWeightValue().should("be.below", initialValue);
    });
});

it("Should select a random Exercise", function () {
    // Wait for React to finish Rendering
    cy.findByTestId("exercise").contains(/\w/);
    cy.findByTestId("exercise")
        .invoke("text")
        .then((exercise) => exercise)
        .as("initalExercise");

    cy.findByTestId("shuffle").click();
    cy.get("@initalExercise").then(function (initalExercise) {
        cy.findByTestId("exercise")
            .invoke("text")
            .should("not.equal", "")
            .should("not.contain", initalExercise);
    });
});

it("Should allow user to manually select an exercise", function () {
    // Wait for React to finish Rendering
    cy.findByTestId("exercise").contains(/\w/);

    const selectedExercise = "Row";

    cy.findByTestId("exercise")
        .invoke("text")
        .then((exercise) => exercise)
        .as("initalExercise");

    cy.contains("Select").click();
    cy.contains(selectedExercise).click();

    cy.get("@initalExercise").then(function (initalExercise) {
        cy.findByTestId("exercise")
            .invoke("text")
            .should("not.equal", "")
            .should("not.contain", initalExercise)
            .should("equal", selectedExercise);
    });
});

it("Should display the most recent Set at the top", function () {
    const history: Exercise[] = [
        {
            ...EXERCISE_DEFAULT["OHP"],
            datetime: moment().subtract(2, "hours").toDate(),
        },
        { ...EXERCISE_DEFAULT["Squat"], datetime: moment().toDate() },
        {
            ...EXERCISE_DEFAULT["Row"],
            datetime: moment().subtract(1, "hours").toDate(),
        },
    ];
    addExercise(history);

    cy.findByTestId("exercise-history")
        .children()
        .eq(0)
        .invoke("text")
        .should("include", "Squat");
});
it("Should only display the History for today", function () {
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
    cy.findByTestId("exercise-history").children().should("have.length", 1);
});
