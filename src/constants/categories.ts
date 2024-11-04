/**
 * @typedef {Object} Category
 * @property {string} key - The unique identifier for the category.
 * @property {string} label - The display name for the category.
 * @property {string} [icon] - An optional icon class for the category.
 * @property {string[]} [items] - An optional array of sub-items related to the category.
 */

/**
 * An array of categories available in the application.
 *
 * @type {Category[]}
 * @constant
 * @default
 */
export const categories =[
  {
    key:'sports',
    label: 'Sports'
    // icon: 'fas fa-football-ball',
    // items: ['cricket', 'football', 'hockey']
  },
  {
    key:'video-games',
    label: 'video-games'
    // icon: 'fas fa-football-ball',
    // items: ['cricket', 'football', 'hockey']
  }
]
