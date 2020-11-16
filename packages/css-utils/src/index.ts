export const bgVariant = (theme, type: string|undefined = undefined, property: string = 'variant', defaultName: string = 'default', reverse = false) => {
    return variant(theme, reverse ? 'background_color' : `background_color${type ? '_' : ''}${type || ''}`, property, defaultName, reverse ? type : undefined)
};
export const cleanCss = o => {Object.keys(o).forEach(k => (undefined === o[k]) && (delete o[k])); return o;};
export const cssActivableClickBox = (theme: any, textType: string, boxType: string) => ({
    ...cssBox(theme, boxType, bgVariant(theme, undefined, 'active', 'none')),
    ...cssText(theme, 'standard', textType, undefined, undefined, fgVariant(theme, textType, 'active')),
    '&:hover': {
        ...cssBgColor(theme, bgVariant(theme, 'hover', 'active', 'none', true)),
        ...cssFgColor(theme, fgVariant(theme, 'hover', 'active', 'default', true, textType) as any),
    },
    '&:disabled': {
        ...cssBgColor(theme, bgVariant(theme, 'disabled', 'active', 'none', true)),
        ...cssFgColor(theme, fgVariant(theme, 'disabled', 'active', 'default', true, textType) as any),
    },
});
export const cssBg = (theme: any, bg: any = undefined) => cleanCss({
    background: bg ? tget(theme, `background_${bg}`) : undefined,
});
export const cssBgColor = (theme: any, bg: any = undefined) => cleanCss({
    backgroundColor: bg ? (('function' === typeof bg) ? bg : tget(theme, `background_color_${bg}`)) : undefined,
});
export const cssBorder = (theme: any, type: string|undefined = undefined) => cleanCss({
    border: type ? props => (tget(theme, `border_${type}_${props.color}`) || tget(theme, `border_${type}`) || undefined) : undefined,
    borderRadius: type ? (tget(theme, `border_radius_${type}`) || undefined) : undefined,
    boxSizing: 'border-box',
});
export const cssBox = (theme: any, type: string|undefined = undefined, bg: string|Function|undefined = undefined, shadow: string|Function|undefined = undefined) => ({
    ...cssBg(theme, bg),
    ...cssBgColor(theme, bg),
    ...cssBorder(theme, type),
    ...cssShadow(theme, shadow)
});
export const cssClickBox = (theme: any, textType: string, boxType: string) => ({
    ...cssClickBoxRoot(theme, textType, boxType),
    '&:hover': {
        ...cssClickBoxHover(theme, textType)
    },
    '&:disabled': {
        ...cssClickBoxDisabled(theme, textType),
    },
    '&:active': {
        ...cssClickBoxClicked(theme, textType, boxType),
    },
});
export const cssClickBoxClicked = (theme: any, textType: string, boxType: string) => ({
    ...cssBox(theme, boxType, bgVariant(theme, 'clicked', 'color', 'none', true), () => 'unset'),
    ...cssFgColor(theme, fgVariant(theme, 'clicked', 'color', 'default', true, textType) as any),
});
export const cssClickBoxDisabled = (theme: any, textType: string) => ({
    ...cssBgColor(theme, bgVariant(theme, 'disabled', 'color', 'none', true)),
    ...cssFgColor(theme, fgVariant(theme, 'disabled', 'color', 'default', true, textType) as any),
    cursor: 'not-allowed',
    pointerEvents: 'none',
});
export const cssClickBoxHover = (theme: any, textType: string) => ({
    ...cssBgColor(theme, bgVariant(theme, 'hover', 'color', 'none', true)),
    ...cssFgColor(theme, fgVariant(theme, 'hover', 'color', 'default', true, textType) as any),
    // @todo: find a way to avoid hard coding 'underline for tertiary', using Prismic themes ?
    textDecoration: props => props.color === 'tertiary' ? 'underline' : undefined,
});
export const cssClickBoxRoot = (theme: any, textType: string, boxType: string) => ({
    ...cssBox(theme, boxType, bgVariant(theme, undefined, 'color', 'none'), props => props.color === 'tertiary' ? 'unset' : tget(theme, 'shadow_level_02')),
    ...cssText(theme, 'standard', textType, undefined, undefined, fgVariant(theme, textType, 'color')),
});
export const cssFgColor = (theme: any, type: string|string[]|any, fg: any = undefined) => {
    let color = undefined;
    if (fg) {
        if ('function' === typeof fg) return {color: fg};
        color = tget(theme, `font_color_${fg}`);
        if (color) return {color};
        return {color: fg};
    }
    type = Array.isArray(type) ? type : [type];
    type = type.find(x => ('function' === typeof x) || !!tget(theme, `font_color_${x}`));
    if ('function' === typeof type) return {color: type};
    if (type) {
        color = tget(theme, `font_color_${type}`);
        if (color) return {color};
    }
    return {};
}
export const cssFont = (theme: any, typo: string, type: string, align: string|Function|undefined = undefined) => cleanCss({
    fontStyle: tget(theme, `typos_${typo}_${type}_font_style`) || theme.typos_common_font_style || undefined,
    lineHeight: tget(theme, `typos_${typo}_${type}_line_height`) || theme.typos_common_line_height || undefined,
    fontWeight: tget(theme, `typos_${typo}_${type}_font_weight`) || theme.typos_common_font_weight || undefined,
    fontFamily: tget(theme, `typos_${typo}_${type}_font_family`) || tget(theme, `typos_${typo}_common_font_family`) || undefined,
    letterSpacing: tget(theme, `typos_${typo}_${type}_letter_spacing`) || tget(theme, `typos_${typo}_common_letter_spacing`) || undefined,
    fontSize: tget(theme, `typos_${typo}_${type}_font_size`) || undefined,
    textTransform: tget(theme, `typos_${typo}_${type}_text_transform`) || 'unset',
    textAlign: align,
    opacity: tget(theme, `typos_${typo}_${type}_opacity`) || undefined,
});
export const cssMargin = (theme: any, typo: string, type: string) => cleanCss({
    margin: tget(theme, `typos_${typo}_${type}_margin`) || undefined,
});
export const cssResetForSeo = () => cleanCss({
    '& h1, & h2, & h3, & h4, & h5, & h6, & p': {
        margin: 'unset',
        padding: 'unset',
        fontWeight: 'unset',
        fontSize: 'unset',
    },
});
export const cssShadow = (theme: any, shadow: string|Function|undefined = undefined) => cleanCss({
    boxShadow: shadow ? (('function' === typeof shadow) ? shadow : tget(theme, `shadow_${shadow}`)) : undefined,
});
export const cssText = (theme: any, typo: string, type: string, align: string|Function|undefined = undefined, bg: string|Function|undefined = undefined, fg: string|Function|undefined = undefined) => ({
    ...cssFont(theme, typo, type, align),
    ...cssBgColor(theme, bg),
    ...cssFgColor(theme, type, fg),
    ...cssMargin(theme, typo, type),
    ...cssResetForSeo(),
    '& b': {
        ...cssFgColor(theme, [`${type}_bold`, 'large_title_bold']),
    }

});
export const fgVariant = (theme, type: string|undefined = undefined, property: string = 'variant', defaultName: string = 'default', reverse = false, prefix: string|undefined = undefined) => {
    const p = `font_color${prefix ? '_' : ''}${prefix || ''}`;
    return variant(theme, reverse ? p : `${p}${type ? '_' : ''}${type || ''}`, property, defaultName, reverse ? type : undefined)
};
export const tget = (theme, key: string) => {
    return theme[key];
};
export const variant = (theme, type: string, property: string = 'variant', defaultName: string = 'default', suffix: string|undefined = undefined) => {
    return props => {
        const name = (('boolean' === typeof props[property]) ? (!!props[property] ? 'active' : 'inactive') : props[property]) || defaultName;
        const key = `${type}_${name}${suffix ? '_' : ''}${suffix || ''}`;
        const defaultKey = `${type}_${defaultName}${suffix ? '_' : ''}${suffix || ''}`;
        return tget(theme, key) || tget(theme, defaultKey) || 'unset';
    };
};
export const varianted = (o: any, n = 'variant') => p => ((o[p[n]] || o.default || o[Object.keys(o)[0]]) || {});
