# Breaking Changes
* renderInnerHtml option will be set to false by default instead of true
* showMissingTranslationMsg option has been removed use missingTranslationMsg option instead
* setTranslations action has been removed
* localize HOC has been removed
* change default slice name from 'locale' to 'localize'
* change name of 'localeReducer' to 'localizeReducer'
* Translate render props API takes single object instead of multiple arguments
* typo updates for action from outstanding PR

# TODO:
* add prettier
* redo docs
* test redux version
* add default language when missing option (open issue for this)
* clean up package.json
* give a debug prop to LocalizeProvider to help with logging in development?
* rename all references to react-localize-redux to react-localize
* update all references to translation key to translation id
* make own options type for Translate component and translate function options


