if (!window._) {
    throw new Error("Underscore.js must be loaded as dependency");
}

var registerElement = require("./utils/registerElement.js");
var createTag = require("./utils/createTag.js");
var safeExtend = require("./utils/safeExtend.js");
var elementDictionary = require("./utils/elementDictionary.js");
var browserChecker = require("./utils/browserChecker.js");
var logger = require("./utils/logger.js");
var events = require("./utils/events.js");
var constants = require("./utils/constants.js");
var confirmationWrapper = require("./utils/confirmationWrapper.js");

window.b = {
    tag: {
        registerElement: registerElement,
        createTag: createTag,
        safeExtend: safeExtend,
        logger: logger,
        events: events,
        confirmationWrapper: confirmationWrapper,
        elements: {
            // Input
            InputText: createTag("input-text").from(elementDictionary.inputText),
            InputTextarea: createTag("input-textarea").from(elementDictionary.inputTextarea),
            InputCheckbox: createTag("input-checkbox").from(elementDictionary.inputCheckbox),
            InputRadio: createTag("input-radio").from(elementDictionary.inputRadio),
            InputRadioGroup: createTag("input-radio-group").from(elementDictionary.inputRadioGroup),
            InputSelect: createTag("input-select").from(elementDictionary.inputSelect),

            // Misc
            PartialAjax: createTag("partial-ajax").from(elementDictionary.partialAjax),
            ConfirmationModal: createTag("confirmation-modal").from(elementDictionary.confirmationModal),

            // Form
            FormAjax: createTag("form-ajax").from(elementDictionary.formAjax),

            // Collection
            CollectionSearchForm: createTag("collection-search-form").from(elementDictionary.collectionSearchForm),
            CollectionElements: createTag("collection-elements").from(elementDictionary.collectionElements),
            CollectionContainer: createTag("collection-container").from(elementDictionary.collectionContainer),
            FeedbackToken: createTag("feedback-token").from(elementDictionary.feedbackToken),
            NumberOfResults: createTag("number-of-results").from(elementDictionary.numberOfResults),
        }
    }
};

if ( typeof module === "object" && typeof module.exports === "object" ) {
    // For CommonJS and CommonJS-like environments
    module.exports = window.btag;
}

var cloackedElements = document.querySelectorAll("[" + constants.cloakingClass + "]");

_(cloackedElements).forEach(function (element) {
    element.removeAttribute(constants.cloakingClass);
});