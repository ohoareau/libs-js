import React, {useCallback, useMemo, useState} from 'react';
import component from '@ohoareau/react-component';
import Typography from '@material-ui/core/Typography';
import TitleIcon from '@material-ui/icons/Title';
import SubjectIcon from '@material-ui/icons/Subject';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import HeightIcon from '@material-ui/icons/Height';
import GridOnIcon from '@material-ui/icons/GridOn';
import CropFreeIcon from '@material-ui/icons/CropFree';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import MessageIcon from '@material-ui/icons/Message';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import {Tabs} from "@ohoareau/react-tabs";
import {createEditor} from 'slate';
import {Slate, Editable, withReact} from 'slate-react';
import DoneIcon from '@material-ui/icons/Done';
import AddIcon from '@material-ui/icons/Add';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import PostAddIcon from '@material-ui/icons/PostAdd';
import jexl from 'jexl';

const getBlockIcon = block => {
    switch (block.type) {
        case 'heading': return TitleIcon;
        case 'paragraph': return SubjectIcon;
        case 'space': return HeightIcon;
        case 'table': return GridOnIcon;
        case 'qrcode': return CropFreeIcon;
        case 'list': return FormatListBulletedIcon;
        default: return CheckBoxOutlineBlankIcon;
    }
}

const getVisibilityIcon = config => {
    if (undefined === config.visible || true === config.visible) return VisibilityIcon;
    return VisibilityOffIcon;
};

const getSelectedIcon = config => config.selected ? RadioButtonCheckedIcon : RadioButtonUncheckedIcon;

const getEnrichmentIcon = (block, config) => {
    if (block.enrichable && config.enrichment && config.enrichment.length && (config.enrichment.length > 1 || (config.enrichment[0].children && config.enrichment[0].children[0].text))) return MessageIcon;
    return null;
};

const getSuggestionsIcon = (block, config, relevantSuggestions) => {
    if (!block.suggestions || !relevantSuggestions || !relevantSuggestions.length) return null;
    return () => <PostAddIcon color={Object.keys((config || {}).suggestions || {}).length ? 'primary' : 'inherit'} />;
};

const BlockEnricher = component(undefined, ({value, onChange}) => {
    const editor = useMemo(() => withReact(createEditor()), []);
    value = value || [{type: 'paragraph', children: [{text: ''}]}];
    return (
        <div>
            <Typography style={{marginTop: 5, marginBottom: 5, textDecoration: 'underline'}}>Commentaire</Typography>
            <div style={{backgroundColor: 'white', border: '1px solid rgb(235, 235, 235)', padding: 5, marginTop: 5}}>
                <Slate editor={editor} value={value} onChange={onChange}>
                    <Editable />
                </Slate>
            </div>
        </div>
    );
});

const BlockSuggestion = component(theme => ({
    root: {
        backgroundColor: 'white',
        marginBottom: 5,
        padding: 5,
        opacity: props => props.disabled ? 0.2 : 'unset',
        '&:hover': {
            cursor: props => props.disabled ? 'unset' : 'pointer',
            backgroundColor: props => props.disabled ? 'white' : theme.palette.primary.main,
            color: props => props.disabled ? 'unset' : theme.palette.primary.contrastText,
        },
        display: 'flex',
        alignItems: 'center',
    },
    rootActive: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        marginBottom: 5,
        padding: 5,
        '&:hover': {
            cursor: 'pointer',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
        },
        display: 'flex',
        alignItems: 'center',
    },
    label: {
        flex: 1,
    },
    indicator: {
    },
}), ({classes = {}, suggestion, disabled = false, active = false, onToggle}) => {
    const handleToggle = useCallback(() => {
        onToggle && onToggle(suggestion.id);
    }, [suggestion, onToggle])
    return (
        <div className={active ? classes.rootActive : classes.root} onClick={disabled ? undefined : handleToggle}>
            <div className={classes.label}>
                {suggestion.displayName || suggestion.id}
            </div>
            {active && (
                <div className={classes.indicator}>
                    <DoneIcon />
                </div>
            )}
            {!active && (
                <div className={classes.indicator}>
                    {disabled ? <NotInterestedIcon /> : <AddIcon />}
                </div>
            )}
        </div>
    );
});

