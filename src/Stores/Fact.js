import Client from "../Client.js";

import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes'

let changeListeners = [];
let facts = initLanguageCodeObject();

let notifyChange = () => {
  changeListeners.forEach((listener) => {
    listener();
  });
}

let fetchFacts = (language, urlSlug) => {
  let query = Client.items()
    .type('about_us');

  if (language) {
    query.languageParameter(language);
  }

  if (urlSlug) {
    query.equalsFilter('elements.url_pattern', urlSlug);
  }

  query.getObservable()
    .subscribe(response => {
      if (language) {
        facts[language] = response.items[0].facts;
      } else {
        facts[defaultLanguage] = response.items[0].facts;
      }
      notifyChange();
    });
}

class FactStore {

  // Actions

  provideFacts(language, urlSlug) {
    fetchFacts(language, urlSlug);
  }

  // Methods

  getFacts(language) {
    return facts[language];
  }

  // Listeners

  addChangeListener(listener) {
    changeListeners.push(listener);
  }

  removeChangeListener(listener) {
    changeListeners = changeListeners.filter((element) => {
      return element !== listener;
    });
  }

}

export default new FactStore();