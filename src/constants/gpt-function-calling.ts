/* eslint-disable max-len */
import type { ChatCompletionFunctions } from 'openai';

// New GPT feature/ optional params, can specify a JSON object for GPT to return by create a JSON schema with specific description.
// For further information, refer to this documentation: https://openai.com/blog/function-calling-and-other-api-updates

export const getDishesListGPTFunction = (
  language: string,
): ChatCompletionFunctions[] => [
  {
    name: 'format_recipe_list_to_JSON_object',
    description: `Formatting a list of recipe to an object with an array of recipe names and a string containing all of the recipe names in ${language}.`,
    parameters: {
      type: 'object',
      properties: {
        dishListArray: {
          type: 'array',
          items: {
            type: 'string',
          },
          description:
            'Formatting a list of recipe name into an array of string, e.g ["Chocolate Cookie", "Cake"]',
        },
        dishListString: {
          type: 'string',
          description:
            'Formatting a list of recipe name into a string, e.g "1. Chocolate Cookie\n, 2. Cake"',
        },
      },
      required: ['dishListArray', 'dishListString'],
    },
  },
];

export const getDishDetailsGPTFunction: ChatCompletionFunctions[] = [
  {
    name: 'format_recipe_details_to_JSON_object',
    description:
      'Formatting a detailed recipe including the name, ingredients and instructions to JSON object',
    parameters: {
      type: 'object',
      properties: {
        dishName: {
          type: 'string',
          description: 'Specific name of the recipe in string type',
        },
        ingredients: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Specific name of the ingredient in string type',
              },
              unit: {
                type: 'string',
                description:
                  'Name of the measurement unit of the ingredient in metric system (e.g: gram, cup, liter) in string type',
              },
              quantity: {
                type: 'string',
                description:
                  'The quantity of the measurement of the ingredient in string type (e.g: 100, 1, 1.25, 0.25...)',
              },
            },
          },
          description:
            'Format a list of recipe ingredients into an array of object, e.g [{ name: "onion", unit: "gram", quantity: "50"}]',
        },
        instructions: {
          type: 'string',
          description:
            'The specific and detailed list of instruction to create the recipe',
        },
      },
      required: [
        'dishName',
        'ingredients',
        'name',
        'unit',
        'quantity',
        'instructions',
      ],
    },
  },
];