const useBlockSuggestions = (block, suggestions, context) => {
    if (!block.suggestions || !block.suggestions.length) return [];
    return block.suggestions.reduce((acc, s) => {
        if ('@' === s.slice(0, 1)) {
            acc = acc.concat(suggestions.tags[s.slice(1)] || []);
        } else {
            suggestions.ids[s] && acc.push(suggestions.ids[s]);
        }
        return acc;
    }, []).map(s => {
        s = {...s};
        if (s.condition && ('$' === s.condition.slice(0, 1))) s.disabled = !jexl.evalSync(s.condition.slice(1), context);
        return s;
    });
}
const BlockSuggestions = component(undefined, ({suggestions, block, value, onChange}) => {
    const onToggle = useCallback(id => {
        const old = (value || {})[id];
        if (old) delete value[id];
        else (value = (value || {}))[id] = true;
        onChange && onChange(value)
    }, [onChange, value]);
    if (!suggestions || !suggestions.length) return null;
    return (
        <div>
            <Typography style={{marginTop: 5, marginBottom: 5, textDecoration: 'underline'}}>Suggestions</Typography>
            {suggestions.map((s, i) => <BlockSuggestion key={s.id || i} suggestion={s} block={block} active={!!(value || {})[s.id]} disabled={!!s.disabled} onToggle={onToggle} />)}
        </div>
    );
});

const BlockEditor = component(theme => ({
    root: {
        backgroundColor: props => {
            if (props.config.selected) return theme.palette.primary.main;
            if (props.config.opened) return 'rgb(235, 235, 235)';
            return 'rgb(245, 245, 245)';
        },
        color: props => {
            if (props.config.selected) return theme.palette.primary.contrastText;
            return 'unset';
        },
        marginBottom: 5,
        '&:hover': {
            cursor: props => (props.block.content || props.block.enrichable) ? 'pointer' : 'unset',
            backgroundColor: props => {
                if (props.config.selected) return theme.palette.primary.dark;
                return 'rgb(225, 225, 225)';
            },
            color: props => {
                if (props.config.selected) return theme.palette.primary.contrastText;
                return 'black';
            },
        },
        padding: 1,
    },
    header: {
        padding: 10,
        display: 'flex',
    },
    content: {
        backgroundColor: 'rgb(245, 245, 245)',
        padding: 10,
        color: 'black',
        '&:hover': {
            cursor: 'default',
        }
    },
    icon: {
        marginRight: 10,
    },
    label: {
        flex: 1,
    },
    visibility: {
        '&:hover': {
            cursor: 'pointer',
        },
    },
    selection: {
        marginLeft: 10,
        '&:hover': {
            cursor: 'pointer',
        },
    }
}), ({classes = {}, block, context, suggestions = {}, config = {}, onChangeConfig, onToggleOpen, onToggleVisibility, onToggleSelection, id, rootConfig}) => {
    const opened = (config.opened || (block.type === 'layout' || block.type === 'group'));
    const label = block.displayName || block.type;
    const contents = opened ? <div>{(Array.isArray(block.content) ? block.content : Object.values(block.content || {})).map((b, i) => b ? <BlockEditor key={b.id || i} context={context} id={b.id || i} block={b} suggestions={suggestions} config={rootConfig[b.id || i] || {}} onToggleOpen={onToggleOpen} onToggleSelection={onToggleSelection} onToggleVisibility={onToggleVisibility} rootConfig={rootConfig} /> : null)}</div> : null;
    const Icon = getBlockIcon(block);
    const VisibleIcon = getVisibilityIcon(config);
    const SelectionIcon = getSelectedIcon(config);
    const EnrichmentIcon = getEnrichmentIcon(block, config);
    const relevantSuggestions = useBlockSuggestions(block, suggestions, context);
    const SuggestionsIcon = getSuggestionsIcon(block, config, relevantSuggestions);
    const onChangeEnrichment = useCallback(enrichment => {
        onChangeConfig && onChangeConfig(id, {...config, enrichment});
    }, [onChangeConfig, config]);
    const onChangeSuggestions = useCallback(suggestions => {
        onChangeConfig && onChangeConfig(id, {...config, suggestions});
    }, [onChangeConfig, config]);
    if (!block.enrichable && !block.hiddable && !relevantSuggestions.length) return null;
    return (!opened || (!!block.displayName)) ? (
        <div className={classes.root} onClick={(block.content || block.enrichable) ? () => { onToggleOpen(id);} : undefined}>
            {(!opened || (!!block.displayName)) && (
                <div className={classes.header}>
                    <Icon className={classes.icon} /><Typography className={classes.label}>{block.type === 'heading' ? block.text : (block.type === 'paragraph' ? `${block.text.slice(0, 30)}...` : label)}</Typography>
                    {SuggestionsIcon && <div className={classes.suggestions}><SuggestionsIcon /></div>}
                    {EnrichmentIcon && <div className={classes.enrichment}><EnrichmentIcon /></div>}
                    {block.hiddable && <div className={classes.visibility}><VisibleIcon onClick={e => {e.stopPropagation(); onToggleVisibility(id);}} /></div>}
                    {<div className={classes.selection}><SelectionIcon onClick={e => {e.stopPropagation(); onToggleSelection(id);}} /></div>}
                </div>
            )}
            {opened && (block.content || block.enrichable) && (
                <div className={classes.content} onClick={e => { e.stopPropagation(); }}>
                    {block.content && (
                        <div>
                            {contents}
                        </div>
                    )}
                    {block.enrichable && <BlockEnricher block={block} value={config.enrichment} onChange={onChangeEnrichment} />}
                    <BlockSuggestions block={block} value={config.suggestions} onChange={onChangeSuggestions} suggestions={relevantSuggestions} />
                </div>
            )}
        </div>
    ) : contents;
})

