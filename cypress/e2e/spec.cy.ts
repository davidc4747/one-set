import { clearHistory } from "../../src/utils/historyService";

beforeEach(function () {
    cy.visit("/");

    // NOTE: This IndexedDB is specific to the Cypress Browser
    //      so clearing the full DB won't have any effect any user's actual data
    clearHistory();

    // Wait for React to finish Rendering
    cy.findByTestId("exercise").contains(/\w/);
});

it("Should Add to completed exercise sets history", () => {
    cy.findByTestId("complete-set").click();
    cy.findByTestId("exercise-history")
        .children()
        .should("have.length.above", 0);
});

it("Should Increment & Decrement Exercise Weight", function () {
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
    cy.findByTestId("exercise")
        .invoke("text")
        .then((num) => num)
        .as("initalExercise");

    cy.findByTestId("shuffle").click();
    cy.get("@initalExercise").then(function (initalExercise) {
        cy.findByTestId("exercise")
            .invoke("text")
            .should("not.equal", "")
            .should("not.contain", initalExercise);
    });
});

it("Should NEVER randomly select the same Exercise as the Current one", function () {
    for (let i = 0; i < 50; i++) {
        cy.findByTestId("exercise")
            .invoke("text")
            .then((num) => num)
            .as("initalExercise");

        cy.findByTestId("shuffle").click();
        cy.get("@initalExercise").then(function (initalExercise) {
            cy.findByTestId("exercise")
                .invoke("text")
                .should("not.equal", "")
                .should("not.contain", initalExercise);
        });
    }
});
