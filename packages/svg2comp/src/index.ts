import svgr from '@svgr/core'
import fs from 'fs';
import path from 'path';
import svgo from '@svgr/plugin-svgo'
import jsx from '@svgr/plugin-jsx'
import prettier from '@svgr/plugin-prettier'

export const svg2comp = async (sourceDir: string, targetDir: string, options: any = {}): Promise<string[]> =>
    Promise.all(
        (await listSvgFiles(sourceDir, options))
            .map(
                async (filePath: string): Promise<string> => convertSvgFileToReactComponentFile(
                    filePath,
                    targetDir,
                    options
                )
            )
    )
;

// noinspection JSUnusedLocalSymbols
export const listSvgFiles = async (sourceDir: string, options: any = {}): Promise<string[]> =>
    fs.readdirSync(sourceDir).map(f => (f.toString ? f.toString() : f)).filter(f => /\.svg$/.test(f)).map(f => `${sourceDir}/${f}`)
;

export const convertSvgFileToReactComponentFile = async (filePath: string, targetDir: string, options: any = {}): Promise<string> => {
    const config = await getSvgFileConfig(filePath, options);
    const opts = {...config, options};
    const targetFilePath = `${targetDir}/${convertSvgFileNameToReactComponentFileName(filePath, opts)}`;
    await saveReactComponentFileContent(
        targetFilePath,
        await convertSvgToReactComponent(
            await getSvgFileContent(filePath, opts),
            opts
        )
    );
    return targetFilePath;
};

// noinspection JSUnusedLocalSymbols
export const saveReactComponentFileContent = async (filePath: string, content: string, options: any = {}): Promise<void> => {
    fs.writeFileSync(filePath, content);
};

// noinspection JSUnusedLocalSymbols
export const getSvgFileContent = async (filePath: string, options: any = {}): Promise<string> =>
    fs.readFileSync(filePath, 'utf8')
;

// noinspection JSUnusedLocalSymbols
export const getSvgFileConfig = async (filePath: string, options: any = {}): Promise<{config: any, state: any}> => {
    const configFile = `${filePath}r.json`;
    return {
        config: {
            dimensions: false,
            expandProps: 'end',
            icon: false,
            native: false,
            typescript: true,
            prettier: true,
            prettierConfig: null,
            memo: false,
            ref: false,
            replaceAttrValues: null,
            svgProps: null,
            svgo: true,
            svgoConfig: null,
            template: null,
            titleProp: false,
            runtimeConfig: true,
            plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
            ...((fs.existsSync(configFile) && require(path.resolve(configFile))) || {}),
        },
        state: {
            filePath,
            caller: {
                name: '@ohoareau/svg2comp',
                defaultPlugins: [svgo, jsx, prettier],
            }
        },
    };
};

// noinspection JSUnusedLocalSymbols
export const convertSvgFileNameToReactComponentFileName = (filePath: string, options: any = {}): string => {
    const n = (filePath.match(/([^/]+)\.svg$/) || [])[1].split(/[-_]+/).map(x => `${x.slice(0, 1).toUpperCase()}${x.slice(1)}`).join('');
    return `${n}.tsx`;
};

export const convertSvgToReactComponent = async (svg: string, options: any = {}): Promise<string> =>
    svgr(svg, options.config, options.state)
;

export default svg2comp;