module.exports = {
    env: {
        browser: true,
        es2015: true
    },
    extends: ["eslint:recommended", "plugin:vue/vue3-essential", "plugin:prettier/recommended"],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
    },
    plugins: ["vue"],
    rules: {
        "vue/multi-word-component-names": false
    }
}
