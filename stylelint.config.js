module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-standard-scss'],
  rules: {
    'declaration-block-no-duplicate-properties': true,
    'property-no-unknown': true,
    'comment-empty-line-before': null,
    'scss/double-slash-comment-empty-line-before': null,
  },
};
