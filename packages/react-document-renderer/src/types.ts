export type document_fragment = any;
export type document_fragments = document_fragment[];
export type document_config = any;
export type document_model = any;
export type document_stylesheet_font = any;
export type document_stylesheet_fonts = document_stylesheet_font[];
export type document_stylesheet_types = any;
export type document_stylesheet_variables = any;
export type document_stylesheet = {
    id: string,
    name: string,
    fonts?: document_stylesheet_fonts,
    variables?: document_stylesheet_variables,
    types?: document_stylesheet_types,
    [key: string]: any,
}
export type document_suggestion = any;
export type document_suggestions_id = document_suggestion;
export type document_suggestions_tag = document_suggestion[];
export type document_suggestions_ids = {
    [key: string]: document_suggestions_id
}
export type document_suggestions_tags = {
    [key: string]: document_suggestions_tag
}
export type document_suggestions = {
    ids?: document_suggestions_ids,
    tags?: document_suggestions_tags,
}
export type document_definition = {
    fragments?: document_fragments,
    config?: document_config,
    model?: document_model,
    stylesheet?: document_stylesheet,
    suggestions?: document_suggestions,
}