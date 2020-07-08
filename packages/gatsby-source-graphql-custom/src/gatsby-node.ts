import StripNonQueryTransform from './StripNonQueryTransform';
import NamespaceUnderFieldTransform from './NamespaceUnderFieldTransform';
import {v4 as uuidv4} from 'uuid';
import {buildSchema, printSchema} from 'gatsby/graphql';
import {wrapSchema, introspectSchema, RenameTypes} from '@graphql-tools/wrap';
import {linkToExecutor} from '@graphql-tools/links';
import {createHttpLink} from 'apollo-link-http';
import nodeFetch from 'node-fetch';
import invariant from 'invariant';
import {createDataloaderLink} from './batching/dataloader-link';

export const sourceNodes = async ({actions, createNodeId, cache, createContentDigest}, options) => {
    const { addThirdPartySchema, createNode } = actions
    const {
        url,
        typeName,
        fieldName,
        headers = {},
        fetch = nodeFetch,
        fetchOptions = {},
        createLink,
        createSchema,
        refetchInterval,
        batch = false,
        internalType = 'GraphQLSourceCustom',
        pluginCode = 'gatsby-source-graphql-custom',
    } = options

    invariant(
        typeName && typeName.length > 0,
        `${pluginCode} requires option \`typeName\` to be specified`
    )
    invariant(
        fieldName && fieldName.length > 0,
        `${pluginCode} requires option \`fieldName\` to be specified`
    )
    invariant(
        (url && url.length > 0) || createLink,
        `${pluginCode} requires either option \`url\` or \`createLink\` callback`
    )

    let link
    if (createLink) {
        link = await createLink(options)
    } else {
        const options = {
            uri: url,
            fetch,
            fetchOptions,
            headers: typeof headers === `function` ? await headers() : headers,
        }
        link = batch ? createDataloaderLink(options) : createHttpLink(options)
    }

    let introspectionSchema

    if (createSchema) {
        introspectionSchema = await createSchema(options)
    } else {
        const cacheKey = `${pluginCode}-schema-${typeName}-${fieldName}`
        let sdl = await cache.get(cacheKey)

        if (!sdl) {
            introspectionSchema = await introspectSchema(<any>linkToExecutor(link))
            sdl = printSchema(introspectionSchema)
        } else {
            introspectionSchema = buildSchema(sdl)
        }

        await cache.set(cacheKey, sdl)
    }

    const nodeId = createNodeId(`${pluginCode}-${typeName}`)
    const node = createSchemaNode({
        id: nodeId,
        typeName,
        fieldName,
        createContentDigest,
        internalType,
    })
    createNode(node)

    const resolver = (parent, args, context) => {
        context.nodeModel.createPageDependency({
            path: context.path,
            nodeId: nodeId,
        })
        return {}
    }

    const schema = wrapSchema(
        {
            schema: introspectionSchema,
            executor: <any>linkToExecutor(link),
        },
        [
            new StripNonQueryTransform(),
            new RenameTypes(name => `${typeName}_${name}`),
            new NamespaceUnderFieldTransform({
                typeName,
                fieldName,
                resolver,
            }),
        ]
    )

    addThirdPartySchema({ schema })

    if (process.env.NODE_ENV !== `production`) {
        if (refetchInterval) {
            const msRefetchInterval = refetchInterval * 1000
            const refetcher = () => {
                createNode(
                    createSchemaNode({
                        id: nodeId,
                        typeName,
                        fieldName,
                        createContentDigest,
                        internalType,
                    })
                )
                setTimeout(refetcher, msRefetchInterval)
            }
            setTimeout(refetcher, msRefetchInterval)
        }
    }
}

function createSchemaNode({ id, typeName, fieldName, createContentDigest, internalType }) {
    const nodeContent = uuidv4()
    const nodeContentDigest = createContentDigest(nodeContent)
    return {
        id,
        typeName: typeName,
        fieldName: fieldName,
        parent: null,
        children: [],
        internal: {
            type: internalType,
            contentDigest: nodeContentDigest,
            ignoreType: true,
        },
    }
}