const EditorTab = component({
    container: {
    },
}, ({classes = {}, fragment, config, onChange, type, model, suggestions = {}}) => {
    if (!fragment) return null;
    const context = {...model, model, config};
    const onToggleVisibility = useCallback(id => {
        config[id] = (config[id] || {});
        config[id].visible = (undefined === config[id].visible) ? false : !config[id].visible;
        onChange && onChange(config);
    }, [fragment, onChange])
    const onToggleSelection = useCallback(id => {
        config[id] = (config[id] || {});
        config[id].selected = (undefined === config[id].selected) ? true : !config[id].selected;
        onChange && onChange(config);
    }, [fragment, onChange])
    const onToggleOpen = useCallback(id => {
        config[id] = (config[id] || {});
        config[id].opened = (undefined === config[id].opened) ? true : !config[id].opened;
        onChange && onChange(config);
    }, [fragment, onChange]);
    const onChangeConfig = useCallback((id, cfg) => {
        config[id] = cfg;
        onChange && onChange(config);
    }, [fragment, onChange]);
    const PrependComp = ({type, blocks}) => {
        if (!blocks.length) {
            switch(type) {
                case 'content': return <Typography>La section est vide.</Typography>;
                case 'header': return <Typography>Aucun entête pour cette section.</Typography>;
                case 'footer': return <Typography>Aucun pied de page pour cette section.</Typography>;
                default: return null;
            }
        }
        switch (type) {
            case 'content': return null;
            case 'header': return <Typography style={{marginBottom: 15}}>Cet entête est présent sur l'ensemble des pages de la section.</Typography>
            case 'footer': return <Typography style={{marginBottom: 15}}>Ce pied de page est présent sur l'ensemble des pages de la section.</Typography>
            default: return null;
        }
    }
    const blocks = (fragment[type] || []);
    return (
        <div className={classes.container}>
            <PrependComp type={type} blocks={blocks} />
            {blocks.map((b, i) => (
                <BlockEditor key={b.id || i} id={b.id || i}
                             block={b} config={config[b.id || i] || {}}
                             onToggleOpen={onToggleOpen} onToggleSelection={onToggleSelection}
                             onToggleVisibility={onToggleVisibility} rootConfig={config}
                             onChangeConfig={onChangeConfig}
                             suggestions={suggestions}
                             context={context}
                />
            ))}
        </div>
    );
});

const Editor = component<EditorProps>({
    root: {
    },
}, ({classes = {}, doc, config = {}, onChange}: EditorProps) => {
    const tabs = [
        {name: 'content', label: 'Contenu', component: EditorTab, props: {type: 'content'}},
        {name: 'header', label: 'Entête', component: EditorTab, props: {type: 'header'}},
        {name: 'footer', label: 'Pied de page', component: EditorTab, props: {type: 'footer'}},
    ];
    const [tab, setTab] = useState(tabs[0].name);
    return (
        <div className={classes.root}>
            <Tabs tab={tab} tabs={tabs} onChange={setTab} extraProps={{...doc, fragment: doc.fragments[0], onChange, config}} />
        </div>
    );
}, undefined, {i18n: false});

export interface EditorProps {
    classes?: {[key: string]: any},
    onChange?: any,
    config?: any,
    doc: any,
}

export default Editor;