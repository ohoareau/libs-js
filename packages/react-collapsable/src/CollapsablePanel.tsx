import component from '@ohoareau/react-component';
import ExpansionPanel, {ExpansionPanelProps} from '@material-ui/core/ExpansionPanel';

const CollapsablePanel = component<CollapsablePanelProps>({
    root: {
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            '&:first-child': {
            },
        },
    },
    expanded: {},
}, ExpansionPanel, undefined, {i18n: false});

type ExtraProps = {
};

export type CollapsablePanelProps = ExpansionPanelProps & ExtraProps;

export default CollapsablePanel