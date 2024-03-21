import algoliasearch from "algoliasearch"


const client = algoliasearch('1WJCB5LT68', 'ee534a7e590610a47d021ea6f8caaf6d')
const index = client.initIndex("products")

export {index}