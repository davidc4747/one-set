import { clear, add } from "../../src/utils/dataservice";

beforeEach(function () {
    cy.visit("/");

    // NOTE: This IndexedDB is specific to the Cypress Browser
    //      so clearing the full DB won't have any effect any user's actual data
    clear();

    // Wait for React to finish Rendering
    cy.findAllByTestId("exercise").contains(/\w/);
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
            .findAllByTestId("weight")
            .invoke("text")
            .then(function parseWeightValue(str: string): number {
                const val = str.replaceAll(/\D/g, "").trim();
                return val ? Number(val) : 0;
            });
    }

    getWeightValue().then(function (initialValue) {
        // Increase
        cy.findAllByTestId("increase").click();
        getWeightValue().should("be.above", initialValue);

        // Decrease
        cy.findAllByTestId("decrease").click();
        cy.findAllByTestId("decrease").click();
        getWeightValue().should("be.below", initialValue);
    });
});
