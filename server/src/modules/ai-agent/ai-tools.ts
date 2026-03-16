import { SchemaType, FunctionDeclaration } from "@google/generative-ai";

export const aiTools: FunctionDeclaration[] = [
  {
    name: "search_products",
    description: "Search for products based on keywords, name, or description. Use this to find items the user might be interested in.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        keywords: {
          type: SchemaType.STRING,
          description: "The keywords to search for products (e.g., 'blue shirt', 'iphone 15').",
        },
        limit: {
          type: SchemaType.NUMBER,
          description: "Maximum number of products to return (default is 5).",
        },
      },
      required: ["keywords"],
    },
  },
  {
    name: "get_product_detail",
    description: "Get detailed information about a specific product including price, variants, and stock. Use the 'slug' obtained from search results.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        slug: {
          type: SchemaType.STRING,
          description: "The unique slug of the product.",
        },
      },
      required: ["slug"],
    },
  },
  {
    name: "list_categories",
    description: "List all available root product categories in the shop. Useful for broad browsing.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {},
      required: [],
    },
  },
];
