# gatsby-source-graphql-custom

Based on/Forked from https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-source-graphql

## Why a fork ?

When using Prismic headless CMS + its official Gatsby source plugin, we faced a conflict between the gatsby-source-graphql plugin and @prismicio/gatsby-source-prismic-graphql plugin:

    The plugin "gatsby-source-graphql" created a node of a type owned by another plugin.

After doing lots of googling, we came to the conclusion that the best option for us was to duplicate the original plugin.

## (Original) Documentation

https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-source-graphql/README.md